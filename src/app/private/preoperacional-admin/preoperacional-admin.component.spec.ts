import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreoperacionalAdminComponent } from './preoperacional-admin.component';

describe('PreoperacionalAdminComponent', () => {
  let component: PreoperacionalAdminComponent;
  let fixture: ComponentFixture<PreoperacionalAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreoperacionalAdminComponent]
    });
    fixture = TestBed.createComponent(PreoperacionalAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
