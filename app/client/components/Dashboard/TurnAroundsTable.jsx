import React, {PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {Map as ImmutableMap, List, Record} from 'immutable';
import Moment from 'moment';
import DashboardPanel from '../DashboardPanel';
import PushButtons from '../PushButtons';
import MetaText from '../MetaText';

// Subset of available moment duration units relevant for TAT display
// http://momentjs.com/docs/#/durations/creating/
const TimeUnits = [
  {value: 'days', label: 'Days'},
  {value: 'hours', label: 'Hours'}
];

const descTATElem = (metaStatuses, metaStages, step) => {
  // console.log("step.stage" + step.stage);
  const stageKey = step.stage;
  const statusKey = step.status;

  const stageDesc = (
    typeof stageKey !== 'undefined' ?
    <MetaText metadata={metaStages} metaKey={stageKey} /> :
    null
  );

  const statusDesc = (
    typeof statusKey !== 'undefined' ?
    <MetaText metadata={metaStatuses} metaKey={statusKey} /> :
    null
  );

  return <span>{statusDesc || stageDesc}</span>;
};

const makeTATRow = (
  tat, index, metaStatuses, metaStages, timeUnit, totalTAT
) => {
  // console.log("metaStages " + metaStages);
  const fromDescElem = descTATElem(metaStatuses, metaStages, tat.get('from'));
  const toDescElem = descTATElem(metaStatuses, metaStages, tat.get('to'));
  const msTAT = tat.get('averageTATms');
  const durationVal = Moment.duration(msTAT).as(timeUnit.value);
  // const durationDesc = durationVal.toFixed(1);
  const durationDesc = Math.round(durationVal);
  const pctTotal = totalTAT > 0 ? (msTAT / totalTAT * 100).toFixed(1) : null;
  const pctTotalDesc = pctTotal ? `${pctTotal}%` : 'N/A';

  return (
    <tr key={index}>
      <td>{fromDescElem}</td>
      <td>{toDescElem}</td>
      <td>{durationDesc}</td>
      <td>{pctTotalDesc}</td>
    </tr>
  );
};

export const TurnAroundsTable = React.createClass({
  propTypes: {
    metaStages: PropTypes.instanceOf(ImmutableMap).isRequired,
    metaStatuses: PropTypes.instanceOf(ImmutableMap).isRequired,
    stagesTATs: PropTypes.instanceOf(List).isRequired,
    endToEndTAT: PropTypes.instanceOf(Record).isRequired,
    timeUnit: PropTypes.string
  },

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  getInitialState() {
    return {timeUnit: TimeUnits[0]};
  },

  _changeTimeUnit(index) {
    if (index < TimeUnits.length) {
      this.setState({timeUnit: TimeUnits[index]});
    }
  },

  render() {
    const {metaStages, metaStatuses, stagesTATs, endToEndTAT} = this.props;
    const {timeUnit} = this.state;

    const totalTAT = endToEndTAT.get('averageTATms');
    const turnaroundTimes = stagesTATs.map((tat, index) =>
      makeTATRow(tat, index, metaStatuses, metaStages, timeUnit, totalTAT));

    const endToEndTurnaroundTime = (
      makeTATRow(endToEndTAT, 0, metaStatuses, metaStages, timeUnit, totalTAT));

    return (
      <DashboardPanel
        heading='Turn Around Times'
        subheading='average times between stages'
      >
        <table className='widget-table' id='tat-table'>
          <thead>
            <tr>
              <th className='col-from'>From Stage</th>
              <th className='col-to'>To Stage</th>
              <th className='col-tat'>{`TAT (${timeUnit.value})`}</th>
              <th className='col-total'>% Total TAT</th>
            </tr>
          </thead>
          <tbody>
            {turnaroundTimes}
          </tbody>
        </table>
        <table className='widget-table' id='e2e-tat-table'>
          <thead>
            <tr>
              <th className='col-from'>From Stage</th>
              <th className='col-to'>To Stage</th>
              <th className='col-tat'>{`TAT (${timeUnit.value})`}</th>
              <th className='col-total'>% Total TAT</th>
            </tr>
          </thead>
          <tbody>
            {endToEndTurnaroundTime}
          </tbody>
        </table>
        <PushButtons
          className='widget-buttons'
          handleClick={this._changeTimeUnit}
          labels={TimeUnits.map(unit => unit.label)}/>
      </DashboardPanel>
    );
  }
});

export default TurnAroundsTable;
