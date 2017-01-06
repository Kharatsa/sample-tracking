import React, {PropTypes} from 'react';
import {Provider} from 'react-redux';
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';
import routes from '../routes';
import DevTools from '../components/DevTools';

export const Root = ({store}) => {
  let devTools;
  if (process.env.NODE_ENV === 'production') {
    devTools = null;
  } else {
    devTools = <DevTools />;
  }

  return (
    <Provider store={store}>
      <div>
        <Router history={browserHistory} routes={routes} />
        {devTools}
      </div>
    </Provider>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
