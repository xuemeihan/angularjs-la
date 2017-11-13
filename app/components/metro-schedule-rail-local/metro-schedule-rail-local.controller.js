MetroScheduleRailLocalController.$inject = ['$interval', 'moment', 'PredictionsModel', '$timeout', '$scope'];

function MetroScheduleRailLocalController($interval, moment, PredictionsModel, $timeout, $scope) {

    this.showAlerts = false;
    this.predictions = [];
    this.intervalId = null;
    this.timeoutId = null;
    this.response = null;
    this.displayAlerts = function() {
        $timeout(function() {
            $scope.$root.$broadcast('fetch-metro-alerts');
        }, 60000);
    }
    $scope.$on('metro-alerts-fetched', function() {
        $scope.$root.$broadcast('scroll-metro-alerts');
        this.showAlerts = true;
    });

    $scope.$on('metro-alerts-scrolled', function() {
        this.showAlerts = false;
        this.displayAlerts();
    });
    $scope.$on('metro-alerts-not-fetched', function() {
        this.displayAlerts();
    });

    // this.refreshPredictions();
    $interval(function() {
        this.refreshPredictions();
    }, 30000);
    this.displayAlerts();


    this.scrollList = function() {
        this.intervalId = $interval(function() {
            // get first item element
            var prediction = this.predictions.shift();
            this.timeoutId = $timeout(function() {
                // wait when transtion ends and push first item element to end
                if (prediction) {
                    this.predictions.push(prediction)
                }
            }, 1000);
            this.timeoutId.then(function() {
                // check if we have updates from server
                if (this.response) {
                    // insert new predictions to list
                    this.response.forEach(function(res) {
                        this.predictions.forEach(function(prediction) {
                            if (prediction.title === res.title) {
                                prediction.predictions = res.predictions;

                                // set flag after update
                                prediction.$updated = res.$updated = true;
                                console.log('updated', prediction, res);
                            }
                        });
                    });
                    this.predictions.forEach(function(item, ix) {
                        if (item.$updated == null) {
                            this.predictions.splice(ix, 1);
                            console.log('deleted item', item);
                        } else {
                            delete item.$updated;
                        }
                    });

                    // push new items
                    this.response.forEach(function(item) {
                        if (item.$updated == null) {
                            this.predictions.push(item);
                            console.log('added item', item);
                        }
                    });
                    // predictions updated, clear storage
                    this.response = null;
                }
            });
        }, 8000);
    }

    this.refreshPredictions = function () {
        // TODO hardcoded stopId
        PredictionsModel.railLocal('080214').then( function(predictions) {
            this.response = predictions;

            // populate list first time
            if (this.intervalId == null) {
                this.predictions = this.response;
                this.response = null;
                this.scrollList();
            }
        });
    }


}