import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreoperationalComponent } from './preoperational.component';

describe('PreoperationalComponent', () => {
  let component: PreoperationalComponent;
  let fixture: ComponentFixture<PreoperationalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreoperationalComponent]
    });
    fixture = TestBed.createComponent(PreoperationalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
