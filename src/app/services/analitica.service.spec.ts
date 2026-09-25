import { TestBed } from '@angular/core/testing';

import { AnaliticaService } from './analitica.service';

describe('AnaliticaService', () => {
  let service: AnaliticaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnaliticaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
