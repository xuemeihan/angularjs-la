var app = angular.module('app');

app.component('schedule', {
    templateUrl: 'components/schedule/schedule.html',
    controller: ScheduleController,
    transclude: {
      scheduleHead: '?scheduleHead',
      scheduleList: '?scheduleList'
    },
    bindings: {
      data: '<'
    }
  });


function ScheduleController() {
  var ctrl = this;

  //this.previousData = [];
  //
  //this.$onChanges = function(changes) {
  //  //console.log('% % % %', this);
  //  //console.log('@ @ @ changes', changes, changes.data.previousValue || []);
  //
  //  // ng-class="{updated: time != $ctrl.previousData[$parent.$index].times[$index] }"
  //
  //  var pv = changes.data.previousValue;
  //  ctrl.previousData = pv && pv.length ? pv : [];
  //}
}
