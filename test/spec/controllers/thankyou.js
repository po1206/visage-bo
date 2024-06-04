'use strict';

describe('Controller: ThankyouCtrl', function () {

  // load the controller's module
  beforeEach(module('visageClientApp'));

  var ThankyouCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ThankyouCtrl = $controller('ThankyouCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ThankyouCtrl.awesomeThings.length).toBe(3);
  });
});
