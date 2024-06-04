'use strict';

/**
 * @ngdoc directive
 * @name visageBoApp.directive:search
 * @description
 * # search
 */
angular.module('visageBoApp')
  .directive('search', function (Search,$location) {
    return {
      templateUrl: 'views/search.tmpl.html',
      restrict: 'E',
      scope: {},
      link: function postLink(scope, element, attrs) {
        scope.launchSearch = function () {
          if (scope.searchText !== undefined && scope.searchText.length > 2) {
            return Search.query({q: '*' + scope.searchText + '*'})
              .$promise
              .then(function (result) {
                var jobOffers = result.jobOffers.hits.hits;
                var users = result.users.hits.hits;
                var searchResults = jobOffers.map(function (jobOffer) {
                  var location = jobOffer.location;
                  if (jobOffer.city) {
                    location = jobOffer.city + ' - ' + location;
                  }
                  return {
                    id:jobOffer._id,
                    type: 'jobOffer',
                    title: jobOffer.title,
                    subtitle: location
                  };
                });

                return searchResults.concat(users.filter(function (user) {
                    return (user.roles.length > 0);
                  })
                  .map(function (user) {
                    var role = user.roles[0];
                    var subtitle ='';
                    switch(role) {
                      case 'employer':
                        subtitle = user.employer.company || '';
                        break;
                      case 'recruiter':
                        subtitle = user.recruiter.location || '';
                        break;
                      case 'expert':
                        subtitle = user.expert.location || '';
                    }
                    return {
                      //TODO Manage several roles....
                      id:user._id,
                      type: user.roles[0],
                      picture: user.picture,
                      title: user.name,
                      subtitle: subtitle
                    };
                  })
                );
              });
          }
        };

        scope.searchTextChange = function () {

        };

        scope.selectedItemChange = function (item) {

          debugger;
          switch(item.type){
            case 'jobOffer' :
              $location.path('/job-offer/'+item.id);
              break;
            case 'employer' :
              $location.path('/clients/'+item.id);
              break;
            case 'recruiter' :
              $location.path('/recruiters/'+item.id);
              break;
            case 'expert' :
              $location.path('/experts/'+item.id);
              break;
          }

        };

        scope.nocache = true;
      }
    };
  });
