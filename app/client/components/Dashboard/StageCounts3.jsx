import React, {PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {Map as ImmutableMap, List} from 'immutable';
import {SummaryFilter} from '../../api/records.js';
import StageSampleIdCounts from './StageSampleIdCounts';
import StageArtifactCounts4 from './StageArtifactCounts4';
import StageArtifactCounts5 from './StageArtifactCounts5';

export const StageCounts3 = React.createClass({
  propTypes: {
    fetchSummary: PropTypes.func.isRequired,
    summaryFilter: PropTypes.instanceOf(SummaryFilter).isRequired,
    sampleIdsStageCounts: PropTypes.instanceOf(List).isRequired,
    artifactStageCounts: PropTypes.instanceOf(List).isRequired,
    metaStages: PropTypes.instanceOf(ImmutableMap).isRequired,
    metaArtifacts: PropTypes.instanceOf(ImmutableMap).isRequired,
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
      sampleIdsStageCounts, artifactStageCounts, metaStages, metaArtifacts,
    } = this.props;

    return (
      <div className='pure-g'>
        <div className='pure-u-1 pure-u-md-1-2'>
          <StageArtifactCounts4
            metaStages={metaStages}
            metaArtifacts={metaArtifacts}
            artifactStageCounts={artifactStageCounts}
          />
        </div>
      <div className='pure-u-1 pure-u-md-1-2'>
          <StageArtifactCounts5
            metaStages={metaStages}
            metaArtifacts={metaArtifacts}
            artifactStageCounts={artifactStageCounts}
          />
        </div>
      <div className='pure-u-1 pure-u-lg-1-1'>
          <StageSampleIdCounts
            metaStages={metaStages}
            sampleIdsStageCounts={sampleIdsStageCounts}
          />
        </div>
      </div>
    );
  }
});

export default StageCounts3;
