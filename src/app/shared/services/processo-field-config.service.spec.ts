import { TestBed } from '@angular/core/testing';

import { ProcessoFieldConfigService } from './processo-field-config.service';

describe('ProcessoFieldConfigService', () => {
  let service: ProcessoFieldConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessoFieldConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
