'use strict';

/**
 * @ngdoc directive
 * @name visageBoApp.directive:recruiters
 * @description
 * # recruiters
 */
angular.module('visageBoApp')
  .directive('experts', function ($location, Preference, $window) {
    return {
      templateUrl: 'views/experts.tmpl.html',
      restrict: 'E',
      scope: {
        selectable: '@',
        selectedExperts:'='
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
              sortType: -1
            });
            Preference.getExperts(extraParams).$promise
              .then(function (experts) {
                this.loadedPages[pageNumber] = [];
                experts.forEach(function (expert) {
                  var loadedExpert = angular.merge({}, expert);
                  this.loadedPages[pageNumber].push(loadedExpert);
                }.bind(this));
              }.bind(this))
              .finally(function () {
                scope.pendingExperts = null;
              });
          };
          DynamicItems.prototype.fetchNumItems_ = function () {
            scope.pendingExperts = 'indeterminate';
            Preference.getExpertsCount(params).then(function (resp) {
                this.numItems = resp.data.count;
              }.bind(this))
              .finally(function () {
                scope.pendingExperts = null;
              });
          };
          scope.dynamicItems = new DynamicItems();
        };

        scope.editExpert = function (expert) {
          if(scope.selectable) {
            $window.open('/#/experts/' + expert._id);
          }
          else {
            $location.path('/experts/' + expert._id);
          }
        };

        scope.selectExpert = function (expert) {
          scope.selectedExperts.push(expert);
          scope.selectedExperts = _.uniq(scope.selectedExperts).filter(function (expertAdded) {
            return !!expertAdded.selected;
          });
          console.table(scope.selectedExperts);
        };

        var params = {
        };

        initVirtualContainer();

      }
    };
  });
