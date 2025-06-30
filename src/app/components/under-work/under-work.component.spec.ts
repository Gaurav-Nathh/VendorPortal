import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderWorkComponent } from './under-work.component';

describe('UnderWorkComponent', () => {
  let component: UnderWorkComponent;
  let fixture: ComponentFixture<UnderWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnderWorkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnderWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
