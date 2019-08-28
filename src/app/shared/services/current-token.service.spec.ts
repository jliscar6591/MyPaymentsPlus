import { TestBed, inject } from '@angular/core/testing';

import { CurrentTokenService } from './current-token.service';

describe('CurrentTokenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrentTokenService]
    });
  });

  it('should be created', inject([CurrentTokenService], (service: CurrentTokenService) => {
    expect(service).toBeTruthy();
  }));
});
