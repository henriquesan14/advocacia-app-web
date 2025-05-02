import { TestBed } from '@angular/core/testing';

import { SituacaoProcessoService } from './situacao-processo.service';

describe('SituacaoProcessoService', () => {
  let service: SituacaoProcessoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SituacaoProcessoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
