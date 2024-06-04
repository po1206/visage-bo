'use strict';

/**
 * @ngdoc function
 * @name visageBoApp.controller:EditrecruiterCtrl
 * @description
 * # EditrecruiterCtrl
 * Controller of the visageBoApp
 */
angular.module('visageBoApp')
  .controller('EditRecruiterCtrl', function ($scope,
    $routeParams,
    Preference,
    $mdDialog,
    $location,
    $q,
    Loader,
    $mdToast,
    EMailFactory,
    RecruiterAssignment) {

    var showToast = function (text) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .position('top right')
          .hideDelay(3000)
      );
    };

    var showConfirm = function () {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .title('Remove recruiter')
        .textContent(
          'Do you want to remove this recruiter?')
        .ariaLabel('Remove')
        .ok('Please do it!')
        .cancel('Nope!');
      return $mdDialog.show(confirm);
    };

    var refreshAssignments = function () {
      return RecruiterAssignment.queryByRecruiter({id: $routeParams.recruiterId})
        .$promise
        .then(function (assignments) {
          assignments = assignments
            .filter(function (assignment) {
              return !!assignment.job._id;
            })
            .map(function (assignment) {
              assignment.fromNow =
                moment(new Date())
                  .diff(moment(new Date(assignment.assigned)), 'days');
              return assignment;
            });
          $scope.recruiterAssignments = assignments;
        });
    };

    var refreshPreferences = function () {
      return Preference.get({userId: $routeParams.recruiterId})
        .$promise
        .then(function (user) {
          $scope.user = user;
        });

    };

    $scope.removeRecruiter = function () {
      showConfirm().then(function () {
        var index = $scope.user.roles.indexOf('recruiter');
        if (index > -1) {
          $scope.user.roles.splice(index, 1);
        }
        if ($scope.user.roles.length === 0) {
          $scope.user.$delete().then(function () {
            $location.path('/recruiters');
          });
        }
        else {
          $scope.user.recruiter.industries = [];
          $scope.user.recruiter.languages = [];
          $scope.user.recruiter.jobRoles = [];
          delete $scope.user.recruiter.location;

          $scope.saveProfile().then(function () {
            $location.path('/recruiters');
          });
        }
      });
    };

    $scope.recruiterUpdated = function () {
      showToast('Recruiter updated');
    };

    $scope.saveProfile = function () {
      $scope.pending = 'indeterminate';
      //Workaround because autocomplete directive save null values when empty
      $scope.user.recruiter.industries =
        $scope.user.recruiter.industries.filter(function (industry) {
          return !!industry;
        });
      return $scope.user.$update().then(function () {
          $scope.recruiterUpdated();
        }, function (err) {
          console.error(err);
        })
        .finally(function () {
          $scope.pending = false;
        });
    };

    $scope.grantRecruiter = function () {
      $scope.user.recruiter.validated = true;
      $scope.saveProfile()
        .then(function () {
          EMailFactory.recruiterValidated($scope.user);
        });
    };

    $scope.denyRecruiter = function () {
      $scope.user.recruiter.validated = false;
      $scope.saveProfile();
    };

    if ($routeParams.recruiterId) {
      Loader.globalLoader(true);
      $q.all([refreshPreferences(), refreshAssignments()])
        .finally(function () {
          Loader.globalLoader(false);
        });
    }
  });
