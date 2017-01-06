import React, {PropTypes} from 'react';

const callMountFunc = (funcName, props) => {
  const func = props[funcName];
  if (func) {
    return func();
  } else if (process.env.NODE_ENV !== 'production') {
    // console.error(`Component missing ${funcName} prop`);
  }
  console.error(`Component missing ${funcName} prop`); // TODO(sean): remove
};

/*
 * Calls the prop function specified by the onMountFunc prop.
 */
export const CallOnMount = Component => {
  const Wrapped = React.createClass({
    displayName: `CallOnMount(${Component.displayName || 'Stateless'})`,

    propTypes: {
      onMountFunc: PropTypes.string.isRequired,
    },

    componentDidMount() {
      const {onMountFunc} = this.props;
      if (onMountFunc) {
        return callMountFunc(onMountFunc, this.props);
      }
    },

    render() {
      return <Component {...this.props} />;
    }
  });

  return Wrapped;
};

export default CallOnMount;
