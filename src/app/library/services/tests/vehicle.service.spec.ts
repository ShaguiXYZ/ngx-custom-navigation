import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FuelTypes } from 'src/app/core/models';
import { QuoteVehicleModel, VehicleDTO } from '../../models';
import {
  CubicCapacityDTO,
  CubicCapacityModel,
  FuelDTO,
  FuelModel,
  ModelVersionModel,
  VehicleClassesDTO,
  VehicleClassesModel
} from '../../models/vehicle';
import { VehicleService } from '../vehicle.service';

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

    service.getBrands(brand).then(brands => {
      expect(brands).toEqual(['Toyota']);
    });
  });

  it('should fetch vehicle models', async () => {
    const mockModels = ['Corolla', 'Civic', 'Mustang'];
    const brand = 'Toyota';
    const search = 'co';

    httpClientSpy.get.and.returnValue(of(mockModels));

    service.getModels(brand, search).then(models => {
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
    const mockFuels: FuelDTO[] = [
      { value: FuelTypes.GASOLINE, label: 'Petrol' },
      { value: FuelTypes.DIESEL, label: 'Diesel' }
    ];
    const vehicle: QuoteVehicleModel = { brand: 'Toyota', model: 'Corolla' };

    httpClientSpy.get.and.returnValue(of(mockFuels));

    service.getFuelTypes(vehicle).then(fuels => {
      const expectedFuels: FuelModel[] = mockFuels.map(fuel => FuelDTO.toModel(fuel));

      expect(fuels).toEqual(expectedFuels);
    });
  });

  it('should fetch vehicle powers', async () => {
    const mockPowers: VehicleClassesDTO[] = ['range-1.100-200', 'range-2.200-300'];
    const vehicle: QuoteVehicleModel = { brand: 'Toyota', model: 'Corolla' };

    httpClientSpy.get.and.returnValue(of(mockPowers));

    service.getVehicleClasses(vehicle).then(powers => {
      const expectedPowers: VehicleClassesModel[] = mockPowers.map(power => VehicleClassesDTO.toModel(power));

      expect(powers).toEqual(expectedPowers);
    });
  });

  it('should fetch cubic capacities', async () => {
    const mockCapacities: CubicCapacityDTO[] = [
      { value: '1', label: '1.5L' },
      { value: '2', label: '2.0L' }
    ];
    const vehicle: QuoteVehicleModel = { brand: 'Toyota', model: 'Corolla' };

    httpClientSpy.get.and.returnValue(of(mockCapacities));

    service.cubicCapacities(vehicle).then(capacities => {
      const expectedCapacities: CubicCapacityModel[] = mockCapacities.map(capacity => CubicCapacityDTO.toModel(capacity));

      expect(capacities).toEqual(expectedCapacities);
    });
  });

  it('should fetch vehicles', async () => {
    const mockVehicles: VehicleDTO[] = [
      { make: 'Toyota', model: 'Corolla' },
      { make: 'Honda', model: 'Civic' }
    ];

    httpClientSpy.get.and.returnValue(of(mockVehicles));

    service.vehicles().then(vehicles => {
      expect(vehicles).toEqual(mockVehicles.map(vehicle => VehicleDTO.toModel(vehicle)));
    });
  });

  it('should find vehicle by plate', async () => {
    const plate = 'ABC123';
    const mockVehicleDTO: VehicleDTO = { make: 'Toyota', model: 'Corolla', plateNumber: plate };
    const mockVehicle: QuoteVehicleModel = { brand: 'Toyota', model: 'Corolla', creationDate: undefined, plateNumber: plate };

    httpClientSpy.get.and.returnValue(of([mockVehicleDTO]));

    service.findByPlate(plate).then(vehicle => {
      expect(vehicle).toEqual([mockVehicle]);
    });
  });
});
