import { TestBed } from '@angular/core/testing';

import { DonoService } from './dono.service';

describe('DonoService', () => {
  let service: DonoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
