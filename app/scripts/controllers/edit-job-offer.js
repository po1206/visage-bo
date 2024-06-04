'use strict';

/**
 * @ngdoc function
 * @name visageBoApp.controller:EditjobofferCtrl
 * @description
 * # EditjobofferCtrl
 * Controller of the visageBoApp
 */
angular.module('visageBoApp')

  .controller('EditJobOfferCtrl', function ($scope,
    $routeParams,
    Loader,
    $q,
    JobOffer,
    removeTrailingEqualsFilter,
    User,
    auth,
    $location,
    Preference,
    $mdToast,
    EMailFactory,
    ExtJobOffers,
    $mdDialog,
    $http,
    ENV,
    localApi) {

    $scope.setHome(false);
    $scope.setProgress(null);

    var tabs = {
      edit: 0,
      campaign: 1,
      pipeline: 2
    };

    var showToast = function (text) {
      return $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .position('top right')
          .hideDelay(3000)
      );
    };

    var chooseSelectedTab = function () {
      if ($scope.job.status === 'Approved' || $scope.job.status === 'Calibrated') {
        $scope.selectedTab = tabs.pipeline;
      }
      else if ($scope.job.status ===
        'Validated' ||
        $scope.job.status ===
        'LonglistReady' ||
        $scope.job.status ===
        'ShortlistReady') {
        if ($scope.job.sourcing) {
          $scope.selectedTab = tabs.pipeline;
        }
        else {
          $scope.selectedTab = tabs.campaign;
        }
      }
      else {
        $scope.selectedTab = tabs.edit;
      }
    };

    var refreshData = function () {

      if ($routeParams.jobId) {
        Loader.globalLoader(true);
        return JobOffer.getAll({_id: $routeParams.jobId})
          .then(function (job) {
            if (job) {
              $scope.existingJob = true;
              //copy existing job to not modify it without validation
              $scope.job = job;
              //Keep original requirements in memory so we can see if it has changed
              $scope.originalRequirements =
                angular.merge({}, $scope.job.requirements);

              $scope.alreadySubmitted = ($scope.job.status === 'Submitted');
              if ($scope.job.syncedWith) {
                $scope.extCreatedAt =
                  moment($scope.job.syncedWith.created_at).format('LLL');
                $scope.refreshExtRecruiters();
              }
              if (!$scope.job.requirements) {
                $scope.job.requirements = {};
                $scope.job.requirements.skills = [];
              }
              Preference.get({
                userId: $scope.job.employer_id
              }).$promise
                .then(function (user) {
                  $scope.user = user;
                })
                .catch(function (err) {
                  console.error(err);
                });
            }
          })
          .finally(function () {
            Loader.globalLoader(false);
          });
      }
      else {
        $scope.job = new JobOffer();
        $scope.job.employer_id =
          removeTrailingEqualsFilter(btoa(auth.profile.user_id));
        $scope.job.requirements = {};
        return true;
      }
    };

    $scope.genericSave = function () {
      $scope.submitted = true;
      var deferred = $q.defer();
      if ($scope.job._id) {
        $scope.job.$update().then(function (job) {
          deferred.resolve(job.resource);
        }, function (err) {
          deferred.reject(err);
        });
      }
      else {
        $scope.job.$save().then(function (job) {
          job.resource.isNew = true;
          deferred.resolve(job.resource);
        }, function (err) {
          deferred.reject(err);
        });
      }

      return deferred.promise;
    };

    var showConfirmNotify = function () {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .title('Requirements changed')
        .textContent('Candidates requirements have been updated.' +
          ' Do yo want to send an update to the client and recruiters working on this job?')
        .ariaLabel('Requirements changed')
        .ok('Please do it!')
        .cancel('Nope !');
      return $mdDialog.show(confirm);
    };

    var notifyForUpdates = function () {
      var diffs = DeepDiff($scope.originalRequirements,
        $scope.job.requirements);
      if (diffs && diffs.length > 0) {
        showConfirmNotify()
          .then(function () {
            return EMailFactory.requirementsChanged($scope.user, $scope.job);
          })
          .then($scope.messageSent);
      }

    };

    $scope.tabSelected = function (name) {
      $scope.$broadcast('tab.selected', name);
    };

    $scope.hasDescription = function () {
      return $scope.job.description || $scope.job.descriptionFile
    };

    $scope.saveJob = function () {
      $scope.pending = 'indeterminate';
      return $scope.genericSave().then(function () {
          $scope.jobSaved();
        }, function (err) {
          console.error('There was an error when trying to save the job');
          console.error(err);
        })
        .finally(function () {
          $scope.pending = null;
        });
    };

    $scope.jobSaved = function () {
      if ($scope.job.isNew) {
        $location.path('/jobs');
      }
      else {
        notifyForUpdates();
        refreshData();
      }

      return showToast('Job saved');
    };

    $scope.messageSent = function () {
      return showToast('Message sent');
    };

    /**
     * Refresh external recruiters and check if they match with the invited recruiters on the
     * job
     */
    $scope.refreshExtRecruiters = function () {
      $scope.pendingRecruiters = 'indeterminate';
      ExtJobOffers.getExternalOfferRecruiters($scope.job.syncedWith.shortcode)
        .then(function (result) {
          $scope.extRecruiters = result.data.recruiters;
          if ($scope.recruiterAssignments) {
            $scope.extRecruiters.forEach(function (extRecruiter) {
              $scope.recruiterAssignments = $scope.recruiterAssignments.map(function (assignment) {
                if (assignment.recruiter.email === extRecruiter.email) {
                  assignment.confirmed = true;
                }
                return assignment;
              });
            });
          }
        })
        .finally(function () {
          $scope.pendingRecruiters = null;
        });

    };

    $scope.refreshData = function () {
      return refreshData();
    };

    $scope.isJobReady = function () {
      return ($scope.job &&
      $scope.job._id &&
      $scope.job.launched &&
      ($scope.job.status ===
      'Validated' ||
      $scope.job.status ===
      'ShortlistReady'));
    };

    $scope.removeJob = function (job) {
      $scope.pending = 'indeterminate';
      if (job) {
        job.$delete().then(function () {
            $location.path('/jobs');
          }, function (err) {
            console.error('Unable to delete the job offer');
            console.error(err);
          })
          .finally(function () {
            $scope.pending = null;
          });
      }

    };

    $scope.back = function () {
      $location.path('/jobs');
    };

    $scope.selectedTab = -1;
    $http.get(localApi.jobStatus)
      .then(function (response) {
        $scope.statuses = response.data;
      });
    refreshData()
      .then(chooseSelectedTab);

  });

