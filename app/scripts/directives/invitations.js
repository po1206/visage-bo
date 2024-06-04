'use strict';

/**
 * @ngdoc directive
 * @name visageBoApp.directive:invitations
 * @description
 * # invitations
 */
angular.module('visageBoApp')
  .directive('invitations', function () {
    return {
      templateUrl: 'views/invitations.tmpl.html',
      restrict: 'E',
      scope: {
        history: '='
      },
      link: function postLink(scope) {
        scope.getRelevantDate = function (invitationEntry) {
          if (invitationEntry.status === 'Sent') {
            return invitationEntry.sentOn;

          }
          else if (invitationEntry.status === 'Confirmed') {
            return invitationEntry.confirmedOn;
          }
        };
      }
    };
  });
