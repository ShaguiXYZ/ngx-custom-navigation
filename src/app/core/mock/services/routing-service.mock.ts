/* eslint-disable @typescript-eslint/no-unused-vars */
import { PageModel } from '../../../shared/models';
import { Page } from '../../models';

export class RoutingServiceMock {
  public nextStep(): void {
    /* Mock method */
  }

  public previousStep(page: PageModel): void {
    /* Mock method */
  }

  public getNextRoute(url: string): string[] {
    return [];
  }

  public getPage(url: string): Partial<Page> | undefined {
    return {};
  }
}
