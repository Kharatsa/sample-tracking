import React, {PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {Map as ImmutableMap, List} from 'immutable';
import {SummaryFilter} from '../../api/records.js';
import StageSampleIdCounts from './StageSampleIdCounts';
import StageArtifactCounts from './StageArtifactCounts';
import StageLabCounts from './StageLabCounts';

export const StageCounts = React.createClass({
  propTypes: {
    artifactStageCounts: PropTypes.instanceOf(List).isRequired,
    fetchSummary: PropTypes.func.isRequired,
    labTestCounts: PropTypes.instanceOf(List).isRequired,
    metaArtifacts: PropTypes.instanceOf(ImmutableMap),
    metaStages: PropTypes.instanceOf(ImmutableMap),
    metaStatuses: PropTypes.instanceOf(ImmutableMap),
    metaLabTests: PropTypes.instanceOf(ImmutableMap),
    summaryFilter: PropTypes.instanceOf(SummaryFilter).isRequired,
    sampleIdsStageCounts: PropTypes.instanceOf(List).isRequired,
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
    const {fetchSummary} = this.props;
    fetchSummary(filter);
  },

  render() {
    const {
      metaStages, sampleIdsStageCounts,
      metaArtifacts, artifactStageCounts,
      metaStatuses, metaLabTests, labTestCounts
    } = this.props;

    return (
      <div className='pure-g'>
        <div className='pure-u-1 pure-u-lg-1-2'>
          <StageArtifactCounts
            metaStages={metaStages}
            metaArtifacts={metaArtifacts}
            artifactStageCounts={artifactStageCounts}
          />
        </div>
        <div className='pure-u-1 pure-u-lg-1-2'>
          <StageSampleIdCounts
            metaStages={metaStages}
            sampleIdsStageCounts={sampleIdsStageCounts}
          />
        </div>
        <div className='pure-u-1'>
          <StageLabCounts
            metaStatuses={metaStatuses}
            metaLabTests={metaLabTests}
            labTestCounts={labTestCounts}
          />
        </div>
      </div>
    );
  }
});

export default StageCounts;
