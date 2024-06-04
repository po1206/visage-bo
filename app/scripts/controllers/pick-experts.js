'use strict';

/**
 * @ngdoc function
 * @name visageBoApp.controller:PickExpertsCtrl
 * @description
 * # PickExpertsCtrl
 * Controller of the visageBoApp
 */
angular.module('visageBoApp')
  .controller('PickExpertsCtrl',
    function ($scope, $mdDialog) {

      $scope.hide = function () {
        $mdDialog.hide();
      };
      $scope.cancel = function () {
        $mdDialog.cancel();
      };

      $scope.expertsSelected = function () {
        $mdDialog.hide($scope.selectedExperts);
      };

      $scope.selectedExperts = [];
      $scope.validatedOnly = true;
    });

