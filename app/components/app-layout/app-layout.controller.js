(function () {

  angular.module('app')
    .controller('AppController', ['$rootScope', '$interval', function ($rootScope, $interval) {
      this.timeNow = new Date();
      $interval(function () {
        this.timeNow = new Date();
      }, 1000);
    }]);

  })();