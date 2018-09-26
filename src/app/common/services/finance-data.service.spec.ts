import { TestBed, inject } from '@angular/core/testing';

import { FinanceDataService } from './finance-data.service';

describe('FinanceDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinanceDataService]
    });
  });

  it('should be created', inject([FinanceDataService], (service: FinanceDataService) => {
    expect(service).toBeTruthy();
  }));
});
