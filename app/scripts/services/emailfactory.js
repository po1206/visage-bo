'use strict';

/**
 * @ngdoc service
 * @name visageClientApp.EMailFactory
 * @description
 * # EMailFactory
 * Factory in the visageClientApp.
 */
angular.module('visageBoApp')
  .factory('EMailFactory', function (ENV, endpointsApi, $http) {

    // Public API here
    return {
      sendCalibration: function (user, job) {
        return $http.post(ENV.apiEndpoint +
          endpointsApi.mail +
          '/send-calibration',
          {
            'client': user,
            'job': job
          });
      },
      requirementsChanged: function (user, job) {
        return $http.post(ENV.apiEndpoint +
          endpointsApi.mail +
          '/requirements-changed',
          {
            'client': user,
            'job': job
          });
      },
      sendShortlist: function (user, job) {
        return $http.post(ENV.apiEndpoint +
          endpointsApi.mail +
          '/shortlist-ready',
          {
            'client': user,
            'job': job
          });
      },
      sendLonglist: function (user, job) {
        return $http.post(ENV.apiEndpoint +
          endpointsApi.mail +
          '/longlist-ready',
          {
            'client': user,
            'job': job
          });
      },
      requestSourcing: function (job) {
        return $http.post(ENV.apiEndpoint +
          endpointsApi.mail +
          '/request-sourcing',
          {
            'job': job
          });
      },

      stopSourcing: function (job) {
        return $http.post(ENV.apiEndpoint +
          endpointsApi.mail +
          '/stop-sourcing',
          {
            'job': job
          });
      },

      sendMailPaymentRequest: function (user, price, payment, securityData) {
        return $http.post(ENV.apiEndpoint +
          endpointsApi.mail +
          '/payment-request',
          {
            'user': user,
            'temporaryToken': securityData.temporaryToken,
            'iv': securityData.iv,
            'paymentRequest': securityData.temporaryToken,
            'receipt': {
              negociatedPrice: price,
              details: payment
            }
          });
      },
      messageCandidate: function (client, candidate, originEmail, messageContent) {
        return $http.post(ENV.apiEndpoint + endpointsApi.mail + '/message-candidate',
          {
            client: client,
            email: originEmail,
            message: messageContent,
            candidate: candidate
          });
      },
      orderConfirmationMail: function (email, receipt) {
        return $http.post(ENV.apiEndpoint +
          endpointsApi.mail +
          '/order-confirmation',
          {
            'email': email,
            'receipt': receipt
          });
      },
      recruiterValidated: function (recruiter) {
        return $http.post(ENV.apiEndpoint +
          endpointsApi.mail +
          '/recruiter-validated',
          {
            'recruiter': recruiter
          });
      }
    };
  });
