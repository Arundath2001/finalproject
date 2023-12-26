import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adminbarchart2Component } from './adminbarchart2.component';

describe('Adminbarchart2Component', () => {
  let component: Adminbarchart2Component;
  let fixture: ComponentFixture<Adminbarchart2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Adminbarchart2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adminbarchart2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
