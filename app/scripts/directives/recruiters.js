'use strict';

/**
 * @ngdoc directive
 * @name visageBoApp.directive:recruiters
 * @description
 * # recruiters
 */
angular.module('visageBoApp')
  .directive('recruiters', function ($location, Preference) {
    return {
      templateUrl: 'views/recruiters.tmpl.html',
      restrict: 'E',
      scope: {
        selectable: '@',
        validatedOnly: '=',
        searchDateFilter: '=',
        searchSubmitted: '='
      },
      link: function postLink(scope) {

        var initVirtualContainer = function () {
          var DynamicItems = function () {
            /**
             * @type {!Object<?Array>} Data pages, keyed by page number (0-index).
             */
            this.loadedPages = {};
            /** @type {number} Total number of items. */
            this.numItems = 0;
            /** @const {number} Number of items to fetch per request. */
            this.PAGE_SIZE = 20;
            this.fetchNumItems_();
          };
          // Required.
          DynamicItems.prototype.getItemAtIndex = function (index) {
            var pageNumber = Math.floor(index / this.PAGE_SIZE);
            var page = this.loadedPages[pageNumber];
            if (page) {
              return page[index % this.PAGE_SIZE];
            }
            else if (page !== null) {
              this.fetchPage_(pageNumber);
            }
          };

          // Required.
          DynamicItems.prototype.getLength = function () {
            return this.numItems;
          };

          DynamicItems.prototype.fetchPage_ = function (pageNumber) {
            // Set the page to null so we know it is already being fetched.
            this.loadedPages[pageNumber] = null;
            // For demo purposes, we simulate loading more items with a timed
            // promise. In real code, this function would likely contain an
            // $http request.
            var pageOffset = pageNumber * this.PAGE_SIZE;
            scope.pendingRecruiters = 'indeterminate';
            var extraParams = angular.extend(params,{
              offset: pageOffset,
              limit: this.PAGE_SIZE,
              sortType: -1,
            });
            if (scope.searchDateFilter.searchDateFrom) {
              extraParams.searchDateFrom = scope.searchDateFilter.searchDateFrom.getTime();
            }
            if (scope.searchDateFilter.searchDateTo) {
              extraParams.searchDateTo = scope.searchDateFilter.searchDateTo.getTime();
            }
            Preference.getRecruiters(extraParams).$promise
              .then(function (recruiters) {
                this.loadedPages[pageNumber] = [];
                recruiters.forEach(function (recruiter) {
                  var loadedRecruiter = angular.merge({}, recruiter);
                  this.loadedPages[pageNumber].push(loadedRecruiter);
                }.bind(this));
              }.bind(this))
              .finally(function () {
                scope.pendingRecruiters = null;
              });
          };

          DynamicItems.prototype.fetchNumItems_ = function () {
            scope.pendingRecruiters = 'indeterminate';
            var extraParams = angular.copy(params);
            if (scope.searchDateFilter.searchDateFrom) {
              extraParams.searchDateFrom = scope.searchDateFilter.searchDateFrom.getTime();
            }
            if (scope.searchDateFilter.searchDateTo) {
              extraParams.searchDateTo = scope.searchDateFilter.searchDateTo.getTime();
            }
            Preference.getRecruitersCount(extraParams).then(function (resp) {
                this.numItems = resp.data.count;
              }.bind(this))
              .finally(function () {
                scope.pendingRecruiters = null;
              });
          };
          scope.dynamicItems = new DynamicItems();
        };

        scope.editRecruiter = function (recruiter) {
          $location.path('/recruiters/' + recruiter._id);
        };

        var params = {
        };

        if (scope.validatedOnly) {
          params.recruiter = {validated :true};
        }
        initVirtualContainer();

        scope.$watch('searchSubmitted', function(newValue) {
          if (newValue) {
            initVirtualContainer();
          }
        });
      }
    };
  });
