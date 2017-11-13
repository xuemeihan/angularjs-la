var app = angular.module('app');

app.controller(
  'DashboardXxlScreen2Controller',
  ['$scope', '$interval', function($scope, $interval) {

    $scope.timeNow = new Date();
    $interval(function() {
      $scope.timeNow = new Date();
      }, 1000);
    }]
  );
