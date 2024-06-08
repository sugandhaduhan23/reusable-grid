import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertBoxComponent } from './alert-box.component';

describe('AlertBoxComponent', () => {
  let component: AlertBoxComponent;
  let fixture: ComponentFixture<AlertBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertBoxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('alert box instance should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with showModal set to false', () => {
    expect(component.showModal).toBe(false);
  });

  it('should accept input properties', () => {
    component.title = 'Test Title';
    component.buttonTitle = 'Test Button Title';
    fixture.detectChanges();

    expect(component.title).toBe('Test Title');
    expect(component.buttonTitle).toBe('Test Button Title');
  });

  it('should set showModal to true when openModal is called', () => {
    component.openModal();
    expect(component.showModal).toBe(true);
  });

  it('should set showModal to false when closeModal is called', () => {
    component.showModal = true;
    component.closeModal();
    expect(component.showModal).toBe(false);
  });
});
