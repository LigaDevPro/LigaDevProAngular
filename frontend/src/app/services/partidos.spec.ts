import { TestBed } from '@angular/core/testing';

import { Partidos } from './partidos';

describe('Partidos', () => {
  let service: Partidos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Partidos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
