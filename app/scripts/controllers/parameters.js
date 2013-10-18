'use strict';

angular.module('darwinD3App')
  .controller('ParametersCtrl', function ($scope, Data, Parameters) {
    $scope.params = Parameters.params;

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
      $('.datapoint').fadeToggle();
    };

  });
