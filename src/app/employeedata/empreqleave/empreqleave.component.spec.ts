import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpreqleaveComponent } from './empreqleave.component';

describe('EmprequestleaveComponent', () => {
  let component: EmpreqleaveComponent;
  let fixture: ComponentFixture<EmpreqleaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpreqleaveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpreqleaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
