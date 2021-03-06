/*!
 * React Swipe 2.3.1
 *
 * Felix Liu
 * Copyright 2016 - 2020, MIT License
 *
*/

'use strict';

// Module dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import SwipeJS from 'swipejs';

// Constants
const noop = function noop() {};

// Swipe Component
class Swipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      needsReSetup: false,
      prevChildrenLength: 0
    };
    this._isMount = false;
    this.instance = null;
  }

  // Check children length change and prepare for re-setup
  static getDerivedStateFromProps(props, state) {
    const childrenLength = (props.children || []).length;
    const prevChildrenLength = state.prevChildrenLength || 0;
    if (childrenLength !== prevChildrenLength) {
      return {
        prevChildrenLength: childrenLength,
        needsReSetup: true
      };
    }
    return null;
  }

  // Perform re-setup when necessary
  componentDidUpdate() {
    const { needsReSetup = false } = this.state || {};
    if (this._isMount && needsReSetup) {
      // delay resetup
      setTimeout(() => this.setupSwipe(), 10);
      this.setState({ needsReSetup: false });
    }
  }

  // Initialize swipe
  componentDidMount() {
    this._isMount = true;
    // delay resetup
    setTimeout(() => this.setupSwipe(), 10);
  }

  swipeOptions() {
    const {
      startSlide,
      speed,
      auto,
      draggable,
      continuous,
      autoRestart,
      disableScroll,
      stopPropagation,
      ignore,
      callback,
      transitionEnd,
      dragStart,
      dragEnd
    } = this.props;

    return {
      startSlide,
      speed,
      auto,
      draggable,
      continuous,
      autoRestart,
      disableScroll,
      stopPropagation,
      ignore,
      callback,
      transitionEnd,
      dragStart,
      dragEnd
    };
  }

  // Initialize swipe or re-setup
  setupSwipe() {
    if (!this.swipeContainer) return;

    let options = this.swipeOptions();

    if (this.instance) {
      this.instance.setup(options);
      if (options.auto) this.instance.restart();
    } else {
      this.instance = new SwipeJS(this.swipeContainer, options);
    }
  }

  componentWillUnmount() {
    this._isMount = false;

    try {
      this.instance.kill();
    } catch (e) { /* do nothing */ }
  }

  cloneSwipeItem(element) {
    let props = Object.assign({}, element.props);

    props = Object.assign(props, {
      ref: function(node) {
        // eslint-disable-next-line
        let dom = ReactDOM.findDOMNode(node);
        dom && dom.setAttribute('data-cloned', true);
      },

      key: String(Math.random()).valueOf()
    });

    // remove id
    delete props.id;

    return <SwipeItem {...props}>{element.props.children}</SwipeItem>;
  }

  render() {
    const { className, style, continuous } = this.props;

    let children;

    // Fix for #65
    // eslint-disable-next-line
    if (continuous) {
      children = [].concat(this.props.children);
      if (children.length === 2) {
        children.push(this.cloneSwipeItem(children[0]));
        children.push(this.cloneSwipeItem(children[1]));
      }
    } else {
      children = this.props.children;
    }

    return (
      <div
        ref={o => this.swipeContainer = o}
        className={ `swipe ${className || ''}` }
        style={style}>
        <div className="swipe-wrap">
          { children }
        </div>
      </div>
    );
  }
}

class SwipeItem extends React.Component {
  static get propTypes() {
    return {
      className: PropTypes.string,
      onClick: PropTypes.func,
      style: PropTypes.object
    };
  }

  static get defaultProps() {
    return {
      className: '',
      onClick: noop,
      style: {}
    };
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { className, onClick, style, children } = this.props;

    return (
      <div
        className={`swipe-item ${className || ''}`}
        onClick={ onClick }
        style={ style }>
        { children }
      </div>
    );
  }
}

Swipe.defaultProps = {
  className: '',
  style: {},
  startSlide: 0,
  speed: 300,
  auto: 3000,
  draggable: false,
  continuous: false,
  autoRestart: false,
  disableScroll: false,
  stopPropagation: false,
  ignore: null,
  callback: noop,
  transitionEnd: noop,
  dragStart: noop,
  dragEnd: noop
};

Swipe.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  startSlide: PropTypes.number,
  speed: PropTypes.number,
  auto: PropTypes.number,
  draggable: PropTypes.bool,
  continuous: PropTypes.bool,
  autoRestart: PropTypes.bool,
  disableScroll: PropTypes.bool,
  stopPropagation: PropTypes.bool,
  ignore: PropTypes.string,
  callback: PropTypes.func,
  transitionEnd: PropTypes.func,
  dragStart: PropTypes.func,
  dragEnd: PropTypes.func
};

function proxyMethods(...methods) {
  methods.map(function(method) {
    Swipe.prototype[method] = function() {
      if (this.instance) return this.instance[method].apply(this.instance, arguments);
    };
  });
}

// Proxy all swipe methods
proxyMethods(
  'prev',
  'next',
  'getPos',
  'getNumSlides',
  'slide',
  'restart',
  'stop',
  'setup',
  'disable',
  'enable',
  'kill'
);

export default Swipe;
export {
  Swipe,
  SwipeItem
};
