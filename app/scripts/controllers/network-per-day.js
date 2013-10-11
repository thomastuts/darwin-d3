'use strict';

angular.module('darwinD3App')
  .controller('NetworkPerDayCtrl', function ($scope, Fixtures, Layout, Dazzle) {

    $scope.availableNetworks = Fixtures.networks;
    $scope.selectedNetwork = 'facebook';

    $scope.fixtureData = Fixtures.dummyData.timeline.data;
    $scope.selectedDay = $scope.fixtureData[0];

    $scope.dataset = $scope.fixtureData[0].sources[$scope.selectedNetwork].stats;

    var w = Layout.width;
    var h = Layout.height;
    var padding = 30;

    var xScale = d3.scale.ordinal()
      .domain($scope.dataset.map(function (d) {
        return d.type;
      }))
      .rangeRoundBands([0, w], 0.05);

    var yScale = d3.scale.linear()
      .domain([0, d3.max($scope.dataset, function (d) {
        return d.amount;
      })])
      .range([0, h])
      .nice();

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom');

    var svg = d3.select('#network-per-day')
      .append('svg')
      .attr({
        width: w,
        height: h
      });

    svg.selectAll('rect')
      .data($scope.dataset)
      .enter()
      .append('rect')
      .attr({
        x: function (d) {
          return xScale(d.type);
        },
        y: function (d) {
          return h - yScale(d.amount) - padding;
        },
        width: xScale.rangeBand(),
        height: function (d) {
          return yScale(d.amount);
        },
        fill: 'teal'
      });

    svg.selectAll('text')
      .data($scope.dataset)
      .enter()
      .append('text')
      .attr({
        x: function (d) {
          return xScale(d.type) + (xScale.rangeBand() / 2);
        },
        y: function () {
          return h - padding - 15;
        },
        fill: 'white',
        'text-anchor': 'middle'
      })
      .text(function (d) {
        return d.amount;
      });

    svg.append('g')
      .attr({
        'class': 'axis',
        transform: 'translate(0,' + (h - padding) + ')',
        fill: 'white'
      })
      .call(xAxis);

    $scope.$watch('selectedDay', function () {
      $scope.updateGraph();
    });

    $scope.$watch('selectedNetwork', function () {
      $scope.updateGraph();
    });

    $scope.updateGraph = function () {
      // TODO: update scale

      $scope.dataset = $scope.selectedDay.sources[$scope.selectedNetwork].stats;
      svg.selectAll('rect')
        .data($scope.dataset)
        .transition()
        .ease(Dazzle.animation.easing)
        .duration(Dazzle.animation.updateDuration)
        .attr({
          y: function (d) {
            return h - yScale(d.amount) - padding;
          },
          height: function (d) {
            return yScale(d.amount);
          }
        });

      svg.selectAll('text')
        .data($scope.dataset)
        .text(function (d) {
          return d.amount;
        });
    };
  });

