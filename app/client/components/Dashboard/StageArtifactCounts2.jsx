import React, {PropTypes} from 'react';
import {Map as ImmutableMap, List} from 'immutable';
import DashboardPanel from '../DashboardPanel';
import Iconic from '../Iconic';
import MetaText from '../MetaText';

const stageArtifactElements = (metaArtifacts, item, index) => {
  const artifactKey = item.get('artifact');
  const goodCount = item.get('goodCount');
  const badCount = item.get('badCount');
  const exceptionIcon = (
    badCount > 0 ?
    <Iconic
      className='widget-table-icon stt-icon'
      color='orange'
      name='warning'/> :
    null
  );

  return (
    <tr key={index}>
      <td>
        <MetaText metadata={metaArtifacts} metaKey={artifactKey} />
      </td>
      <td>{goodCount + badCount}</td>
      <td>{badCount}{exceptionIcon}</td>
    </tr>
  );
};

const stageElements = (metaStages, metaArtifacts, item, index) => {
  const counts = item.get('artifacts').map((artifact, i) =>
    stageArtifactElements(metaArtifacts, artifact, i));

  const stageKey = item.get('stage');

  if (stageKey === "SDEPART") {
    return (
      <table className='widget-table' key={index}>
        <thead>
          <tr>
            <th className='col-1-of-3'>
              <MetaText metadata={metaStages} metaKey={stageKey} /> Scan Type
            </th>
            <th className='col-2-of-3'>Scans</th>
            <th className='col-3-of-3'>Exceptions</th>
          </tr>
        </thead>
        <tbody>
          {counts}
        </tbody>
      </table>
    ); 
  } 
};

export const StageArtifactCounts2 = ({
  metaStages, metaArtifacts, artifactStageCounts
}) => {
  const artifactCounts = artifactStageCounts.map((stage, i) =>
    stageElements(metaStages, metaArtifacts, stage, i));

  return (
    <DashboardPanel
      heading='Samples & Forms'
      subheading='individual sample and form scans'
    >
      {artifactCounts}
    </DashboardPanel>
  );
};

StageArtifactCounts2.propTypes = {
  metaStages: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaArtifacts: PropTypes.instanceOf(ImmutableMap).isRequired,
  artifactStageCounts: PropTypes.instanceOf(List).isRequired
};

export default StageArtifactCounts2;
