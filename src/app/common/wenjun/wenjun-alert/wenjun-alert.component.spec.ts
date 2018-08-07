import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WenjunAlertComponent } from './wenjun-alert.component';

describe('WenjunAlertComponent', () => {
  let component: WenjunAlertComponent;
  let fixture: ComponentFixture<WenjunAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WenjunAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WenjunAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
