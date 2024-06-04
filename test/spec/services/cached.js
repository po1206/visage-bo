'use strict';

describe('Service: Cached', function () {

  // instantiate service
  var Cached,
    init = function () {
      inject(function (_Cached_) {
        Cached = _Cached_;
      });
    };

  // load the service's module
  beforeEach(module('visageClientApp'));

  it('should do something', function () {
    init();

    expect(!!Cached).toBe(true);
  });

  it('should be configurable', function () {
    module(function (CachedProvider) {
      CachedProvider.setSalutation('Lorem ipsum');
    });

    init();

    expect(Cached.greet()).toEqual('Lorem ipsum');
  });

});
