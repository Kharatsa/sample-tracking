import {connect} from 'react-redux';
import {changeSummaryFilter} from '../actions/actioncreators';
import {LocationFilters} from '../components/DashboardControls';
import {
  getMetaRegions, getFilteredMetaFacilities
} from '../selectors/metadataselectors';
import {getIsSummaryReady} from '../selectors/uiselectors';
import {WaitOnReady} from '../components/Utils';

export const LocationFilterContainer = connect(
  state => ({
    isReady: getIsSummaryReady(state),
    filterRegionKey: state.summaryFilter.get('regionKey', null),
    filterFacilityKey: state.summaryFilter.get('facilityKey', null),
    filteredMetaFacilities: getFilteredMetaFacilities(state),
    metaRegionsByKey: state.metaRegionsByKey,
    metaFacilitiesByKey: state.metaRegionsByKey,
    metaRegions: getMetaRegions(state),
  }),
  {changeSummaryFilter},
)(WaitOnReady(LocationFilters));

export default LocationFilterContainer;
