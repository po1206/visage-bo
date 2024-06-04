'use strict';

/**
 * @ngdoc function
 * @name visageBoApp.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the visageBoApp
 */
angular.module('visageBoApp')
  .controller('MenuCtrl', function ($scope, $location) {

    $scope.navigateTo = function (path) {
      $location.path(path);
    };
  });
