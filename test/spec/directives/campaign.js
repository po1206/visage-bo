'use strict';

describe('Directive: campaign', function () {

  // load the directive's module
  beforeEach(module('visageBoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<campaign></campaign>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the campaign directive');
  }));
});
