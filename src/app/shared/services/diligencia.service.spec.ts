import { TestBed } from '@angular/core/testing';

import { DiligenciaService } from './diligencia.service';

describe('DiligenciaService', () => {
  let service: DiligenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiligenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
