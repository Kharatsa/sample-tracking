import {connect} from 'react-redux';
import {getIsLoading} from '../selectors/uiselectors';
import {getArtifactStageCounts} from '../selectors/dashboardselectors';
import StageArtifactCounts from '../components/Dashboard/StageArtifacts/StageArtifactCounts';

export const StageArtifactCountsContainer = connect(
  state => ({
    isLoading: getIsLoading(state),
    metaStages: state.metaStageByKey,
    metaArtifacts: state.metaArtifactsByKey,
    artifactStageCounts: getArtifactStageCounts(state),
  }))(StageArtifactCounts);

export default StageArtifactCountsContainer;
