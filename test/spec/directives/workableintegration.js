'use strict';

describe('Directive: workableIntegration', function () {

  // load the directive's module
  beforeEach(module('visageBoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<workable-integration></workable-integration>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the workableIntegration directive');
  }));
});
