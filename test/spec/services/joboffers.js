'use strict';

describe('Service: JobOffers', function () {

  // load the service's module
  beforeEach(module('visageClientApp'));

  // instantiate service
  var JobOffers;
  beforeEach(inject(function (_JobOffers_) {
    JobOffers = _JobOffers_;
  }));

  it('should do something', function () {
    expect(!!JobOffers).toBe(true);
  });

});
