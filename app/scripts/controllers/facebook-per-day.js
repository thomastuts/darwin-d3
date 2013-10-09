'use strict';

angular.module('darwinD3App')
  .controller('FacebookPerDayCtrl', function ($scope, Fixtures, Layout, Dazzle) {
    $scope.network = 'facebook';
    $scope.fixtureData = Fixtures.timeline.data;
    $scope.selectedDay = $scope.fixtureData[0];
    $scope.dataset = $scope.fixtureData[0].sources[$scope.network].stats;

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

    var svg = d3.select('#facebook-per-day')
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

    svg.append('g')
      .attr({
        'class': 'axis',
        transform: 'translate(0,' + (h - padding) + ')'
      })
      .call(xAxis);

    $scope.$watch('selectedDay', function (selectedDay) {
      $scope.dataset = selectedDay.sources[$scope.network].stats;
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
    });
  });

