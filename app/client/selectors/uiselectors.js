import {createSelector} from 'reselect';

const getIsMetadataAvailable = state => state.isMetadataAvailable;
const getIsChangesAvailable = state => state.isChangesAvailable;
const getIsSummaryAvailable = state => state.isSummaryAvailable;
const getIsTATAvailable = state => state.isTATAvailable;

const allTrue = (...args) => args.every((arg) => !!arg);

export const getIsChangesReady = createSelector(
  [getIsMetadataAvailable, getIsChangesAvailable],
  allTrue,
);

export const getIsTATReady = createSelector(
  [getIsMetadataAvailable, getIsTATAvailable],
  allTrue,
);

export const getIsSummaryReady = createSelector(
  [getIsMetadataAvailable, getIsSummaryAvailable],
  allTrue,
);
