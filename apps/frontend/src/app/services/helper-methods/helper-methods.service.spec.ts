import { TestBed } from '@angular/core/testing';

import { HelperMethodsService } from './helper-methods.service';

describe('HelperMethodsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HelperMethodsService = TestBed.get(HelperMethodsService);
    expect(service).toBeTruthy();
  });
});
