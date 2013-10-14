'use strict';

angular.module('darwinD3App')
  .controller('TimelineCtrl', function ($scope, Fixtures, Layout, Data) {
    Data.fullData().then(function (result) {
      $scope.uniqueDates = _.uniq(_.pluck(result.data, 'period')).reverse();

      $scope.startDate = '2013-05-16';
      $scope.endDate = '2013-05-28';

      $scope.visibleNetworks = {
        facebook: true,
        twitter: true
      };

      $scope.getPeriodData = function () {
        $scope.periodData = Data.filterBySource(Data.filterByPeriod(result.data, $scope.startDate, $scope.endDate), 'facebook');
      };

      $scope.getPeriodData();

      var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      var parseDate = d3.time.format('%Y-%m-%d').parse;

      var x = d3.time.scale()
        .range([0, width]);

      var y = d3.scale.linear()
        .range([height, 0]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

      var line = d3.svg.line()
        .x(function (d) {
          return x(d.period);
        })
        .y(function (d) {
          return y(d.awareness);
        });

      var svg = d3.select('#graph-timeline').append('svg')
        .attr({
          width: width + margin.left + margin.right,
          height: height + margin.top + margin.bottom
        })
        .append('g')
          .attr({
            transform: 'translate(' + margin.left + ',' + margin.top + ')'
          });


      $scope.periodData.forEach(function(d) {
        d.period = parseDate(d.period);
      });

      x.domain(d3.extent($scope.periodData, function (d) {
        return d.period;
      }));

      y.domain(d3.extent($scope.periodData, function (d) {
        return d.awareness;
      }));


      svg.append('g')
        .attr({
          'class': 'x axis',
          transform: 'translate(0,' + height + ')'
        })
        .call(xAxis);
      svg.append('g')
        .attr({
          'class': 'y axis'
        })
        .call(yAxis)
      .append('text')
        .attr({
          transform: 'rotate(-90)',
          y: 6,
          dy: '.71em'
        })
        .style('text-anchor', 'end')
        .text('Awareness');

      svg.append('path')
        .datum($scope.periodData)
        .attr("class", "line " + 'facebook')
        .attr("d", line);

      svg.selectAll('circle')
        .data($scope.periodData)
        .enter()
        .append('circle')
        .attr({
          cx: function (d) {
            return x(d.period);
          },
          cy: function (d) {
            return y(d.awareness);
          },
          r: 7,
          'class': 'datapoint ' + 'facebook'
        });

    });
  });
