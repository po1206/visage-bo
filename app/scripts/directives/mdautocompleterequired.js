'use strict';

/**
 * @ngdoc directive
 * @name visageBoApp.directive:mdAutocompleteRequired
 * @description
 * # mdAutocompleteRequired
 */
angular.module('visageBoApp')
  .directive('mdAutocompleteRequired', function ($timeout) {
    return {
      restrict: 'A',
      require: '^form',
      link: function (scope, element, attr, ctrl) {
        $timeout(function () {
          var realModel,
            elemCtrl = ctrl[attr.mdInputName],
            realValidation = function (model) {
              elemCtrl.$setValidity('selectedItem', !model || !!realModel);
              return model;
            };
          if (!!attr.mdSelectedItem && !!attr.mdInputName) {
            scope.$watchCollection(attr.mdSelectedItem, function (obj) {
              realModel = obj;
              realValidation();
            });
            elemCtrl.$parsers.push(realValidation);
          }
        });
      }
    };
  });
