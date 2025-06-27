import { TestBed } from '@angular/core/testing';

import { ViewInvoiceService } from './view-invoice.service';

describe('ViewInvoiceService', () => {
  let service: ViewInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
