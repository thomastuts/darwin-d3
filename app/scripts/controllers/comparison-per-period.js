'use strict';

angular.module('darwinD3App')
  .controller('ComparisonPerPeriodCtrl', function ($scope, Fixtures, Parameters) {
    $scope.params = Parameters.params;

    $scope.$watch('params', function (newVal, oldVal) {
      console.log('updated params from other controller!');
    }, true);

  });
