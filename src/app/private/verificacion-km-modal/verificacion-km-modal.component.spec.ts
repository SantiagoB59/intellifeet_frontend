import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificacionKmModalComponent } from './verificacion-km-modal.component';

describe('VerificacionKmModalComponent', () => {
  let component: VerificacionKmModalComponent;
  let fixture: ComponentFixture<VerificacionKmModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerificacionKmModalComponent]
    });
    fixture = TestBed.createComponent(VerificacionKmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
