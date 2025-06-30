import { TestBed } from '@angular/core/testing';

import { VendorServiceFileService } from './vendor-service-file.service';

describe('VendorServiceFileService', () => {
  let service: VendorServiceFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorServiceFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
