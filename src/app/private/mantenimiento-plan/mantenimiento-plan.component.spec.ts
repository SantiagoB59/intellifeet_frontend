import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoPlanComponent } from './mantenimiento-plan.component';

describe('MantenimientoPlanComponent', () => {
  let component: MantenimientoPlanComponent;
  let fixture: ComponentFixture<MantenimientoPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoPlanComponent]
    });
    fixture = TestBed.createComponent(MantenimientoPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
