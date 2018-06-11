// directive to handle invalid image
angular.module("myApp").directive('fallbackSrc', function () {
var fallbackSrc = {
  link: function postLink(scope, iElement, iAttrs) {
    iElement.bind('error', function() {
      iAttrs.$set("src", iAttrs.fallbackSrc);
      iAttrs.$set("height", 70);
      iAttrs.$set("width", 74);
    });
  }
 }
 return fallbackSrc;
});
