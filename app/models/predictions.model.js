var app = angular.module('app');

app.factory('PredictionsModel', function($http, $q) {

    return ({
        railLocal: railLocal,
        railRegional: railRegional,
        metroBus: metroBus,
        bikeShare: bikeShare,
        twitter: twitter,
        advisories: advisories,
        getDiectionsData: getDiectionsData,
        metroAlerts: metroAlerts,
        stationBus: stationBus
    });
    function railLocal(stopId) {
        //url = "http://webservices.nextbus.com/service/publicJSONFeed?command=predictions&a=lametro-rail&stopId=#{stopId}"
        //url = "models/stubs/light-predictions.json"
        // url = "http://107.170.192.182/app.php/api/stops/light-rails" stage

        var url = "http://scalaws.riits.net/app.php/api/stops/light-rails"; // prod

        return $http.get(url).then(
            function(response) {
                var result, ref;
                result = [];
                if ((ref = response.data) != null) {
                    ref.some(function(item) {
                        var p, prediction;
                        if (!item.direction) {
                            item.prediction = {
                                prediction: []
                            };
                        }

                        if (!angular.isArray(item.direction.prediction)) {
                            item.direction.prediction = [item.direction.prediction];
                        }
                        prediction = {
                            title: item.direction.title,
                            route: item.direction.title,
                            color: item.color,
                            predictions: (function() {
                                var i, len, ref1, results;
                                ref1 = item.direction.prediction || [];
                                results = [];
                                for ( i = 0, len = ref1.length; i < len; i++) {
                                    p = ref1[i];
                                    results.push({
                                        timestamp: p.epochTime,
                                        minutes: p.minutes,
                                        seconds: p.seconds,
                                        text: +p.minutes? ("" + p.minutes + " min") + (+p.minutes > 1? 's' : '') : "< 1 min"
                                    });
                                }

                                return results;
                            })()
                        };

                        if( prediction.predictions.length == 0) {
                            prediction.predictions = [
                                {
                                    text: "Timing is not available"
                                }
                            ];
                        }

                        result.push(prediction);
                        return false;
                    });
                }

                if(result.length === 1 && result[0] === void 0) {
                    result.length = 0;
                }

                return result;
            }
        );
    }

    function railRegional(stopId) {
        // url = "http://webservices.nextbus.com/service/publicJSONFeed?command=predictions&a=lametro-rail&stopId=#{stopId}"
        // url = "models/stubs/rail-predictions.json"
        // url = "http://107.170.192.182/app.php/api/stops/region-rails" stage

        var url = "http://scalaws.riits.net/app.php/api/stops/region-rails" // prod

        return $http.get(url).then(function(response) {
            var result, ref;
            result = [];
            if ((ref = response.data) != null) {
                ref.some(function(item) {
                    var prediction;
                    prediction = {
                        id: item.id,
                        route: item.title,
                        color: item.color,
                        icon: item.icon,
                        predictions: item.scheduled_times.split(',').map(function(txt) {
                            return {
                                text: txt || "Timings is not available"
                            };
                        })
                    };

                    result.push(prediction);
                    return false;
                });
            }
            if (result.length === 1 && result[0] === void 0) {
                result.length = 0;
            }

            return result;
        });
    }

    function metroBus(stopId) {
        var url;

        url = "http://scalaws.riits.net/app.php/api/stops/buses"; //prod

        return $http.get(url).then(function(response) {
            var result, ref;
            response.data = response.data.filter(function(item){
                return item;
            });

            result = [];
            if ((ref = response.data) != null) {
                ref.some(function(item) {
                    var prediction;
                    prediction = {
                        id: item.id,
                        route: item.title,
                        color: item.color,
                        predictions: item.scheduled_times.split(',').map(function(txt) {
                            return {
                                text: txt || 'Timings is not avaialle'
                            };
                        })
                    };

                    result.push(prediction);

                    return false;
                });
            }

            if (result.length === 1 && result[0] === void 0) {
                result.length = 0;
            }
            return result;
        });
    }

    function bikeShare(stations) {
        var url;
        url = "http://scalaws.riits.net/app.php/api/stops/bike-share";
        return $http.get(url).then(function(response) {
            return _.map(response.data, function(item) {
                return item.properties;
            });
        });
    }

    function twitter(stations) {
        var url;
        url = "http://scalaws.riits.net/app.php/api/tweets";
        return $http.get(url).then(function(response) {
            return response.data;
        });
    }

    function advisories(texts) {
        var url = "http://scalaws.riits.net/app.php/api/adviser";
        return $http.get(url).then(function(response) {
            return response.data;
        });
    }

    function getDiectionsData(texts) {
        var url = "http://scalaws.riits.net/api/route-stops?orig=-118.37380526389, 34.019311328588&dest=-118.04452116127, 34.07227186734";

        return $http.get(url).then(function(response) {
            return response.data;
        });
    }

    function metroAlerts(texts) {
        var url = "http://scalaws.riits.net/app.php/api/tweets/light-rails-alerts";
        return $http.get(url).then(function(response) {
            var filtered;
            filtered = [];

            response.data.forEach(function(item) {
                if (item.hasAlert) {
                    return filtered.push(item);
                }
            });

            return filtered;
        });
    }

    function stationBus(stationId) {
        var url = "http://socaltransport.org/tm/node_time_v2.php?format=json&node_id=" + stationId;

        return $http.get(url).then(function(response) {
            var result = response.data.node_time;
            result = _.chain(result.filter(function(item) {
                return !!item;
            }).map(function(val, key) {
                var p;
                val.scheduled_times = val.scheduled_times.split(',');
                val.predictions = (function() {
                    var i, len, ref, results;
                    ref = val.scheduled_times;
                    results = [];
                    for (i = 0, len = ref.length; i < len; i++) {
                        p = ref[i];
                        results.push({
                            text: p
                        });
                    }

                    return results;
                })();
                return val;
            }).groupBy(function(item) {
                var ref;
                return +((ref = item.location) != null ? ref.split(' BAY ')[1] : void 0);
            }).reduce((function(res, val, key){
                res[key] = val;
                res[key] = res[key].slice(0, 5);
                return res;
            }), {}.value()));
            return result;
        });
    }
});