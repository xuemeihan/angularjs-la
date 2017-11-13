BikeShareController.$inject = ['$interval', 'moment', 'PredictionsModel', '$timeout'];

function BikeShareController($interval, moment, PredictionsModel, $timeout) {

    this.predictions = []
    this.intervalId = null // shift list item from start iterval
    this.timeoutId = null // push list item to end timeout
    this.response = null // storage for predictions from server

    //this.refreshPredictions() // fetch data and start scroll
    $interval(function() {
        this.refreshPredictions();
    }, 30000);

    this.scrollList = function() {
        this.intervalId = $interval(function() {
            // get first item element
            var prediction = this.predictions.shift();
            this.timeoutId = $timeout(function(){
                // wait when transtion ends and push first item element to end
                this.predictions.push(prediction);
            }, 2000);
            this.timeoutId.then(function() {
                // check if we have updates from server
                if (this.response) {
                    this.response.forEach(function(res) {
                        this.predictions.forEach(function(prediction) {
                            if (prediction.name === res.name) {
                                prediction.bikesAvailable = res.bikesAvailable;
                                prediction.docksAvailable = res.docksAvailable;
                            }
                        });
                    });

                    this.response = null;
                }
            })
        }, 8000);
    }

    this.refreshPredictions = function() {
        this.PredictionsModel.bikeShare().then(function(predictions) {
            this.response = predictions;
            if (this.intervalId === null) {
                this.predictions= this.response;
                this.response = null;
                this.scrollList();
            }
        })
    }
};