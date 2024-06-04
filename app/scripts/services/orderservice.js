'use strict';

/**
 * @ngdoc service
 * @name visageBoApp.OrderService
 * @description
 * # OrderService
 * Service in the visageBoApp.
 */
angular.module('visageBoApp')
  .service('OrderService',
    function (auth, Cached, $http, ENV, endpointsApi, $q, JobOffer, EMailFactory) {

      // AngularJS will instantiate a singleton by calling 'new' on this function
      //FIXME Security breach, a user should not be able to mark his jobs as paid.
      // should be done on the server side when payment is done
      this.updatePayment = function (clientId, date, sendEmail, email, payment) {
        var deferred = $q.defer();
        var calls = [];
        JobOffer.queryByUser({
          userId: clientId,
          paid: ''
        }).$promise.then(function (unpaids) {
          //calls.push(CustomerService.updateCustomerIntercom({
          //  leadStatus: '5'
          //}));
          if (sendEmail && email && payment) {
            calls.push(EMailFactory.orderConfirmationMail(email, payment));
          }
          unpaids.forEach(function (jobOffer) {
            jobOffer.paid = date;
            calls.push(jobOffer.$update());
          });

          $q.all(calls).then(function (resp) {
            deferred.resolve(resp);
          }, function (err) {
            console.error('There was an error paying the jobs');
            console.error(err);
            deferred.reject(err);
          });
        });
        return deferred.promise;
      };

      this.getOrderDetails = function (categories, jobs) {
        var orderDetails = {
          total: {
            quantity: 0,
            price: 0
          }
        };
        var categoryBySalaryRange = {};
        categories.forEach(function (category) {
          var name = category.category;
          var price = category.price;
          category.ranges.forEach(function (range) {
            categoryBySalaryRange[range] = {
              name: name,
              price: price
            };
          });
        });
        jobs.forEach(function (job) {
          if (!orderDetails[categoryBySalaryRange[job.salaryRange].name]) {
            orderDetails[categoryBySalaryRange[job.salaryRange].name] = {
              quantity: 0,
              price: 0
            };
          }
          orderDetails[categoryBySalaryRange[job.salaryRange].name].quantity++;
          orderDetails[categoryBySalaryRange[job.salaryRange].name].price +=
            categoryBySalaryRange[job.salaryRange].price;
          orderDetails.total.quantity++;
          orderDetails.total.price += categoryBySalaryRange[job.salaryRange].price;
        });

        return orderDetails;
      };

    });
