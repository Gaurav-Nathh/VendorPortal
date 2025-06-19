import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSalesOrderComponent } from './dashboard-sales-order.component';

describe('DashboardSalesOrderComponent', () => {
  let component: DashboardSalesOrderComponent;
  let fixture: ComponentFixture<DashboardSalesOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSalesOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSalesOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
