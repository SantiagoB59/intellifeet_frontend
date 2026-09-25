import { TestBed } from '@angular/core/testing';

import { ReportesPreoperacionalesService } from './reportes-preoperacionales.service';

describe('ReportesPreoperacionalesService', () => {
  let service: ReportesPreoperacionalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportesPreoperacionalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
