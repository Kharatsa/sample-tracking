import {connect} from 'react-redux';
import {fetchChanges} from '../actions/actioncreators';
import {getIsChangesReady} from '../selectors/uiselectors';
import {getChangesDetail} from '../selectors/changes_selectors';
import Changes from '../components/Changes';
import {WaitOnReady, CallOnMount} from '../components/Utils';

export const ChangesContainer = connect(
  state => ({
    isReady: getIsChangesReady(state),
    onMountFunc: 'fetchChanges',
    changes: getChangesDetail(state),
    metaStages: state.metaStagesByKey,
    metaStatuses: state.metaStatusesByKey,
    metaArtifacts: state.metaArtifactsByKey,
    metaLabTests: state.metaLabTestsByKey,
    metaFacilities: state.metaFacilitiesByKey,
    metaPeople: state.metaPeopleByKey,
    summaryFilter: state.summaryFilter,
  }),
  {fetchChanges},
)(CallOnMount(WaitOnReady(Changes)));

export default ChangesContainer;
