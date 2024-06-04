'use strict';

/**
 * @ngdoc function
 * @name visageBoApp.controller:ExpertsCtrl
 * @description
 * # ExpertsCtrl
 * Controller of the visageBoApp
 */
angular.module('visageBoApp')
  .controller('ExpertsCtrl',
    function ($scope, $location) {

      $scope.inviteExpert = function () {
        $location.path('/experts/invite');
      };

    });
