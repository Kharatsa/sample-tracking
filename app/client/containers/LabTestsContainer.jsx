import {connect} from 'react-redux';
import {fetchSummary} from '../actions/actioncreators';
import {getIsSummaryReady} from '../selectors/uiselectors';
import {
  getArtifactStageCounts,
  getLabTestStatusCounts
} from '../selectors/dashboardselectors';
import {LabTestCounts} from '../components';
import {WaitOnReady, CallOnMount} from '../components/Utils';

export const LabTestsContainer = connect(
  state => ({
    isReady: getIsSummaryReady(state),
    onMountFunc: 'fetchSummary',
    summaryFilter: state.summaryFilter,
    metaStages: state.metaStagesByKey,
    metaArtifacts: state.metaArtifactsByKey,
    artifactStageCounts: getArtifactStageCounts(state),
    metaStatuses: state.metaStatusesByKey,
    metaLabTests: state.metaLabTestsByKey,
    labTestCounts: getLabTestStatusCounts(state)
  }),
  {fetchSummary},
)(CallOnMount(WaitOnReady(LabTestCounts)));

export default LabTestsContainer;
