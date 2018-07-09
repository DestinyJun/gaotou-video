import { TestBed, inject } from '@angular/core/testing';

import { CentermapService } from './centermap.service';

describe('CentermapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CentermapService]
    });
  });

  it('should be created', inject([CentermapService], (service: CentermapService) => {
    expect(service).toBeTruthy();
  }));
});
