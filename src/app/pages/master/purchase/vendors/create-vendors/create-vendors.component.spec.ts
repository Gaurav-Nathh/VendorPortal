import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVendorsComponent } from './create-vendors.component';

describe('CreateVendorsComponent', () => {
  let component: CreateVendorsComponent;
  let fixture: ComponentFixture<CreateVendorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateVendorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
