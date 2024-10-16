import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VehicleService } from '../vehicle.service';
import { HttpService } from '@shagui/ng-shagui/core';
import {
  BrandKey,
  IVehicleModel,
  ModelVersionModel,
  FuelModel,
  PowerRangesModel,
  CubicCapacityModel,
  FuelTypes
} from 'src/app/shared/models';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('VehicleService', () => {
  let service: VehicleService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [VehicleService, { provide: HttpClient, useValue: httpClientSpy }]
    });

    service = TestBed.inject(VehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch vehicle brands', async () => {
    const mockBrands = ['Toyota', 'Honda', 'Ford'];
    const brand = 'to';

    httpClientSpy.get.and.returnValue(of(mockBrands));

    service.vehicleBrands(brand).then(brands => {
      expect(brands).toEqual(['Toyota']);
    });
  });

  it('should fetch vehicle models', async () => {
    const mockModels = ['Corolla', 'Civic', 'Mustang'];
    const brand: BrandKey = 'Toyota';
    const search = 'co';

    httpClientSpy.get.and.returnValue(of(mockModels));

    service.vehicleModels(brand, search).then(models => {
      expect(models).toEqual(['Corolla']);
    });
  });

  it('should fetch vehicle model versions', async () => {
    const mockModelVersions: ModelVersionModel[] = [
      { index: 1, data: 'Version1' },
      { index: 2, data: 'Version2' }
    ];
    const model = 'Corolla';

    httpClientSpy.get.and.returnValue(of(mockModelVersions));

    service.vehicleModelVersions(model).then(versions => {
      expect(versions).toEqual(mockModelVersions);
    });
  });

  it('should fetch model fuels', async () => {
    const mockFuels: FuelModel[] = [
      { index: FuelTypes.GASOLINE, data: 'Petrol' },
      { index: FuelTypes.DIESEL, data: 'Diesel' }
    ];
    const vehicle: IVehicleModel = { make: 'Toyota', model: 'Corolla' };

    httpClientSpy.get.and.returnValue(of(mockFuels));

    service.modelFuels(vehicle).then(fuels => {
      expect(fuels).toEqual(mockFuels);
    });
  });

  it('should fetch vehicle powers', async () => {
    const mockPowers: PowerRangesModel[] = [
      { index: 'range-1', data: '100-200' },
      { index: 'range-2', data: '200-300' }
    ];
    const vehicle: IVehicleModel = { make: 'Toyota', model: 'Corolla' };

    httpClientSpy.get.and.returnValue(of(mockPowers));

    service.vehiclePowers(vehicle).then(powers => {
      expect(powers).toEqual(mockPowers);
    });
  });

  it('should fetch cubic capacities', async () => {
    const mockCapacities: CubicCapacityModel[] = [
      { index: 1, data: '1.5L' },
      { index: 2, data: '2.0L' }
    ];
    const vehicle: IVehicleModel = { make: 'Toyota', model: 'Corolla' };

    httpClientSpy.get.and.returnValue(of(mockCapacities));

    service.cubicCapacities(vehicle).then(capacities => {
      expect(capacities).toEqual(mockCapacities);
    });
  });

  it('should fetch vehicles', async () => {
    const mockVehicles: IVehicleModel[] = [
      { make: 'Toyota', model: 'Corolla' },
      { make: 'Honda', model: 'Civic' }
    ];

    httpClientSpy.get.and.returnValue(of(mockVehicles));

    service.vehicles().then(vehicles => {
      expect(vehicles).toEqual(mockVehicles);
    });
  });
});
