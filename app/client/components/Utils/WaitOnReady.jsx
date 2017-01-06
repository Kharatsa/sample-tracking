import React, {PropTypes} from 'react';
import LoadingIndicator from '../LoadingIndicator.jsx';

const wrapName = (Component, name) => {
  if (name !== null) {
    return `WaitOnReady(${name})`;
  }
  return `WaitOnReady(${Component.displayName})`;
};

/**
 * Renders a loading indicator in place of Component until loading completes
 */
export const WaitOnReady = (Component, name=null) => {

  const Wrapped = React.createClass({
    displayName: wrapName(Component, name),

    propTypes: {
      isReady: PropTypes.bool.isRequired,
    },

    render() {
      const {isReady = false} = this.props;
      if (isReady) {
        return <Component {...this.props} />;
      }
      return <LoadingIndicator />;
    }
  });

  return Wrapped;
};

export default WaitOnReady;
