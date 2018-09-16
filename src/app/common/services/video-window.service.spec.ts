import { TestBed, inject } from '@angular/core/testing';

import { VideoWindowService } from './video-window.service';

describe('VideoWindowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VideoWindowService]
    });
  });

  it('should be created', inject([VideoWindowService], (service: VideoWindowService) => {
    expect(service).toBeTruthy();
  }));
});
