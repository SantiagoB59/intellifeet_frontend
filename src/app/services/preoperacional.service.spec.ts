import { TestBed } from '@angular/core/testing';

import { PreoperacionalService } from './preoperacional.service';

describe('PreoperacionalService', () => {
  let service: PreoperacionalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreoperacionalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
