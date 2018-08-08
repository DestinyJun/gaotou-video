import { TestBed, inject } from '@angular/core/testing';

import { WenjunAlertService } from './wenjun-alert.service';

describe('WenjunAlertService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WenjunAlertService]
    });
  });

  it('should be created', inject([WenjunAlertService], (service: WenjunAlertService) => {
    expect(service).toBeTruthy();
  }));
});
