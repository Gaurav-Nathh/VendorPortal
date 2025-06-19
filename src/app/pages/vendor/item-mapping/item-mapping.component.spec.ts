import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMappingComponent } from './item-mapping.component';

describe('ItemMappingComponent', () => {
  let component: ItemMappingComponent;
  let fixture: ComponentFixture<ItemMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemMappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
