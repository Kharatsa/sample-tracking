import React, {PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {List} from 'immutable';
import StageDatesChart from './StageDatesChart';

export const StageDatesCounts = React.createClass({
  propTypes: {
    fetchDateSummary: PropTypes.func.isRequired,
    summaryFilter: PropTypes.object,
    stageDates: PropTypes.instanceOf(List).isRequired,
    stageCountsChartData: PropTypes.arrayOf(PropTypes.shape({
      stage: PropTypes.string,
      data: PropTypes.arrayOf(PropTypes.number)
    })).isRequired,
  },

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  componentWillMount() {
    this._update(this.props.summaryFilter);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.summaryFilter !== this.props.summaryFilter) {
      this._update(nextProps.summaryFilter);
    }
  },

  _update(filter) {
    const {fetchDateSummary} = this.props;
    fetchDateSummary(filter);
  },

  render() {
    const {stageDates, stageCountsChartData} = this.props;

    return (
      <StageDatesChart
        stageDates={stageDates}
        stageCountsChartData={stageCountsChartData}
      />
    );
  }
});

export default StageDatesCounts;
