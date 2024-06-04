'use strict';

/**
 * @ngdoc service
 * @name visageBoApp.preferences
 * @description
 * # preferences
 * Factory in the visageBoApp.
 */
angular.module('visageBoApp')
  .factory('Preference', function (cachedResource, endpointsApi, ENV, auth, $q, $http,removeTrailingEqualsFilter) {

    var Preference = cachedResource(ENV.apiEndpoint +
      endpointsApi.preferences +
      '/:path/:userId', {userId: '@_id'});
    return angular.extend(Preference, {
      getPreferences: function () {
        //Had to do that because when using impersonation the profile is not always loaded
        function profileLoaded(profile) {
          var encodedId = removeTrailingEqualsFilter(btoa(profile.user_id));
          return Preference.get({userId: encodedId}).$promise;
        }
        if (auth.profile) {
          return profileLoaded(auth.profile);
        }
        else {
          console.log(auth);
        }
      },
      isRecruiterProfileCompleted: function (userId) {
        var deferred = $q.defer();
        this.get(userId).$promise.then(function (userPref) {
          if (userPref) {
            if (!userPref.roles || userPref.roles.indexOf('recruiter') === -1) {
              deferred.resolve(false);
            }
            else {
              if (userPref.recruiter.industries.length ===
                0 ||
                userPref.recruiter.jobRoles.length ===
                0 ||
                userPref.recruiter.jobRoles.length ===
                0 ||
                userPref.recruiter.languages.length ===
                0 || !userPref.recruiter.location) {
                deferred.resolve(false);
              }
              deferred.resolve(userPref);
            }
          }
          else {
            deferred.reject({
              message: 'No preferences found'
            });
          }
        }, function (err) {
          deferred.reject(err);
        });
        return deferred.promise;
      },
      isEmployerProfileCompleted: function (userId) {
        var deferred = $q.defer();
        this.get(userId).then(function (userPref) {
          if (userPref) {
            if (!userPref.roles || userPref.roles.indexOf('employer') === -1) {
              deferred.resolve(false);
            }
            else {
              if (!userPref.employer || !userPref.employer.phone || !userPref.employer.company) {
                deferred.resolve(false);
              }
              deferred.resolve(userPref);
            }
          }
          else {
            deferred.reject({
              message: 'No preferences found'
            });
          }
        }, function (err) {
          deferred.reject(err);
        });
        return deferred.promise;
      },
      getRecruitersCount: function (params) {
        params = params || {};
        params = angular.extend(params, {roles: 'recruiter'});
        return $http.get(ENV.apiEndpoint + endpointsApi.preferences + '/count',
          {
            params: params
          });
      },
      getExpertsCount: function (params) {
        params = params || {};
        params = angular.extend(params, {roles: 'expert'});
        return $http.get(ENV.apiEndpoint + endpointsApi.preferences + '/count',
          {
            params: params
          });
      },
      getRecruiters: function (params) {
        params = params || {};
        var extendedParams = angular.extend(params, {roles: 'recruiter'});
        return Preference.query(extendedParams);
      },
      generateRecruitersReportSign: function (searchDateFilter) {
        var params = {
          searchDateFrom: searchDateFilter.searchDateFrom.getTime(),
          searchDateTo: searchDateFilter.searchDateTo.getTime(),
          path: 'recruiters',
          userId: 'signing'
        };
        return Preference.get(params);
      },
      getExperts: function (params) {
        params = params || {};
        var extendedParams = angular.extend(params, {roles: 'expert'});
        return Preference.query(extendedParams);
      },
      getEmployers: function (params) {
        params = params || {};
        var extendedParams = angular.extend(params, {roles: 'employer'});
        return Preference.query(extendedParams);
      }
    });
  });

