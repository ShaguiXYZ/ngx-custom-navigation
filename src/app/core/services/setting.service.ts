import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService, DataInfo, HttpService, UniqueIds } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Step, Stepper, StepperDTO } from '../../shared/models';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA, QUOTE_ERROR_PAGE_ID } from '../constants';
import { AppContextData, Configuration, ConfigurationDTO, Links, LiteralModel, Literals, Page, QuoteModel } from '../models';
import { LiteralsService } from './literals.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly contextDataService = inject(ContextDataService);
  private readonly httpService = inject(HttpService);
  private readonly literalService = inject(LiteralsService);
  private readonly translateService = inject(TranslateService);

  public async loadSettings(): Promise<void> {
    const quoteData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);

    this.translateService.setDefaultLang('es-ES');

    this.contextDataService.set(
      QUOTE_CONTEXT_DATA,
      { ...QuoteModel.init(), ...quoteData },
      {
        persistent: true
      }
    );

    const configuration = await firstValueFrom(
      this.httpService.get<ConfigurationDTO>(environment.journeyUrl).pipe(
        map(res => res as ConfigurationDTO),
        map(this.init)
      )
    );
    const appContextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    this.contextDataService.set(QUOTE_APP_CONTEXT_DATA, AppContextData.init(configuration, appContextData?.navigation.viewedPages ?? []), {
      persistent: true
    });

    console.group('SettingsService');
    console.log('Quote data', QUOTE_CONTEXT_DATA, this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA));
    console.log('Quote app context data', QUOTE_APP_CONTEXT_DATA, this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA));
    console.groupEnd();
  }

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
      pageMap: dto.pageMap.reduce((acc, page) => {
        acc[page.pageId] = page;
        return acc;
      }, {} as DataInfo<Page>),
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
    const steppersMap: DataInfo<Stepper> = {};

    if (!steppers) return;

    steppers.forEach(stepper => {
      const stepperKey = UniqueIds._next_();

      steppersMap[stepperKey] = {
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
          })
      };
    });

    configuration.steppers = { steppersMap };
  };

  private initLinks = (configuration: Configuration, links?: Links): void => {
    configuration.links = { ...configuration.links, ...links };
  };

  private initLiterals = (configuration: Configuration, literals?: Literals): void => {
    configuration.literals = literals;
  };

  private normalizeTextForUri = (text: LiteralModel): string => this.literalService.toString(text).toLowerCase().replace(/\s/g, '-');
}
