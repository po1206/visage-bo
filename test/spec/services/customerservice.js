'use strict';

describe('Service: CustomerService', function () {

  // load the service's module
  beforeEach(module('visageClientApp'));

  // instantiate service
  var CustomerService;
  beforeEach(inject(function (_CustomerService_) {
    CustomerService = _CustomerService_;
  }));

  it('should do something', function () {
    expect(!!CustomerService).toBe(true);
  });

});
