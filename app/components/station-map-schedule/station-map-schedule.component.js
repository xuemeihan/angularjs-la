var app = angular.module('app');

  app.component('stationMapSchedule', {
    templateUrl: 'components/station-map-schedule/station-map-schedule.html',
    transclude: {
      metroScheduleTitle: '?metroScheduleTitle',
      metroScheduleList: '?metroScheduleList'
    },
    bindings: {
      predictions: '<'
    }
  });
