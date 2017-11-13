'use strict';

var app = angular.module('app');

  app.service('Repeater', function ($interval) {

    var runningTasks = {};

    return {

      run: function(id, task, interval, run_immediately) {
        if (run_immediately === true)
          task();

        if (angular.isUndefined(runningTasks[id])) {
          runningTasks[id] = $interval(task, interval);
        }
      },

      stop: function(id) {
        if (angular.isDefined(runningTasks[id])) {
          $interval.cancel(runningTasks[id]);
          runningTasks[id] = undefined;
        }
      }

    };

  });
