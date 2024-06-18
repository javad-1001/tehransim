import { TestBed } from '@angular/core/testing';

import { GurdGuard } from './gurd.guard';

describe('GurdGuard', () => {
  let guard: GurdGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GurdGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
