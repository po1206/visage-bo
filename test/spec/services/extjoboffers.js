'use strict';

describe('Service: ExtJobOffers', function () {

  // load the service's module
  beforeEach(module('visageBoApp'));

  // instantiate service
  var ExtJobOffers;
  beforeEach(inject(function (_ExtJobOffers_) {
    ExtJobOffers = _ExtJobOffers_;
  }));

  it('should do something', function () {
    expect(!!ExtJobOffers).toBe(true);
  });

});
