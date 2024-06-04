'use strict';

describe('Controller: CkeckoutCtrl', function () {

  // load the controller's module
  beforeEach(module('visageClientApp'));

  var CkeckoutCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CkeckoutCtrl = $controller('CkeckoutCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CkeckoutCtrl.awesomeThings.length).toBe(3);
  });
});
