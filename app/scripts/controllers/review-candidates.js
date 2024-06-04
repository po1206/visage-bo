'use strict';

/**
 * @ngdoc function
 * @name visageBoApp.controller:ReviewCandidatesCtrl
 * @description
 * # ReviewCandidatesCtrl
 * Controller of the visageBoApp
 */
angular.module('visageBoApp')
  .controller('ReviewCandidatesCtrl',
    function ($scope, $q, $routeParams, JobOffer, CandidateSubmission, Preference) {
      $scope.refreshSubmissions = function () {
        var calls = {
          job: JobOffer.get({_id: $routeParams.jobId}).$promise,
          pending: CandidateSubmission.queryByJob({
            jobId: $routeParams.jobId,
            status: $routeParams.status
          })
            .$promise,
          user: Preference.getPreferences()
        };

        return $q.all(calls)
          .then(function (result) {
            $scope.candidateSubmissions = result.pending;
            $scope.job = result.job;
            $scope.status = $routeParams.status;
            $scope.user = result.user;
            if ($scope.status === 'Approved') {
              $scope.operations = {
                disqualify: true,
                shortlist:true
              };
            } else if ($scope.status === 'Sourced') {
              $scope.operations = {
                viewRequirements: true,
                outstanding: true,
                qualify: true,
                disqualify: true
              };
            }
            return true;
          });
      };
      $scope.selectedCandidateSubmission = {};

      //FIXME just a quick workaround for hotfix but it should be fixed in the visage-ng-common lib
      $scope.indicators = {
        slots : 99,
        pendingCVs : 0,
        approvedCVs : 0
      };

      $scope.refreshSubmissions();
    });
