import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRateComponent } from './service-rate.component';

describe('ServiceRateComponent', () => {
  let component: ServiceRateComponent;
  let fixture: ComponentFixture<ServiceRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceRateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
