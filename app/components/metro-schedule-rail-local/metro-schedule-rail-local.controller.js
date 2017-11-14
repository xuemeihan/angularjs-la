MetroScheduleRailLocalController.$inject = ['$interval', 'PredictionsModel', '$timeout', '$scope'];

function MetroScheduleRailLocalController($interval, PredictionsModel, $timeout, $scope) {

    var vm = $scope;
    vm.showAlerts = false;
    vm.predictions = [];
    vm.intervalId = null;
    vm.timeoutId = null;
    vm.response = null;
    vm.displayAlerts = function () {
        $timeout(function () {
            $scope.$root.$broadcast('fetch-metro-alerts');
        }, 60000);
    }
    $scope.$on('metro-alerts-fetched', function () {
        $scope.$root.$broadcast('scroll-metro-alerts');
        vm.showAlerts = true;
    });

    $scope.$on('metro-alerts-scrolled', function () {
        vm.showAlerts = false;
        vm.displayAlerts();
    });
    $scope.$on('metro-alerts-not-fetched', function () {
        vm.displayAlerts();
    });

    // vm.refreshPredictions();
    $interval(function () {
        vm.refreshPredictions();
    }, 30000);
    vm.displayAlerts();


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
                if (prediction) {
                    vm.predictions.push(prediction)
                }
            }, 1000);
            vm.timeoutId.then(function () {
                // check if we have updates from server
                if (vm.response) {
                    // insert new predictions to list
                    vm.response.forEach(function (res) {
                        vm.predictions.forEach(function (prediction) {
                            if (prediction.title === res.title) {
                                prediction.predictions = res.predictions;

                                // set flag after update
                                prediction.$updated = res.$updated = true;
                                console.log('updated', prediction, res);
                            }
                        });
                    });
                    vm.predictions.forEach(function (item, ix) {
                        if (item.$updated == null) {
                            vm.predictions.splice(ix, 1);
                            console.log('deleted item', item);
                        } else {
                            delete item.$updated;
                        }
                    });

                    // push new items
                    vm.response.forEach(function (item) {
                        if (item.$updated == null) {
                            vm.predictions.push(item);
                            console.log('added item', item);
                        }
                    });
                    // predictions updated, clear storage
                    vm.response = null;
                }
            });
        }, 8000);
    }

    vm.refreshPredictions = function () {
        // TODO hardcoded stopId
        PredictionsModel.railLocal('080214').then(function (predictions) {

            /**
             * Check if predictions
             */
            if (!predictions) {
                return;
            }

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


}