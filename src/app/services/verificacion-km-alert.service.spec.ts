import { TestBed } from '@angular/core/testing';

import { VerificacionKmAlertService } from './verificacion-km-alert.service';

describe('VerificacionKmAlertService', () => {
  let service: VerificacionKmAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerificacionKmAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
