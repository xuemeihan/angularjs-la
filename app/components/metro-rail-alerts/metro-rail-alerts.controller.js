MetroRailAlertsController.$inject = ['$interval', 'moment', 'PredictionsModel', '$timeout', '$scope'];

function MetroRailAlertsController($interval, moment, PredictionsModel, $timeout, $scope) {

    this.alerts = [];
    this.intervalId = null;
    $scope.$on('fetch-metro-alerts', function() {
        this.fetchAlerts();
    });

    $scope.$on('scroll-metro-alerts', function() {
        this.scrollList();
    });

    this.scrollList = function() {
        this.intervalId = $interval(function() {
            this.alerts.shift();
            if(this.alerts.length == 0) {
                $scope.$root.$broadcast('metro-alerts-scrolled');
                $interval.cancel(this.intervalId)
            }
        }, 5000);
    }

    this.fetchAlerts = function() {
        console.log('fetch alerts');
        // TODO hardcoded stop id
        PredictionsModel.metroAlerts().then(function(response) {
            console.log('alerts fetched', this.alerts);
            if(response.length > 0) {
                this.alerts = response;
                $scope.$root.$broadcast('metro-alerts-fetched');
            } else {
                $scope.$root.$broadcast('metro-alerts-not-fetched');
            }
        }, function() {
            $scope.$root.$broadcast('metro-alerts-not-fetched');
        });
    }
}