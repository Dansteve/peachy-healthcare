import { TestBed } from '@angular/core/testing';
import { CustomTitleStrategy } from './custom-title-strategy.service';


describe('TemplateMetadataStrategyService', () => {
  let service: CustomTitleStrategy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomTitleStrategy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
