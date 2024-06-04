'use strict';

/**
 * @ngdoc directive
 * @name visageBoApp.directive:recruiterProfile
 * @description
 * # recruiterProfile
 */
angular.module('visageBoApp')
  .directive('recruiterProfile', function (StaticData, Preference, $q, Loader) {
    return {
      templateUrl: 'views/recruiter-profile.tmpl.html',
      restrict: 'E',
      link: function postLink(scope) {
        function createFilterFor(query) {
          var lowercaseQuery = angular.lowercase(query);
          return function filterFn(location) {
            var cnty = angular.lowercase(location);
            return (cnty.indexOf(lowercaseQuery) !== -1);
          };
        }

        scope.searchIndustry = function (query) {
          return query ? scope.industries.filter(createFilterFor(query)) : [];
        };

        scope.searchLocation = function (query) {
          return query ? scope.locations.filter(createFilterFor(query)) : [];
        };

        scope.setHome(false);

        var calls = [StaticData.init()];

        Loader.globalLoader(true);
        $q.all(calls)
          .then(function (result) {
            scope.locations = result[0][0].data.geonames.map(function (location) {
              return location.countryName;
            });
            scope.jobRoles = result[0][1].data;
            scope.industries = result[0][4].data;
            scope.areas = result[0][7].data;
            scope.availabilities = result[0][8].data;
            Loader.globalLoader(false);
          }, function (err) {
            console.error(err);
            Loader.globalLoader(false);
          });

      }
    };
  });
