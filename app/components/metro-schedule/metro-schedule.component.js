var app = angular.module('app');

  app.component('metroSchedule', {
    templateUrl: 'components/metro-schedule/metro-schedule.html',
    transclude: {
      metroScheduleTitle: '?metroScheduleTitle',
      metroScheduleList: '?metroScheduleList'
    },
    bindings: {
      predictions: '<'
    }
  });