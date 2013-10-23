'use strict';

angular.module('darwinD3App')
  .controller('ParametersCtrl', function ($scope, Data, Parameters, Layout) {
    $scope.params = Parameters.params;
    $scope.startDateCalendar = {};
    $scope.endDateCalendar = {};
    $scope.startingDay = 1;
    $scope.showWeeks = 'false';

    Data.getData().then(function (result) {
      $scope.availableDates = _.uniq(_.pluck(result.data, 'period')).reverse();

      $scope.startDateCalendar.minDate = $scope.availableDates[0];
      $scope.endDateCalendar.maxDate = $scope.availableDates[$scope.availableDates.length - 1];

      $scope.adjustCalendar();
    });

    $scope.setNetwork = function (network) {
      $scope.params.metricComparison.selectedNetwork = network;
    };

    $scope.toggleNetwork = function (network) {
      console.log('Toggling network ' + network);
      if (_.contains($scope.params.networkComparison.selectedNetworks, network)) {
        $scope.params.networkComparison.selectedNetworks = _.without($scope.params.networkComparison.selectedNetworks, network);
      }
      else {
        $scope.params.networkComparison.selectedNetworks.push(network);
      }
    };

    $scope.isSelectedNetwork = function (network, comparison) {
      if (comparison === 'network') {
        return _.contains($scope.params.networkComparison.selectedNetworks, network) ? 'active' : '';
      }
      else if (comparison === 'metric') {
        return $scope.params.metricComparison.selectedNetwork === network ? 'active' : '';
      }
    };

    $scope.setMetric = function (metric) {
      $scope.params.networkComparison.selectedMetric = metric;
    };

    $scope.toggleMetric = function (metric) {
      if (_.contains($scope.params.metricComparison.selectedMetrics, metric)) {
        $scope.params.metricComparison.selectedMetrics = _.without($scope.params.metricComparison.selectedMetrics, metric);
      }
      else {
        $scope.params.metricComparison.selectedMetrics.push(metric);
      }
    };

    $scope.isSelectedMetric = function (metric, comparison) {
      if (comparison === 'network') {
        return $scope.params.networkComparison.selectedMetric === metric ? 'active' : '';
      }
      else if (comparison === 'metric') {
        return _.contains($scope.params.metricComparison.selectedMetrics, metric) ? 'active' : '';
      }
    };

    $scope.adjustCalendar = function () {
      $scope.endDateCalendar.minDate = $scope.params.startDate;
      $scope.startDateCalendar.maxDate = $scope.params.endDate;
    };

    $scope.$watch('params.startDate + params.endDate', function () {
      console.log('Changing');
      $scope.endDateCalendar.minDate = $scope.params.startDate;
      $scope.startDateCalendar.maxDate = $scope.params.endDate;
    });

    $scope.$watch('endDateCalendar', function () {

    });
  });
