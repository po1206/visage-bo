'use strict';

describe('Service: errorHandler', function () {

  // load the service's module
  beforeEach(module('visageBoApp'));

  // instantiate service
  var errorHandler;
  beforeEach(inject(function (_errorHandler_) {
    errorHandler = _errorHandler_;
  }));

  it('should do something', function () {
    expect(!!errorHandler).toBe(true);
  });

});
