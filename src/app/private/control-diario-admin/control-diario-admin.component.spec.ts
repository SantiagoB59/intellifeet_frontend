import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlDiarioAdminComponent } from './control-diario-admin.component';

describe('ControlDiarioAdminComponent', () => {
  let component: ControlDiarioAdminComponent;
  let fixture: ComponentFixture<ControlDiarioAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ControlDiarioAdminComponent]
    });
    fixture = TestBed.createComponent(ControlDiarioAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
