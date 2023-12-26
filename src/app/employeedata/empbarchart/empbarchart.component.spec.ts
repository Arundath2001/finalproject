import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpbarchartComponent } from './empbarchart.component';

describe('EmpbarchartComponent', () => {
  let component: EmpbarchartComponent;
  let fixture: ComponentFixture<EmpbarchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpbarchartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpbarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
