'use strict';

/**
 * @ngdoc service
 * @name visageBoApp.JobOffer
 * @description
 * # JobOffer
 * Factory in the visageBoApp.
 */
angular.module('visageBoApp')
  .factory('ExpertAssignment', function (cachedResource, endpointsApi, ENV) {

    var ExpertAssignment = cachedResource(ENV.apiEndpoint +
      '/:path/:jobId' +
      endpointsApi.experts +
      '/:_id',
      {_id: '@_id'}, {
        queryByJob: {
          method: 'GET',
          params: {
            path: 'job-offers',
            jobId: '@jobId'
          },
          isArray: true
        },
        clearByJob: {
          method: 'DELETE',
          params: {
            path: 'job-offers',
            jobId: '@jobId'
          }
        },
        queryByExpert: {
          url: ENV.apiEndpoint +
          '/:path/:id' +
          endpointsApi.expertAssignments,
          method: 'GET',
          params: {
            path: 'users',
            id: '@id'
          },
          isArray: true
        }
      });

    return ExpertAssignment;
  });
