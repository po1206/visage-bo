'use strict';

describe('Controller: EditjobofferCtrl', function () {

  // load the controller's module
  beforeEach(module('visageClientApp'));

  var EditjobofferCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditjobofferCtrl = $controller('EditjobofferCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EditjobofferCtrl.awesomeThings.length).toBe(3);
  });
});
