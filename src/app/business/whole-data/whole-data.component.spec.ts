import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WholeDataComponent } from './whole-data.componentt';

describe('WholeDataComponent', () => {
  let component: WholeDataComponent;
  let fixture: ComponentFixture<WholeDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WholeDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WholeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
