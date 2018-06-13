import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildDataMapComponent } from './child-data-map.component';

describe('ChildDataMapComponent', () => {
  let component: ChildDataMapComponent;
  let fixture: ComponentFixture<ChildDataMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildDataMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildDataMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
