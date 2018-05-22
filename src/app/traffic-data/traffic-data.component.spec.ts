import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficDataComponent } from './traffic-data.component';

describe('TrafficDataComponent', () => {
  let component: TrafficDataComponent;
  let fixture: ComponentFixture<TrafficDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrafficDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrafficDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
