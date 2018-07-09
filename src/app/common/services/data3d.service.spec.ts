import { TestBed, inject } from '@angular/core/testing';

import { Data3dService } from './data3d.service';

describe('Data3dService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Data3dService]
    });
  });

  it('should be created', inject([Data3dService], (service: Data3dService) => {
    expect(service).toBeTruthy();
  }));
});
