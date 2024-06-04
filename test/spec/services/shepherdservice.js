'use strict';

describe('Service: ShepherdService', function () {

  // load the service's module
  beforeEach(module('visageClientApp'));

  // instantiate service
  var ShepherdService;
  beforeEach(inject(function (_ShepherdService_) {
    ShepherdService = _ShepherdService_;
  }));

  it('should do something', function () {
    expect(!!ShepherdService).toBe(true);
  });

});
