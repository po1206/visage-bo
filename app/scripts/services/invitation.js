'use strict';

/**
 * @ngdoc service
 * @name visageBoApp.invitation
 * @description
 * # invitation
 * Factory in the visageBoApp.
 */
angular.module('visageBoApp')
  .factory('Invitation', function (cachedResource, endpointsApi, ENV) {

    var Invitation = cachedResource(ENV.apiEndpoint + endpointsApi.invitations + '/:inviteId',
      {inviteId: '@_id'});
    return angular.extend(Invitation, {});
  });

