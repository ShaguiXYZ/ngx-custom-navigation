import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FuelTypes } from 'src/app/core/models';
import { HttpService } from '@shagui/ng-shagui/core';
import { QuoteVehicleModel, VehicleDTO } from '../../models';
import {
  BrandDTO,
  CubicCapacityDTO,
  CubicCapacityModel,
  FuelDTO,
  FuelModel,
  ModelVersionModel,
  VehicleClassesDTO,
  VehicleClassesModel,
  VehicleModelDTO
} from '../../models/vehicle';
import { VehicleService } from '../vehicle.service';

describe('VehicleService', () => {
  let service: VehicleService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    httpServiceSpy = jasmine.createSpyObj('HttpService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [VehicleService, { provide: HttpService, useValue: httpServiceSpy }]
    });

    service = TestBed.inject(VehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch vehicle brands', async () => {
    const mockBrands: BrandDTO = {
      collection: {
        url: '',
        count: 3,
        pages: 1,
        total: 3,
        next: '',
        prev: '',
        first: '',
        last: ''
      },
      data: [
        { id: 1, name: 'Toyota' },
        { id: 2, name: 'Honda' },
        { id: 3, name: 'Ford' }
      ]
    };
    const brand = 'to';

    httpServiceSpy.get.and.returnValue(of(mockBrands));

    const brands = await service.getBrands(brand);

    expect(brands).toEqual(['Toyota']);
  });

  it('should fetch vehicle models', async () => {
    const mockModels: VehicleModelDTO = {
      collection: {
        url: '',
        count: 3,
        pages: 1,
        total: 3,
        next: '',
        prev: '',
        first: '',
        last: ''
      },
      data: [
        { id: 1, make_id: 1, name: 'Corolla' },
        { id: 2, make_id: 1, name: 'Civic' },
        { id: 3, make_id: 1, name: 'Mustang' }
      ]
    };
    const brand = 'Toyota';
    const search = 'co';

    httpServiceSpy.get.and.returnValue(of(mockModels));

    const models = await service.getModels(brand, search);

    expect(models).toEqual(['Corolla']);
  });

  it('should fetch vehicle model versions', async () => {
    const mockModelVersions: ModelVersionModel[] = [
      { index: 1, data: 'Version1' },
      { index: 2, data: 'Version2' }
    ];
    const model = 'Corolla';

    httpServiceSpy.get.and.returnValue(of(mockModelVersions));

    const versions = await service.vehicleModelVersions(model);

    expect(versions).toEqual(mockModelVersions);
  });

  it('should fetch model fuels', async () => {
    const mockFuels: FuelDTO[] = [
      { value: FuelTypes.GASOLINE, label: 'Petrol' },
      { value: FuelTypes.DIESEL, label: 'Diesel' }
    ];
    const vehicle: QuoteVehicleModel = { brand: 'Toyota', model: 'Corolla' };

    httpServiceSpy.get.and.returnValue(of(mockFuels));

    const fuels = await service.getFuelTypes(vehicle);
    const expectedFuels: FuelModel[] = mockFuels.map(fuel => FuelDTO.toModel(fuel));

    expect(fuels).toEqual(expectedFuels);
  });

  it('should fetch vehicle powers', async () => {
    const mockPowers: VehicleClassesDTO[] = ['range-1.100-200', 'range-2.200-300'];
    const vehicle: QuoteVehicleModel = { brand: 'Toyota', model: 'Corolla' };

    httpServiceSpy.get.and.returnValue(of(mockPowers));

    const powers = await service.getVehicleClasses(vehicle);
    const expectedPowers: VehicleClassesModel[] = mockPowers.map(power => VehicleClassesDTO.toModel(power));

    expect(powers).toEqual(expectedPowers);
  });

  it('should fetch cubic capacities', async () => {
    const mockCapacities: CubicCapacityDTO[] = [
      { value: '1', label: '1.5L' },
      { value: '2', label: '2.0L' }
    ];
    const vehicle: QuoteVehicleModel = { brand: 'Toyota', model: 'Corolla' };

    httpServiceSpy.get.and.returnValue(of(mockCapacities));

    const capacities = await service.cubicCapacities(vehicle);
    const expectedCapacities: CubicCapacityModel[] = mockCapacities.map(capacity => CubicCapacityDTO.toModel(capacity));

    expect(capacities).toEqual(expectedCapacities);
  });

  it('should fetch vehicles', async () => {
    const mockVehicles: VehicleDTO[] = [
      { make: 'Toyota', model: 'Corolla' },
      { make: 'Honda', model: 'Civic' }
    ];

    httpServiceSpy.get.and.returnValue(of(mockVehicles));

    const vehicles = await service.vehicles();

    expect(vehicles).toEqual(mockVehicles.map(vehicle => VehicleDTO.toModel(vehicle)));
  });

  it('should find vehicle by plate', async () => {
    const plate = 'ABC123';
    const mockVehicleDTO: VehicleDTO = { make: 'Toyota', model: 'Corolla', plateNumber: plate };
    const mockVehicle: QuoteVehicleModel = { brand: 'Toyota', model: 'Corolla', creationDate: undefined, plateNumber: plate };

    httpServiceSpy.get.and.returnValue(of([mockVehicleDTO]));

    const vehicles = await service.findByPlate(plate);

    expect(vehicles).toEqual([mockVehicle]);
  });
});
