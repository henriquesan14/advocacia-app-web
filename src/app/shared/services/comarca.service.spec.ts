import { TestBed } from '@angular/core/testing';

import { ComarcaService } from './comarca.service';

describe('ComarcaService', () => {
  let service: ComarcaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComarcaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
