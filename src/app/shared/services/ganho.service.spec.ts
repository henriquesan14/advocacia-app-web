import { TestBed } from '@angular/core/testing';

import { GanhoService } from './ganho.service';

describe('GanhoService', () => {
  let service: GanhoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GanhoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
