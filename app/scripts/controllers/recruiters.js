'use strict';

/**
 * @ngdoc function
 * @name visageBoApp.controller:UsersCtrl
 * @description
 * # UsersCtrl
 * Controller of the visageBoApp
 */
angular.module('visageBoApp')
  .controller('RecruitersCtrl',
    function ($scope, $location, Preference) {

      $scope.searchDateFilter = {
        searchDateFrom: null,
        searchDateTo: null
      };
      $scope.searchSubmitted = false;

      $scope.searchRecruiters = function () {
        if (!$scope.searchDateFilter.searchDateFrom) {
          $scope.searchDateFilter.searchDateFrom = new Date('1970-1-1');
        }
        if (!$scope.searchDateFilter.searchDateTo) {
          $scope.searchDateFilter.searchDateTo = new Date();
        }
        Preference.generateRecruitersReportSign($scope.searchDateFilter)
          .$promise
          .then(function(urlObject) {
            $scope.csvDownloadUrl = urlObject.signedUrl;
          });
        $scope.searchSubmitted = true;
      };

      $scope.$watch('searchDateFilter.searchDateFrom', function(newValue, oldValue) {
        if (newValue && !oldValue) return;
        $scope.searchSubmitted = false;
        $scope.csvDownloadUrl = null;
      });

      $scope.$watch('searchDateFilter.searchDateTo', function(newValue, oldValue) {
        if (newValue && !oldValue) return;
        $scope.searchSubmitted = false;
        $scope.csvDownloadUrl = null;
      });

      $scope.inviteRecruiter = function () {
        $location.path('/recruiters/invite');
      };

      $scope.validatedOnly = false;

    });
