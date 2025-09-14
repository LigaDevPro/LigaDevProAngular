import { TestBed } from '@angular/core/testing';

import { Torneos } from './torneos';

describe('Torneos', () => {
  let service: Torneos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Torneos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
