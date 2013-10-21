'use strict';

angular.module('darwinD3App')
  .controller('DonutCtrl', function ($scope, Data, Layout, Parameters) {
    $scope.params = Parameters.params;
    Data.getData().then(function (result) {
      $scope.dataset = Data.getDonutData(result.data, $scope.params.startDate, $scope.params.endDate, 'facebook', ['advocacy', 'appreciation', 'awareness']);

      var width = 960,
        height = 500,
        radius = Math.min(width, height) / 2;

      var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);

      var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.amount; });

      var svg = d3.select("#graph-donut").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var g = svg.selectAll(".arc")
        .data(pie($scope.dataset))
        .enter().append("g")
        .attr("class", "arc");

      $scope.renderInitialGraph = function () {
        g.append("path")
          .attr({
            d: arc,
            'class': function (d) {
              return d.data.metric;
            }
          });

        g.append("text")
          .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
          .attr("dy", ".35em")
          .style("text-anchor", "middle")
          .text(function(d) { return d.data.metric; });
      };

      $scope.renderInitialGraph();

      $scope.updateGraph = function () {
        $scope.dataset = Data.getDonutData(result.data, $scope.params.startDate, $scope.params.endDate, 'facebook', ['advocacy', 'appreciation', 'awareness']);

        var sel = svg.selectAll(".arc")
          .data(pie($scope.dataset));

        var arcs = sel.selectAll('path');
      };

      $scope.$watch('params', function (newValue, oldValue) {
        $scope.updateGraph();
      }, true);

    });
  });
