import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Empchart1Component } from './empchart1.component';

describe('Empchart1Component', () => {
  let component: Empchart1Component;
  let fixture: ComponentFixture<Empchart1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Empchart1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Empchart1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
