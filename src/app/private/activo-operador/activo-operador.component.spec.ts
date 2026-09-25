import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivoOperadorComponent } from './activo-operador.component';

describe('ActivoOperadorComponent', () => {
  let component: ActivoOperadorComponent;
  let fixture: ComponentFixture<ActivoOperadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivoOperadorComponent]
    });
    fixture = TestBed.createComponent(ActivoOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
