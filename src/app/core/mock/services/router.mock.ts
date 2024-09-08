import { Router } from '@angular/router';
import { lastValueFrom, of } from 'rxjs';

const mockRouter = jasmine.createSpyObj<Router>(['navigate']);
mockRouter.navigate.and.returnValue(lastValueFrom(of(true)));
