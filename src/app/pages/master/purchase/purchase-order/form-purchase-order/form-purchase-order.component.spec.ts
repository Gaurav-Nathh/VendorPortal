import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPurchaseOrderComponent } from './form-purchase-order.component';

describe('FormPurchaseOrderComponent', () => {
  let component: FormPurchaseOrderComponent;
  let fixture: ComponentFixture<FormPurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPurchaseOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
