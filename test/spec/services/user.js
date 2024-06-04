'use strict';

describe('Service: User', function () {

  // instantiate service
  var User,
    init = function () {
      inject(function (_User_) {
        User = _User_;
      });
    };

  // load the service's module
  beforeEach(module('visageClientApp'));

  it('should do something', function () {
    init();

    expect(!!User).toBe(true);
  });

  it('should be configurable', function () {
    module(function (UserProvider) {
      UserProvider.setSalutation('Lorem ipsum');
    });

    init();

    expect(User.greet()).toEqual('Lorem ipsum');
  });

});
