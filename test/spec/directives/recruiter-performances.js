'use strict';

describe('Directive: recruiterPerformances', function () {

  // load the directive's module
  beforeEach(module('visageBoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<recruiter-performances></recruiter-performances>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the recruiterPerformances directive');
  }));
});
