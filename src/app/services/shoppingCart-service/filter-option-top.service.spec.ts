import { TestBed } from '@angular/core/testing';

import { FilterOptionTopService } from './filter-option-top.service';

describe('FilterOptionTopService', () => {
  let service: FilterOptionTopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterOptionTopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
