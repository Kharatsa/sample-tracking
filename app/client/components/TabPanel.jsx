import React, {PropTypes} from 'react';

export const TabPanel = ({header}) => {
  return <div className='hero-data-header2 hero-data'>{header}</div>;
};

TabPanel.propTypes = {
  header: PropTypes.node.isRequired,
};

export default TabPanel;

