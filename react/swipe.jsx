/*!
 * React Swipe 2.2.4
 *
 * Felix Liu
 * Copyright 2016, MIT License
 *
*/

'use strict';

// Module dependencies
import React from 'react';
import SwipeJS from 'swipejs';

// Constants
const noop = function noop() {};

class Swipe extends React.Component {
  static get propTypes() {
    return {
      className: React.PropTypes.string,
      style: React.PropTypes.object,
      startSlide: React.PropTypes.number,
      speed: React.PropTypes.number,
      auto: React.PropTypes.number,
      draggable: React.PropTypes.bool,
      continuous: React.PropTypes.bool,
      autoRestart: React.PropTypes.bool,
      disableScroll: React.PropTypes.bool,
      stopPropagation: React.PropTypes.bool,
      callback: React.PropTypes.func,
      transitionEnd: React.PropTypes.func
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

  componentWillUmount() {
    try {
      this.instance.kill();
    } catch (e) { /* do nothing */ }
  }

  render() {
    const { className, style } = this.props;
    return (
      <div ref='swipe' className={ `swipe ${className || ''}` } style={style}>
        <div className="swipe-wrap">
          { this.props.children }
        </div>
      </div>
    );
  }
}

class SwipeItem extends React.Component {
  static get propTypes() {
    return {
      className: React.PropTypes.string,
      onClick: React.PropTypes.func,
      style: React.PropTypes.object
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
    const { className, onClick, style } = this.props;

    return (
      <div className={`swipe-item ${className || ''}`}
           onClick={ onClick }
           style={style}>
        { this.props.children }
      </div>
    );
  }
}

export {
  Swipe,
  SwipeItem
};
