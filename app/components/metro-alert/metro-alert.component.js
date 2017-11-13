var app = angular.module('app');

  app.component('metroAlert', {
    templateUrl: 'components/metro-alert/metro-alert.html',
    transclude: {
      metroScheduleTitle: '?metroScheduleTitle',
      metroScheduleList: '?metroScheduleList'
    },
    bindings: {
      alerts: '<'
    }
  });