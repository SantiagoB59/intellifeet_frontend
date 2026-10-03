import { TestBed } from '@angular/core/testing';

import { ControlDiarioService } from './control-diario.service';

describe('ControlDiarioService', () => {
  let service: ControlDiarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlDiarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
