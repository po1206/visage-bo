'use strict';

/**
 * @ngdoc service
 * @name visageBoApp.cachedResource
 * @description
 * # cachedResource
 * Factory in the visageBoApp.
 */
angular.module('visageBoApp')
  .factory('cachedResource', function ($resource, $cacheFactory) {
    var cache = $cacheFactory('resourceCache');
    var keys = [], origPut = cache.put, origRemove = cache.remove;

    cache.put = function (key, value) {
      origPut(key, value);
      if (keys.indexOf(key) === -1) {
        keys.push(key);
      }
    };

    cache.remove = function (key) {
      origRemove(key);
      var indexRemove = keys.indexOf(key);
      if (indexRemove !== -1) {
        keys.splice(indexRemove,1);
      }
    };

    cache.getKeys = function () {
      return keys;
    };

    cache.removeStartsBy = function (keyStarts) {
      cache.remove(keyStarts);
      keys.forEach(function (key) {
        if (key.indexOf(keyStarts) !== -1) {
          cache.remove(key);
        }
      });
    };

    var interceptor = {
      response: function (response) {
        cache.remove(response.config.url);
        if (response.config.method === 'POST') {
          if (response.data._id) {
            cache.remove(response.config.url + '/' + response.data._id);
          }
        }
        if (response.config.method === 'PUT' || response.config.method === 'DELETE') {
          var removeGetCache = response.config.url.split('/').slice(0, -1).join('/') + '/';
          cache.removeStartsBy(removeGetCache);
        }
        return response;
      }
    };

    return function (url, paramDefaults, actions, options) {
      actions = angular.merge({}, {/* default options get, query, etc. */}, actions);

      actions = angular.merge({}, {
        'get': {method: 'GET', cache: cache},
        'query': {method: 'GET', cache: cache, isArray: true},
        'save': {method: 'POST', interceptor: interceptor},
        'update': {method: 'PUT', interceptor: interceptor},
        'remove': {method: 'DELETE', interceptor: interceptor},
        'delete': {method: 'DELETE', interceptor: interceptor}
      }, actions);

      return $resource(url, paramDefaults, actions, options);
    };
  });
