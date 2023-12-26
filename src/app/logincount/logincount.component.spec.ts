import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogincountComponent } from './logincount.component';

describe('LogincountComponent', () => {
  let component: LogincountComponent;
  let fixture: ComponentFixture<LogincountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogincountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogincountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
