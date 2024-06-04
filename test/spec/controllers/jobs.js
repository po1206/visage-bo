'use strict';

describe('Controller: JobsctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('visageClientApp'));

  var JobsctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JobsctrlCtrl = $controller('JobsctrlCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(JobsctrlCtrl.awesomeThings.length).toBe(3);
  });
});
