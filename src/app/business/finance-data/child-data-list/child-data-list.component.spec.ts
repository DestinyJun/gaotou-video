import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildDataListComponent } from './child-data-list.component';

describe('ChildDataListComponent', () => {
  let component: ChildDataListComponent;
  let fixture: ComponentFixture<ChildDataListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildDataListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
