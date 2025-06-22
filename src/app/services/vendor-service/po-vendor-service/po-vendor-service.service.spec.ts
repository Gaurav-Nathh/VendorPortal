import { TestBed } from '@angular/core/testing';

import { PoVendorServiceService } from './po-vendor-service.service';

describe('PoVendorServiceService', () => {
  let service: PoVendorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoVendorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
