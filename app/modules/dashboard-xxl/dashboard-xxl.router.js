angular.module('app').config(function($stateProvider) {
    $stateProvider
    .state('dashboard-xxl', {
      abstract: true,
      url: '/xxl',
      template: '<ui-view/>',
      controllerAs: '$ctrl'
    })
    .state('dashboard-xxl.root', {
      url: '/',
      template: '<ui-view/>',
      controller: function($state) {
  
        $state.go('dashboard-xxl.all');
      }
    })
    .state('dashboard-xxl.all', {
      url: '/all',
      templateUrl: 'modules/dashboard-xxl/dashboard-xxl.all.html',
      controllerAs: '$ctrl',
      controller: function($state) {
  
        this.getScreenUrl = function(screenId) {
          return $state.href('dashboard-xxl.screen', {
            screenId: screenId
          });
        };
        return this;
      }
    })
    .state('dashboard-xxl.screen', {
      url: '/{screenId}',
      controllerAs: '$ctrl',
      controllerProvider: function($stateParams, $controller) {
  
        var ctrlExists, ctrlName, err, screenId;
        screenId = $stateParams.screenId;
        ctrlName = "DashboardXxlScreen" + screenId + "Controller";
        ctrlExists = true;
        try {
          $controller(ctrlName, {
            $scope: {}
          }, true);
        } catch (error) {
          err = error;
          ctrlExists = false;
        }
        if (ctrlExists) {
          return ctrlName;
        } else {
          return void 0;
        }
      },
      templateUrl: function($stateParams) {
        return "modules/dashboard-xxl/dashboard-xxl.screen-" + $stateParams.screenId + ".html";
      }
    });
  });