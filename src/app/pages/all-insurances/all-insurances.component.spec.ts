import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllInsurancesComponent } from './all-insurances.component';

describe('AllInsurancesComponent', () => {
  let component: AllInsurancesComponent;
  let fixture: ComponentFixture<AllInsurancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllInsurancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllInsurancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
