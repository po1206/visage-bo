'use strict';

/**
 * @ngdoc service
 * @name visageBoApp.Search
 * @description
 * # Search
 * Factory in the visageBoApp.
 */
angular.module('visageBoApp')
  .factory('Search', function (ENV, endpointsApi, cachedResource) {
    var Search = cachedResource(ENV.apiEndpoint + endpointsApi.search + '/:_id',
      {_id: '@_id'},
      {'query': {method: 'GET', cache:null, isArray:false}});

    return Search;
  });
