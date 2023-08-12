import { TestBed } from '@angular/core/testing';

import { ComponentPickerService } from './component-picker.service';

describe('ComponentPickerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComponentPickerService = TestBed.get(ComponentPickerService);
    expect(service).toBeTruthy();
  });
});
