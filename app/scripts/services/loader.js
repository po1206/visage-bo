'use strict';

/**
 * @ngdoc service
 * @name visageBoApp.Loader
 * @description
 * # Loader
 * Factory in the visageBoApp.
 */
angular.module('visageBoApp')
  .factory('Loader', function ($rootScope) {

    // Public API here
    return {
      globalLoader: function (loading) {
        if (loading) {
          $rootScope.$broadcast('loading:show');
        }
        else {
          $rootScope.$broadcast('loading:hide');
        }
      },
      refreshScreen: function () {
        this.globalLoader(true);
        $rootScope.refresh = true;
      }
    };
  });
