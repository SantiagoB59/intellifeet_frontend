import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesPreoperacionalesComponent } from './reportes-preoperacionales.component';

describe('ReportesPreoperacionalesComponent', () => {
  let component: ReportesPreoperacionalesComponent;
  let fixture: ComponentFixture<ReportesPreoperacionalesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportesPreoperacionalesComponent]
    });
    fixture = TestBed.createComponent(ReportesPreoperacionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
