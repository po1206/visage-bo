'use strict';

/**
 * @ngdoc directive
 * @name visageBoApp.directive:clientJobs
 * @description
 * # clientJobs
 */
angular.module('visageBoApp')
  .directive('clientJobs', function (JobOffer, $q, $routeParams, Loader, $location) {
    return {
      templateUrl: 'views/client-jobs.tmpl.html',
      restrict: 'E',
      scope: {
        jobs: '='
      },
      link: function postLink(scope) {
        scope.editJob = function (index) {
          $location.path('/job-offer/' + index);
        };

        if ($routeParams.clientId) {
          Loader.globalLoader(true);
          $q.all([
              JobOffer.queryByUser({
                userId: $routeParams.clientId,
                state: 'active'
              }).$promise,
              JobOffer.queryByUser({
                userId: $routeParams.clientId,
                state: 'inactive'
              }).$promise
            ])
            .then(function (results) {
              var activeJobs = results[0];
              var inactiveJobs = results[1];
              scope.activeJobs = activeJobs;
              scope.inactiveJobs = inactiveJobs;
            }, function (err) {
              console.error(err);
            })
            .finally(function () {
              Loader.globalLoader(false);
            });
        }
      }
    };
  });
