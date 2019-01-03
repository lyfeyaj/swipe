React Swipe
===========

## Installation

```bash
npm i swipejs
```

## Usage

### Example

```javascript

'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Swipe, { SwipeItem } from 'swipejs/react';

const Slider = () => {
  let swipeEl;

  return (
    <div>
      <Swipe ref={o => swipeEl = o}
      >
        <SwipeItem>Slide One</SwipeItem>
        <SwipeItem>Slide Two</SwipeItem>
        <SwipeItem>Slide Three</SwipeItem>
      </Swipe>
      <button onClick={() => swipeEl.next()}>Next</button>
      <button onClick={() => swipeEl.prev()}>Previous</button>
    </div>
  );
};

ReactDOM.render(<Slider />, document.getElementById('app'));
```

### Props

#### `Swipe` Component
| Props              | Type     | Default | Description                                                                                                                                                                                                      |
|---------------------|----------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **className**       | String   | ''      | custom class name for swipe container element                                                                                                                                                                    |
| **style**           | Object   | {}      | custom styles for swipe                                                                                                                                                                                          |
| **startSlide**      | Integer  | 0       | index position at which Swipe should start.                                                                                                                                                                      |
| **speed**           | Integer  | 300     | speed of prev and next transitions in milliseconds.                                                                                                                                                              |
| **auto**            | Integer  | 0       | when specified, start an auto-playing slideshow (time in milliseconds between slide change).                                                                                                                     |
| **continuous**      | Boolean  | true    | create an infinite feel with no endpoints.                                                                                                                                                                       |
| **autoRestart**     | Boolean  | false   | auto restart slideshow after user's touch event or next/prev calls.                                                                                                                                              |
| **disableScroll**   | Boolean  | false   | prevent any touch events on this container from scrolling the page.                                                                                                                                              |
| **stopPropagation** | Boolean  | false   | stop event propagation.                                                                                                                                                                                          |
| **callback**        | Function | null    | runs at slide change. Three parameters are passed to the function: `index` (the current slide index)`elem` (the current slide element) and `dir` (direction: `1` for left or backward`-1` for right or forward). |
| **transitionEnd**   | Function | null    | runs at the end of a slide transition. Two parameters are passed to the function: `index` (the current slide index) and `elem` (the current slide element).                                                      |

#### `SwipeItem` Component

| Options             | Type     | Default | Description                                                                                                                                                                                                      |
|---------------------|----------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **className**       | String   | ''      | custom class name for swipe item element                                                                                                                                                                    |
| **style**           | Object   | {}      | custom styles for swipe item                                                                                                                                                                                          |
| **onClick**         | Function | null    | onClick event handler                                                                                                                                                                                            |

### API

A Swipe instance exposes the following public methods:

| Methods                  | Description                                                                                             |
|--------------------------|---------------------------------------------------------------------------------------------------------|
| `prev()`                 | slide to the previous slide.                                                                            |
| `next()`                 | slide to the next slide.                                                                                |
| `getPos()`               | return the current slide index position.                                                                |
| `getNumSlides()`         | return the number of slides.                                                                            |
| `slide(index, duration)` | slide to the position matching the `index` (integer) (`duration`: speed of transition in milliseconds). |
| `restart()`              | restart the slideshow with autoplay.                                                                    |
| `stop()`                 | stop the slideshow and disable autoplay.                                                                |
| `setup(options)`         | reinitialize swipe with options.                                                                        |
| `disable()`              | disable slideshow.                                                                                      |
| `enable()`               | enable slideshow.                                                                                       |
| `kill()`                 | completely remove the Swipe instance.                                                                   |

## License

[The MIT License (MIT)](http://opensource.org/licenses/MIT).