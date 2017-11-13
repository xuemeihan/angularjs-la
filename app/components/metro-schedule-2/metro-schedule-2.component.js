var app = angular.module('app');

  app.component('metroSchedule2', {
    templateUrl: 'components/metro-schedule-2/metro-schedule-2.html',
    transclude: {
      metroScheduleTitle: '?metroScheduleTitle',
      metroScheduleList: '?metroScheduleList'
    },
    bindings: {
      predictions: '<'
    }
  });