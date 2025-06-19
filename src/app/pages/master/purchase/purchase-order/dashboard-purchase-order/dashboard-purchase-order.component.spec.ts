import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPurchaseOrderComponent } from './dashboard-purchase-order.component';

describe('DashboardPurchaseOrderComponent', () => {
  let component: DashboardPurchaseOrderComponent;
  let fixture: ComponentFixture<DashboardPurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPurchaseOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
