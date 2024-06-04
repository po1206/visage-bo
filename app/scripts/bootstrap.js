'use strict';

(function () {
  angular.element(document).ready(function () {
    angular.module('config-module', ['visageNgCommon.config','config'])
      .run(function (ENV) {
        angular.bootstrap(document.getElementById('visage-bo-app'), ['visageBoApp'], {
          strictDi: !ENV.development
        });
      });
    angular.bootstrap(document.getElementById('config-module'), ['config-module'], {});
  });
})();

