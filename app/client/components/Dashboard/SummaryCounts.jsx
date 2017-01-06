import React, {PropTypes} from 'react';
import Iconic from '../Iconic';
import HeroDataPanel from '../HeroDataPanel';

const displayValue = (val) => {
  if (val === null) {
    return '-';
  }
  return val.toLocaleString ? val.toLocaleString() : val;
};

export const SummaryCounts = ({
  numSampleIds=null, numArtifacts=null, numLabTests=null
}) => {
  return (
    <div className='pure-g dashboard-top-bar'>
      <div className='pure-u-1 pure-u-md-1-3'>
        <HeroDataPanel header='Total Sample IDs'>
          <span>
            {displayValue(numSampleIds)}
            <Iconic className='hero-data-icon stt-icon' name='clipboard'/>
          </span>

        </HeroDataPanel>
      </div>
      <div className='pure-u-1 pure-u-md-1-3'>
        <HeroDataPanel header='Total Samples & Forms'>
          <span>
            {displayValue(numArtifacts)}
            <Iconic className='hero-data-icon stt-icon' name='droplet'/>
          </span>
        </HeroDataPanel>
      </div>

      <div className='pure-u-1 pure-u-md-1-3'>
        <HeroDataPanel header='Total Lab Tests'>
          <span>
            {displayValue(numLabTests)}
            <Iconic className='hero-data-icon stt-icon' name='medical-cross'/>
          </span>
        </HeroDataPanel>
      </div>
    </div>
  );
};

SummaryCounts.propTypes = {
  numSampleIds: PropTypes.number,
  numArtifacts: PropTypes.number,
  numLabTests: PropTypes.number,
};

export default SummaryCounts;
