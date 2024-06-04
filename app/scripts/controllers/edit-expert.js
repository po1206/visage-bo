'use strict';

/**
 * @ngdoc function
 * @name visageBoApp.controller:EditExpertCtrl
 * @description
 * # EditExpertCtrl
 * Controller of the visageBoApp
 */
angular.module('visageBoApp')
  .controller('EditExpertCtrl', function ($scope,
    $routeParams,
    Preference,
    $mdDialog,
    $location,
    $q,
    Loader,
    $mdToast,
    ExpertAssignment) {

    var showToast = function (text) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .position('top right')
          .hideDelay(3000)
      );
    };

    var refreshAssignments = function () {
      return ExpertAssignment.queryByExpert({id: $routeParams.expertId})
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
          $scope.expertAssignments = assignments;
        });
    };

    var refreshPreferences = function () {
      return Preference.get({userId: $routeParams.expertId})
        .$promise
        .then(function (user) {
          $scope.user = user;
        });

    };

    var showConfirm = function () {
      var confirm = $mdDialog.confirm()
        .title('Remove expert')
        .textContent(
          'Do you want to remove this expert?')
        .ariaLabel('Remove')
        .ok('Please do it!')
        .cancel('Nope!');
      return $mdDialog.show(confirm);
    };


    $scope.removeExpert = function () {
      showConfirm().then(function () {
        var index = $scope.user.roles.indexOf('expert');
        if (index > -1) {
          $scope.user.roles.splice(index, 1);
        }
        if ($scope.user.roles.length === 0) {
          $scope.user.$delete().then(function () {
            $location.path('/experts');
          });
        }
        else {
          $scope.user.expert.industries = [];
          $scope.user.expert.jobRoles = [];
          delete $scope.user.expert.location;

          $scope.saveProfile().then(function () {
            $location.path('/experts');
          });
        }
      });
    };

    $scope.expertUpdated = function () {
      showToast('Expert updated');
    };

    $scope.saveProfile = function () {
      $scope.pending = 'indeterminate';
      //Workaround because autocomplete directive save null values when empty
      $scope.user.expert.industries =
        $scope.user.expert.industries.filter(function (industry) {
          return !!industry;
        });
      return $scope.user.$update().then(function () {
          $scope.expertUpdated();
        }, function (err) {
          console.error(err);
        })
        .finally(function () {
          $scope.pending = false;
        });
    };

    if ($routeParams.expertId) {
      Loader.globalLoader(true);
      $q.all([refreshPreferences(), refreshAssignments()])
        .finally(function () {
          Loader.globalLoader(false);
        });
    }
  });
