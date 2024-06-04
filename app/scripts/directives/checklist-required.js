'use strict';

/**
 * @ngdoc directive
 * @name visageBoApp.directive:checklistRequired
 * @description
 * # checklistRequired
 */
angular.module('visageBoApp')
  .directive('checklistRequired', function ($parse) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attrs, ctrl) {
        //$scope.$watch('checklistRequired', function() {
        //  alert('hey, myVar has changed!');
        //});

        //For DOM -> model validation
        ctrl.$parsers.unshift(function (value) {
          var model = $parse(attrs.checklistRequired);
          var valid = model(scope).length > 0;
          ctrl.$setValidity('oneRequired', valid);
          return valid ? value : undefined;
        });

        //For model -> DOM validation
        ctrl.$formatters.unshift(function (value) {
          var model = $parse(attrs.checklistRequired);
          ctrl.$setValidity('oneRequired', model(scope).length > 0);
          return value;
        });

      }
    };
  });

