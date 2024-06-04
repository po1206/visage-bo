'use strict';

/**
 * @ngdoc directive
 * @name visageBoApp.directive:campaign
 * @description
 * # campaign
 */
angular.module('visageBoApp')
  .directive('campaign',
    function ($mdDialog,
      $q,
      $mdMedia,
      $window,
      EMailFactory,
      ExtJobOffers,
      $location,
      RecruiterAssignment,
      ExpertAssignment,
      $routeParams,
      $mdToast) {
      return {
        templateUrl: 'views/campaign.tmpl.html',
        restrict: 'E',
        link: function postLink(scope) {

          function bindListeners() {
            scope.$on('tab.selected', function (event, tab) {
              if (tab === 'campaign' && notLoaded) {
                scope.loading = 'indeterminate';
                refreshData()
                  .then(function () {
                    notLoaded = false;
                  })
                  .finally(function () {
                    scope.loading = null;
                  });
              }
            });

            scope.$watch(function () {
              return scope.job.launched;
            }, function () {
              updateLaunched();
            });

            scope.$watch(function () {
              return scope.job.sourcing;
            }, function () {
              updateSourcing();
            });
          }

          var notLoaded = true;

          var refreshData = function () {
            var calls = {jobUpdate: scope.refreshData()};

            calls.recruiterAssignments =
              RecruiterAssignment.queryByJob({jobId: $routeParams.jobId}).$promise;
            calls.expertAssignments =
              ExpertAssignment.queryByJob({jobId: $routeParams.jobId}).$promise;

            return $q.all(calls)
              .then(function (result) {
                if (result.recruiterAssignments) {
                  scope.recruiterAssignments = result.recruiterAssignments;
                }
                if (result.expertAssignments) {
                  scope.expertsAssignments = result.expertAssignments;
                }
              });

          };

          var showConfirmRequestSourcing = function () {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
              .title('Request sourcing')
              .textContent(
                'Do you really want to invite all recruiters ' +
                'on the job?')
              .ariaLabel('Request sourcing')
              .ok('Please do it!')
              .cancel('Nope !');
            return $mdDialog.show(confirm);
          };

          var showConfirmStopSourcing = function (holdCampaign) {
            var msg = 'Do you really want to stop sourcing for this job? We\'ll notify all the ' +
              'recruiters on the job ?';
            if (holdCampaign) {
              msg =
                'By putting the campaign on hold you will stop sourcing and notify the ' +
                'recruiters and the experts';
            }
            var confirm = $mdDialog.confirm()
              .title('Stop sourcing')
              .textContent(msg)
              .ariaLabel('Stop sourcing')
              .ok('Yeah')
              .cancel('Nope');
            return $mdDialog.show(confirm);
          };

          var showToast = function (text) {
            return $mdToast.show(
              $mdToast.simple()
                .textContent(text)
                .position('top right')
                .hideDelay(3000)
            );
          };

          var chooseChange = function () {
            if (scope.job.sourcing) {
              return showConfirmRequestSourcing();
            }
            else {
              return showConfirmStopSourcing();
            }
          };

          var updateLaunched = function () {
            scope.launched =
              (scope.job.launched) ? 'Launched' : 'On hold';
          };

          var updateSourcing = function () {
            scope.sourcing =
              (scope.job.sourcing) ? 'Sourcing' : 'Not sourcing';
          };

          scope.onRequestSourcingChange = function () {
            scope.pendingRequestSourcing = scope.pending = 'indeterminate';
            chooseChange()
              .then(function (result) {
                if (scope.job.sourcing) {
                  EMailFactory.requestSourcing(scope.job);
                }
                else {
                  EMailFactory.stopSourcing(scope.job);
                }
                return scope.job.$update();
              })
              .then(function () {
                scope.jobSaved();
              })
              .catch(function (err) {
                scope.job.sourcing = !scope.job.sourcing;
                console.error(err);
              })
              .finally(function () {
                scope.pendingRequestSourcing = scope.pending = null;
              });
          };

          scope.onCampaignLaunchChange = function () {
            scope.pendingCampaignLaunch = scope.pending = 'indeterminate';
            var oldSourcingValue = scope.job.sourcing;
            scope.job.sourcing = false;
            if (scope.job.launched) {
              scope.job.launchedAt = new Date();
              scope.job.$update()
                .then(function () {
                  scope.jobSaved();
                })
                .finally(function () {
                  scope.pendingCampaignLaunch = scope.pending = null;
                });
            }
            else {
              var jobUpdated;
              if (oldSourcingValue) {
                jobUpdated = showConfirmStopSourcing(oldSourcingValue)
                  .then(function () {
                    EMailFactory.stopSourcing(scope.job);
                    return scope.job.$update();
                  });
              }
              else {
                jobUpdated = scope.job.$update();
              }
              jobUpdated.then(function () {
                  scope.jobSaved();
                })
                .catch(function (err) {
                  scope.job.launched = !scope.job.launched;
                  scope.job.sourcing = oldSourcingValue;
                  console.error(err);
                })
                .finally(function () {
                  scope.pendingCampaignLaunch = scope.pending = null;
                });
            }

          };

          scope.openExternal = function (event, jobOffer) {
            $window.open(jobOffer.url, '_blank');
          };

          scope.viewRecruiter = function (recruiter) {
            $location.path('/recruiters/' + recruiter._id);
          };

          scope.viewExpert = function (expert) {
            $location.path('/experts/' + expert._id);
          };

          scope.pickExperts = function (ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
            $mdDialog.show({
                controller: 'PickExpertsCtrl',
                templateUrl: 'views/pick-experts.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
              })
              .then(function (experts) {
                scope.pendingExperts = 'indeterminate';
                var assignmentCalls = [];
                if (scope.job.expertsAssignments) {
                  assignmentCalls.push(
                    ExpertAssignment.clearByJob({jobId: scope.job._id})
                  );
                }
                //only on or two experts so not a big deal
                experts.forEach(function (expert) {
                  var expAssign = new ExpertAssignment();
                  expAssign.expert = expert._id;
                  expAssign.job = scope.job._id;
                  assignmentCalls.push(expAssign.$save({
                    jobId: scope.job._id,
                    path: 'job-offers'
                  }));
                });
                $q.all(assignmentCalls)
                  .then(function (assignmentsResults) {
                    refreshData();
                    console.info(assignmentsResults.length, ' assignments added.');
                  })
                  .catch(function (err) {
                    console.error(err);
                  })
                  .finally(function () {
                    scope.pendingExperts = null;
                  });
              });
            scope.$watch(function () {
              return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
              scope.customFullscreen = (wantsFullScreen === true);
            });
          };

          bindListeners();

        }
      };
    });
