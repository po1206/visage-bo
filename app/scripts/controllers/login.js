'use strict';

/**
 * @ngdoc function
 * @name visageBoApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the visageBoApp
 */
angular.module('visageBoApp')
  .controller('LoginCtrl',
    function ($scope,
      $http,
      auth,
      store,
      $location,
      CustomerService,
      Loader,
      TempLocalStorage) {

      var bindListeners = function () {
        $scope.$on('visage.loggedIn', function (event, profile) {
          if (!$scope.profile) {
            updateProfile(profile);
          }
        });

        $scope.$on('visage.promptLogin', function () {
          promptLogin();
        });

      };

      var updateProfile = function (profile) {
        if (profile && !profile.picture) {
          profile.picture = 'images/default-avatar.png';
        }

        $scope.profile = profile;
      };

      var promptLogin = function () {
        $scope.login();
      };

      var originatorEv;

      var checkLogin = function (profile, token) {
        if (profile.app_metadata &&
          profile.app_metadata.roles &&
          profile.app_metadata.roles.indexOf('admin') !== -1) {
          updateProfile(profile);
          store.set('profile', profile);
          store.set('token', token);
          Loader.globalLoader(false);
          $location.path('/jobs');
        }
        else {
          console.error(
            'You are not authorized to access the back office, please contact your administrator');
          $location.path('/login');
        }
      };

      $scope.login = function () {
        auth.signin({
          primaryColor: '#309fc3',
          icon: 'images/logo_square_white_small.png',
          socialBigButtons: true,
          authParams: {
            scope: 'openid email app_metadata'
          }
        }, function (profile, token) {
          checkLogin(profile, token);
        }, function (resp) {
          console.error(resp);
        });
      };

      $scope.signUp = function () {
        auth.signup({
          primaryColor: '#309fc3',
          icon: 'images/logo_square_white_small.png',
          socialBigButtons: true,
          authParams: {
            scope: 'openid email app_metadata'
          }
        }, function (profile, token) {
          checkLogin(profile, token);
        }, function (resp) {
          console.error(resp.data);
        });
      };

      $scope.logout = function () {
        TempLocalStorage.destroy();
        auth.signout();
        store.remove('profile');
        store.remove('token');
        $location.path('/login');
        promptLogin();
      };

      $scope.openMenu = function ($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
      };

      updateProfile(auth.profile);
      bindListeners();

    });
