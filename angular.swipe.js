(function() {
  'use strict';

  angular.module('angular.swipe', [])
    .directive('swipeWrap', swipeWrap)
    .directive('swipeSlides', swipeSlides)
    .directive('swipeItem', swipeItem);

  function swipeWrap() {
    return {
      restrict: 'EA',
      scope: false,
      controller: SwipeController,
      controllerAs: 'SwipeCtrl',
      bindToController: {
        options: '='
      },
      link: function(scope, element, attrs, Controller) {
        // Set the element onto the controller
        //Controller.element = element[0];
        // Apply the options set by the user
        //Controller.options = scope.options;
        // Kickstart the Swipe Slider
        Controller.init();
        console.log('scope from within swipeWrap', scope.SwipeCtrl.getNumSlides())
      }
    };
  }
  SwipeController.$inject = ['$scope'];
  function SwipeController($scope) {
    var SwipeCtrl = this;

    SwipeCtrl.example = 'bob';

    SwipeCtrl.element = null;

    SwipeCtrl.init = initSwipe;

    function initSwipe() {
      // Throw an exception if the `element` property is not set
      if (!SwipeCtrl.element) {
        throw 'Swipe requires an element to work.';
      }
      // Create a new Swipe instance and store the returned api
      var api = new Swipe(SwipeCtrl.element, SwipeCtrl.options);

      // Clone the Swipe API onto the controller
      for (var a in api) {
        SwipeCtrl[a] = api[a];
      }
      console.log('scope from within swipe controller', $scope)
    }
  }
  function swipeSlides() {
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
          Controller.options = scope.options;
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
      require: '^swipeSlides',
      template: '<div ng-transclude></div>'
    };
  }
})();