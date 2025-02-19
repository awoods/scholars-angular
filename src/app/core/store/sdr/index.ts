import { createSelector, createFeatureSelector } from '@ngrx/store';

import { DiscoveryView, DisplayView, DirectoryView, CollectionView, Filter } from '../../model/view';
import { SdrResource } from '../../model/sdr';

import * as fromSdr from './sdr.reducer';

export const selectSdrState = <R extends SdrResource>(name: string) => createFeatureSelector<fromSdr.SdrState<R>>(name);

export const selectResourceIds = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.selectIds(name));
export const selectResourceEntities = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.selectEntities(name));
export const selectAllResources = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.selectAll(name));
export const selectResourcesTotal = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.selectTotal(name));

export const selectResourceError = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.getError);
export const selectResourceIsCounting = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.isCounting);
export const selectResourceIsLoading = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.isLoading);
export const selectResourceIsDereferencing = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.isDereferencing);
export const selectResourceIsUpdating = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.isUpdating);

export const selectResourcesCounts = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.getCounts);
export const selectResourcesPage = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.getPage);
export const selectResourcesFacets = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.getFacets);
export const selectResourcesLinks = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.getLinks);
export const selectResourcesRecentlyUpdated = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.getRecentlyUpdated);

export const selectResourceById = <R extends SdrResource>(name: string, id: string) => createSelector(
    selectResourceEntities<R>(name),
    resources => resources[id]
);

export const selectDirectoryViewByClass = (clazz: string) => createSelector(
    selectAllResources<DirectoryView>('directoryViews'),
    (resources) => resources.find((dv: DirectoryView) => dv.filters.find((filter: Filter) => filter.field === 'class').value === clazz)
);

export const selectDiscoveryViewByClass = (clazz: string) => createSelector(
    selectAllResources<DiscoveryView>('discoveryViews'),
    (resources) => resources.find((dv: DiscoveryView) => dv.filters.find((filter: Filter) => filter.field === 'class').value === clazz)
);

export const selectCollectionViewByName = (collection: string, name: string) => createSelector(
    selectResourceEntities<CollectionView>(collection),
    (collectionViews) => collectionViews[name]
);

export const selectDisplayViewByTypes = (types: string[]) => createSelector(
    selectResourceEntities<DisplayView>('displayViews'),
    (displayViews) => {
        let defaultDisplayView;
        for (const key in displayViews) {
            if (displayViews.hasOwnProperty(key)) {
                for (const i in types) {
                    if (displayViews.hasOwnProperty(key)) {
                        if (displayViews[key].types.indexOf(types[i]) >= 0) {
                            return displayViews[key];
                        }
                    }
                }
                if (displayViews[key].name === 'Default') {
                    defaultDisplayView = displayViews[key];
                }
            }
        }
        return defaultDisplayView;
    }
);

export const selectDisplayViewTab = (view: string, tab: string) => createSelector(
    selectResourceEntities<DisplayView>('displayViews'),
    (displayViews) => {
        for (const i in displayViews) {
            if (displayViews.hasOwnProperty(i)) {
                if (displayViews[i].name === view) {
                    for (const j in displayViews[i].tabs) {
                        if (displayViews[i].tabs.hasOwnProperty(j)) {
                            if (displayViews[i].tabs[j].name === tab) {
                                return displayViews[i].tabs[j];
                            }
                        }
                    }
                }
            }
        }
    }
);
