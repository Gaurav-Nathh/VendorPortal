import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoListComponent } from './po-list.component';

describe('PoListComponent', () => {
  let component: PoListComponent;
  let fixture: ComponentFixture<PoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
