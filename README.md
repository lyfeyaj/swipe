Swipe
=====

[![Build Status](https://travis-ci.org/lyfeyaj/swipe.svg?branch=master)](https://travis-ci.org/lyfeyaj/swipe)
[![npm version](https://badge.fury.io/js/swipejs.svg)](https://badge.fury.io/js/swipejs)
[![npm](https://img.shields.io/npm/dt/swipejs.svg)]()
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/lyfeyaj/swipe/master/LICENSE.md)


> Swipe is the most accurate touch slider. It is extremely lightweight (only 6kb minified) and works across all browsers, including IE7+.

> Support both React.js and Angular.js(v1)

## Note

This repo is a continuation of the dead [Swipe](https://github.com/thebird/Swipe) project. Our mission is to keep Swipe alive and moving forward, with maintenance fixes and new features. Pull Requests are welcome!

## Usage

### Preview

[![Preview Image](docs/images/preview.png)](https://swipe.js.org)

Thanks to [@loup-brun](https://github.com/loup-brun)

### Installation

```bash
npm i swipejs
```

See the [online example](https://swipe.js.org) for a simple demo.

### Markup

Swipe requires just a few lines of markup. Here is an example:

``` html
<div id="slider" class="swipe">
  <div class="swipe-wrap">
    <div></div>
    <div></div>
    <div></div>
  </div>
</div>
```

Above is the initial required structure– a series of elements wrapped in two containers. Place any content you want within the items. The containing `div` will need to be passed to the Swipe function like so:

### Style

Swipe requires the following styles to be added to your stylesheet:

``` css
.swipe {
  overflow: hidden;
  visibility: hidden;
  position: relative;
}
.swipe-wrap {
  overflow: hidden;
  position: relative;
}
.swipe-wrap > div {
  float: left;
  width: 100%;
  position: relative;
  overflow: hidden;
}
```

### Javascript

You may initialize a Swipe slider with only one line of javascript code:

``` js
window.mySwipe = new Swipe(document.getElementById('slider'));
```

I always place this at the bottom of the page, externally, to verify the page is ready.

## Options

Swipe can take an optional second parameter – an object of key/value settings:

| Options             | Type     | Default | Description                                                                                                                                                                                                      |
|---------------------|----------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **startSlide**      | Integer  | 0       | index position at which Swipe should start.                                                                                                                                                                      |
| **speed**           | Integer  | 300     | speed of prev and next transitions in milliseconds.                                                                                                                                                              |
| **auto**            | Integer  | 0       | when specified, start an auto-playing slideshow (time in milliseconds between slide change).                                                                                                                     |
| **continuous**      | Boolean  | true    | create an infinite feel with no endpoints.                                                                                                                                                                       |
| **autoRestart**     | Boolean  | false   | auto restart slideshow after user's touch event or next/prev calls.                                                                                                                                              |
| **disableScroll**   | Boolean  | false   | prevent any touch events on this container from scrolling the page.                                                                                                                                              |
| **stopPropagation** | Boolean  | false   | stop event propagation.                                                                                                                                                                                          |
| **callback**        | Function | null    | runs at slide change. Three parameters are passed to the function: `index` (the current slide index)`elem` (the current slide element) and `dir` (direction: `1` for left or backward`-1` for right or forward). |
| **transitionEnd**   | Function | null    | runs at the end of a slide transition. Two parameters are passed to the function: `index` (the current slide index) and `elem` (the current slide element).                                                      |

### Example

``` js
window.mySwipe = new Swipe(document.getElementById('slider'), {
  startSlide: 0,
  speed: 400,
  auto: 3000,
  draggable: false,
  continuous: true,
  disableScroll: false,
  stopPropagation: false,
  callback: function(index, elem, dir) {},
  transitionEnd: function(index, elem) {}
});
```

## API

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

## Supports

### Browser Support

Swipe is now compatible with all browsers, including IE7+. Swipe works best on devices that support CSS transforms and touch events, but can be used without these as well. A few helper methods determine touch and CSS transition support and choose the proper animation methods accordingly.

### React Support

Please go to [react swipe plugin](react), or check the [example](docs/examples/react)

### Angular(V1) Support

Please go to [angular swipe plugin](https://swipe.js.org/examples/angular-v1) for source code and usage example.

## Who's using Swipe

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <img src="docs/icons/airbnb.png" width="170px" height="80px">
      </td>
      <td align="center" valign="middle">
        <img src="docs/icons/nhl.png" width="170px" height="80px">
      </td>
      <td align="center" valign="middle">
        <img src="docs/icons/htc.png" width="170px" height="80px">
      </td>
      <td align="center" valign="middle">
        <img src="docs/icons/thinkgeek.png" width="170px" height="80px">
      </td>
    </tr>
    <tr></tr>
    <tr>
      <td align="center" valign="middle">
        <img src="docs/icons/snapguide.png" width="170px" height="80px">
      </td>
      <td align="center" valign="middle">
        <img src="docs/icons/everlane.png" width="170px" height="80px">
      </td>
      <td align="center" valign="middle">
        <img src="docs/icons/boqii.png" width="170px" height="80px">
      </td>
      <td align="center" valign="middle">
        <img src="docs/icons/allbeauty.png" width="170px" height="80px">
      </td>
    </tr>
  </tbody>
</table>

Send me a [note](mailto:lyfeyaj@gmail.com) if you want your logo here

## License

[The MIT License (MIT)](http://opensource.org/licenses/MIT).
