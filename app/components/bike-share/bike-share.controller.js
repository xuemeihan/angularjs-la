BikeShareController.$inject = ['$scope', '$interval', 'moment', 'PredictionsModel', '$timeout'];

function BikeShareController($scope, $interval, moment, PredictionsModel, $timeout) {

    var vm = $scope;
    vm.predictions = [];
    vm.intervalId = null; // shift list item from start iterval
    vm.timeoutId = null; // push list item to end timeout
    vm.response = null; // storage for predictions from server

    //vm.refreshPredictions() // fetch data and start scroll
    $interval(function () {
        vm.refreshPredictions();
    }, 30000);

    vm.scrollList = function () {
        vm.intervalId = $interval(function () {

            /**
             * Check if predictions
             */
            if (!vm.predictions) {
                return;
            }

            // get first item element
            var prediction = vm.predictions.shift();
            vm.timeoutId = $timeout(function () {
                // wait when transtion ends and push first item element to end
                vm.predictions.push(prediction);
            }, 2000);
            vm.timeoutId.then(function () {
                // check if we have updates from server
                if (vm.response) {
                    vm.response.forEach(function (res) {
                        vm.predictions.forEach(function (prediction) {
                            if (prediction.name === res.name) {
                                prediction.bikesAvailable = res.bikesAvailable;
                                prediction.docksAvailable = res.docksAvailable;
                            }
                        });
                    });

                    vm.response = null;
                }
            })
        }, 8000);
    }

    vm.refreshPredictions = function () {
        PredictionsModel.bikeShare().then(function (predictions) {
            vm.response = predictions;
            if (vm.intervalId === null) {
                vm.predictions = vm.response;
                vm.response = null;
                vm.scrollList();
            }
        }).catch(function (e) {
            console.log("Exception in bike-share");
            //TODO: show some notification
        })
    }
};