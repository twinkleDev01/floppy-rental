import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdPlacementComponent } from './ad-placement.component';

describe('AdPlacementComponent', () => {
  let component: AdPlacementComponent;
  let fixture: ComponentFixture<AdPlacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdPlacementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
