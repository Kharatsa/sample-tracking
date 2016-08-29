// https://github.com/acdlite/flux-standard-action
// http://rackt.org/redux/docs/basics/Actions.html

/*
 * action types
 */

export const FETCH_METADATA = 'FETCH_METADATA';
export const FETCH_METADATA_FAILURE = 'FETCH_METADATA_FAILURE';
export const RECEIVE_METADATA = 'RECEIVE_METADATA';

export const FETCH_CHANGES = 'FETCH_CHANGES';
export const FETCH_CHANGES_FAILURE = 'FETCH_CHANGES_FAILURE';
export const RECEIVE_CHANGES = 'RECEIVE_CHANGES';

export const FETCH_SAMPLE_DETAIL = 'FETCH_SAMPLE_DETAIL';
export const FETCH_SAMPLE_DETAIL_FAILURE = 'FETCH_SAMPLE_DETAIL_FAILURE';
export const RECEIVE_SAMPLE_DETAIL = 'RECEIVE_SAMPLE_DETAIL';

export const FETCH_SUMMARY = 'FETCH_SUMMARY';
export const FETCH_SUMMARY_FAILURE = 'FETCH_SUMMARY_FAILURE';
export const RECEIVE_SUMMARY = 'RECEIVE_SUMMARY';

export const FETCH_TURN_AROUNDS = 'FETCH_TURN_AROUNDS';
export const FETCH_TURN_AROUNDS_FAILURE = 'FETCH_TURN_AROUNDS_FAILURE';
export const RECEIVE_TURN_AROUNDS = 'RECEIVE_TURN_AROUNDS';

export const FETCH_DATE_SUMMARY = 'FETCH_DATE_SUMMARY';
export const FETCH_DATE_SUMMARY_FAILURE = 'FETCH_DATE_SUMMARY_FAILURE';
export const RECEIVE_DATE_SUMMARY = 'RECEIVE_DATE_SUMMARY';

export const FETCH_USERS = 'FETCH_USERS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';
export const RECEIVE_USERS = 'RECEIVE_USERS';
// TODO(sean): create/update users actions

export const CHANGE_SUMMARY_FILTER = 'CHANGE_SUMMARY_FILTER';
