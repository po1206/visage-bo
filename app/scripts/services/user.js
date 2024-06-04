'use strict';

/**
 * @ngdoc service
 * @name visageBoApp.Users
 * @description
 * # Users
 * Factory in the visageBoApp.
 */
angular.module('visageBoApp')
  .factory('User', function (ENV, endpointsApi, cachedResource) {

    var User = cachedResource(ENV.apiEndpoint + endpointsApi.users + '/:_id',
      {_id: '@_id'});

    return User;
  });
