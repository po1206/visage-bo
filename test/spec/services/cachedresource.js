'use strict';

describe('Service: cachedResource', function () {

  // load the service's module
  beforeEach(module('visageClientApp'));

  // instantiate service
  var cachedResource;
  beforeEach(inject(function (_cachedResource_) {
    cachedResource = _cachedResource_;
  }));

  it('should do something', function () {
    expect(!!cachedResource).toBe(true);
  });

});
