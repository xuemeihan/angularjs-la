
var app = angular.module('app');
app.factory('ScheduleService', function($q, $http) {
    var routesList = [];

    loadRoutes().then(function(response) {
        routesList = response;
    });

    var loadRoutes = function() {
        var deferred = $q.defer();

        $http({
            method: "GET",
            url: "http://api.metro.net/agencies/lametro/routes/",
            cache: true
        }).then(function(response) {
            var result = {};
            response.data.items.some(function(item) {
                result[item.id] = item.display_name;
                return false;
            });
            return deferred.resolve(result);
        });

        return deferred.promise;
    }

    var loadBusPredictions = function() {
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: "http://api.metro.net/agencies/lametro/stops/30021/predictions/"
        }).then(function(response) {
            //          // DEBUG
            //          items = [{"block_id": "2220100", "run_id": "222_50_1", "seconds": 923.0, "is_departing": false, "route_id": "222", "minutes": 2.0},
            //            {"block_id": "2220300", "run_id": "222_48_0", "seconds": 2017.0, "is_departing": false, "route_id": "222", "minutes": 5.0},
            //            {"block_id": "2220300", "run_id": "222_48_0", "seconds": 2460.0, "is_departing": false, "route_id": "222", "minutes": 10.0},
            //            {"block_id": "1690100", "run_id": "169_109_1", "seconds": 3314.0, "is_departing": true, "route_id": "169", "minutes": 10.0},
            //            {"block_id": "2220200", "run_id": "222_50_1", "seconds": 3453.0, "is_departing": false, "route_id": "222", "minutes": 15.0},
            //            {"block_id": "2220802", "run_id": "222_48_0", "seconds": 5223.0, "is_departing": false, "route_id": "222", "minutes": 20.0},
            //            {"block_id": "2221002", "run_id": "222_50_1", "seconds": 5625.0, "is_departing": false, "route_id": "901", "minutes": 93.0},
            //            {"block_id": "2221002", "run_id": "222_50_1", "seconds": 5625.0, "is_departing": false, "route_id": "102", "minutes": 293.0}]
            //          deferred.resolve items
            return deferred.resolve(response.data.items);
        });

        return deferred.promise;
    }

    var getMetroBusSchedule = function() {
        loadBusPredictions().then(function(response) {
            var result = [];
            result = _.chain(response).groupBy('route_id').map(function(v, k) {
                return {
                    route_id: k,
                    route: routesList[k],
                    times: _.map(v, 'minutes'),
                    color: 'rgb(255, 165, 0)'
                };
            }).sortBy(function(o) {
                return o.times[0];
            }).value();

            return result;
        });
    }

});