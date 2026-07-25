import { TestBed } from '@angular/core/testing';

import { SistemasService } from './sistemas.service';

describe('SistemasService', () => {
  let service: SistemasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SistemasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
