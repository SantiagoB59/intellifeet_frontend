import { TestBed } from '@angular/core/testing';

import { InspeccionMensualService } from './inspeccion-mensual.service';

describe('InspeccionMensualService', () => {
  let service: InspeccionMensualService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InspeccionMensualService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
