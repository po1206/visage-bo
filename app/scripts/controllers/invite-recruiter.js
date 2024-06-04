'use strict';

/**
 * @ngdoc function
 * @name visageBoApp.controller:InviteRecruiterCtrl
 * @description
 * # InviteRecruiterCtrl
 * Controller of the visageBoApp
 */
angular.module('visageBoApp')
  .controller('InviteRecruiterCtrl',
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
          '/send-recruiter-invitation',
          invitation);
      };

      $scope.getRelevantDate = function (invitationEntry) {
        if (invitationEntry.status === 'Sent') {
          return invitationEntry.sentOn;

        }
        else if (invitationEntry.status === 'Confirmed') {
          return invitationEntry.confirmedOn;
        }
      };

      $scope.sendRecruitersInvitations = function () {
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
              invitation.role = 'recruiter';
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


      $scope.importFromWorkable = function () {
        $scope.pendingInvites = 'indeterminate';
        $http.get(ENV.apiEndpoint + endpointsApi.extRecruiters)
          .then(function (results) {
            var allRecruiters = results.data.candidates;
            $scope.invitationEmails = _.uniq(allRecruiters
              .filter(function (extRecruiter) {
                return !extRecruiter.disqualified && alreadyConfirmed.indexOf(
                    extRecruiter.email) === -1;
              })
              .map(function (extRecruiter) {
                return extRecruiter.email;
              })).join(',');
          })
          .catch(function (err) {
            console.error(err);
            console.error('Unable to retrieve recruiters from external source');
          })
          .finally(function () {
            $scope.pendingInvites = null;
          });

      };

      var alreadyConfirmed;

      Invitation.query({'role' : 'recruiter'})
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
