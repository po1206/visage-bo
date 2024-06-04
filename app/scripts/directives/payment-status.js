'use strict';

/**
 * @ngdoc directive
 * @name visageBoApp.directive:paymentstatus
 * @description
 * # paymentstatus
 */
angular.module('visageBoApp')
  .directive('paymentStatus',
    function ($http,
      $mdToast,
      endpointsApi,
      ENV,
      $routeParams,
      $mdDialog,
      Loader,
      $q,
      OrderService,
      $location,
      EMailFactory) {
      return {
        templateUrl: 'views/payment-status.tmpl.html',
        restrict: 'E',
        scope: {
          user: '='
        },
        link: function postLink(scope) {

          var bindListeners = function () {
            scope.$watch('user', function (newValue) {
              if (newValue) {
                scope.emailPaymentIssuer = newValue.email;
              }
            });

          };

          var addPayment = function (status) {
            var deferred = $q.defer();
            retrieveToken()
              .then(function (resp) {
                var securityData = resp.data;
                if (!scope.user.employer.payments) {
                  scope.user.employer.payments = [];
                }
                var sentDate = new Date();
                scope.payment._id = securityData.temporaryToken;

                scope.payment.sentOn = sentDate;
                scope.payment.status = status;
                if (status === 'Paid') {
                  scope.payment.paidOn = sentDate;
                }
                scope.user.employer.payments.push(scope.payment);
                scope.user.$update()
                  .then(function (user) {
                      deferred.resolve([securityData, user]);
                    },
                    function (err) {
                      throw err;
                    });
              })
              .catch(function (err) {
                deferred.reject(err);
              });
            return deferred.promise;

          };

          var retrieveToken = function () {
            return $http.get(ENV.apiEndpoint + endpointsApi.secretPaymentToken,
              {
                params: {
                  'user_id': $routeParams.clientId,
                  'price': parseInt(scope.priceAfterDiscount, 10) * 100
                }
              });
          };

          var showPrompt = function () {
            // Appending dialog to document.body to cover sidenav in docs app
            //FIXME For now we can t set a default value for the prompt. Planned in
            // 1.3.0 https://github.com/angular/material/issues/7046 var confirm =
            // $mdDialog.prompt() .title('Send receipt?') .textContent('Do you want
            // to send the receipt to the client for USD '+scope.negociatedPrice+'
            // ?') .placeholder('Payment issuer email') .ariaLabel('Payment issuer
            // email') .ok('Send!') .cancel('Nope, just validate the payment!');

            var confirm = $mdDialog.confirm()
              .title('Send receipt?')
              .textContent('Do you want to send the receipt to ' +
                scope.emailPaymentIssuer +
                ' for USD ' +
                scope.priceAfterDiscount +
                ' ?')
              .ariaLabel('Payment issuer email')
              .ok('Send')
              .cancel('Nope just validate');
            return $mdDialog.show(confirm);
          };

          var showToast = function (text) {
            $mdToast.show(
              $mdToast.simple()
                .textContent(text)
                .position('top right')
                .hideDelay(3000)
            );
          };

          scope.priceChanged = function () {
            var demo = function (resp) {
              fx.rates = resp.data.rates;
              var rate = fx(scope.negociatedPrice).from('USD').to('AED');
              scope.priceInAED = rate.toFixed(4);
            };

            //FIXME does not provide AED
            $http.get('https://api.fixer.io/latest')
              .then(demo);

            scope.payment.discount = scope.payment.discount || 0;
            scope.priceAfterDiscount = scope.payment.price - scope.payment.discount;
            scope.discountRate =
              Math.round((scope.payment.discount / scope.payment.price) * 10000) /
              100;
          };

          scope.validatePayment = function (requestForm) {
            if (requestForm.$valid) {
              var sendEmail = false, email = null;
              showPrompt(scope.user)
                .then(function (newEmail) {
                  email = scope.emailPaymentIssuer;
                  sendEmail = newEmail;
                })
                .finally(function () {
                  addPayment('Paid')
                    .then(function () {
                      OrderService.updatePayment($routeParams.clientId,
                        scope.paidOn,
                        sendEmail,
                        email,
                        scope.payment);
                      $location.path('/clients');
                    });
                });
            }
            else {
              scope['payment-request'].$setSubmitted();
            }
          };

          scope.getRelevantDate = function (paymentEntry) {
            if (paymentEntry.status === 'Sent') {
              return paymentEntry.sentOn;

            }
            else if (paymentEntry.status === 'Paid') {
              return paymentEntry.paidOn;
            }
          };

          scope.sendPaymentRequest = function () {
            Loader.globalLoader(true);
            addPayment('Sent')
              .then(function (paymentAdded) {
                var securityData = paymentAdded[0];
                if (securityData.temporaryToken) {
                  return EMailFactory.sendMailPaymentRequest(scope.user,
                    scope.priceAfterDiscount,
                    scope.payment,
                    securityData);
                }
              })
              .then(function () {
                showToast('Payment request sent');
              })
              .catch(function (err) {
                console.error(
                  'BACKEND ERROR - Currently not able to send the payment request');
                console.error(err);
              })
              .finally(function () {
                Loader.globalLoader(false);
              });
          };

          Loader.globalLoader(true);
          $http.get('data/product-types.json')
            .then(function (result) {
              scope.productTypes = result.data;
              scope.paidOn = new Date();
              scope.payment = {
                productType: scope.productTypes[0]
              };
            })
            .finally(function () {
              Loader.globalLoader(false);
            });

          bindListeners();
        }
      };
    });
