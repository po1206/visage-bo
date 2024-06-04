'use strict';

/**
 * @ngdoc service
 * @name visageBoApp.JobOffer
 * @description
 * # JobOffer
 * Factory in the visageBoApp.
 */
angular.module('visageBoApp')
  .factory('RecruiterAssignment', function (cachedResource, endpointsApi, ENV) {

    var RecruiterAssignment = cachedResource(ENV.apiEndpoint +
      '/:path/:jobId' +
      endpointsApi.recruiters +
      '/:subId',
      {subId: '@_id'}, {
        queryByJob: {
          method: 'GET',
          params: {
            path: 'job-offers',
            jobId: '@jobId'
          },
          isArray: true
        },
        queryByRecruiter: {
          url: ENV.apiEndpoint +
          '/:path/:id' +
          endpointsApi.recruiterAssignments,
          method: 'GET',
          params: {
            path: 'users',
            id: '@id'
          },
          isArray: true
        }
      });

    return RecruiterAssignment;
  });
