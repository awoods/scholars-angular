import { Params } from '@angular/router';
import { RouterReducerState } from '@ngrx/router-store';
import { createSelector, createFeatureSelector } from '@ngrx/store';

import { CustomRouterState } from './router.reducer';
import { Filter } from '../../model/view';

export const selectRouterState = createFeatureSelector<RouterReducerState<CustomRouterState>>('router');

export const selectRouterUrl = createSelector(selectRouterState, (router: RouterReducerState<CustomRouterState>) => router && router.state && router.state.url);
export const selectRouterParams = createSelector(selectRouterState, (router: RouterReducerState<CustomRouterState>) => router && router.state && router.state.params);
export const selectRouterQueryParams = createSelector(selectRouterState, (router: RouterReducerState<CustomRouterState>) => router && router.state && router.state.queryParams);
export const selectRouterData = createSelector(selectRouterState, (router: RouterReducerState<CustomRouterState>) => router && router.state && router.state.data);
export const selectRouterSearchQuery = createSelector(selectRouterState, (router: RouterReducerState<CustomRouterState>) => router && router.state && router.state.queryParams ? router.state.queryParams.query : '');

export const selectRouterQueryParamFilters = createSelector(
    selectRouterQueryParams,
    (queryParams: Params): Filter[] => {
        const filters: Filter[] = [];
        if (queryParams.filters) {
            queryParams.filters.split(',').forEach((field: string) => {
                const value = queryParams[`${field}.filter`];
                const opKey = queryParams[`${field}.opKey`];
                if (value) {
                    filters.push({
                        field,
                        value,
                        opKey
                    });
                }
            });
        }
        return filters;
    }
);
