import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoGoodReceiptComponent } from './po-good-receipt.component';

describe('PoGoodReceiptComponent', () => {
  let component: PoGoodReceiptComponent;
  let fixture: ComponentFixture<PoGoodReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoGoodReceiptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoGoodReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
