import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerShaftLengthwaysComponent } from './timer-shaft-lengthways.component';

describe('TimerShaftLengthwaysComponent', () => {
  let component: TimerShaftLengthwaysComponent;
  let fixture: ComponentFixture<TimerShaftLengthwaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerShaftLengthwaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerShaftLengthwaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
