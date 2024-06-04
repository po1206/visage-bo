'use strict';

describe('Service: staticdata', function () {

  // load the service's module
  beforeEach(module('visageBoApp'));

  // instantiate service
  var staticdata;
  beforeEach(inject(function (_staticdata_) {
    staticdata = _staticdata_;
  }));

  it('should do something', function () {
    expect(!!staticdata).toBe(true);
  });

});
