import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntiDiscriminationPolicyComponent } from './anti-discrimination-policy.component';

describe('AntiDiscriminationPolicyComponent', () => {
  let component: AntiDiscriminationPolicyComponent;
  let fixture: ComponentFixture<AntiDiscriminationPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AntiDiscriminationPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AntiDiscriminationPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
