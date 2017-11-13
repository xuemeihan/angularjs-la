

MetroScheduleBusController.$inject = ['$scope', '$interval', 'moment', 'PredictionsModel', '$timeout'];
function MetroScheduleBusController($scope, $interval, moment, PredictionsModel, $timeout) {
    var vm = $scope;
    this.predictions = [];
    this.intervalId = null; // shift list item from start interval
    this.timeoutId = null; // push list item to end timeout
    this.response = null; // storage for predictions from server

    //this.refreshPredictions(); // fetch data and start scroll
    $interval(function() {
        vm.refreshPredictions();
    }, 30000);

    vm.scrollList = function() {
        this.intervalId = $interval(function() {
            //get first item element
            var prediction = this.predictions.shift();
            this.timeoutId = $timeout(function() {
                // wait when transtion ends and push first item element to end
                this.prediction.push(prediction);
            }, 1000);

            this.timeoutId.then(function() {
                // check if we have updates from server

                if (this.response) {
                    // insert new predictions to list
                    this.response.forEach(function(res) {
                        this.predictions.forEach(function(prediction) {
                            if (prediction.id === res.id) {
                                prediction.predictions = res.predictions;
                            }
                        });
                    });

                    this.response = null;
                }
            });
        }, 8000);
    }

    vm.refreshPredictions = function() {
        PredictionsModel.metroBus('080214').then(function(predictions) {
            this.response = predictions;
            if (this.intervalId === null) {
                this.predictions = this.response;
                this.response = null;
                vm.scrollList();
            }
        });
    }

}