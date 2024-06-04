'use strict';

describe('Controller: WarningCtrl', function () {

  // load the controller's module
  beforeEach(module('visageClientApp'));

  var WarningCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WarningCtrl = $controller('WarningCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(WarningCtrl.awesomeThings.length).toBe(3);
  });
});
