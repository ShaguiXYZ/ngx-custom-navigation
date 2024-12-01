import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService, DataInfo, HttpService, UniqueIds } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA, QUOTE_ERROR_PAGE_ID } from '../constants';
import {
  AppContextData,
  Configuration,
  ConfigurationDTO,
  Links,
  LiteralModel,
  Literals,
  Page,
  QuoteModel,
  QuoteSettingsModel,
  StateInfo,
  Step,
  Stepper,
  StepperDTO
} from '../models';
import { LiteralsService } from './literals.service';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly contextDataService = inject(ContextDataService);
  private readonly httpService = inject(HttpService);
  private readonly literalService = inject(LiteralsService);
  private readonly translateService = inject(TranslateService);

  public async loadSettings(): Promise<void> {
    const settings = await this.quoteSettings();

    this.translateService.setDefaultLang('es-ES');

    if (!settings.commercialExceptions.enableWorkFlow) {
      return this.disableWorkFlow(settings);
    }

    return this.loadContext(settings);
  }

  private quoteSettings = (): Promise<QuoteSettingsModel> =>
    firstValueFrom(this.httpService.get<QuoteSettingsModel>(`${environment.baseUrl}/settings`).pipe(map(res => res as QuoteSettingsModel)));

  private disableWorkFlow = async (settings: QuoteSettingsModel): Promise<void> => {
    const configuration = await this.fetchConfiguration(`${environment.baseUrl}/journey/not-journey`);
    const viewedPages: string[] = [];

    this.contextDataService.set(QUOTE_APP_CONTEXT_DATA, AppContextData.init(settings, configuration, viewedPages), {
      persistent: true
    });

    const quoteData = QuoteModel.init();
    this.contextDataService.set(QUOTE_CONTEXT_DATA, quoteData, { persistent: true });
  };

  private fetchConfiguration = (url: string): Promise<Configuration> =>
    firstValueFrom(
      this.httpService.get<ConfigurationDTO>(url).pipe(
        map(res => res as ConfigurationDTO),
        map(this.init)
      )
    );

  private loadContext = async (settings: QuoteSettingsModel): Promise<void> => {
    const appContextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    if (appContextData) {
      const quote = { ...QuoteModel.init(), ...this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA) };
      this.contextDataService.set(QUOTE_CONTEXT_DATA, quote, { persistent: true });

      console.group('SettingsService');
      console.log('Quote data', QUOTE_CONTEXT_DATA, quote);
      console.log('Quote app context data', QUOTE_APP_CONTEXT_DATA, appContextData);
      console.groupEnd();

      return;
    }

    const configuration = await firstValueFrom(
      this.httpService.get<ConfigurationDTO>(`${environment.baseUrl}/${environment.journey}`).pipe(
        map(res => res as ConfigurationDTO),
        map(this.init)
      )
    );

    this.contextDataService.set(QUOTE_APP_CONTEXT_DATA, AppContextData.init(settings, configuration, []), {
      persistent: true
    });

    this.contextDataService.set(QUOTE_CONTEXT_DATA, QuoteModel.init(), { persistent: true });
  };

  private init = (configuration: ConfigurationDTO): Configuration => {
    const quoteConfiguration: Configuration = this.initQuote(configuration);

    this.initSteppers(quoteConfiguration, configuration.steppers);
    this.initLinks(quoteConfiguration, configuration.links);
    this.initLiterals(quoteConfiguration, configuration.literals);

    return quoteConfiguration;
  };

  private initQuote = (dto: ConfigurationDTO): Configuration => {
    const errorPageId = dto.errorPageId ?? UniqueIds.random();

    const configuration: Configuration = {
      homePageId: dto.homePageId,
      errorPageId,
      lastUpdate: dto.lastUpdate,
      pageMap: dto.pageMap.reduce<DataInfo<Page>>((acc, page) => {
        acc[page.pageId] = page;
        return acc;
      }, {}),
      links: {}
    };

    this.setErrorPage(configuration, errorPageId);

    return configuration;
  };

  private setErrorPage = (configuration: Configuration, errorPageId: string): void => {
    if (!configuration.pageMap[errorPageId]) {
      const errorPage: Page = {
        pageId: errorPageId,
        route: QUOTE_ERROR_PAGE_ID,
        configuration: {
          literals: {
            body: 'Lo sentimos, no podemos ofrecerle el seguro que necesitas en esta ocasion.'
          }
        }
      } as Page;

      configuration.pageMap[errorPageId] = errorPage;
    }

    configuration.links = { ...configuration.links, [errorPageId]: errorPageId };
  };

  private initSteppers = (configuration: Configuration, steppers?: StepperDTO[]): void => {
    if (!steppers) return;

    const steppersMap: DataInfo<Stepper> = steppers.reduce((acc, stepper) => {
      const stepperKey = UniqueIds._next_();

      acc[stepperKey] = {
        steps: stepper.steps
          .filter(step => step.pages?.length)
          .map(step => {
            const stepKey = UniqueIds._next_();

            step.pages.forEach(pageId => {
              const page = configuration.pageMap[pageId];
              if (page) {
                page.stepper = { key: stepperKey, stepKey };
                page.routeTree = this.normalizeTextForUri(step.label);
              }
            });

            return { key: stepKey, label: step.label, pages: step.pages } as Step;
          }),
        stateInfo: this.statelessInheritFrom(stepper.stateInfo)
      };

      return acc;
    }, {} as DataInfo<Stepper>);

    configuration.steppers = { steppersMap };
  };

  private initLinks = (configuration: Configuration, links?: Links): void => {
    configuration.links = { ...configuration.links, ...links };
  };

  private initLiterals = (configuration: Configuration, literals?: Literals): void => {
    configuration.literals = literals;
  };

  private statelessInheritFrom = (stateless?: StateInfo | boolean): StateInfo | undefined => {
    if (typeof stateless === 'boolean') return { inherited: stateless };

    return stateless;
  };

  private normalizeTextForUri = (text: LiteralModel): string => this.literalService.toString(text).toLowerCase().replace(/\s/g, '-');
}
