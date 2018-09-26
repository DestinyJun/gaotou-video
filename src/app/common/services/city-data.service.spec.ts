import { TestBed, inject } from '@angular/core/testing';

import { CityDataService } from './city-data.service';

describe('CityDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CityDataService]
    });
  });

  it('should be created', inject([CityDataService], (service: CityDataService) => {
    expect(service).toBeTruthy();
  }));
});
