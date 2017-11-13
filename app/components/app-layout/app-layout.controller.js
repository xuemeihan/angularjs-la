AppController.$inject = ['$rootScope', '$interval'];

function AppController($rootScope, $interval) {

  this.timeNow = new Date();

  $interval(function() {
    this.timeNow = new Date();
  }, 1000);
};