'use strict';

/**
 * @ngdoc directive
 * @name visageBoApp.directive:recruiterPerformances
 * @description
 * # recruiterPerformances
 */
angular.module('visageBoApp')
  .directive('recruiterPerformances', function ($location) {
    return {
      templateUrl: 'views/recruiter-performances.tmpl.html',
      restrict: 'E',
      scope: {
        recruiterAssignments: '='
      },
      link: function postLink(scope) {
        scope.editJob = function (index) {
          $location.path('/job-offer/' + index);
        };

      }
    };
  });
