import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adminchart1Component } from './adminchart1.component';

describe('Adminchart1Component', () => {
  let component: Adminchart1Component;
  let fixture: ComponentFixture<Adminchart1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Adminchart1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adminchart1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
