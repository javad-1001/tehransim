import { TestBed } from '@angular/core/testing';

import { GurdServiceService } from './Services/gurd-service.service';

describe('GurdServiceService', () => {
  let service: GurdServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GurdServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
