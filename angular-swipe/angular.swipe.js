(function() {
  'use strict';

  angular.module('swipe', [])
    .directive('swipeWrap', swipeWrap)
    .directive('swipeSlider', swipeSlider)
    .directive('swipeItem', swipeItem);

  function swipeWrap($timeout) {
    return {
      restrict: 'EA',
      replace: true,
      controller: SwipeController,
      controllerAs: 'SwipeCtrl',
      link: function(scope, element, attrs, Controller) {
        // Kickstart the Swipe Slider
        // Use $timeout so the controller will be inited at the end of the cycle
        // This is needed when you are using ng-repeat and other async stuff
        $timeout(Controller.init);
      }
    };
  }
  swipeWrap.$inject = ['$timeout'];
  function SwipeController($scope) {
    var SwipeCtrl = this;

    SwipeCtrl.element = null;
    SwipeCtrl.init = initSwipe;
    

    function initSwipe() {
      // Throw an exception if the `element` property is not set
      if (!SwipeCtrl.element) {
        throw 'Swipe requires an element to work.';
      }
      
      // Force a $digest on slide change while preserving the user's callback
      var userCallback = SwipeCtrl.options.callback || function(){};      
      SwipeCtrl.options.callback = function(index, elem) {
        $scope.$apply();
        userCallback(index, elem);
      };
      // Create a new Swipe instance and store the returned api
      var api = new Swipe(SwipeCtrl.element, SwipeCtrl.options);

      // Clone the Swipe API onto the controller
      for (var a in api) {
        SwipeCtrl[a] = api[a];
      }
    }
  }
  SwipeController.$inject = ['$scope'];
  function swipeSlider() {
    return {
      restrict: 'EA',
      require: '^swipeWrap',
      scope: {
        options: '='
      },
      replace: true,
      transclude: true,
      template: '<div class="swipe"><div class="swipe-wrap" ng-transclude></div></div>',
      link: {
        pre: function(scope, element, attrs, Controller) {
          Controller.options = scope.options || {};
          Controller.element = element[0];
        }
      }
    };
  }
  function swipeItem() {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      require: '^swipeSlider',
      template: '<div ng-transclude></div>'
    };
  }
})();
