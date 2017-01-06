import * as actions from '../actions/actions.js';

export const isChangesAvailable = (state=false, action) => {
  switch (action.type) {
  case actions.RECEIVE_CHANGES:
    return true;
  default:
    return state;
  }
};

export const isSampleDetailAvailble = (state=false, action) => {
  switch (action.type) {
  case actions.RECEIVE_SAMPLE_DETAIL:
    return true;
  default:
    return state;
  }
};

export const isSummaryAvailable = (state=false, action) => {
  switch (action.type) {
  case actions.RECEIVE_SUMMARY:
    return true;
  default:
    return state;
  }
};

export const isTATAvailable = (state=false, action) => {
  switch (action.type) {
  case actions.RECEIVE_TURN_AROUNDS:
    return true;
  default:
    return state;
  }
};

export const isMetadataAvailable = (state=false, action) => {
  switch (action.type) {
  case actions.RECEIVE_METADATA:
    return true;
  default:
    return state;
  }
};
