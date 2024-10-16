import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
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
      { index: '1', data: 'Company A', icon: 'assets/images/wm/insurances/company/Company A.png' },
      { index: '2', data: 'Company B', icon: 'assets/images/wm/insurances/company/Company B.png' }
    ];

    httpClientSpy.get.and.returnValue(of(expectedCompanies));

    service
      .companies()
      .then(companies => {
        expect(companies).withContext('expected companies').toEqual(expectedCompanies);
        done();
      })
      .catch(done.fail);

    expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
  });
});
