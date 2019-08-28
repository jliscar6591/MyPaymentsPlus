import { TestBed, inject } from '@angular/core/testing';

import { MultiDistrictService } from './multi-district.service';

describe('MultiDistrictService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MultiDistrictService]
    });
  });

  it('should be created', inject([MultiDistrictService], (service: MultiDistrictService) => {
    expect(service).toBeTruthy();
  }));
});
