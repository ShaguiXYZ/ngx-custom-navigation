import { Observable } from 'rxjs';

export class LoadingServiceMock {
  uiShowLoading = new Observable(observer => {
    observer.next(true);
    observer.complete();
  });
}
