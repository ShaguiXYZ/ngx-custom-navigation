import { TestBed } from '@angular/core/testing';
import { QuoteFooterService } from './quote-footer.service';
import { RoutingService } from 'src/app/core/services';
import { QuoteFooterConfig } from '../models';

describe('QuoteFooterService', () => {
  let service: QuoteFooterService;
  let routingServiceSpy: jasmine.SpyObj<RoutingService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('RoutingService', ['nextStep', 'previousStep']);

    TestBed.configureTestingModule({
      providers: [QuoteFooterService, { provide: RoutingService, useValue: spy }]
    });

    service = TestBed.inject(QuoteFooterService);
    routingServiceSpy = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call nextStep on RoutingService when nextStep is called', () => {
    service.nextStep();
    expect(routingServiceSpy.nextStep).toHaveBeenCalled();
  });

  it('should call previousStep on RoutingService when previousStep is called', () => {
    service.previousStep();
    expect(routingServiceSpy.previousStep).toHaveBeenCalled();
  });

  it('should call nextFn if provided in config when nextStep is called', () => {
    const nextFnSpy = jasmine.createSpy('nextFn');
    const config: QuoteFooterConfig = { showNext: true, nextFn: nextFnSpy };

    service.nextStep(config);
    expect(nextFnSpy).toHaveBeenCalled();
    expect(routingServiceSpy.nextStep).toHaveBeenCalled();
  });

  it('should call backFn if provided in config when previousStep is called', () => {
    const backFnSpy = jasmine.createSpy('backFn');
    const config: QuoteFooterConfig = { showNext: true, backFn: backFnSpy };

    service.previousStep(config);
    expect(backFnSpy).toHaveBeenCalled();
    expect(routingServiceSpy.previousStep).toHaveBeenCalled();
  });
});
