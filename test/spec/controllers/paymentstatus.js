'use strict';

describe('Controller: PaymentstatusCtrl', function () {

  // load the controller's module
  beforeEach(module('visageBoApp'));

  var PaymentstatusCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PaymentstatusCtrl = $controller('PaymentstatusCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PaymentstatusCtrl.awesomeThings.length).toBe(3);
  });
});
