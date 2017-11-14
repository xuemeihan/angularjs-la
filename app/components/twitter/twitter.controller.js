

TwitterController.$inject = ['$scope', '$interval', 'PredictionsModel', '$timeout'];

function TwitterController($scope, $interval, PredictionsModel, $timeout){

  $scope.predictions = [];
    $scope.intervalId = null; // shift list item from start interval
    $scope.timeoutId = null; //push list item to end timeout
    $scope.pendingAjax = false;
    $scope.twitAppear = null;
    $scope.twitDisappear = null;

    $scope.toggleTwit = function(display) {
      if (display === undefined) {
        $scope.twitAppear = true;
      } else {
        $scope.twitAppear = display;
        $scope.twitDisappear = !display;
      }
    }

    $scope.scrollList = function() {
      $scope.toggleTwit(); // show twit at first

      $scope.intervalId = $interval(function() {
        $scope.toggleTwit(false); // hide twit
        // display nest twit
        $scope.timeoutId = $timeout(function(){
          $scope.prediction = $scope.predictions.shift();
        }, 1000);

        //show twit

        $scope.timeoutId.then(function(){
          // wait img downloading and rendering
          setTimeout(function() {
            $scope.toggleTwit(true);
          }, 500);

          if($scope.predictions.length < 3) {
            $scope.refreshPredictions();
          }
        });
      }, 10000 + 2000);
    };

    $scope.refreshPredictions = function() {
      var promise;
      if ($scope.pendingAjax === true) {
        return;
      } else {
        $scope.pendingAjax = true;
      }

      promise = PredictionsModel.twitter();
      promise.then(function(response) {
        if(!response){
          return;
        }
        response.forEach(function(item) {
          return $scope.predictions.push(item);
        });

        if ($scope.intervalId === null) {
          $scope.prediction = $scope.predictions.shift();
          return $scope.scrollList();
        }
      }).catch(function (e) {
        console.log('Exception here --- ');
          //TODO: show some notification
      });

      promise.finally(function() {
        return $scope.pendingAjax = false;
      });
    }
    $scope.refreshPredictions(); // fetch data and start scroll
  };