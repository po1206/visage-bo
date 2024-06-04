'use strict';

/**
 * @ngdoc function
 * @name visageBoApp.controller:WarningCtrl
 * @description
 * # WarningCtrl
 * Controller of the visageBoApp
 */
angular.module('visageBoApp')
  .controller('WarningCtrl', function ($scope, $mdToast) {
    $scope.closeToast = function () {
      $mdToast.hide();
    };
  });
