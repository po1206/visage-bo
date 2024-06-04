'use strict';

/**
 * @ngdoc overview
 * @name visageBoApp
 * @description
 * # visageBoApp
 *
 * Main module of the application.
 */

angular
  .module(
    'visageBoApp', [
      'ngAnimate',
      'ngCookies',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngMaterial',
      'visageNgCommon',
      'config',
      'constants',
      'angularPayments',
      'auth0',
      'angular-storage',
      'angular-jwt',
      'checklist-model',
      'ngFileUpload',
      'xml'
    ])
  .config(function ($mdThemingProvider) {
    // Extend the red theme with a few different colors
    var visageTeal = $mdThemingProvider.extendPalette('teal', {
      '500': '48b0a1',
      '800': '309fc3'
    });
    var visageOrange = $mdThemingProvider.extendPalette('orange', {
      'A200': 'FB8C00'
    });
    // Register the new color palette map with the name <code>visageCyan</code>
    $mdThemingProvider.definePalette('visageTeal', visageTeal);
    $mdThemingProvider.definePalette('visageOrange', visageOrange);

    // Use that theme for the primary intentions
    $mdThemingProvider.theme('default')
      .primaryPalette('visageTeal')
      .accentPalette('visageOrange')
      .warnPalette('red');
  })
  .config(function ($routeProvider) {

    $routeProvider
      .when('/', {
        redirectTo: '/jobs'
      })
      .when('/jobs', {
        requiresLogin: true,
        templateUrl: 'views/jobs.html',
        controller: 'JobsCtrl',
        controllerAs: 'jobs'
      })
      .when('/jobs/inactive', {
        requiresLogin: true,
        templateUrl: 'views/inactive-jobs.html',
        controller: 'InactiveJobsCtrl',
        controllerAs: 'inactivejobs'
      })
      .when('/job-offer/:jobId?', {
        requiresLogin: true,
        templateUrl: 'views/edit-job-offer.html',
        controller: 'EditJobOfferCtrl',
        controllerAs: 'editJobOffer'
      })
      .when('/job-offer/:jobId/candidates/:status?', {
        requiresLogin: true,
        templateUrl: 'views/review-candidates.html',
        controller: 'ReviewCandidatesCtrl',
        controllerAs: 'reviewCandidatesCtrl'
      })
      .when('/recruiters', {
        requiresLogin: true,
        templateUrl: 'views/recruiters.html',
        controller: 'RecruitersCtrl',
        controllerAs: 'recruiters'
      })
      .when('/recruiters/invite', {
        requiresLogin: true,
        templateUrl: 'views/invite-recruiter.html',
        controller: 'InviteRecruiterCtrl',
        controllerAs: 'inviterecruiter'
      })
      .when('/recruiters/:recruiterId', {
        requiresLogin: true,
        templateUrl: 'views/edit-recruiter.html',
        controller: 'EditRecruiterCtrl',
        controllerAs: 'editrecruiter'
      })
      .when('/experts', {
        requiresLogin: true,
        templateUrl: 'views/experts.html',
        controller: 'ExpertsCtrl',
        controllerAs: 'experts'
      })
      .when('/experts/invite', {
        requiresLogin: true,
        templateUrl: 'views/invite-expert.html',
        controller: 'InviteExpertCtrl',
        controllerAs: 'inviteexpert'
      })
      .when('/experts/:expertId', {
        requiresLogin: true,
        templateUrl: 'views/edit-expert.html',
        controller: 'EditExpertCtrl',
        controllerAs: 'editexpert'
      })
      .when('/clients', {
        requiresLogin: true,
        templateUrl: 'views/clients.html',
        controller: 'ClientsCtrl',
        controllerAs: 'clients'
      })
      .when('/clients/:clientId', {
        requiresLogin: true,
        templateUrl: 'views/client-status.html',
        controller: 'ClientStatusCtrl',
        controllerAs: 'clientStatus'
      })
      .when('/login', {
        controller: 'ForbiddenCtrl',
        templateUrl: 'views/forbidden.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function (authProvider, ThirdParties) {
    authProvider.init({
      domain: ThirdParties.auth0.domain,
      clientID: ThirdParties.auth0.clientID,
      callbackURL: location.href,
      // Here include the URL to redirect to if the user tries to access a
      // resource when not authenticated.
      loginUrl: '/login'
    });
  })
  .config(function (authProvider, $routeProvider, $httpProvider, jwtInterceptorProvider) {

    // We're annotating this function so that the `store` is injected correctly when this file is
    // minified
    jwtInterceptorProvider.tokenGetter = ['store', function (store) {
      // Return the saved token
      return store.get('token');
    }];

    $httpProvider.interceptors.push('jwtInterceptor');
  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('ServerErrorInterceptor');
  })
  .config(['$resourceProvider', function ($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
  }])
  .config(function (ENV,$sceDelegateProvider) {
    var whitelist = [
      // Allow same origin resource loads.
      'self',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      'https://*.visage.ae/**',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      'https://*.visage.jobs/**',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      'https://*.instapage.com/**',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      'https://*.pagedemo.co/**',
      ENV.pdfViewerEndpoint
    ];
    $sceDelegateProvider.resourceUrlWhitelist(whitelist);
  })
  .config(function (ENV, $compileProvider) {
  $compileProvider.debugInfoEnabled(ENV.development);
});
