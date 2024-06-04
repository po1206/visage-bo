'use strict';

/**
 * @ngdoc function
 * @name visageBoApp.controller:ClientStatusCtrl
 * @description
 * # ClientStatusCtrl
 * Controller of the visageBoApp
 */
angular.module('visageBoApp')
  .controller('ClientStatusCtrl',
    function ($scope, $q, $routeParams, Loader, Preference, $mdDialog, $location) {

      var showConfirmDeleteClient = function () {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
          .title('Remove client')
          .textContent(
            'Deleting a client cannot be undone. Are you sure ?')
          .ariaLabel('Remove client')
          .ok('Yes')
          .cancel('No');
        return $mdDialog.show(confirm);
      };

      $scope.removeClient = function () {
        showConfirmDeleteClient()
          .then(function (confirm) {
            if (confirm) {
              Loader.globalLoader(true);
              var indexEmployer = $scope.user.roles.indexOf("employer");
              $scope.user.roles.splice(indexEmployer,1);
              $scope.user.employer = {
                payments : [],
                phone:null,
                company:null
              };
              return $scope.user.$update()
                .$promise;
            }
          })
          .then(function () {
            $location.path("/clients");
          })
          .finally(function () {
            Loader.globalLoader(false);
          });
      };

      if ($routeParams.clientId) {
        Loader.globalLoader(true);
        Preference.get({
          userId: $routeParams.clientId
        }).$promise
          .then(function (user) {
            $scope.user = user;
          }, function (err) {
            console.error(err);
          })
          .finally(function () {
            Loader.globalLoader(false);
          });
      }

    });

