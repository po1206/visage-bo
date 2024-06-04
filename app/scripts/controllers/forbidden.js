'use strict';

/**
 * @ngdoc function
 * @name visageBoApp.controller:ForbiddenCtrl
 * @description
 * # ForbiddenCtrl
 * Controller of the visageBoApp
 */
angular.module('visageBoApp')
  .controller('ForbiddenCtrl', function ($scope) {
    $scope.$emit('visage.promptLogin');
  });
