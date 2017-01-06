import React, {PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import Select from 'react-select';

export const LocationFilters = React.createClass({
  propTypes: {
    isReady: PropTypes.bool.isRequired,
    metaRegions: PropTypes.object.isRequired,
    filteredMetaFacilities: PropTypes.object.isRequired,
    filterRegionKey: PropTypes.string,
    filterFacilityKey: PropTypes.string,
    changeSummaryFilter: PropTypes.func.isRequired,
  },

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  _selectLocationFilter(selected, type) {
    const {filterRegionKey, filterFacilityKey} = this.props;
    const {changeSummaryFilter} = this.props;

    if (!selected) {
      if (type === 'region') {
        changeSummaryFilter({regionKey: null, facilityKey: null});
      } else {
        changeSummaryFilter({regionKey: filterRegionKey, facilityKey: null});
      }
    } else {

      const {value: selectedKey} = selected;
      if (type === 'facility' && selectedKey !== filterFacilityKey) {
        changeSummaryFilter(
          {regionKey: filterRegionKey, facilityKey: selectedKey});
      } else if (type === 'region') {
        changeSummaryFilter(
          {regionKey: selectedKey, facilityKey: filterFacilityKey});
      }
    }
  },

  selectFacility(selectedKey) {
    this._selectLocationFilter(selectedKey, 'facility');
  },

  selectRegion(selectedKey) {
    this._selectLocationFilter(selectedKey, 'region');
  },

  render() {
    const {
      isReady, metaRegions, filteredMetaFacilities, filterRegionKey,
      filterFacilityKey
    } = this.props;

    const regionKey = filterRegionKey;
    const facilityKey = filterFacilityKey;

    const regionOptions = metaRegions.map(region =>
      ({value: region.get('key'), label: region.get('value')}
    )).toJS();

    const facilityOptions = filteredMetaFacilities.map(facility =>
      ({value: facility.get('key'), label: facility.get('value')}
    )).toJS();

    return (
      <div>
        <label htmlFor='regionFilter'>Laboratory</label>
        <Select
            id='regionFilter'
            isLoading={!isReady}
            matchPos='any'
            matchProp='label'
            placeholder='Select Laboratory...'
            value={regionKey}
            options={regionOptions}
            onChange={this.selectRegion}
        />
        <label htmlFor='facilityFilter'>Facility</label>
        <Select
            id='facilityFilter'
            disabled={regionKey === null}
            isLoading={!isReady}
            matchPos='any'
            matchProp='label'
            placeholder='Select Facility...'
            value={facilityKey}
            options={facilityOptions}
            onChange={this.selectFacility}
        />
      </div>
    );
  }
});

export default LocationFilters;
