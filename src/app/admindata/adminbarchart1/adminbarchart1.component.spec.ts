import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adminbarchart1Component } from './adminbarchart1.component';

describe('Adminbarchart1Component', () => {
  let component: Adminbarchart1Component;
  let fixture: ComponentFixture<Adminbarchart1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Adminbarchart1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adminbarchart1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
