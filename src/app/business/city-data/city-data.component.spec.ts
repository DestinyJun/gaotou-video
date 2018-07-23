import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CityDataComponent } from './city-data.component';

describe('CityDataComponent', () => {
  let component: CityDataComponent;
  let fixture: ComponentFixture<CityDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CityDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
