'use strict';

describe('Service: TempLocalStorage', function () {

  // load the service's module
  beforeEach(module('visageClientApp'));

  // instantiate service
  var TempLocalStorage;
  beforeEach(inject(function (_TempLocalStorage_) {
    TempLocalStorage = _TempLocalStorage_;
  }));

  it('should do something', function () {
    expect(!!TempLocalStorage).toBe(true);
  });

});
