import { TestBed } from '@angular/core/testing';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QuoteModel, QuoteVehicleModel } from 'src/app/core/models';
import { VehicleService } from 'src/app/core/services';
import { YourCarIsService } from './your-car-is.service';

describe('YourCarIsService', () => {
  let service: YourCarIsService;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let vehicleService: jasmine.SpyObj<VehicleService>;

  beforeEach(() => {
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get']);
    const vehicleServiceSpy = jasmine.createSpyObj('VehicleService', ['vehicles']);

    TestBed.configureTestingModule({
      providers: [
        YourCarIsService,
        { provide: ContextDataService, useValue: contextDataServiceSpy },
        { provide: VehicleService, useValue: vehicleServiceSpy }
      ]
    });

    service = TestBed.inject(YourCarIsService);
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    vehicleService = TestBed.inject(VehicleService) as jasmine.SpyObj<VehicleService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call vehicleService.vehicles when plateNumber is present', async () => {
    const mockQuoteModel: QuoteModel = { vehicle: { plateNumber: 'ABC123' } } as QuoteModel;
    contextDataService.get.and.returnValue(mockQuoteModel);
    vehicleService.vehicles.and.returnValue(Promise.resolve([]));

    await service.findVehicles();

    expect(vehicleService.vehicles).toHaveBeenCalled();
  });

  it('should call vehicleService.vehicles when plateNumber is not present', async () => {
    const mockQuoteModel: QuoteModel = { vehicle: { plateNumber: '' } } as QuoteModel;
    contextDataService.get.and.returnValue(mockQuoteModel);
    vehicleService.vehicles.and.returnValue(Promise.resolve([]));

    await service.findVehicles();

    expect(vehicleService.vehicles).toHaveBeenCalled();
  });

  it('should return an array of QuoteVehicleModel', async () => {
    const mockQuoteModel: QuoteModel = { vehicle: { plateNumber: 'ABC123' } } as QuoteModel;
    const mockVehicles: QuoteVehicleModel[] = [{ make: 'Toyota' }] as QuoteVehicleModel[];

    contextDataService.get.and.returnValue(mockQuoteModel);
    vehicleService.vehicles.and.returnValue(Promise.resolve(mockVehicles));

    const result = await service.findVehicles();

    expect(result).toEqual(mockVehicles);
  });
});
