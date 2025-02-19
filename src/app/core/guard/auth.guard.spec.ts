import { inject, TestBed } from '@angular/core/testing';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { AuthGuard } from './auth.guard';

import { AlertService } from '../service/alert.service';
import { DialogService } from '../service/dialog.service';

import { metaReducers, reducers } from '../store';
import { testAppConfig } from '../../../test.config';

describe('AuthGuard', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthGuard,
                AlertService,
                DialogService,
                TranslateService
            ],
            imports: [
                StoreModule.forRoot(reducers(testAppConfig), {
                    metaReducers,
                    runtimeChecks: {
                        strictStateImmutability: false,
                        strictActionImmutability: false,
                        strictStateSerializability: false,
                        strictActionSerializability: false
                    }
                }),
                TranslateModule.forRoot(),
                RouterTestingModule.withRoutes([])
            ]
        });
    });

    it('should be created', inject([AuthGuard], (service: AuthGuard) => {
        expect(service).toBeTruthy();
    }));

});
