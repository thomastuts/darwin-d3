'use strict';

angular.module('darwinD3App')
  .controller('TimelineCtrl', function ($scope, Fixtures, Layout, Data) {
    Data.getData().then(function (result) {
      $scope.uniqueDates = _.uniq(_.pluck(result.data, 'period')).reverse();

      $scope.startDate = '2013-09-23';
      $scope.endDate = '2013-09-30';

      $scope.visibleNetworks = ['facebook', 'twitter'];

      $scope.dataset = Data.getPeriodData(result.data, $scope.startDate, $scope.endDate, ['facebook', 'twitter'], 'advocacy');

      $scope.selectedMetric = 'advocacy';

      var parseDate = d3.time.format("%Y-%m-%d").parse;

      var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      var x = d3.time.scale()
        .range([0, width]);

      var y = d3.scale.linear()
        .range([height, 0]);

      var color = d3.scale.category10();

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

      var line = d3.svg.line()
        .x(function (d) {
          return x(d.period);
        })
        .y(function (d) {
          return y(d.amount);
        });

      var svg = d3.select('body').append('svg')
        .attr({
          width: width + margin.left + margin.right,
          height: height + margin.top + margin.right
        })
        .append('g')
        .attr({
          transform: 'translate(' + margin.left + ',' + margin.top + ')'
        });

      color.domain(d3.keys($scope.dataset[0]).filter(function (key) {
        return key !== 'period';
      }));

      $scope.dataset.forEach(function (d) {
        d.period = parseDate(d.period);
      });

      var sources = color.domain().map(function (name) {
        return {
          name: name,
          values: $scope.dataset.map(function (d) {
            return {
              period: d.period,
              amount: d[name]
            };
          })
        };
      });

      x.domain(d3.extent($scope.dataset, function (d) {
        return d.period;
      })).nice();

      y.domain([
        d3.min(sources, function (s) {
          return d3.min(s.values, function (v) {
            return v.amount;
          });
        }),
        d3.max(sources, function (s) {
          return d3.max(s.values, function (v) {
            return v.amount;
          });
        })
      ]).nice();

      svg.append('g')
        .attr({
          'class': 'x axis',
          transform: 'translate(0,' + height + ')'
        })
        .call(xAxis);

      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr({
          transform: 'rotate(-90)',
          y: 6,
          dy: '.71em'
        })
        .style('text-anchor', 'end')
        .text($scope.selectedMetric);

      var source = svg.selectAll('.source')
        .data(sources)
        .enter().append('g')
        .attr('class', 'source');

      source.append('path')
        .attr({
          'class': 'line',
          d: function (d) {
            console.log(d);
            return line(d.values);
          }
        });

    });
  });
