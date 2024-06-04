'use strict';

/**
 * @ngdoc service
 * @name visageBoApp.TempLocalStorage
 * @description
 * # TempLocalStorage
 * Factory in the visageBoApp.
 */
angular.module('visageBoApp')
  .factory('TempLocalStorage', function (auth, Cached, store) {


    // Public API here
    return {
      updateProfile: function () {
        store.set('profile', auth.profile);
      },
      save: function () {
        if (auth.profile) {
          store.set('profile', auth.profile);
        }
      },
      load: function () {
      },
      destroy: function () {
        sessionStorage.clear();
        Cached.destroy();
      }
    };
  });
