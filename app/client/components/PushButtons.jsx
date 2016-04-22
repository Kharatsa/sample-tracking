import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classnames from 'classnames';

export const PushButtons = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    labels: PropTypes.arrayOf(PropTypes.string),
    handleClick: PropTypes.func.isRequired,
    className: PropTypes.any
  },

  getInitialState() {
    return {selectedIndex: 0};
  },

  render() {
    const {labels, handleClick, className=''} = this.props;
    const {selectedIndex} = this.state;

    const buttons = labels.map((label, i) => {
      const buttonClass = classnames({
        'widget-buttons-pressed': i === selectedIndex,
        'pure-button': true
      });

      const buttonClick = () => {
        this.setState({selectedIndex: i});
        if (typeof handleClick !== 'undefined') {
          handleClick(i, label);
        }
      };

      return (
        <button className={buttonClass} onClick={buttonClick} key={i}>
          {label}
        </button>
      );
    });

    return <div className={className}>{buttons}</div>;
  }
});

export default PushButtons;
