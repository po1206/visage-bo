'use strict';

/**
 * @ngdoc filter
 * @name visageBoApp.filter:filters
 * @function
 * @description
 * # filters
 * Filter in the visageBoApp.
 */
angular.module('visageBoApp')
  .filter('removeTrailingEquals', function () {
    return function (input) {
      if (input) {
        return input.replace(new RegExp('=', 'g'), '');
      }
    };
  })
  .filter('convertUserId', function () {
    return function (input) {
      if (input) {
        return btoa(input).replace(new RegExp('=', 'g'), '');
      }
    };
  });
