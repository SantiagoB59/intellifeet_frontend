import { TestBed } from '@angular/core/testing';

import { VehiculoTrackingService } from './vehiculo-tracking.service';

describe('VehiculoTrackingService', () => {
  let service: VehiculoTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehiculoTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
