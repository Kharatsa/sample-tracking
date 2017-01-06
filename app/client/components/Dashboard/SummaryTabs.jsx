import React from 'react';
import TabPanel from '../TabPanel';
import Link from 'react-router/lib/Link';

export const SummaryTabs = () => {
  return (
    <div className='dashboard-top-bar'>
      <div className='pure-u-1 pure-u-md-1-2'>
        <Link to='/tat'>
          <TabPanel header='Turn Around Times' />
        </Link>
      </div>
      <div className='pure-u-1 pure-u-md-1-2'>
        <Link to='/tests'>
          <TabPanel header='Lab Tests' />
        </Link>
      </div>
    </div>
  );
};

export default SummaryTabs;
