/* eslint-disable @typescript-eslint/no-unused-vars */
import { Page } from '../../models';

export class RoutingServiceMock {
  public nextStep(): void {
    /* Mock method */
  }

  public previousStep(page: Page): void {
    /* Mock method */
  }

  public goToStep = (pageId: string): Promise<boolean> => {
    /* Mock method */
    return Promise.resolve(false);
  };
}
