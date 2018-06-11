(function() {

  'use strict';

  angular.module("myApp").service("mainPageSvc", svcFn);

  svcFn.$inject = ["$http", "$localStorage"]
  function svcFn($http, $localStorage) {

    this.getMainPageInfo = function(callback) {
      $http({
        method: "GET",
        url: "https://www.reddit.com/hot.json"
      }).then(function (res) {

        // set $localStorage
        if(!$localStorage.favoritePosts) {
          $localStorage.favoritePosts = [];
        }else{
          // store the ids for lookup
          var lookup = {};
          $localStorage.favoritePosts.forEach(function(favoritePost) {
            lookup[favoritePost.id] = true;
          });
        }

        // massage data
        var redditData = [];
        res.data.data.children.forEach(function(oneItem) {

          var item = oneItem.data;

          // for voting display eg. 12300 -> 12.3k
          item.scoreAdjusted = item.score + "";
          if(item.score >= 10000) {
            item.scoreAdjusted = item.scoreAdjusted.substring(0,2) + "." + item.scoreAdjusted[2] + "k";
          }

          // set a variable to control play icon and closed icon
          item.showPlayIcon = true;

          // convert utc seconds to date
          var dateNow = new Date();
          var createdTime = new Date(0);
          createdTime.setUTCSeconds(item.created_utc);
          var hours = Math.floor(Math.abs(dateNow - createdTime) / 36e5);
          if(hours >= 24) {
            item.timeDisplayed = hours / 24 + " day(s) " + hours % 24 + " hours";
          }else{
            item.timeDisplayed = hours + " hours ";
          }

          // set a variable to control favorite/not favorite icons
          if($localStorage.favoritePosts.length > 0) {
            if(lookup[item.id]) {
              item.isFavorite = true;
              lookup[item.id] = false;
            }
          }else{
            item.isFavorite = false;
          }

          redditData.push(item)
        });

        // add the favorite posts to redditData that are not in the returned latest 25 posts
        $localStorage.favoritePosts.forEach(function(favoritePost) {
          if(lookup[favoritePost.id]) {
            redditData.push(favoritePost);
          }
        });

        callback(false, redditData);
      }, function (err) {
        callback(true, err);
      });

    }
  }
})();
