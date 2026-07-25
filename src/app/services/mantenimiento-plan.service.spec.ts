import { TestBed } from '@angular/core/testing';

import { MantenimientoPlanService } from './mantenimiento-plan.service';

describe('MantenimientoPlanService', () => {
  let service: MantenimientoPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MantenimientoPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
