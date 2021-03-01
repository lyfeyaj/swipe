import React from 'react';
import ReactDom from 'react-dom';
import { Swipe, SwipeItem } from 'swipejs/react/swipe';

import 'swipejs/style.css';
import './style.css';

class ReactSwipeExampleApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      slides: [
        'Slide One',
        'Slide Two',
        'Slide Three'
      ]
    };
  }

  onTransactionEnd(index, elem) {
    // Your own logic
  }

  handleCallback(index, elem) {
    // Your own logic
  }

  handleDragStart(index, elem) {
    // Your own logic
  }

  handleDragEnd(index, elem) {
    // Your own logic
  }

  handleClick(e) {
    // Your own logic
  }

  render() {
    const { slides } = this.state || {};
    return (
      <div className='react-swipe-example'>
        <h2>React Swipe Example</h2>
        <Swipe className='custom-swipe-container-class'
          ref={el => this.swipeEl = el}
          startSlide={0}
          speed={300}
          auto={3000}
          draggable={false}
          continuous={true}
          autoRestart={false}
          disableScroll={false}
          stopPropagation={false}
          callback={this.handleCallback.bind(this)}
          transitionEnd={this.onTransactionEnd.bind(this)}
          dragStart={this.handleDragStart.bind(this)}
          dragEnd={this.handleDragEnd.bind(this)}>
          {
            slides.map((slide, i) => {
              return (
                <SwipeItem key={slide + i} className='custom-swipe-item-class' onClick={this.handleClick.bind(this)}>
                  {slide}
                </SwipeItem>
              );
            })
          }
        </Swipe>
      </div>
    );
  }
}

ReactDom.render(<ReactSwipeExampleApp />, document.getElementById('react-swipe-example-app'));