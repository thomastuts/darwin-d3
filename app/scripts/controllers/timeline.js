'use strict';

angular.module('darwinD3App')
  .controller('TimelineCtrl', function ($scope, Fixtures, Layout, Data, Parameters) {
    Data.getData().then(function (result) {
      $scope.uniqueDates = _.uniq(_.pluck(result.data, 'period')).reverse();
      $scope.params = Parameters.params;

      $scope.startDate = '2013-09-08';
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

      var svg = d3.select('#graph-timeline').append('svg')
        .attr({
          width: width + margin.left + margin.right,
          height: height + margin.top + margin.right
        })
        .append('g')
        .attr({
          transform: 'translate(' + margin.left + ',' + margin.top + ')'
        });

      $scope.getSeriesNames = function () {
        return d3.keys($scope.dataset[0])
          .filter(function (d) {
            return d !== 'period';
          });
      };

      $scope.parseDatasetDates = function () {
        $scope.dataset.forEach(function (d) {
          d.period = parseDate(d.period);
        });
      };

      $scope.parseDatasetDates();

      $scope.getSources = function () {
        return seriesNames.map(function (source) {
          return {
            name: source,
            values: $scope.dataset.map(function (d) {
              return {
                period: d.period,
                amount: d[source]
              };
            })
          };
        });
      };

      var seriesNames = $scope.getSeriesNames();
      var sources = $scope.getSources();
      var source;

      $scope.setDomains = function () {
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
      };

      $scope.renderInitialGraph = function () {
        $scope.setDomains();

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

        source = svg.selectAll('.source')
          .data(sources)
          .enter().append('g')
          .attr('class', function (d, i) {
            return 'series ' + seriesNames[i];
          });

        source.append('path')
          .attr({
            'class': 'line',
            d: function (d) {
              return line(d.values);
            }
          });

        source.append('g').selectAll('circle')
          .data(function (d) {
            return d.values;
          })
          .enter()
          .append('circle')
          .attr({
            'class': 'datapoint',
            r: Layout.circleRadius,
            cx: function (d) {
              return x(d.period);
            },
            cy: function (d) {
              return y(d.amount);
            }
          });
      };

      $scope.renderInitialGraph();

      $scope.updateGraph = function () {
        console.log('updating graph');
        $scope.params.startDate = $scope.startDate;
        // update data
        $scope.dataset = Data.getPeriodData(result.data, $scope.startDate, $scope.endDate, ['facebook', 'twitter'], 'advocacy');

        $scope.parseDatasetDates();

        sources = $scope.getSources();

        // update domains
        $scope.setDomains();

        // update lines
        var sel = svg.selectAll('.series')
          .data(sources);

        sel
          .select('path')
          .transition()
          .ease(Layout.easeMethod)
          .duration(Layout.dataUpdateDuration)
          .attr('d', function (d) {
            return line(d.values);
          });

        sel
          .selectAll('.datapoint')
          .data(function (d) {
            return d.values;
          })
          .transition()
          .ease(Layout.easeMethod)
          .duration(Layout.dataUpdateDuration)
          .attr({
            cx: function (d) {
              return x(d.period);
            },
            cy: function (d) {
              return y(d.amount);
            }
          });


        console.log(Parameters);
      };

      $scope.$watch('Parameters.StartDate', function () {
        console.log('updated parameters!');
      });

    });
  });
