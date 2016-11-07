/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { GeoTargetingApiService } from './geo-targeting-api.service';
import { FbService } from '../../fb/fb.service';
import { TranslateService } from 'ng2-translate';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

describe('Service: Api', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:   [],
      providers: [
        GeoTargetingApiService,
        {
          provide: FbService, useValue: {
          api: new Subject()
        }
        },
        {
          provide: TranslateService, useValue: {
          onLangChange: new Subject()
        }
        },
        {provide: Store, useValue: {}},
      ]
    });
  });

  it('should ...', inject([GeoTargetingApiService], (service: GeoTargetingApiService) => {
    expect(service)
      .toBeTruthy();
  }));
});
