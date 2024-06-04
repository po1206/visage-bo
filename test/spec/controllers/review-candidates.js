'use strict';

describe('Controller: ReviewCandidatesCtrl', function () {

  // load the controller's module
  beforeEach(module('visageBoApp'));

  var ReviewCandidatesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReviewCandidatesCtrl = $controller('ReviewCandidatesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ReviewCandidatesCtrl.awesomeThings.length).toBe(3);
  });
});
