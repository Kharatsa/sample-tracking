import {connect} from 'react-redux';
import {fetchTurnArounds} from '../actions/actioncreators';
import {getIsTATReady} from '../selectors/uiselectors';
import {getStagesTATs, getEndToEndTAT} from '../selectors/dashboardselectors';
import TurnArounds from '../components/Dashboard/TurnArounds';
import {WaitOnReady, CallOnMount} from '../components/Utils';

export const TurnAroundsContainer = connect(
  state => ({
    isReady: getIsTATReady(state),
    onMountFunc: 'fetchTurnArounds',
    summaryFilter: state.summaryFilter,
    metaStages: state.metaStagesByKey,
    metaStatuses: state.metaStatusesByKey,
    turnArounds: state.summaryTurnArounds,
    stagesTATs: getStagesTATs(state),
    endToEndTAT: getEndToEndTAT(state)
  }),
  {fetchTurnArounds},
)(CallOnMount(WaitOnReady(TurnArounds)));

export default TurnAroundsContainer;
