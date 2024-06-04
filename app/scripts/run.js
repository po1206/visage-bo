'use strict';

/**
 * Created by manu on 1/5/16.
 */
angular.module('visageBoApp')
  .run(function ($rootScope,
    TempLocalStorage,
    $location,
    $window,
    auth,
    store,
    jwtHelper,
    $mdSidenav,
    $mdMedia) {

    function bindHeaderScrollFeature() {
      window.addEventListener('scroll', function () {
        var distanceY = window.pageYOffset || document.documentElement.scrollTop,
          shrinkOn = 100,
          headerElem = angular.element(document.querySelector('header')),
          fabs = angular.element(document.querySelector('.md-fab'));

        if (distanceY > shrinkOn) {
          headerElem.addClass('smaller');
          fabs.addClass('higher');
        }
        else {
          headerElem.removeClass('smaller');
          fabs.removeClass('higher');
        }
      });
    }

    function bindListeners() {
      $rootScope.$on('loading:show', function () {
        $rootScope.globalLoading = true;
      });
      $rootScope.$on('loading:hide', function () {
        $rootScope.globalLoading = false;
      });
    }

    bindHeaderScrollFeature();
    bindListeners();
    $rootScope.globalLoading = false;

    $rootScope.setProgress = function (value) {
      $rootScope.progress = value;
    };

    $rootScope.setHome = function (isHome) {
      $rootScope.home = isHome;
    };

    $rootScope.setEmail = function (email) {
      $rootScope.email = email;
    };

    $rootScope.isAuthenticated = function () {
      return auth.isAuthenticated;
    };

    // This events gets triggered on refresh or URL change
    $rootScope.$on('$locationChangeStart', function () {
      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          if (!auth.isAuthenticated) {
            auth.authenticate(store.get('profile'), token).then(function (profile) {
              $rootScope.$broadcast('visage.loggedIn', profile);
            });
          }
        }
        else {
          // Either show the login page or use the refresh token to get a new idToken
          $location.path('/login');
        }
      }
    });

    $rootScope.$on('$routeChangeStart', function () {
      TempLocalStorage.save();
    });

    $rootScope.toggleSide = function (navID) {
      $mdSidenav(navID)
        .toggle()
        .then(function () {
          //$log.debug('toggle ' + navID + ' is done');
        });
    };

    $rootScope.goHome = function () {
      $location.path('/jobs');
    };

    $rootScope.isGTMD = function () {
      return $mdMedia('gt-md');
    };

    TempLocalStorage.load();

    //Authentication events
    // This hooks al auth events to check everything as soon as the app starts
    auth.hookEvents();
  });
