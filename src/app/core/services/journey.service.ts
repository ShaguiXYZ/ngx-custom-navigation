import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContextDataService, DataInfo, HttpService, UniqueIds } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_ERROR_PAGE_ID } from '../constants';
import {
  AppContextData,
  Configuration,
  ConfigurationDTO,
  dataHash,
  Links,
  LiteralModel,
  Literals,
  Page,
  StateInfo,
  Step,
  Stepper,
  StepperDTO,
  VersionInfo
} from '../models';
import { LiteralsService } from './literals.service';

@Injectable({ providedIn: 'root' })
export class JourneyService {
  private readonly contextDataService = inject(ContextDataService);
  private readonly httpService = inject(HttpService);
  private readonly literalService = inject(LiteralsService);

  public clientJourney = async (cliendId: number): Promise<string> => {
    const httpParams = new HttpParams().append('clientId', cliendId.toString());

    return await firstValueFrom(
      this.httpService
        .get<string[]>(`${environment.baseUrl}/journeys`, {
          clientOptions: { params: httpParams }
        })
        .pipe(
          map(res => res as string[]),
          map(journeys => {
            return journeys[0];
          })
        )
    );
  };

  public fetchConfiguration = async (
    name: string
  ): Promise<{
    configuration: Configuration;
    properties?: {
      breakingchange: boolean;
    };
  }> => {
    const configurationDTO = await firstValueFrom(
      this.httpService.get<ConfigurationDTO>(`${environment.baseUrl}/journey/${name}`).pipe(map(res => res as ConfigurationDTO))
    );
    const { version, ...significantData } = configurationDTO;
    const hash = dataHash(significantData);
    const configuration = { ...this.init(configurationDTO), hash, name };
    const appContextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const contextConfiguration = appContextData?.configuration;

    return {
      configuration,
      properties: {
        breakingchange:
          contextConfiguration?.hash !== hash &&
          (contextConfiguration?.version.actual
            ? VersionInfo.isBreakingChange([{ value: contextConfiguration.version.actual }], version)
            : true)
      }
    };
  };

  private init = (configuration: ConfigurationDTO): Configuration => {
    const quoteConfiguration: Configuration = this.initQuote(configuration);

    if (!configuration.homePageId) {
      quoteConfiguration.homePageId = quoteConfiguration.errorPageId;
      quoteConfiguration.title = { value: 'error-title', type: 'literal' };
    }

    this.initSteppers(quoteConfiguration, configuration.steppers);
    this.initLinks(quoteConfiguration, configuration.links);
    this.initLiterals(quoteConfiguration, configuration.literals);

    return quoteConfiguration;
  };

  private initQuote = (dto: ConfigurationDTO): Configuration => {
    const lastVersion = VersionInfo.last(dto.version);
    const errorPageId = dto.errorPageId ?? UniqueIds.random();

    const configuration: Configuration = {
      version: { actual: lastVersion.value, last: lastVersion.value },
      releaseDate: lastVersion.date ? new Date(lastVersion.date) : undefined,
      homePageId: dto.homePageId,
      title: dto.title,
      errorPageId,
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
      configuration.pageMap[errorPageId] = {
        pageId: errorPageId,
        component: QUOTE_ERROR_PAGE_ID,
        configuration: {
          literals: {
            body: { value: 'error-body', type: 'literal' }
          },
          data: {
            headerConfig: {
              showBack: false,
              showContactUs: false
            }
          }
        }
      };
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

    configuration.steppers = steppersMap;
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
