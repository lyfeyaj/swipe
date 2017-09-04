/*!
 * Swipe 2.2.10
 *
 * Brad Birdsall
 * Copyright 2013, MIT License
 *
*/

// if the module has no dependencies, the above pattern can be simplified to
// eslint-disable-next-line no-extra-semi
;(function (root, factory) {
  // eslint-disable-next-line no-undef
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    // eslint-disable-next-line no-undef
    define([], function(){
      root.Swipe = factory();
      return root.Swipe;
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals
    root.Swipe = factory();
  }
}(this, function () {
  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
             typeof global == 'object' && global.global === global && global ||
             this;

  var _document = root.document;

  const defaultOptions = {
    auto: 0,

    // auto restart slideshow after user's touch event
    autoRestart: false,

    continuous: true,

    disableScroll: false,

    draggable: true,

    startSlide: 0,
    speed: 300,
  };

  const {requestAnimationFrame, cancelAnimationFrame} = root.requestAnimationFrame ? root : ((() => {
    let lastId = 0;
    let callbacks = undefined;

    return {
      requestAnimationFrame(cb) {
        const id = lastId++;

        if (!callbacks) {
          callbacks = new Map();

          setTimeout(() => {
            const timestamp = Date.now();

            // neded so requestAnimationFrame from callbacks
            // are not added to the current callbacks map
            const cbs = callbacks;
            callbacks = undefined;

            cbs.forEach((cb) => cb(timestamp));
          }, 33); // 33ms is 30fps
        }

        callbacks.set(id, cb);

        return id;
      },

      cancelAnimationFrame(id) {
        callbacks && delete callbacks[id];
      }
    };
  })());

  function Swipe(container, inputOptions) {

    'use strict';

    let options = Object.assign({}, defaultOptions, inputOptions);

    // setup initial vars
    var start = {};
    var delta = {};
    var isScrolling;

    // setup auto slideshow
    var delay = options.auto;
    var interval;

    var disabled = false;

    // utilities

    // check browser capabilities
    var browser = {
      addEventListener: !!root.addEventListener,
      // eslint-disable-next-line no-undef
      touch: ('ontouchstart' in root) || root.DocumentTouch && _document instanceof DocumentTouch,
      transitions: (function(temp) {
        var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
        for ( var i in props ) {
          if (temp.style[ props[i] ] !== undefined){
            return true;
          }
        }
        return false;
      })(_document.createElement('swipe'))
    };

    // quit if no root element
    if (!container) throw new Error('Missing swipe container');

    var element = container.children[0];
    var slides, slidePos, width, length;
    var index = parseInt(options.startSlide, 10) || 0;
    var speed = options.speed;

    // Returns a function, that, as long as it continues to be invoked, 
    // will not be triggered.
    const debounce = (fn, threshhold = 100) => {

      let timeout = 0;
      const cancel = () => {
        timeout && clearTimeout(timeout);
        timeout = 0;
      }

      const debounced = function(...args) {
        cancel();
        timeout = setTimeout(() => fn.apply(this, ...args), threshhold);
      }

      // allow remove debounced timeout
      debounced.cancel = cancel;
      return debounced;
    };

    const debouncedSetup = debounce(setup);

    // setup event capturing
    var events = {

      handleEvent: function(event) {
        if (disabled) return;

        switch (event.type) {
          case 'mousedown':
          case 'touchstart': this.start(event); break;
          case 'mousemove':
          case 'touchmove': this.move(event); break;
          case 'mouseup':
          case 'mouseleave':
          case 'touchend': this.end(event); break;
          case 'webkitTransitionEnd':
          case 'msTransitionEnd':
          case 'oTransitionEnd':
          case 'otransitionend':
          case 'transitionend': this.transitionEnd(event); break;
          case 'resize': debouncedSetup(); break;
        }

        if (options.stopPropagation) {
          event.stopPropagation();
        }
      },

      start: function(event) {
        let touches;

        if (isMouseEvent(event)) {
          touches = event;
          event.preventDefault(); // For desktop Safari drag
        } else if (event.touches.length !== 1) {
          // cancel swipe tracking
          detachFollowupEvents(event);
          moveFrame(index, 0, speed);
          return;
        } else {
          touches = event.touches[0];
        }

        attachFollowupEvents(event);

        // measure start values
        start = {

          // get initial touch coords
          x: touches.pageX,
          y: touches.pageY,

          // store time to determine touch duration
          time: Date.now()

        };

        // used for testing first move event
        isScrolling = undefined;

        // reset delta and end measurements
        delta = {
          x: 0,
          y: 0
        };
      },

      move: function(event) {
        var touches;

        if (isMouseEvent(event)) {
          touches = event;
        } else {
          // ensure swiping with one touch and not pinching
          if ( event.touches.length > 1 || event.scale && event.scale !== 1) {
            return;
          }

          if (options.disableScroll) {
            event.preventDefault();
          }

          touches = event.touches[0];
        }

        // measure change in x and y
        delta = {
          x: touches.pageX - start.x,
          y: touches.pageY - start.y
        };

        // determine if scrolling test has run - one time test
        if (isScrolling === undefined) {
          isScrolling = Math.abs(delta.x) < Math.abs(delta.y);
        }

        // if user is not trying to scroll vertically
        if (isScrolling) return;
        
        // prevent native scrolling
        event.preventDefault();

        // stop slideshow
        stop();

        const isPastBounds = !options.continuous &&
          index === (delta.x > 0 ? 0 : slides.length - 1);
        if (isPastBounds) {
          // increase resistance if first or last slide
          delta.x /= (Math.abs(delta.x)/width) + 1;
        }

        moveFrame(index, delta.x, 0);
      },

      end: function(event) {

        if (isScrolling) return;

        // measure duration
        var duration = Date.now() - start.time;

        // determine if slide attempt triggers next/prev slide
        var isValidSlideGesture =
            Number(duration) < 250 &&         // if slide duration is less than 250ms
            Math.abs(delta.x) > 20 ||         // and if slide amt is greater than 20px
            Math.abs(delta.x) > width/2;      // or if slide amt is greater than half the width

        // determine if slide attempt is past start and end
        const isPastBounds = !options.continuous &&
          index === (delta.x > 0 ? 0 : slides.length - 1);

        // OLD determine direction of swipe (true:right, false:left)
        // determine direction of swipe (-1: backward, 1: forward)
        const direction = delta.x < 0 ? 1 : -1;

        if (isValidSlideGesture && !isPastBounds) {

          const nextIndex = slideIndexAt(index + direction);

          if (browser.transitions) {
            // The new current slide must be between the 2 slides before and after itself
            move(index, -width * direction, speed);
            move(nextIndex, 0, speed);

            move(slideIndexAt(index + 2*direction), width * direction, 0);
          } else {
            moveFrame(nextIndex, 0, speed);
          }

          index = nextIndex;

          runCallback(getPos(), slides[index], direction)

        } else {
          moveFrame(index, 0, speed);
        }

        // kill touchmove and touchend event listeners until touchstart called again
        detachFollowupEvents(event);
      },

      transitionEnd: function(event) {
        var currentIndex = parseInt(event.target.getAttribute('data-index'), 10);
        if (currentIndex === index) {
          if (delay || options.autoRestart) restart();

          runTransitionEnd(getPos(), slides[index]);
        }
      }
    };

    // trigger setup
    setup();

    // start auto slideshow if applicable
    begin();

    // Expose the Swipe API
    return {
      // initialize
      setup: setup,

      // go to slide
      slide: function(to, speed) {
        stop();
        slide(to, speed);
      },

      // move to previous
      prev: function() {
        stop();
        prev();
      },

      // move to next
      next: function() {
        stop();
        next();
      },

      // Restart slideshow
      restart: restart,

      // cancel slideshow
      stop: stop,

      // return current index position
      getPos: getPos,

      // disable slideshow
      disable: disable,

      // enable slideshow
      enable: enable,

      // return total number of slides
      getNumSlides: function() { return length; },

      // completely remove swipe
      kill: kill
    };

    function moveFrame(index, dist, speed) {
      if (!browser.transitions) {
        const from = parseInt(element.style.left, 10), to = dist - width * index;
        animate(from, to, speed);
      } else {
        [-1, 0, 1]
          .forEach((offset) => move(slideIndexAt(index+offset), offset*width + dist, speed));
      }
    }

    // remove all event listeners
    function detachEvents() {
      if (browser.addEventListener) {
        // remove current event listeners
        element.removeEventListener('touchstart', events, false);
        element.removeEventListener('mousedown', events, false);
        element.removeEventListener('webkitTransitionEnd', events, false);
        element.removeEventListener('msTransitionEnd', events, false);
        element.removeEventListener('oTransitionEnd', events, false);
        element.removeEventListener('otransitionend', events, false);
        element.removeEventListener('transitionend', events, false);
        root.removeEventListener('resize', events, false);
      } else {
        root.onresize = null;
      }
    }

    // add event listeners
    function attachEvents() {
      if (browser.addEventListener) {

        // set touchstart event on element
        if (browser.touch) {
          element.addEventListener('touchstart', events, false);
        }

        if (options.draggable) {
          element.addEventListener('mousedown', events, false);
        }

        if (browser.transitions) {
          element.addEventListener('webkitTransitionEnd', events, false);
          element.addEventListener('msTransitionEnd', events, false);
          element.addEventListener('oTransitionEnd', events, false);
          element.addEventListener('otransitionend', events, false);
          element.addEventListener('transitionend', events, false);
        }

        // set resize event on window
        root.addEventListener('resize', events, false);

      } else {
        root.onresize = debouncedSetup; // to play nice with old IE
      }
    }

    function detachFollowupEvents(event) {
      if (isMouseEvent(event)) {
        element.removeEventListener('mousemove', events, false);
        element.removeEventListener('mouseup', events, false);
        element.removeEventListener('mouseleave', events, false);
      } else {
        element.removeEventListener('touchmove', events, false);
        element.removeEventListener('touchend', events, false);
      }
    }

    function attachFollowupEvents(event) {
      if (isMouseEvent(event)) {
        element.addEventListener('mousemove', events, false);
        element.addEventListener('mouseup', events, false);
        element.addEventListener('mouseleave', events, false);
      } else {
        element.addEventListener('touchmove', events, false);
        element.addEventListener('touchend', events, false);
      }
    }

    // clone nodes when there is only two slides
    function cloneNode(el) {
      var clone = el.cloneNode(true);
      element.appendChild(clone);

      // tag these slides as clones (to remove them on kill)
      clone.setAttribute('data-cloned', true);

      // Remove id from element
      clone.removeAttribute('id');
    }

    function setup() {
      // cache slides
      slides = element.children;
      length = slides.length;

      // slides length correction, minus cloned slides
      for (var i = 0; i < slides.length; i++) {
        if (slides[i].getAttribute('data-cloned')) length--;
      }

      // set continuous to false if only one slide
      if (slides.length < 2) {
        options.continuous = false;
      }

      // special case if two slides
      if (browser.transitions && options.continuous && slides.length < 3) {
        cloneNode(slides[0]);
        cloneNode(slides[1]);

        slides = element.children;
      }

      // create an array to store current positions of each slide
      slidePos = new Array(slides.length);

      // determine width of each slide
      width = container.getBoundingClientRect().width || container.offsetWidth;

      element.style.width = (slides.length * width * 2) + 'px';

      // stack elements
      var pos = slides.length;
      while(pos--) {
        var slide = slides[pos];

        slide.style.width = width + 'px';
        slide.setAttribute('data-index', pos);

        if (browser.transitions) {
          slide.style.left = (pos * -width) + 'px';
          move(pos, index > pos ? -width : (index < pos ? width : 0), 0);
        }
      }

      moveFrame(index, 0, 0);

      container.style.visibility = 'visible';

      // reinitialize events
      detachEvents();
      attachEvents();
    }

    function prev() {
      if (disabled) return;

      if (options.continuous) {
        slide(index-1);
      } else if (index) {
        slide(index-1);
      }
    }

    function next() {
      if (disabled) return;

      if (options.continuous) {
        slide(index+1);
      } else if (index < slides.length - 1) {
        slide(index+1);
      }
    }

    function runCallback(pos, index, dir) {
      if (options.callback) {
        options.callback(pos, index, dir);
      }
    }

    function runTransitionEnd(pos, index) {
      if (options.transitionEnd) {
        options.transitionEnd(pos, index);
      }
    }

    function slideIndexAtCircular(index) {
      const modulo = slides.length;
      return (modulo + index % modulo) % modulo;
    }

    function slideIndexAtNormal(index) {
      return (index >= 0 && index < length) ? index : undefined;
    }

    function slideIndexAt(index) {
      return (options.continuous ? slideIndexAtCircular : slideIndexAtNormal)(index);
    }

    function getPos() {
      // Fix for the clone issue in the event of 2 slides
      var currentIndex = index;

      if (currentIndex >= length) {
        currentIndex = currentIndex - length;
      }

      return currentIndex;
    }

    function slide(to, slideSpeed) {

      // ensure to is of type 'number'
      to = typeof to !== 'number' ? parseInt(to, 10) : to;

      // do nothing if already on requested slide
      if (index === to) return;

      if (browser.transitions) {

        var direction = Math.abs(index-to) / (index-to); // 1: backward, -1: forward

        // get the actual position of the slide
        if (options.continuous) {
          var natural_direction = direction;
          direction = -slidePos[slideIndexAt(to)] / width;

          // if going forward but to < index, use to = slides.length + to
          // if going backward but to > index, use to = -slides.length + to
          if (direction !== natural_direction) {
            to = -direction * slides.length + to;
          }

        }

        var diff = Math.abs(index-to) - 1;

        // move all the slides between index and to in the right direction
        while (diff--) {
          move( slideIndexAt((to > index ? to : index) - diff - 1), width * direction, 0);
        }

        to = slideIndexAt(to);

        move(index, width * direction, slideSpeed || speed);
        move(to, 0, slideSpeed || speed);

        if (options.continuous) { // we need to get the next in place
          move(slideIndexAt(to - direction), -(width * direction), 0);
        }

      } else {

        to = slideIndexAt(to);
        animate(index * -width, to * -width, slideSpeed || speed);
        // no fallback for a circular continuous if the browser does not accept transitions
      }

      index = to;

      const onNextTick = (cb, ...args) => cb && setTimeout(cb, 0, ...args);
      onNextTick(() => runCallback(getPos(), slides[index], direction));
    }

    function move(index, dist, speed) {
      translate(index, dist, speed);
      slidePos[index] = dist;
    }

    function translate(index, dist, speed) {

      var slide = slides[index];
      var style = slide && slide.style;

      if (!style) return;

      style.webkitTransitionDuration =
        style.MozTransitionDuration =
        style.msTransitionDuration =
        style.OTransitionDuration =
        style.transitionDuration = speed + 'ms';

      style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
      style.msTransform =
        style.MozTransform =
        style.OTransform = 'translateX(' + dist + 'px)';

    }

    function animate(from, to, speed) {

      // if not an animation, just reposition
      if (!speed) {
        element.style.left = to + 'px';
        return;
      }

      let start;

      requestAnimationFrame(function step(timestamp) {
        if (!start) {
          start = timestamp;
          requestAnimationFrame(step);
        } else if (timestamp - start >= speed) {

          element.style.left = to + 'px';

          if (delay || options.autoRestart) restart();

          runTransitionEnd(getPos(), slides[index]);

        } else {
          const timeElap = timestamp - start;
          element.style.left = ((to-from) * (timeElap/speed) + from) + 'px';

          requestAnimationFrame(step);
        }
      });
    }

    function begin() {
      delay = options.auto;
      if (delay) interval = setTimeout(next, delay);
    }

    function stop() {
      delay = 0;
      clearTimeout(interval);
    }

    function restart() {
      stop();
      begin();
    }

    function disable() {
      stop();
      disabled = true;
    }

    function enable() {
      disabled = false;
      restart();
    }

    function isMouseEvent(e) {
      return /^mouse/.test(e.type);
    }

    function kill() {
      // cancel slideshow
      stop();

      // remove inline styles
      container.style.visibility = '';

      // reset element
      element.style.width = '';
      element.style.left = '';

      // reset slides
      var pos = slides.length;
      while (pos--) {

        if (browser.transitions) {
          translate(pos, 0, 0);
        }

        var slide = slides[pos];

        // if the slide is tagged as clone, remove it
        if (slide.getAttribute('data-cloned')) {
          var _parent = slide.parentElement;
          _parent.removeChild(slide);
        }

        // remove styles
        slide.style.width = '';
        slide.style.left = '';

        slide.style.webkitTransitionDuration =
          slide.style.MozTransitionDuration =
          slide.style.msTransitionDuration =
          slide.style.OTransitionDuration =
          slide.style.transitionDuration = '';

        slide.style.webkitTransform =
          slide.style.msTransform =
          slide.style.MozTransform =
          slide.style.OTransform = '';

        // remove custom attributes (?)
        // slide.removeAttribute('data-index');
      }

      // remove all events
      detachEvents();

      // remove throttled function timeout
      debouncedSetup.cancel();
    }
  }

  if ( root.jQuery || root.Zepto ) {
    (function($) {
      $.fn.Swipe = function(params) {
        return this.each(function() {
          $(this).data('Swipe', new Swipe($(this)[0], params));
        });
      };
    })( root.jQuery || root.Zepto );
  }

  return Swipe;
}));
