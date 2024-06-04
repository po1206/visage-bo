'use strict';

describe('Controller: InviteRecruiterCtrl', function () {

  // load the controller's module
  beforeEach(module('visageBoApp'));

  var InviteRecruiterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InviteRecruiterCtrl = $controller('InviteRecruiterCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(InviteRecruiterCtrl.awesomeThings.length).toBe(3);
  });
});
