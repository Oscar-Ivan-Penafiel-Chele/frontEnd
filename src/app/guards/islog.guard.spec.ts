import { TestBed } from '@angular/core/testing';

import { IslogGuard } from './islog.guard';

describe('IslogGuard', () => {
  let guard: IslogGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IslogGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
