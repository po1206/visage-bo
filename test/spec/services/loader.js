'use strict';

describe('Service: Loader', function () {

  // load the service's module
  beforeEach(module('visageClientApp'));

  // instantiate service
  var Loader;
  beforeEach(inject(function (_Loader_) {
    Loader = _Loader_;
  }));

  it('should do something', function () {
    expect(!!Loader).toBe(true);
  });

});
