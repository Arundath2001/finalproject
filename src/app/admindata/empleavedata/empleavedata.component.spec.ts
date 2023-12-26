import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleavedataComponent } from './empleavedata.component';

describe('EmpleavedataComponent', () => {
  let component: EmpleavedataComponent;
  let fixture: ComponentFixture<EmpleavedataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpleavedataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpleavedataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
