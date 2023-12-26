import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminbtnComponent } from './adminbtn.component';

describe('AdminbtnComponent', () => {
  let component: AdminbtnComponent;
  let fixture: ComponentFixture<AdminbtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminbtnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminbtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
