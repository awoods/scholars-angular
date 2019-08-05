import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { AppState } from '../core/store';

import { DiscoveryView, Filter, FacetType } from '../core/model/view';
import { SolrDocument } from '../core/model/discovery';
import { SdrPage, SdrFacet } from '../core/model/sdr';
import { WindowDimensions } from '../core/store/layout/layout.reducer';

import { selectRouterSearchQuery, selectRouterUrl, selectRouterQueryParamFilters, selectRouterQueryParams } from '../core/store/router';
import { selectAllResources, selectResourcesPage, selectResourcesFacets, selectResourceById } from '../core/store/sdr';
import { selectWindowDimensions } from '../core/store/layout';

import { addFacetsToQueryParams, addFiltersToQueryParams, addSortToQueryParams, addExportToQueryParams } from '../shared/utilities/view.utility';

import { environment } from '../../environments/environment';

@Component({
    selector: 'scholars-discovery',
    templateUrl: 'discovery.component.html',
    styleUrls: ['discovery.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscoveryComponent implements OnDestroy, OnInit {

    public windowDimensions: Observable<WindowDimensions>;

    public url: Observable<string>;

    public query: Observable<string>;

    public queryParams: Observable<Params>;

    public filters: Observable<any[]>;

    public discoveryViews: Observable<DiscoveryView[]>;

    public discoveryView: Observable<DiscoveryView>;

    public documents: Observable<SolrDocument[]>;

    public page: Observable<SdrPage>;

    public facets: Observable<SdrFacet[]>;

    private subscriptions: Subscription[];

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.subscriptions = [];
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

    ngOnInit() {
        this.windowDimensions = this.store.pipe(select(selectWindowDimensions));
        this.url = this.store.pipe(select(selectRouterUrl));
        this.query = this.store.pipe(select(selectRouterSearchQuery));
        this.queryParams = this.store.pipe(select(selectRouterQueryParams));
        this.filters = this.store.pipe(select(selectRouterQueryParamFilters));
        this.discoveryViews = this.store.pipe(select(selectAllResources<DiscoveryView>('discoveryViews')));
        this.subscriptions.push(this.route.params.subscribe((params) => {
            if (params.view) {
                this.discoveryView = this.store.pipe(
                    select(selectResourceById('discoveryViews', params.view)),
                    filter((view: DiscoveryView) => view !== undefined),
                    tap((view: DiscoveryView) => {
                        this.documents = this.store.pipe(select(selectAllResources<SolrDocument>(view.collection)));
                        this.page = this.store.pipe(select(selectResourcesPage<SolrDocument>(view.collection)));
                        this.facets = this.store.pipe(select(selectResourcesFacets<SolrDocument>(view.collection)));
                    })
                );
            }
        }));
    }

    public showTabs(windowDimensions: WindowDimensions): boolean {
        return windowDimensions.width > 767;
    }

    public isActive(discoveryView: DiscoveryView, url: string): boolean {
        return url.startsWith(`/discovery/${discoveryView.name}`);
    }

    public showFilter(discoveryView: DiscoveryView, actualFilter: Filter): boolean {
        // tslint:disable-next-line:no-shadowed-variable
        for (const filter of discoveryView.filters) {
            if (this.equals(filter, actualFilter)) {
                return false;
            }
        }
        return true;
    }

    public getFilterField(discoveryView: DiscoveryView, actualFilter: Filter): string {
        return actualFilter.field;
    }

    public getFilterValue(discoveryView: DiscoveryView, actualFilter: Filter): string {
        for (const facet of discoveryView.facets) {
            if (facet.type === FacetType.DATE_YEAR && facet.field === actualFilter.field) {
                return actualFilter.value.substring(1, actualFilter.value.length - 1).split(' TO ')[0];
            }
        }
        return actualFilter.value;
    }

    public hasExport(discoveryView: DiscoveryView): boolean {
        return discoveryView.export !== undefined && discoveryView.export.length > 0;
    }

    public getDiscoveryRouterLink(discoveryView: DiscoveryView): string[] {
        return ['/discovery', discoveryView.name];
    }

    public getDiscoveryQueryParams(discoveryView: DiscoveryView, page: SdrPage, query: string, filters: Filter[] = [], removeFilter: Filter): Params {
        const queryParams: Params = {};
        queryParams.collection = discoveryView.collection;
        addFacetsToQueryParams(queryParams, discoveryView);
        addFiltersToQueryParams(queryParams, discoveryView);
        addSortToQueryParams(queryParams, discoveryView);
        // tslint:disable-next-line:no-shadowed-variable
        filters.filter((filter: Filter) => !this.equals(filter, removeFilter)).forEach((filter: Filter) => {
            queryParams[`${filter.field}.filter`] = filter.value;
        });
        if (query && query.length > 0) {
            queryParams.query = query;
        }
        if (page && page.size) {
            queryParams.size = page.size;
        }
        return queryParams;
    }

    public getDiscoveryExportUrl(discoveryView: DiscoveryView, params: Params): string {
        const queryParams: Params = Object.assign({}, params);
        queryParams.fields = queryParams.facets;
        queryParams.facets = null;
        queryParams.collection = null;
        addExportToQueryParams(queryParams, discoveryView);
        const tree = this.router.createUrlTree([''], { queryParams });
        const query = tree.toString().substring(1);
        return `${environment.serviceUrl}/${discoveryView.collection}/search/export${query}`;
    }

    private equals(filterOne: Filter, filterTwo: Filter): boolean {
        return filterOne.field === filterTwo.field && filterOne.value === filterTwo.value;
    }

}
