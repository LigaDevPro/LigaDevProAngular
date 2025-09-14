import { TestBed } from '@angular/core/testing';

import { UltimosPartidos } from './ultimos-partidos';

describe('UltimosPartidos', () => {
  let service: UltimosPartidos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UltimosPartidos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
