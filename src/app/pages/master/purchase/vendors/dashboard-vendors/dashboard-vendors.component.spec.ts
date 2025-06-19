import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardVendorsComponent } from './dashboard-vendors.component';

describe('DashboardVendorsComponent', () => {
  let component: DashboardVendorsComponent;
  let fixture: ComponentFixture<DashboardVendorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardVendorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
