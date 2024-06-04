'use strict';

/**
 * @ngdoc directive
 * @name visageBoApp.directive:extJobs
 * @description
 * # extJobs
 */
angular.module('visageBoApp')
  .directive('extJobs', function ($window) {
    return {
      templateUrl: 'views/ext-jobs.tmpl.html',
      restrict: 'E',
      scope: {
        jobs: '=',
        selectable: '@',
        adminLink: '@'
      },
      link: function postLink(scope) {

        scope.openExternal = function (event, jobOffer) {
          $window.open(jobOffer.url, '_blank');
        };
      }
    };
  });
