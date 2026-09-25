import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreoperacionalComponent } from './preoperacional.component';

describe('PreoperacionalComponent', () => {
  let component: PreoperacionalComponent;
  let fixture: ComponentFixture<PreoperacionalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreoperacionalComponent]
    });
    fixture = TestBed.createComponent(PreoperacionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
