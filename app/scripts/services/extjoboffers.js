'use strict';

/**
 * @ngdoc service
 * @name visageBoApp.ExtJobOffers
 * @description
 * # ExtJobOffers
 * Factory in the visageBoApp.
 */
angular.module('visageBoApp')
  .factory('ExtJobOffers', function ($http, ENV, endpointsApi) {

    return {
      getExternalOffers: function () {
        return $http.get(ENV.apiEndpoint + endpointsApi.extJobOffers);
      },
      getLatestExternalOffers: function (createdAfter) {
        return $http.get(ENV.apiEndpoint + endpointsApi.extJobOffers + '/latest',
          {
            params: {
              created_after: createdAfter
            }
          });
      },
      getExternalOffer: function (shortCode) {
        return $http.get(ENV.apiEndpoint + endpointsApi.extJobOffers + '/' + shortCode);
      },
      getExternalOfferRecruiters: function (shortCode) {
        return $http.get(ENV.apiEndpoint +
          endpointsApi.extJobOffers +
          '/' +
          shortCode +
          '/recruiters');
      }
    };
  });
