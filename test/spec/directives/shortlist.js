'use strict';

describe('Directive: shortlist', function () {

  // load the directive's module
  beforeEach(module('visageBoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<shortlist></shortlist>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the shortlist directive');
  }));
});
