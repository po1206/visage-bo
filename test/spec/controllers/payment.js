'use strict';

describe('Controller: PaymentCtrl', function () {

  // load the controller's module
  beforeEach(module('visageBoApp'));

  var PaymentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PaymentCtrl = $controller('PaymentCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PaymentCtrl.awesomeThings.length).toBe(3);
  });
});
