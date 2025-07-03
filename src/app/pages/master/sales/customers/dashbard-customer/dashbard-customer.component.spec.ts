import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbardCustomerComponent } from './dashbard-customer.component';

describe('DashbardCustomerComponent', () => {
  let component: DashbardCustomerComponent;
  let fixture: ComponentFixture<DashbardCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashbardCustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashbardCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
