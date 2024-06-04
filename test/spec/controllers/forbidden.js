'use strict';

describe('Controller: ForbiddenCtrl', function () {

  // load the controller's module
  beforeEach(module('visageBoApp'));

  var ForbiddenCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ForbiddenCtrl = $controller('ForbiddenCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ForbiddenCtrl.awesomeThings.length).toBe(3);
  });
});
