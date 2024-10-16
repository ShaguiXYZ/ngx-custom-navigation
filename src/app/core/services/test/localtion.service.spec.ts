import { TestBed } from '@angular/core/testing';
import { LocationService } from '../localtion.service';

describe('LocationService', () => {
  let service: LocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return undefined for invalid postal code length', async () => {
    const result = await service.getAddresses('123');
    expect(result).toBeUndefined();
  });

  it('should return undefined for non-existent province code', async () => {
    const result = await service.getAddresses('99999');
    expect(result).toBeUndefined();
  });

  it('should return correct address for valid postal code', async () => {
    const result = await service.getAddresses('28001');
    expect(result).toEqual({ index: '28', data: 'Madrid' });
  });

  it('should return correct address for another valid postal code', async () => {
    const result = await service.getAddresses('46001');
    expect(result).toEqual({ index: '46', data: 'Valencia' });
  });

  it('should return undefined for postal code with invalid characters', async () => {
    const result = await service.getAddresses('28A01');
    expect(result).toBeUndefined();
  });
});
