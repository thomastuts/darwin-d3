'use strict';

angular.module('darwinD3App')
  .controller('MainCtrl', function ($scope, Fixtures, Layout) {
    $scope.fixtureData = Fixtures.timeline;
  });
