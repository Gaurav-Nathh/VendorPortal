import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSalesOrderComponent } from './form-sales-order.component';

describe('FormSalesOrderComponent', () => {
  let component: FormSalesOrderComponent;
  let fixture: ComponentFixture<FormSalesOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSalesOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSalesOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
