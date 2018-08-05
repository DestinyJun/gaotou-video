import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerShaftCrosswiseComponent } from './timer-shaft-crosswise.component';

describe('TimerShaftCrosswiseComponent', () => {
  let component: TimerShaftCrosswiseComponent;
  let fixture: ComponentFixture<TimerShaftCrosswiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerShaftCrosswiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerShaftCrosswiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
