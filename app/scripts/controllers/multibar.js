'use strict';

angular.module('darwinD3App')
  .controller('MultibarCtrl', function ($scope, Data, Layout, Parameters) {
    $scope.params = Parameters.params;

    Data.getData().then(function (result) {
      $scope.dataset = Data.getMultibarData(result.data, '2013-09-15', '2013-09-30', 'facebook', ['advocacy', 'action', 'awareness']);
    });
  });
