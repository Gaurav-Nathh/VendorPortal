import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsReceiptsComponent } from './goods-receipts.component';

describe('GoodsReceiptsComponent', () => {
  let component: GoodsReceiptsComponent;
  let fixture: ComponentFixture<GoodsReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoodsReceiptsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoodsReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
