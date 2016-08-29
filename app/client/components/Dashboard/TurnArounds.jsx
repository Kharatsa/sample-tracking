import React, {PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {Map as ImmutableMap, List, Record} from 'immutable';
import WaitOnFetch from '../WaitOnFetch.jsx';
import TurnAroundsTable from './TurnAroundsTable';
import TurnAroundsChart from './TurnAroundsChart';

const TurnAroundsTableWrapped = WaitOnFetch(TurnAroundsTable);
const TurnAroundsChartWrapped = WaitOnFetch(TurnAroundsChart);

export const TurnArounds = React.createClass({
  propTypes: {
    endToEndTAT: PropTypes.instanceOf(Record).isRequired,
    fetchTurnArounds: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    metaStages: PropTypes.instanceOf(ImmutableMap),
    metaStatuses: PropTypes.instanceOf(ImmutableMap),
    summaryFilter: PropTypes.object,
    stagesTATs: PropTypes.instanceOf(List).isRequired,
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
    const {fetchTurnArounds} = this.props;
    fetchTurnArounds(filter);
  },

  render() {
    const {
      isLoading, metaStages, metaStatuses, stagesTATs, endToEndTAT
    } = this.props;

    return (
      <div className='pure-g'>
        <div className='pure-u-1 pure-u-lg-1-2'>
          <TurnAroundsChartWrapped
            isLoading={isLoading}
            metaStages={metaStages}
            metaStatuses={metaStatuses}
            stagesTATs={stagesTATs}
          />
        </div>
        <div className='pure-u-1 pure-u-lg-1-2'>
          <TurnAroundsTableWrapped
            isLoading={isLoading}
            metaStages={metaStages}
            metaStatuses={metaStatuses}
            stagesTATs={stagesTATs}
            endToEndTAT={endToEndTAT}
          />
        </div>
      </div>);
  }
});

export default TurnArounds;
