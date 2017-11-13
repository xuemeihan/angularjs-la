var app = angular.module('app');

app.component('weatherWidget', {
    templateUrl: 'components/weather-widget/weather-widget.html',
    //controllerAs: '$ctrl',
    controller: WeatherWidgetController,
    bindings: {
        cityId: '<'
    }
});

WeatherWidgetController.$inject = ['$scope', '$http'];
function WeatherWidgetController($scope, $http) {

    var weatherData = {};
    
    loadWeatherData($http).then(function(data) {
        return weatherData = {
            temp: data.main.temp,
            units: '°',
            weatherId: data.weather[0].id,
            description: data.weather[0].description
        };
    });
}

function loadWeatherData($http) {

    // TODO refactor
    var appId = '56f22ed5d33c2e168edcd777ae2913ba';
    // cityId = '4885983' // Burbank # 90012
    // cityZip = '90012' // LA
    var cityId = '5368361'; // LA
    // body...
    return $http.get("http://api.openweathermap.org/data/2.5/weather", {
        params: {
            mode: 'json',
            lang: 'en',
            units: 'imperial',
            appid: appId,
            id: cityId
        }
    }).then(function(response) {
        return response.data;
    }, function(error) {
        return console.log('error', error);
    });
}


