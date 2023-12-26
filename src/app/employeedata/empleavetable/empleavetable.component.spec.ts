import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleavetableComponent } from './empleavetable.component';

describe('EmpleavetableComponent', () => {
  let component: EmpleavetableComponent;
  let fixture: ComponentFixture<EmpleavetableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpleavetableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpleavetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
