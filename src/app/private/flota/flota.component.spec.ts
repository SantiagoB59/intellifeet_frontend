import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlotaComponent } from './flota.component';

describe('FlotaComponent', () => {
  let component: FlotaComponent;
  let fixture: ComponentFixture<FlotaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlotaComponent]
    });
    fixture = TestBed.createComponent(FlotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
