'use strict';

/**
 * @ngdoc service
 * @name visageBoApp.CustomerService
 * @description
 * # CustomerService
 * Service in the visageBoApp.
 */
angular.module('visageBoApp')
  .service('CustomerService',
    function (auth, ThirdParties, $http, auth0constants, TempLocalStorage) {
      this.updateContact = function (status) {
        var user = auth.profile;
        user.leadStatus = status;
        return $http.get(ThirdParties.zappier.updateLead, {
          skipAuthorization: true,
          params: user
        });
      };

      this.updateUserData = function (data) {
        angular.merge(auth.profile, data);
        TempLocalStorage.updateProfile();
        return $http({
          url: 'https://' +
          auth0constants.domain +
          '/api/v2/users/' +
          auth.profile.user_id,
          method: 'PATCH',
          data: data
        });
      };

      this.getCurrentCompany = function () {
        var company;
        if (auth.profile.positions) {
          var positions = auth.profile.positions.values;
          if (positions) {
            positions.forEach(function (position) {
              if (position.isCurrent) {
                company = position.company.name;
              }
            });
          }
        }
        return company;
      };
    });
