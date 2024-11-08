import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NxAvatarModule } from '@aposin/ng-aquila/avatar';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { BrandData, BrandKey, IVehicleDictionaryData } from 'src/app/core/models';
import { SelectableOptionComponent } from 'src/app/shared/components';
import { BrandComponent } from './brand.component';

describe('BrandComponent', () => {
  let component: BrandComponent;
  let fixture: ComponentFixture<BrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [BrandComponent, CommonModule, SelectableOptionComponent, NxAvatarModule, NxCopytextModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit uiSelect event when selectBrand is called', () => {
    spyOn(component.uiSelect, 'emit');
    component.brand = 'someBrandKey' as BrandKey;
    component.selectBrand();
    expect(component.uiSelect.emit).toHaveBeenCalledWith('someBrandKey');
  });

  it('should set brand and data correctly', () => {
    const brandKey: BrandKey = 'someBrandKey' as BrandKey;
    const mockData: IVehicleDictionaryData = {
      /* mock data */
    };
    spyOn(BrandData, 'value').and.returnValue(mockData);

    component.brand = brandKey;

    expect(component.brand).toBe(brandKey);
    expect(component.data).toBe(mockData);
  });

  it('should have selected input as undefined by default', () => {
    expect(component.selected).toBeUndefined();
  });

  it('should render the brand component correctly', () => {
    component.brand = 'NISSAN' as BrandKey;
    fixture.detectChanges();
    const brandElement = fixture.debugElement.query(By.css('.card-container'));

    expect(brandElement).toBeTruthy();
  });
});
