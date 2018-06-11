(function() {

  'use strict'
  angular.module("myApp", ["ngStorage", "ngAnimate", "ui.bootstrap"]);

  angular.module("myApp").controller("mainPageCtrl", ctrlFn);

  ctrlFn.$inject = ["$scope", "mainPageSvc", "$localStorage", "$uibModal"];
  function ctrlFn($scope, mainPageSvc, $localStorage, $uibModal) {

    var vm = this;

    vm.mainPageData = [];
    vm.viewFavorite = false;

    // pagination variables
    vm.usePagination = false;
    vm.paginationBtnNum = 1;
    vm.limitTo = 10;
    vm.offset = 0;

    // get data from reddit
    mainPageSvc.getMainPageInfo(function(err, data) {
      if(err) {
        console.log("error getting data");
      }else{
        vm.mainPageData = data;
        if(vm.mainPageData.length > 10) {
          vm.usePagination = true;
          vm.paginationBtnNum = Math.ceil(vm.mainPageData.length / 10);
        }
        console.log(vm.mainPageData);
      }
    });

    // for "All" button to view all posts
    vm.showAll = function() {
      vm.viewFavorite = false;

      if(vm.mainPageData.length > 10) {
        vm.usePagination = true;
        vm.paginationBtnNum = Math.ceil(vm.mainPageData.length / 10);
      }
      vm.offset = 0;
      vm.limitTo = 10;

    }

    // for "Favorite" button to view all marked posts
    vm.showFavorite = function() {
      vm.viewFavorite = true;
      vm.limitTo = vm.mainPageData.length;
      vm.usePagination = false;
      vm.offset = 0;
    }

    // calculate offset for indexing
    vm.setOffset = function(pageNum) {
      // pageNum holds 0, 1, 2, 3...
      vm.offset = pageNum * 10;
    }

    vm.setFavorite = function(index) {

      vm.mainPageData[index].isFavorite = true;
      $localStorage.favoritePosts.push(vm.mainPageData[index]);
    }

    vm.cancelFavorite = function(id) {

      // if the cancelled post in an old post stored in the $localStorage.favoritePosts, then need to use id to set it not favorite
      var i = _.findIndex(vm.mainPageData, function(pageData){
        return pageData.id === id;
      });

      if(i > -1){
        vm.mainPageData[i].isFavorite = false;
      }

      // remove the post from $localStorage.favoritePosts
      var index = _.findIndex($localStorage.favoritePosts, function(item) {
        return item.id === id;
      });

      if(index > -1) {
        $localStorage.favoritePosts.splice(index, 1);
      }

    }

    vm.showPopup = function() {
      $uibModal.open({
        template: "<p>Coming up soon...</p>",
        size: 'sm',
        controller: function() {
        }
      });
    }
  }


})();
