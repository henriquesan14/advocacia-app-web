import { TestBed } from '@angular/core/testing';

import { FilterProcessoService } from './filter-processo.service';

describe('FilterProcessoService', () => {
  let service: FilterProcessoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterProcessoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
