import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimedateComponent } from './timedate.component';

describe('TimedateComponent', () => {
  let component: TimedateComponent;
  let fixture: ComponentFixture<TimedateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimedateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimedateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
