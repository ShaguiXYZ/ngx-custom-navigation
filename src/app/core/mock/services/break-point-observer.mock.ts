import { Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable, of } from 'rxjs';

export class MockBreakpointObserver {
  observe(breakPoint: string | readonly string[]): Observable<BreakpointState> {
    if (breakPoint === 'small') {
      return of({ matches: true, breakpoints: { [Breakpoints.Small]: true } });
    }

    return of({ matches: false, breakpoints: {} });
  }
}
