import * as action from './actions.js';
import * as api from '../api';
import {SummaryFilter} from '../api/records.js';

const requestMetadata = () => ({type: action.FETCH_METADATA});

const fetchMetadataFailure = err =>
  ({type: action.FETCH_METADATA_FAILURE, error: err});

const receiveMetadata = metadata => ({type: action.RECEIVE_METADATA, metadata});

export const fetchMetadata = () => {
  return (dispatch, getState) => {
    const {isFetchingMetadata} = getState();
    if (isFetchingMetadata) {
      return; // short circuit to avoid redundant requests
    }

    dispatch(requestMetadata());
    return api.getMetadata((err, data) => {
      if (err) {
        dispatch(fetchMetadataFailure(err));
        return;
      }
      dispatch(receiveMetadata(data));
    });
  };
};

const requestSample = sampleId =>
  ({type: action.FETCH_SAMPLE_DETAIL, detailSampleId: sampleId});

const fetchSampleDetailFailure = error =>
  ({type: action.FETCH_SAMPLE_DETAIL_FAILURE, error});

export const fetchSampleDetail = sampleId => {
  return dispatch => {
    dispatch(requestSample(sampleId));
    return api.getSampleDetail(sampleId, (err, data) => {
      if (err) {
        dispatch(fetchSampleDetailFailure(err));
        return;
      }
      dispatch(receiveSampleDetail(data));
    });
  };
};

const getFilterValues = filter => {
  if (filter) {
    return {
      afterDate: filter.get('afterDate', null),
      beforeDate: filter.get('beforeDate', null),
      regionKey: filter.get('regionKey', null),
      facilityKey: filter.get('facilityKey', null)
    };
  }

  return {
    afterDate: null, beforeDate: null, regionKey: null, facilityKey: null,
  };
};

const receiveSampleDetail = (data) => ({
  type: action.RECEIVE_SAMPLE_DETAIL,
  ...data
});

const requestChanges = (summaryFilter, page) =>
  ({type: action.FETCH_CHANGES, summaryFilter, page});

const fetchChangesFailure = (error, page) =>
  ({type: action.FETCH_CHANGES_FAILURE, error, prevPageNumber: page});

export const fetchChanges = (summaryFilter, page) => {
  return dispatch => {
    dispatch(requestChanges(summaryFilter, page));
    return api.getChanges(getFilterValues(summaryFilter), page, (err, data) => {
      if (err) {
        dispatch(fetchChangesFailure(err, page));
        return;
      }
      dispatch(receiveChanges(data));
    });
  };
};

const receiveChanges = ({
  changes, changeIds, artifacts, labTests, samples, count
}) => ({
  type: action.RECEIVE_CHANGES,
  changes, artifacts, labTests, samples, count, changeIds
});

const requestSummary = (summaryFilter) =>
  ({type: action.FETCH_SUMMARY, summaryFilter});

const fetchSummaryFailure = (error) =>
  ({type: action.FETCH_SUMMARY_FAILURE, error});

const receiveSummary = ({sampleIds, artifacts, labTests, totals}) =>
  ({type: action.RECEIVE_SUMMARY, sampleIds, artifacts, labTests, totals});

export const fetchSummary = (summaryFilter) => {
  return dispatch => {
    dispatch(requestSummary(summaryFilter));

    return api.getSummary(getFilterValues(summaryFilter), (err, data) => {
      if (err) {
        dispatch(fetchSummaryFailure(err));
        return;
      }
      dispatch(receiveSummary(data));
    });
  };
};

const requestTurnArounds = (summaryFilter) =>
  ({type: action.FETCH_TURN_AROUNDS, summaryFilter});

const fetchTurnAroundsFailure = (error) =>
  ({type: action.FETCH_TURN_AROUNDS_FAILURE, error});

const receiveTurnArounds = (turnArounds) =>
  ({type: action.RECEIVE_TURN_AROUNDS, turnArounds});

export const fetchTurnArounds = (summaryFilter) => {
  return dispatch => {
    dispatch(requestTurnArounds(summaryFilter));
    return api.getTurnArounds(getFilterValues(summaryFilter), (err, data) => {
      if (err) {
        dispatch(fetchTurnAroundsFailure(err));
        return;
      }
      dispatch(receiveTurnArounds(data));
    });
  };
};

export const changeSummaryFilter = ({
  afterDate, beforeDate, regionKey, facilityKey
}) => ({
  type: action.CHANGE_SUMMARY_FILTER,
  summaryFilter: new SummaryFilter({
    afterDate, beforeDate, regionKey, facilityKey
  })
});

const requestDateSummary = (summaryFilter) =>
  ({type: action.FETCH_DATE_SUMMARY, summaryFilter});

const fetchDateSummaryFailure = (error) =>
  ({type: action.FETCH_DATE_SUMMARY_FAILURE, error});

const receiveDateSummary = data =>
  ({type: action.RECEIVE_DATE_SUMMARY, ...data});

export const fetchDateSummary = (summaryFilter) => {
  return dispatch => {
    dispatch(requestDateSummary(summaryFilter));
    return api.getStageDates(getFilterValues(summaryFilter), (err, data) => {
      if (err) {
        dispatch(fetchDateSummaryFailure(err));
        return;
      }
      dispatch(receiveDateSummary(data));
    });
  };
};

const requestUsers = () => ({type: action.FETCH_USERS});

const fetchUsersFailure = (error) => ({type: action.FETCH_USERS_FAILURE, error});

const receiveUsers = (data) => ({type: action.RECEIVE_USERS, ...data});

export const fetchUsers = () => {
  return dispatch => {
    dispatch(requestUsers());
    return api.getUsers((err, data) => {
      if (err) {
        dispatch(fetchUsersFailure(err));
        return;
      }
      dispatch(receiveUsers(data));
    });
  };
};
