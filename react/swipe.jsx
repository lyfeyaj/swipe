/*!
 * React Swipe 2.2.10
 *
 * Felix Liu
 * Copyright 2016, MIT License
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

class Swipe extends React.Component {
  static get propTypes() {
    return {
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
      callback: PropTypes.func,
      transitionEnd: PropTypes.func
    };
  }

  static get defaultProps() {
    return {
      className: '',
      style: {},
      startSlide: 0,
      speed: 300,
      auto: 3000,
      draggable: false,
      continuous: true,
      autoRestart: false,
      disableScroll: false,
      stopPropagation: false,
      callback: noop,
      transitionEnd: noop
    };
  }

  constructor(...args) {
    super(...args);
  }

  componentDidMount() {
    const {
      startSlide,
      speed,
      auto,
      draggable,
      continuous,
      autoRestart,
      disableScroll,
      stopPropagation,
      callback,
      transitionEnd
    } = this.props;
    this.instance = new SwipeJS(this.refs.swipe, {
      startSlide,
      speed,
      auto,
      draggable,
      continuous,
      autoRestart,
      disableScroll,
      stopPropagation,
      callback,
      transitionEnd
    });
  }

  componentWillUnmount() {
    try {
      this.instance.kill();
    } catch (e) { /* do nothing */ }
  }

  cloneSwipeItem(element) {
    let props = Object.assign({}, element.props);

    props = Object.assign(props, {
      ref: function(node) {
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
    const { className, style } = this.props;

    // Fix for #65
    let children = [].concat(this.props.children);
    if (children.length === 2) {
      children.push(this.cloneSwipeItem(children[0]));
      children.push(this.cloneSwipeItem(children[1]));
    }

    return (
      <div ref='swipe' className={ `swipe ${className || ''}` } style={style}>
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

  constructor(...args) {
    super(...args);

    this.state = {};
  }

  render() {
    const { className, onClick, style, children } = this.props;

    return (
      <div className={`swipe-item ${className || ''}`}
           onClick={ onClick }
           style={ style }>
        { children }
      </div>
    );
  }
}

export {
  Swipe,
  SwipeItem
};
