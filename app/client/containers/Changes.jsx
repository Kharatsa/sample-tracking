'use strict';

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchChanges} from '../actions/actioncreators.js';
import LatestChanges from '../components/LatestChanges.jsx';

const Changes = React.createClass({
  shouldComponentUpdate(nextProps) {
    if (nextProps.isFetchingData) {
      return false;
    }

    // Uses strict equality for speed
    return (!(
      this.props.isFetchingData === nextProps.isFetchingData &&
      this.props.changesById === nextProps.changesById &&
      this.props.samplesById === nextProps.samplesById &&
      this.props.artifactsById === nextProps.artifactsById &&
      this.props.labTestsById === nextProps.labTestsById &&
      this.props.metadata === nextProps.metadata
    ));
  },

  componentWillMount() {
    const {fetchChanges} = this.props.actions;
    fetchChanges();
  },

  render() {
    return <LatestChanges {...this.props} />;
  }
});

export default connect(
  state => ({
    changeIds: state.changeIds,
    changesById: state.changesById,
    changesTotal: state.changesTotal,
    samplesById: state.samplesById,
    artifactsById: state.artifactsById,
    labTestsById: state.labTestsById,
    isFetchingData: state.isFetchingData,
    metadata: state.metadata,
    page: state.page
  }),
  dispatch => ({
    actions: bindActionCreators({fetchChanges}, dispatch)
  })
)(Changes);
