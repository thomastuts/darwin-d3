'use strict';

angular.module('darwinD3App')
  .controller('ParametersCtrl', function ($scope, Data, Parameters, Layout) {
    $scope.params = Parameters.params;
    var datapointsVisible = true;

    Data.getData().then(function (result) {
      $scope.availableDates = _.uniq(_.pluck(result.data, 'period')).reverse();
      $scope.minDate = $scope.availableDates[0];
      $scope.maxDate = $scope.availableDates[$scope.availableDates.length - 1];
    });

    $scope.toggleNetwork = function (network) {
      if (_.contains($scope.params.networkComparison.selectedNetworks, network)) {
        $scope.params.networkComparison.selectedNetworks = _.without($scope.params.networkComparison.selectedNetworks, network);
      }
      else {
        $scope.params.networkComparison.selectedNetworks.push(network);
      }
    };

    $scope.isSelectedNetwork = function (network) {
      return _.contains($scope.params.networkComparison.selectedNetworks, network);
    };

    $scope.toggleMetric = function (metric) {
      if (_.contains($scope.params.metricComparison.selectedMetrics, metric)) {
        $scope.params.metricComparison.selectedMetrics = _.without($scope.params.metricComparison.selectedMetrics, metric);
      }
      else {
        $scope.params.metricComparison.selectedMetrics.push(metric);
      }
    };

    $scope.isSelectedMetric = function (metric) {
      return _.contains($scope.params.metricComparison.selectedMetrics, metric);
    };

    $scope.toggleDatapoints = function () {
      d3.selectAll('.datapoint')
        .transition()
        .duration(500)
        .attr({
          r: datapointsVisible ? 0 : Layout.circleRadius
        });

      datapointsVisible = !datapointsVisible;
    };
  });
