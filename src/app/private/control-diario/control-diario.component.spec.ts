import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlDiarioComponent } from './control-diario.component';

describe('ControlDiarioComponent', () => {
  let component: ControlDiarioComponent;
  let fixture: ComponentFixture<ControlDiarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ControlDiarioComponent]
    });
    fixture = TestBed.createComponent(ControlDiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
