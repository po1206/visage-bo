'use strict';

/**
 * @ngdoc service
 * @name visageBoApp.JobOffer
 * @description
 * # JobOffer
 * Factory in the visageBoApp.
 */
angular.module('visageBoApp')
  .factory('JobOffer', function (cachedResource, endpointsApi, ENV, $q, auth, Cached) {

    var JobOffer = cachedResource(ENV.apiEndpoint +
      '/:path/:userId' +
      endpointsApi.jobOffers +
      '/:state/:_id',
      {_id: '@_id'}, {
        queryByUser: {
          method: 'GET',
          params: {
            path: 'users',
            userId: '@userId'
          },
          isArray: true
        },
        queryByState: {
          method: 'GET',
          params: {
            state: '@state'
          },
          isArray: true
        }
      });

    return angular.extend(JobOffer,
      {

        getAll: function (parameters) {
          var defered = $q.defer();
          var found = false;
          if (parameters) {
            var unsubmitteds = Cached.getUnsubmittedJobOffers();
            unsubmitteds.forEach(function (unsubmitted) {
              for (var key in parameters) {
                if (parameters.hasOwnProperty(key) &&
                  (unsubmitted[key] === parameters[key])) {
                  found = true;
                  defered.resolve(unsubmitted);
                }
              }
            });
          }
          if (!found) {
            JobOffer.get(parameters).$promise.then(function (result) {
                defered.resolve(result);
              },
              function (result) {
                defered.reject(result);
              });
          }

          return defered.promise;
        },

        getActiveJobs: function () {
          return JobOffer.queryByState({state: 'active'}).$promise;
        },

        getInActiveJobs: function () {
          return JobOffer.queryByState({state: 'inactive'}).$promise;
        }
      }
    );
  });
