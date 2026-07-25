import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientosMaquinariaComponent } from './mantenimientos-maquinaria.component';

describe('MantenimientosMaquinariaComponent', () => {
  let component: MantenimientosMaquinariaComponent;
  let fixture: ComponentFixture<MantenimientosMaquinariaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientosMaquinariaComponent]
    });
    fixture = TestBed.createComponent(MantenimientosMaquinariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
