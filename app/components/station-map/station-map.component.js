var app = angular.module('app');

  app.component('stationMap', {
    templateUrl: 'components/station-map/station-map.html',
    controller: StationMapController,
    bindings: {
      mapIndex: '<',
      scheduleData: '='
    }
  });