'use strict';

/**
 * @ngdoc function
 * @name visageBoApp.controller:InviteExpertCtrl
 * @description
 * # InviteRecruiterCtrl
 * Controller of the visageBoApp
 */
angular.module('visageBoApp')
  .controller('InviteExpertCtrl',
    function ($scope,
      Invitation,
      $http,
      ENV,
      endpointsApi,
      $mdToast) {

      var showToast = function (text) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(text)
            .position('top right')
            .hideDelay(3000)
        );
      };

      var invitationEMail = function (invitation) {
        return $http.post(ENV.apiEndpoint +
          endpointsApi.mail +
          '/send-expert-invitation',
          invitation);
      };

      $scope.sendExpertsInvitations = function () {
        function invitationsSent() {
          return allResponses === invitationEmails.length;
        }

        var invitationEmails = $scope.invitationEmails.split(/,|;/);
        if (invitationEmails.length > 0) {
          var allResponses = 0;
          var successes = [];
          var sentOn = new Date();
          $scope.pendingInvites = 'indeterminate';
          _.uniq(invitationEmails)
            .forEach(function (email) {
              var invitation = new Invitation();
              invitation.email = email.trim().toLowerCase();
              invitation.sentOn = sentOn;
              invitation.status = 'Sent';
              invitation.role = 'expert';
              invitation.$save()
                .then(function (result) {
                  var invitation = result.resource;
                  $scope.invitations.push(invitation);
                  invitationEMail(invitation);
                })
                .catch(function (err) {
                  console.error(err);
                })
                .finally(function () {
                  allResponses++;
                  if (invitationsSent()) {
                    $scope.pendingInvites = null;
                    showToast('Invitations sent');
                    console.log('Sent:');
                    console.table(successes);
                  }
                });
            });
        }

      };

      var alreadyConfirmed;

      Invitation.query({'role' : 'expert'})
        .$promise
        .then(function (invitations) {
          $scope.invitations = invitations;
          alreadyConfirmed = _.uniq(invitations
            .filter(function (invitation) {
              return invitation.status ===
                'Confirmed';
            })
            .map(function (invitation) {
              return invitation.email;
            }));
        });
    });
