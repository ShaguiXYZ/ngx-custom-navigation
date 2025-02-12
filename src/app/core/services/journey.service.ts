/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContextDataService, DataInfo, HttpService, UniqueIds } from '@shagui/ng-shagui/core';
import { firstValueFrom, map, tap } from 'rxjs';
import { NX_WORKFLOW_TOKEN } from '../components/models';
import { QUOTE_APP_CONTEXT_DATA } from '../constants';
import {
  AppContextData,
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
import { StorageLib } from '../lib';

const JOURNEY_SESSION_KEY = 'journey';
const JOURNEY_API = '/journey';

@Injectable({ providedIn: 'root' })
export class JourneyService {
  private readonly workFlowToken = inject(NX_WORKFLOW_TOKEN);
  private readonly contextDataService = inject(ContextDataService);
  private readonly httpService = inject(HttpService);
  private readonly literalService = inject(LiteralsService);

  public quoteSettings = async (): Promise<QuoteSettingsModel> => {
    const journey = StorageLib.get(JOURNEY_SESSION_KEY);
    const params = journey ? new HttpParams().appendAll({ journey }) : undefined;

    const value = await firstValueFrom(
      this.httpService
        .get<QuoteSettingsModel>(`${JOURNEY_API}/setting/values`, {
          clientOptions: { params }
        })
        .pipe(
          map(res => res as QuoteSettingsModel),
          tap(res => StorageLib.set(JOURNEY_SESSION_KEY, res.journey))
        )
    );
    const { settings: { commercialExceptions = {} } = { commercialExceptions: {} } } =
      this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA) ?? {};

    return { ...value, commercialExceptions };
  };

  public journeySettings = async (journeyId: string): Promise<JourneyInfo> => {
    return await firstValueFrom(
      this.httpService.get<JourneyInfo>(`${JOURNEY_API}/${journeyId}/settings`).pipe(map(res => res as JourneyInfo))
    );
  };

  public enableTracking = async (): Promise<boolean> => {
    return await firstValueFrom(this.httpService.get<boolean>(`${JOURNEY_API}/setting/enable-tracking`).pipe(map(res => !!res)));
  };

  public fetchConfiguration = async (info: JourneyInfo): Promise<Configuration> => {
    const configurationDTO = await firstValueFrom(
      this.httpService.get<ConfigurationDTO>(`${JOURNEY_API}/${info.id}`).pipe(map(res => res as ConfigurationDTO))
    );

    return this.init(info.name, configurationDTO, VersionInfo.last(info.versions));
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
      const stepperKey = stepper.id ?? UniqueIds._next_();

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
