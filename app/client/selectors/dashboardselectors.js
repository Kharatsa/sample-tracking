import {fromJS, List, Map as ImmutableMap} from 'immutable';
import {TurnAround} from '../api/records';
import {createSelector} from 'reselect';
import {
  SCAN_STAGES,
  SCAN_STAGES_ORDER,
  REQUEST_SCAN_ARTIFACTS,
  RESULT_SCAN_ARTIFACTS,
  SCAN_STATUSES,
  LAB_STATUSES_ORDER,
  isRequestScanStage,
  isResultScanStage
} from '../../common/sttworkflow';

const getSampleIdCounts = (state) => state.summarySampleIds;

// Returns Array of Objects
// Elements of array each represent a stage
export const getSampleIdsStageCounts = createSelector(
  [getSampleIdCounts],
  (counts) => fromJS(
    SCAN_STAGES_ORDER.map(stage => {
      const count = counts.get(stage) || 0;
      return ({stage, count});
    }))
);

const requestArtifacts = (
  Object.keys(REQUEST_SCAN_ARTIFACTS)
  .map(key => REQUEST_SCAN_ARTIFACTS[key]));

const resultArtifacts = (
  Object.keys(RESULT_SCAN_ARTIFACTS)
  .map(key => RESULT_SCAN_ARTIFACTS[key]));

const getOneStageArtifactCounts = (stageArtifacts, counts) => {
  return stageArtifacts.map(artifact => {
    const artifactCount = counts.get(artifact);
    let result = {artifact, goodCount: null, badCount: null};

    if (artifactCount) {
      result.goodCount = artifactCount.get(SCAN_STATUSES.GOOD);
      result.badCount = artifactCount.get(SCAN_STATUSES.BAD);
    }

    return result;
  });
};

const getArtifactCounts = (state) => state.summaryArtifacts;

/**
 * Array of Arrays
 * Outer Array workflow stages
 * Inner Arrays Artifacts at each stage
 */
export const getArtifactStageCounts = createSelector(
  [getArtifactCounts],
  (counts) => {
    if (counts.size === 0) {
      return List();
    }

    return fromJS(SCAN_STAGES_ORDER.map(stage => {
      const stageCounts = counts.get(stage);

      if (typeof stageCounts === 'undefined') {
        return [];
      }

      let artifacts;
      if (isRequestScanStage(stage)) {
        artifacts = getOneStageArtifactCounts(requestArtifacts, stageCounts);
      } else if (isResultScanStage(stage)) {
        artifacts = getOneStageArtifactCounts(resultArtifacts, stageCounts);
      } else {
        throw new Error(`Unrecognized stage name "${stage}"`);
      }
      return {stage, artifacts};
    }));
  }
);

const getOneLabTestStatusCounts = (test, counts) => {
  return List(LAB_STATUSES_ORDER.map(status =>
    ImmutableMap({status, count: counts && status ? counts.get(status) : 0})));
};

const getLabTestCounts = (state) => state.summaryLabTests;
const getMetaLabTestKeys = (state) => state.metaLabTestsKeys;

// List of Maps
export const getLabTestStatusCounts = createSelector(
  [getMetaLabTestKeys, getLabTestCounts],
  (testKeys, counts) => {
    if (counts.size === 0) {
      return List();
    }
    const labStatusCounts = counts.first();

    return List(testKeys.map(test => ImmutableMap({
      test,
      statuses: getOneLabTestStatusCounts(test, labStatusCounts.get(test))
    })));
  }
);

const getMetaStages = (state) => state.metaStagesByKey;
const getStageDatesRaw = (state) => state.summaryStageCountsDates;
const getStageDatesCounts = (state) => state.summaryStageCountsByDate;

export const getStageCountsChartData = createSelector(
  [getStageDatesRaw, getStageDatesCounts, getMetaStages],
  (dates, counts, metaStages) => {
    if (dates.size === 0 || metaStages === null || metaStages.size === 0) {
      return [];
    }

    return SCAN_STAGES_ORDER.map(stage => ({
      name: metaStages.get(stage).get('value'),
      data: dates.map(date => counts.get(date).get(stage)).toArray()
    }));
  }
);

const getTAT = (state) => state.summaryTurnArounds;

const isEndToEndTAT = (tatFrom, tatTo) => (
  tatFrom && tatFrom.stage === SCAN_STAGES.SAMPLE_PICKUP &&
  tatTo && tatTo.stage === SCAN_STAGES.RESULT_DELIVERY);

export const getStagesTATs = createSelector(
  [getTAT],
  (tats) =>
    tats.filter(tat => !isEndToEndTAT(tat.get('from'), tat.get('to')))
);

export const getEndToEndTAT = createSelector(
  [getTAT],
  (tats) => (
    tats
    .filter(tat => isEndToEndTAT(tat.get('from'), tat.get('to')))
    .first() ||
    null)
);
