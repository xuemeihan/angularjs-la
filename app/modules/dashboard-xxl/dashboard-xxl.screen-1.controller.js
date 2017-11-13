var app = angular.module('app');

app.controller('DashboardXxlScreen1Controller',
  ['$scope', '$interval', '$timeout', '$sce', 'Carousel', 'PredictionsModel',
  function($scope, $interval, $timeout, $sce, Carousel, PredictionsModel) {


  $scope.timings = {
    intervals: [
    10000, 30000, 20000, 30000, // diagram, embeded map, map image, embeded map
    15000, 15000, 15000, 15000, 15000 //bus slides
    ],
    cursor: 0
  };


  $scope.response = null;
  $scope.texts = null;
  $scope.intervalId = null;

  $scope.slideMap = function() {

    //slide
    $timeout(function() {
      Carousel.get('maps-carousel').next();
      $scope.slideMap();
    }, $scope.timings.intervals[$scope.timings.cursor]);

    if ($scope.timings.cursor === $scope.timings.intervals.length - 1 ) {
     $scope.timings.cursor = 0; 
    } else {
      $scope.timings.cursor += 1;
    }
  }

  $scope.getTexts = function() {
    PredictionsModel.advisories().then(
      function(response) {
        if ($scope.texts === null) {
          $scope.texts = $scope.response
          $scope.response = null;
        }
      })
  }

  $scope.stationBusSchedule = [];
  PredictionsModel.stationBus('44241').then(function(stationBusSchedule) {
    $scope.stationBusSchedule = stationBusSchedule;

    $interval(function() {
      PredictionsModel.stationBus('44241').then(function(stationBusSchedule) {
        $scope.stationBusSchedule = stationBusSchedule;
      });
    }, 15000);
  });

  $scope.getTexts();
  $scope.slideMap();

  // / slide text

  $scope.intervalId = $interval( function() {
    if ($scope.texts != null) {
      $scope.texts.shift();
      if ($scope.texts.length == 0) {
        $scope.getTexts();
      }
    }

    $timeout(function() {
      if ($scope.response != null) {
        $scope.texts = $scope.response;
        $scope.response = null;
      }
    }, 1000);
  }, 8000);



    
  }]);
