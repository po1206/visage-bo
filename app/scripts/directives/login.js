'use strict';

/**
 * @ngdoc directive
 * @name visageBoApp.directive:login
 * @description
 * # login
 */
angular.module('visageBoApp')
  .directive('login', function () {
    return {
      templateUrl: 'views/login.tmpl.html',
      restrict: 'E',
      controller: 'LoginCtrl',
      replace: true
    };
  });
