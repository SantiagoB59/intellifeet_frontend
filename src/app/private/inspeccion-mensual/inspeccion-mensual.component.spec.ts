import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspeccionMensualComponent } from './inspeccion-mensual.component';

describe('InspeccionMensualComponent', () => {
  let component: InspeccionMensualComponent;
  let fixture: ComponentFixture<InspeccionMensualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InspeccionMensualComponent]
    });
    fixture = TestBed.createComponent(InspeccionMensualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
