'use strict';

/**
 * @ngdoc directive
 * @name visageBoApp.directive:boJobs
 * @description
 * # boJobs
 */
angular.module('visageBoApp')
  .directive('boJobs', function ($location) {
    return {
      templateUrl: 'views/bo-jobs.tmpl.html',
      restrict: 'E',
      scope: {
        title: '@',
        jobs: '=',
        usersById: '=',
        hideLegend: '@',
        hideSearch: '@'
      },
      link: function postLink(scope) {

        var jobsData = {};

        scope.editJob = function (index) {
          $location.path('/job-offer/' + index);
        };

        var bindListeners = function () {

          scope.$watch('jobs', function (newJobs) {
            if (newJobs && newJobs.length > 0) {
              newJobs.forEach(function (job) {
                if (!jobsData[job.status]) {
                  jobsData[job.status] = [];
                }
                jobsData[job.status].push(job);
                var dateFrom;
                if (job.launched) {
                  dateFrom = job.launchedAt;
                }
                else {
                  if (job.status !== 'ShortlistReady') {
                    dateFrom = job.submitted;
                  }
                }
                job.fromNow = moment(new Date()).diff(moment(new Date(dateFrom)), 'days');
              });

              var sortingFunction = function (a, b) {
                if (b.launchedAt && a.launchedAt) {
                  return new Date(a.launchedAt) - new Date(b.launchedAt);
                }
                else if (a.launchedAt) {
                  return -1;
                }
                else if (b.launchedAt) {
                  return 1;
                }
                else if (a.submitted && b.submitted) {
                  return new Date(a.submitted) - new Date(b.submitted);
                }
              };

              for (var keyStatus in jobsData) {
                if (jobsData.hasOwnProperty(keyStatus)) {
                  jobsData[keyStatus].sort(sortingFunction);
                }
              }

              //copy
              scope.jobsData = angular.merge({}, jobsData);
            }

          });
        };

        bindListeners();

      }
    };
  });
