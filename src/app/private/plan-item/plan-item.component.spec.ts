import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanItemComponent } from './plan-item.component';

describe('PlanItemComponent', () => {
  let component: PlanItemComponent;
  let fixture: ComponentFixture<PlanItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanItemComponent]
    });
    fixture = TestBed.createComponent(PlanItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
