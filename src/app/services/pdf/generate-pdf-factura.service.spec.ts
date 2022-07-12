import { TestBed } from '@angular/core/testing';

import { GeneratePdfFacturaService } from './generate-pdf-factura.service';

describe('GeneratePdfFacturaService', () => {
  let service: GeneratePdfFacturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneratePdfFacturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
