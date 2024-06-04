'use strict';

/**
 * @ngdoc service
 * @name visageBoApp.UserFactory
 * @description
 * # UserFactory
 * Factory in the visageBoApp.
 */
angular.module('visageBoApp')
  .factory('UserFactory', function () {

    var user = {
      name: '',
      email: '',
      title: '',
      jobTitle: '',
      company: '',
      phone: '',
      employer: null
    };

    // Public API here
    return {
      getUser: function () {
        return user;
      },
      setUser: function (newUser) {
        user = newUser;
      },
      destroy: function () {
        user = null;
      }
    };
  });
