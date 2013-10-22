'use strict';

angular.module('darwinD3App')
  .controller('DonutCtrl', function ($scope, Data, Layout, Parameters) {
    $scope.params = Parameters.params;
    var isGraphRendered = false;
    Data.getData().then(function (result) {
      $scope.dataset = Data.getDonutData(result.data, $scope.params.startDate, $scope.params.endDate, 'facebook', ['advocacy', 'appreciation', 'awareness']);
      d3.select('#update').on('click', function () {
        $scope.updateGraph();
      });

      var width = 300,
        height = 300,
        radius = Math.min(width, height) / 2;

      var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);

      var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
          return d.amount;
        });

      var svg = d3.select("#graph-donut").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var arcs;

      var arcAttributes = {
        d: arc,
        'class': function (d) {
          return d.data.metric;
        }
      };

      $scope.renderInitialGraph = function () {
        arcs = svg.selectAll('path')
          .data(pie($scope.dataset), function (d) {
            return d.data.metric;
          })
          .enter()
          .append('path')
          .attr(arcAttributes).each(function (d) {
            this._current = d;
          });

        isGraphRendered = true;
      };

      $scope.renderInitialGraph();

      $scope.updateGraph = function () {
        $scope.dataset = Data.getDonutData(result.data, $scope.params.startDate, $scope.params.endDate, 'facebook', ['advocacy', 'appreciation', 'awareness']);

        arcs = arcs.data(pie($scope.dataset));
        arcs.transition().duration(1000).attrTween("d", arcTween);
      };

      function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function (t) {
          return arc(i(t));
        };
      }

      $scope.$watch('params', function (newValue, oldValue) {
        if (isGraphRendered) {
          $scope.updateGraph();
        }
      }, true);

    });
  });
