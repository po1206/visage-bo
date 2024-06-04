'use strict';

describe('Controller: CandidateCtrl', function () {

  // load the controller's module
  beforeEach(module('visageClientApp'));

  var CandidateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CandidateCtrl = $controller('CandidateCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CandidateCtrl.awesomeThings.length).toBe(3);
  });
});
