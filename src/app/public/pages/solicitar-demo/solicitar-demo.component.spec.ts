import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarDemoComponent } from './solicitar-demo.component';

describe('SolicitarDemoComponent', () => {
  let component: SolicitarDemoComponent;
  let fixture: ComponentFixture<SolicitarDemoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitarDemoComponent]
    });
    fixture = TestBed.createComponent(SolicitarDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
