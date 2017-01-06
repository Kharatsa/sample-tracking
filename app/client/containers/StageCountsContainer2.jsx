import {connect} from 'react-redux';
import {fetchSummary} from '../actions/actioncreators';
import {getIsSummaryReady} from '../selectors/uiselectors';
import {
  getSampleIdsStageCounts, getArtifactStageCounts, getLabTestStatusCounts
} from '../selectors/dashboardselectors';
import {StageCounts2} from '../components';
import {WaitOnReady, CallOnMount} from '../components/Utils';

export const StageCountsContainer2 = connect(
  state => ({
    isReady: getIsSummaryReady(state),
    onMountFunc: 'fetchSummary',
    summaryFilter: state.summaryFilter,
    metaStages: state.metaStagesByKey,
    sampleIdsStageCounts: getSampleIdsStageCounts(state),
    metaArtifacts: state.metaArtifactsByKey,
    artifactStageCounts: getArtifactStageCounts(state),
    metaStatuses: state.metaStatusesByKey,
    metaLabTests: state.metaLabTestsByKey,
    labTestCounts: getLabTestStatusCounts(state)
  }),
  {fetchSummary},
)(CallOnMount(WaitOnReady(StageCounts2)));

export default StageCountsContainer2;
