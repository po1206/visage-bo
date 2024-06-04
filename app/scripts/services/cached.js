'use strict';

/**
 * @ngdoc service
 * @name visageBoApp.Cached
 * @description
 * # Cached
 * Provider in the visageBoApp.
 */

angular.module('visageBoApp')
  .factory('Cached', function () {

    var unsubmitteds = [];

    return {
      getUnsubmittedJobOffers: function () {
        return unsubmitteds;
      },
      destroy: function () {
        unsubmitteds = [];
      }
    };
  });
