import { TestBed } from '@angular/core/testing';

import { GoodRecServiceService } from './good-rec-service.service';

describe('GoodRecServiceService', () => {
  let service: GoodRecServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoodRecServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
