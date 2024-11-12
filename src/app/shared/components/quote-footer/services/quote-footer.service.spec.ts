import { TestBed } from '@angular/core/testing';
import { QuoteFooterService } from './quote-footer.service';
import { RoutingService } from 'src/app/core/services';
import { QuoteFooterConfig } from '../models';

describe('QuoteFooterService', () => {
  let service: QuoteFooterService;
  let routingServiceSpy: jasmine.SpyObj<RoutingService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('RoutingService', ['next', 'previous']);

    TestBed.configureTestingModule({
      providers: [QuoteFooterService, { provide: RoutingService, useValue: spy }]
    });

    service = TestBed.inject(QuoteFooterService);
    routingServiceSpy = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call next on RoutingService when next is called', () => {
    service.next();
    expect(routingServiceSpy.next).toHaveBeenCalled();
  });

  it('should call previous on RoutingService when previous is called', () => {
    service.previous();
    expect(routingServiceSpy.previous).toHaveBeenCalled();
  });

  it('should call nextFn if provided in config when nextStep is called', () => {
    const nextFnSpy = jasmine.createSpy('nextFn');
    const config: QuoteFooterConfig = { showNext: true, nextFn: nextFnSpy };

    service.next(config);
    expect(nextFnSpy).toHaveBeenCalled();
    expect(routingServiceSpy.next).toHaveBeenCalled();
  });

  it('should call backFn if provided in config when previous is called', () => {
    const backFnSpy = jasmine.createSpy('backFn');
    const config: QuoteFooterConfig = { showNext: true, backFn: backFnSpy };

    service.previous(config);
    expect(backFnSpy).toHaveBeenCalled();
    expect(routingServiceSpy.previous).toHaveBeenCalled();
  });
});
