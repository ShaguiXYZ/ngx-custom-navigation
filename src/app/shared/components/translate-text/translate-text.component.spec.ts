import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslationService } from 'src/app/core/services';
import { QuoteTranslatePipe } from '../../pipes';
import { TranslateTextComponent } from './translate-text.component';

describe('TranslateTextComponent', () => {
  const translationServiceSpy = jasmine.createSpyObj('TranslationService', ['translate']);
  let component: TranslateTextComponent;
  let fixture: ComponentFixture<TranslateTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [CommonModule, TranslateTextComponent, QuoteTranslatePipe],
      providers: [{ provide: TranslationService, useValue: translationServiceSpy }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslateTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should display translated text', async () => {
  //   component.text = 'Hello, world!';

  //   translationServiceSpy.translate.and.returnValue(of({ translatedText: 'Hola, mundo!' }));

  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement;

  //   await fixture.whenStable();
  //   console.log(compiled.querySelector('span'));

  //   expect(compiled.querySelector('span').textContent).toContain('Hola, mundo!');
  // });

  // it('should handle undefined text input', async () => {
  //   component.text = undefined;
  //   fixture.detectChanges();
  //   await fixture.whenStable();

  //   const compiled = fixture.nativeElement;
  //   expect(compiled.querySelector('span').textContent).toBe('');
  // });
});
