'use strict';

/**
 * @ngdoc directive
 * @name visageBoApp.directive:editJob
 * @description
 * # editJob
 */
angular.module('visageBoApp')
  .directive('editJob', function ($http, ENV, endpointsApi, $window, Upload, x2js, StaticData) {
    return {
      templateUrl: 'views/edit-job.tmpl.html',
      restrict: 'E',
      link: function postLink(scope) {

        function initJob() {
          if(!scope.job._id) {
            scope.job.employmentStatus = scope.datasets.employmentStatus[0];
            scope.job.employmentType = scope.datasets.employmentType[0];
            scope.job.status = scope.datasets.jobStatus[0];
          }
        }

        function initEditForm() {
          return StaticData.init()
            .then(function (result) {
              scope.datasets = {
                jobStatus: result[6].data,
                jobRoles: result[1].data,
                industries: result[4].data,
                employmentStatus: result[3].data,
                employmentType: result[2].data,
                jobLocations: result[0].data.geonames.map(function (location) {
                  return location.countryName;
                })
              };
              scope.datasets.salaryRange = [];
              result[5].data.forEach(function (category) {
                scope.datasets.salaryRange = scope.datasets.salaryRange.concat(category.ranges);
              });
            });
        }

        function bindListeners() {
          scope.$watch('file', function () {
            scope.uploadFile(scope.file);
          });
          scope.$on('tab.selected', function (event,tab) {
            if(tab === 'edit' && notLoaded) {
              scope.loadingForm = 'indeterminate';
              initEditForm()
                .then(function () {
                  notLoaded = false;
                })
                .finally(function () {
                  scope.loading = null;
                });
            }
          });
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
          var lowercaseQuery = angular.lowercase(query);
          return function filterFn(location) {
            var cnty = angular.lowercase(location);
            return (cnty.indexOf(lowercaseQuery) !== -1);
          };
        }

        var notLoaded = true;

        scope.searchTextLocation = null;

        scope.jobRoleChanged = function () {
          console.log(scope.currentJobFormData);
        };

        scope.querySearch = function (query) {
          var results = query ?
            scope.datasets.jobLocations.filter(createFilterFor(query)) :
            [];
          return results;
        };

        scope.updateDesc = function () {
          scope.description = scope.hasDescription();
        };
        scope.uploadFile = function (file, errFiles) {
          if (file) {
            scope.f = file;
            scope.errFile = errFiles && errFiles[0];

            $http.post(ENV.apiEndpoint + endpointsApi.media + '/signing', {
                mediaType: 'JobDescription',
                filename: file.name,
                type: file.type
              })
              .success(function (result) {
                file.upload = Upload.upload({
                  url: result.url, //s3Url
                  transformRequest: function (data,
                    headersGetter) {
                    var headers = headersGetter();
                    delete headers.Authorization;
                    delete headers.authorization;
                    return data;
                  },
                  skipAuthorization: true,
                  fields: result.fields, //credentials
                  method: 'POST',
                  file: file
                });

                file.upload.success(function (response) {
                    var data = x2js.xml_str2json(response);
                    scope.uploadSucceeded({
                      identifier: data.PostResponse.Key,
                      originalFilename: file.name
                    });
                  })
                  .error(function (response) {
                    if (response.status > 0) {
                      scope.errorMsg = response.status + ': ' + response.data;
                    }
                  })
                  .progress(function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                      evt.loaded / evt.total));
                  });

              })
              .error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
              });
          }

        };

        scope.uploadSucceeded = function (result) {
          scope.job.descriptionFile = {
            originalFilename: result.originalFilename,
            identifier: result.identifier
          };
          scope.file.progress = undefined;
        };

        scope.download = function (file) {
          $window.open(ENV.apiEndpoint +
            endpointsApi.media +
            '/download/JobDescription/' +
            file.identifier +
            '?filename=' +
            file.originalFilename, '_blank');
        };

        scope.removeFileDesc = function (file, mediaType) {
          scope.pendingDeletion = 'indeterminate';
          $http.delete(ENV.apiEndpoint +
              endpointsApi.media +
              '/' +
              mediaType +
              '/' +
              file.identifier)
            .then(function () {
              scope.pendingDeletion = null;
              scope.job.descriptionFile = null;
            }, function (err) {
              console.log(err.data);
            });
        };

        bindListeners();
        initJob();
      }
    };
  });
