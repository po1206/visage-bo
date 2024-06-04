'use strict';

/**
 * @ngdoc directive
 * @name visageBoApp.directive:expertPerformances
 * @description
 * # recruiterPerformances
 */
angular.module('visageBoApp')
  .directive('expertPerformances', function ($location) {
    return {
      templateUrl: 'views/expert-performances.tmpl.html',
      restrict: 'E',
      scope: {
        expertAssignments: '='
      },
      link: function postLink(scope) {
        scope.editJob = function (index) {
          $location.path('/job-offer/' + index);
        };

      }
    };
  });
