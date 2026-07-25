import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaquinariaComponent } from './maquinaria.component';

describe('MaquinariaComponent', () => {
  let component: MaquinariaComponent;
  let fixture: ComponentFixture<MaquinariaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaquinariaComponent]
    });
    fixture = TestBed.createComponent(MaquinariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
