/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DataInfo, HttpService, UniqueIds } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NX_WORKFLOW_TOKEN } from '../components/models';
import {
  Configuration,
  ConfigurationDTO,
  dataHash,
  JourneyInfo,
  Links,
  LiteralModel,
  Literals,
  Page,
  QuoteSettingsModel,
  StateInfo,
  Step,
  Stepper,
  StepperDTO,
  VersionInfo
} from '../models';
import { LiteralsService } from './literals.service';

export const QUOTE_JOURNEY_DISALED = 'not-journey';

@Injectable({ providedIn: 'root' })
export class JourneyService {
  private readonly workFlowToken = inject(NX_WORKFLOW_TOKEN);
  private readonly httpService = inject(HttpService);
  private readonly literalService = inject(LiteralsService);

  public quoteSettings = (): Promise<QuoteSettingsModel> =>
    firstValueFrom(
      this.httpService.get<QuoteSettingsModel>(`${environment.baseUrl}/journey/settings`).pipe(map(res => res as QuoteSettingsModel))
    );

  public clientJourney = async (journeyId: string): Promise<JourneyInfo> => {
    const httpParams = new HttpParams().append('clientId', journeyId);

    return await firstValueFrom(
      this.httpService
        .get<Record<string, JourneyInfo>>(`${environment.baseUrl}/journey/journeys`, {
          clientOptions: { params: httpParams }
        })
        .pipe(
          map(res => res as Record<string, JourneyInfo>),
          map(journeys => {
            return journeys[journeyId];
          })
        )
    );
  };

  public fetchConfiguration = async (name: string, versions: VersionInfo[]): Promise<Configuration> => {
    const configurationDTO = await firstValueFrom(
      this.httpService.get<ConfigurationDTO>(`${environment.baseUrl}/journey/${name}`).pipe(map(res => res as ConfigurationDTO))
    );

    return this.init(name, configurationDTO, VersionInfo.last(versions));
  };

  private init = (name: string, configuration: ConfigurationDTO, version: VersionInfo): Configuration => {
    const quoteConfiguration: Configuration = this.initQuote(name, configuration, version);

    if (!configuration.homePageId) {
      quoteConfiguration.homePageId = quoteConfiguration.errorPageId;
      quoteConfiguration.title = { value: 'error-title', type: 'literal' };
    }

    this.initSteppers(quoteConfiguration, configuration.steppers);
    this.initLinks(quoteConfiguration, configuration.links);
    this.initLiterals(quoteConfiguration, configuration.literals);

    return quoteConfiguration;
  };

  private initQuote = (name: string, dto: ConfigurationDTO, version: VersionInfo): Configuration => {
    const errorPageId = dto.errorPageId ?? UniqueIds.random();
    const hash = this.configuration_Hash(name, dto);

    const configuration: Configuration = {
      name,
      version: { actual: version.value, last: version.value },
      releaseDate: version.date ? new Date(version.date) : undefined,
      homePageId: dto.homePageId,
      title: dto.title,
      errorPageId,
      pageMap: dto.pageMap.reduce<DataInfo<Page>>((acc, page) => {
        acc[page.pageId] = page;
        return acc;
      }, {}),
      links: {},
      hash
    };

    this.setErrorPage(configuration, errorPageId);

    return configuration;
  };

  private configuration_Hash = (name: string, dto: ConfigurationDTO): string => {
    const { errorPageId, ...significantData } = dto;

    return dataHash({ ...significantData, name });
  };

  private setErrorPage = (configuration: Configuration, errorPageId: string): void => {
    if (!configuration.pageMap[errorPageId]) {
      configuration.pageMap[errorPageId] = {
        pageId: errorPageId,
        component: this.workFlowToken.errorPageId,
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
                page.routeTree = this.normalizeTextForUri(page.routeTree?.trim() || step.label);
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
