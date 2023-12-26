import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpnavbarComponent } from './empnavbar.component';

describe('EmpnavbarComponent', () => {
  let component: EmpnavbarComponent;
  let fixture: ComponentFixture<EmpnavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpnavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpnavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
