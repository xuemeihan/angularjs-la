
MetroScheduleRailRegionalController.$inject = ['$scope', '$interval', 'moment', 'PredictionsModel', '$timeout'];

function MetroScheduleRailRegionalController($scope, $interval, moment, PredictionsModel, $timeout) {
    var vm = $scope;
    this.predictions = [];
    this.intervalId = null; // shift list item from start iterval
    this.timeoutId = null; // push list item to end timeout
    this.response = null; // storage for predictions from server

    vm.scrollList = function() {
        this.intervalId = $interval(function() {
            //get first item element
            prediction = this.predictions.shift();

            this.timeoutId = $timeout(function() {
                // wait when transtion ends and push first item element to end
                this.predictions.push(prediction);
            }, 1000);
            this.timeoutId.then(function() {
                // check if we have updates from server
                if (this.response) {
                    // insert new predictions to list
                    this.response.forEach(function(res) {
                        this.predictions.forEach(function(prediction) {
                            if (prediction.id = res.id) {
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
        // TODO hardcoded stopId
        PredictionsModel.railRegional('080214').then(function(predictions) {
            this.response = predictions;

            // populate list first time
            if (this.intervalId == null) {
                this.predictions = this.response;
                this.response = null;
                vm.scrollList();
            }
        });
    }
    vm.refreshPredictions() // fetch data and start scroll
    $interval(function() {
        vm.refreshPredictions();
    }, 30000);
}