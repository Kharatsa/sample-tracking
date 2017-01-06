import {connect} from 'react-redux';
import {fetchSummary} from '../actions/actioncreators';
import {getIsSummaryReady} from '../selectors/uiselectors';
import {
  getSampleIdsStageCounts, getArtifactStageCounts, getLabTestStatusCounts
} from '../selectors/dashboardselectors';
import {StageCounts3} from '../components';
import {WaitOnReady, CallOnMount} from '../components/Utils';

export const StageCountsContainer3 = connect(
  state => ({
    isReady: getIsSummaryReady(state),
    onMountFunc: 'fetchSummary',
    summaryFilter: state.summaryFilter,
    sampleIdsStageCounts: getSampleIdsStageCounts(state),
    artifactStageCounts: getArtifactStageCounts(state),
    labTestCounts: getLabTestStatusCounts(state),
    metaStages: state.metaStagesByKey,
    metaArtifacts: state.metaArtifactsByKey,
    metaStatuses: state.metaStatusesByKey,
    metaLabTests: state.metaLabTestsByKey,
  }),
  {fetchSummary},
)(CallOnMount(WaitOnReady(StageCounts3)));

export default StageCountsContainer3;
