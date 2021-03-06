'use strict';

angular.module('darwinD3App')
  .controller('DonutCtrl', function ($scope, Data, Layout, Parameters) {
    $scope.params = Parameters.params;
    var isGraphRendered = false;
    var dimensions = Layout.getDimensions().donut;

    var tip = d3.tip().attr('class', 'd3-tip').html(function (d) {
      return d.data.metric + ' - ' + d.data.amount;
    });

    Data.getData().then(function (result) {
      $scope.dataset = Data.getDonutData(result.data, $scope.params.startDate, $scope.params.endDate, $scope.params.metricComparison.selectedNetwork, $scope.params.metricComparison.selectedMetrics);
      d3.select('#update').on('click', function () {
        $scope.updateGraph();
      });

      var width = dimensions.width,
        height = dimensions.height,
        radius = Math.min(width, height) / 2;

      var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 40);

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

      svg.call(tip);

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
          })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);

        isGraphRendered = true;
      };

      $scope.renderInitialGraph();

      $scope.updateGraph = function () {
        $scope.dataset = Data.getDonutData(result.data, $scope.params.startDate, $scope.params.endDate, $scope.params.metricComparison.selectedNetwork, $scope.params.metricComparison.selectedMetrics);

        arcs = arcs.data(pie($scope.dataset), function (d) {
          return d.data.metric;
        });

        // Remove unused arcs
        arcs
          .exit()
          .transition()
          .duration(1000)
          .attrTween("d", arcTween)
          .remove();

        // Add new arcs
        arcs
          .enter()
          .append('path')
          .attr(arcAttributes).each(function (d) {
            this._current = d;
          })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);;

        // Transition new arcs
        arcs
          .transition()
          .duration(1000)
          .attrTween("d", arcTween);
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
