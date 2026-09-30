import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPreviewComponent } from './dashboard-preview.component';

describe('DashboardPreviewComponent', () => {
  let component: DashboardPreviewComponent;
  let fixture: ComponentFixture<DashboardPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardPreviewComponent]
    });
    fixture = TestBed.createComponent(DashboardPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
