import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificacionKmComponent } from './verificacion-km.component';

describe('VerificacionKmComponent', () => {
  let component: VerificacionKmComponent;
  let fixture: ComponentFixture<VerificacionKmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerificacionKmComponent]
    });
    fixture = TestBed.createComponent(VerificacionKmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
