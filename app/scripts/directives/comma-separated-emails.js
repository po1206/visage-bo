'use strict';

/**
 * @ngdoc directive
 * @name visageBoApp.directive:commaSeparatedEmails
 * @description
 * # commaSeparatedEmails
 */
angular.module('visageBoApp')
  .directive('commaSeparatedEmails', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, ctrl) {
        ctrl.$parsers.unshift(function (viewValue) {

          var emails = viewValue.split(/,|;/);
          // loop that checks every email, returns undefined if one of them fails.
          var re = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

          // angular.foreach(emails, function() {
          var validityArr = emails.map(function (str) {
            return re.test(str.trim());
          }); // sample return is [true, true, true, false, false, false]

          var atLeastOneInvalid = false;
          angular.forEach(validityArr, function (value) {
            if (value === false) {
              atLeastOneInvalid = true;
            }
          });
          if (!atLeastOneInvalid) {
            // ^ all I need is to call the angular email checker here, I think.
            ctrl.$setValidity('multipleEmails', true);
            return viewValue;
          }
          else {
            ctrl.$setValidity('multipleEmails', false);
            return undefined;
          }
          // })
        });
      }
    };
  });
