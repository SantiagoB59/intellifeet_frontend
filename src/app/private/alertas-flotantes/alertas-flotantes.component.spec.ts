import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertasFlotantesComponent } from './alertas-flotantes.component';

describe('AlertasFlotantesComponent', () => {
  let component: AlertasFlotantesComponent;
  let fixture: ComponentFixture<AlertasFlotantesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertasFlotantesComponent]
    });
    fixture = TestBed.createComponent(AlertasFlotantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
