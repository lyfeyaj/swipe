(function() {
  'use strict';

  angular.module('swipe.counter', [])
    .directive('swipeCounter', swipeCounter);

  function swipeCounter() {
    return {
      require: '^swipeWrap',
      template: '{{ SwipeCtrl.getPos() }}',
    };
  }

})();