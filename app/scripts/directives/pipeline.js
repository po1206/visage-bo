'use strict';

/**
 * @ngdoc directive
 * @name visageBoApp.directive:pipeline
 * @description
 * # pipeline
 */
angular.module('visageBoApp')
  .directive('pipeline', function ($routeParams,EMailFactory) {
    return {
      templateUrl: 'views/pipeline.tmpl.html',
      restrict: 'E',
      link: function postLink(scope) {

        function bindListeners() {
          scope.$on('tab.selected', function (event, tab) {
            if (tab === 'pipeline' && scope.notLoaded) {
              scope.notLoaded = false;
            }
          });
        }

        scope.sendCalibration = function () {
          scope.pending = 'indeterminate';
          scope.job.status = 'Calibrated';
          scope.genericSave()
            .then(function () {
              return EMailFactory.sendCalibration(scope.user, scope.job);
            })
            .then(function () {
              scope.jobSaved();
              scope.refreshData();
            }, function (err) {
              console.error('There was an error when trying to save the job');
              console.error(err);
            })
            .finally(function () {
              scope.pending = null;
            });
        };

        scope.sendLonglist = function () {
          scope.pending = 'indeterminate';
          scope.job.status = 'LonglistReady';
          scope.genericSave()
            .then(function () {
              return EMailFactory.sendLonglist(scope.user, scope.job);
            })
            .then(function () {
              scope.jobSaved();
              scope.refreshData();
            }, function (err) {
              console.error('There was an error when trying to save the job');
              console.error(err);
            })
            .finally(function () {
              scope.pending = null;
            });
        };

        scope.sendLonglist = function () {
          scope.pending = 'indeterminate';
          scope.job.status = 'ShortlistReady';
          scope.genericSave()
            .then(function () {
              return EMailFactory.sendShortlist(scope.user, scope.job);
            })
            .then(function () {
              scope.jobSaved();
              scope.refreshData();
            }, function (err) {
              console.error('There was an error when trying to save the job');
              console.error(err);
            })
            .finally(function () {
              scope.pending = null;
            });
        };

        bindListeners();
        scope.notLoaded = true;
        scope.jobId = $routeParams.jobId;
        //TODO ugly, include that in widget (careful do not break client side)
        scope.viewCandidatesPath = '/job-offer/'+scope.jobId+'/candidates/';
        scope.viewCandidatesSourcedPath = '/job-offer/'+scope.jobId+'/candidates/Sourced';
        scope.viewCandidatesApprovedPath = '/job-offer/'+scope.jobId+'/candidates/Approved';
        scope.viewCandidatesShortlistedPath = '/job-offer/'+scope.jobId+'/candidates/Shortlisted';

      }
    };
  });
