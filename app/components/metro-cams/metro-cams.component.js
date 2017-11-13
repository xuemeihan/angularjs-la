var app = angular.module('app');

  app.component('metroCams', {
    templateUrl: 'components/metro-cams/metro-cams.html',
    controller: MetroCamsController,
    bindings: {
      data: '<'
    }
  });