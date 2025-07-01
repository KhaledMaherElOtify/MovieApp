import { TestBed } from '@angular/core/testing';

import { Fetch } from './fetch';

describe('Fetch', () => {
  let service: Fetch;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fetch);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
