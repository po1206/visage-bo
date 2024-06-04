'use strict';

describe('Controller: InactiveJobsCtrl', function () {

  // load the controller's module
  beforeEach(module('visageBoApp'));

  var InactiveJobsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InactiveJobsCtrl = $controller('InactiveJobsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(InactiveJobsCtrl.awesomeThings.length).toBe(3);
  });
});
