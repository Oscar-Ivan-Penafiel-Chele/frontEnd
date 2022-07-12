import { TestBed } from '@angular/core/testing';

import { GenerateReportSailService } from './generate-report-sail.service';

describe('GenerateReportSailService', () => {
  let service: GenerateReportSailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateReportSailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
