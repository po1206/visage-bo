'use strict';

/**
 * @ngdoc function
 * @name visageBoApp.controller:PaymentCtrl
 * @description
 * # PaymentCtrl
 * Controller of the visageBoApp
 */
angular.module('visageBoApp')
  .controller('ClientsCtrl',
    function ($scope,
      Preference,
      Loader,
      removeTrailingEqualsFilter,
      User,
      $location) {
      $scope.usersById = {};
      var employers;

      var bindListeners = function () {
        $scope.$watch('searchClient', function () {
          if (employers && $scope.searchClient !== undefined) {
            var lowCased = $scope.searchClient.toLowerCase();
            $scope.employers = employers.filter(function (employer) {
              employer.email = employer.email || '';
              employer.name = employer.name || '';
              employer.employer.company = employer.employer.company || '';
              return (lowCased ===
              '' ||
              employer.email.toLowerCase().indexOf(lowCased) !== -1 ||
              employer.name.toLowerCase().indexOf(lowCased) !== -1 ||
              employer.employer.company.toLowerCase().indexOf(lowCased) !== -1 );
            });
          }
        });
      };

      var loadPreferences = function () {
        return Preference.getEmployers().$promise;
      };

      $scope.viewClient = function (employer) {
        $location.path('/clients/' + removeTrailingEqualsFilter(employer._id));
      };

      Loader.globalLoader(true);
      loadPreferences()
        .then(function (loadedEmployers) {
          $scope.employers = employers = loadedEmployers;
        })
        .catch(function (err) {
          console.error(err);
        })
        .finally(function () {
          Loader.globalLoader(false);
        });

      bindListeners();
    });
