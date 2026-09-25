import { TestBed } from '@angular/core/testing';

import { ActivoOperadorService } from './activo-operador.service';

describe('ActivoOperadorService', () => {
  let service: ActivoOperadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivoOperadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
