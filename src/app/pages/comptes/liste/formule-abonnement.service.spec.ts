import { TestBed } from '@angular/core/testing';

import { FormuleAbonnementService } from './formule-abonnement.service';

describe('FormuleAbonnementService', () => {
  let service: FormuleAbonnementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormuleAbonnementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
