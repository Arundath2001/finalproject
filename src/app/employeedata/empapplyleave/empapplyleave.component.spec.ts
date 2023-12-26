import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpapplyleaveComponent } from './empapplyleave.component';

describe('EmpapplyleaveComponent', () => {
  let component: EmpapplyleaveComponent;
  let fixture: ComponentFixture<EmpapplyleaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpapplyleaveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpapplyleaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
