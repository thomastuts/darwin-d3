'use strict';

angular.module('darwinD3App')
  .controller('ParametersCtrl', function ($scope, Data, Parameters, Layout) {
    $scope.params = Parameters.params;
    var datapointsVisible = true;

    Data.getData().then(function (result) {
      $scope.availableDates = _.uniq(_.pluck(result.data, 'period')).reverse();
    });

    $scope.toggleNetwork = function (network) {
      if (_.contains($scope.params.selectedNetworks, network)) {
        $scope.params.selectedNetworks = _.without($scope.params.selectedNetworks, network);
      }
      else {
        $scope.params.selectedNetworks.push(network);
      }
    };

    $scope.isSelectedNetwork = function (network) {
      return _.contains($scope.params.selectedNetworks, network);
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
