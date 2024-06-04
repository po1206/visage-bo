'use strict';

/**
 * @ngdoc function
 * @name visageBoApp.controller:JobsCtrl
 * @description
 * # JobsCtrl
 * Controller of the visageBoApp
 */
angular.module('visageBoApp')
  .controller('JobsCtrl',
    function ($scope,
      JobOffer,
      Cached,
      $location,
      $timeout,
      auth,
      Loader,
      removeTrailingEqualsFilter,
      Preference) {

      $scope.setHome(false);
      $scope.setProgress(false);

      $scope.newJobOffer = function () {
        $location.path('/job-offer/');
      };

      $scope.usersById = {};

      var loadUsers = function () {
        return Preference.getEmployers().$promise
          .then(function (results) {
            results.forEach(function (preference) {
              if ($scope.usersById[preference._id]) {
                $scope.usersById[preference._id] = preference;
              }
            });
          });

      };

      Loader.globalLoader(true);

      // Form data for the post job process
      JobOffer.getActiveJobs().then(
        function (results) {
          var userIds = _.uniq(results.map(function (job) {
            if (!$scope.usersById[job.employer_id]) {
              $scope.usersById[job.employer_id] = {};
            }
            return job.employer_id;
          }));

          loadUsers(userIds);
          $scope.jobs = results;
        }
        )
        .catch(function (err) {
          console.error(err);
        })
        .finally(function () {
          Loader.globalLoader(false);
        });

    })
;
