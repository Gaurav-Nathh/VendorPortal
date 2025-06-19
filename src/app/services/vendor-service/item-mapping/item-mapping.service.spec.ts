import { TestBed } from '@angular/core/testing';

import { ItemMappingService } from './item-mapping.service';

describe('ItemMappingService', () => {
  let service: ItemMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
