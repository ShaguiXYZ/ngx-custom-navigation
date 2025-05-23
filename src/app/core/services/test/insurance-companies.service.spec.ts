import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { InsuranceCompany, InsuranceCompanyDTO } from '../../models';
import { InsuranceCompaniesService } from '../insurance-companies.service';

describe('InsuranceCompaniesService', () => {
  let service: InsuranceCompaniesService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [InsuranceCompaniesService, { provide: HttpClient, useValue: httpClientSpy }]
    });

    service = TestBed.inject(InsuranceCompaniesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected insurance companies (HttpClient called once)', (done: DoneFn) => {
    const expectedCompanies = [
      { value: '1', label: 'Company A' },
      { value: '2', label: 'Company B' }
    ] as InsuranceCompanyDTO[];

    const quoteCompanies = expectedCompanies.map(data => InsuranceCompany.create(data));

    httpClientSpy.get.and.returnValue(of(expectedCompanies));

    service
      .companies()
      .then(companies => {
        expect(companies).withContext('expected companies').toEqual(quoteCompanies);
        done();
      })
      .catch(done.fail);

    expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
  });
});
