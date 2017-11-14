MetroScheduleRailRegionalController.$inject = ['$scope', '$interval', 'PredictionsModel', '$timeout'];

function MetroScheduleRailRegionalController($scope, $interval, PredictionsModel, $timeout) {
    var vm = $scope;
    vm.predictions = [];
    vm.intervalId = null; // shift list item from start iterval
    vm.timeoutId = null; // push list item to end timeout
    vm.response = null; // storage for predictions from server

    vm.scrollList = function () {
        vm.intervalId = $interval(function () {
            /**
             * check if predictions
             */
            if (!vm.predictions) {
                return;
            }
            //get first item element
            prediction = vm.predictions.shift();

            vm.timeoutId = $timeout(function () {
                // wait when transtion ends and push first item element to end
                vm.predictions.push(prediction);
            }, 1000);
            vm.timeoutId.then(function () {
                // check if we have updates from server
                if (vm.response) {
                    // insert new predictions to list
                    vm.response.forEach(function (res) {
                        vm.predictions.forEach(function (prediction) {
                            if (prediction.id = res.id) {
                                prediction.predictions = res.predictions;
                            }
                        });
                    });
                    vm.response = null;
                }
            });
        }, 8000);
    }

    vm.refreshPredictions = function () {
        // TODO hardcoded stopId
        PredictionsModel.railRegional('080214').then(function (predictions) {
            vm.response = predictions;

            // populate list first time
            if (vm.intervalId == null) {
                vm.predictions = vm.response;
                vm.response = null;
                vm.scrollList();
            }
        }).catch(function (e) {
            //TODO: show some notification
        });
    }
    vm.refreshPredictions() // fetch data and start scroll
    $interval(function () {
        vm.refreshPredictions();
    }, 30000);
}