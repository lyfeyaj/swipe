React Swipe
===========

### Prerequisite

Install swipejs via `npm install swipejs`

### Example

```javascript

'use strict';

import React from 'react';
import { Swipe, SwipeItem } from 'swipejs/react';

class HomePage extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  componentDidMount() {
    let mySwipe = this.refs.swipe.instance;
    // You can call swipe methods on `mySwipe`
    // mySwipe.prev()
    // mySwipe.next()
    // mySwipe.getPos()
    // mySwipe.getNumSlides()
    // mySwipe.slide()
    // mySwipe.restart()
    // mySwipe.stop()
    // mySwipe.kill()
  }

  onTransactionEnd(index, elem) {
    // Your own logic
  }

  handleCallback(index, elem) {
    // Your own logic
  }

  handleClick(e) {
    // Your own logic
  }

  render() {
    return (
      <Swipe className='custom-swipe-container-class'
             ref='swipe'
             startSlide={0}
             speed={300}
             auto={3000}
             draggable={false}
             continuous={true}
             autoRestart={false}
             disableScroll={false}
             stopPropagation={false}
             callback={this.handleCallback.bind(this)}
             transitionEnd={this.onTransactionEnd.bind(this)}>
        <SwipeItem className='custom-swipe-item-class'
                   onClick={this.handleClick.bind(this)}>
          Slide One
        </SwipeItem>
        <SwipeItem className='custom-swipe-item-class'
                   onClick={this.handleClick.bind(this)}>
          Slide Two
        </SwipeItem>
        <SwipeItem className='custom-swipe-item-class'
                   onClick={this.handleClick.bind(this)}>
          Slide Three
        </SwipeItem>
      </Swipe>
    );
  }
}

```
