'use strict';

angular.module('darwinD3App')
  .controller('TimelineCtrl', function ($scope, Layout, Data, Parameters) {
    Data.getData().then(function (result) {
      $scope.uniqueDates = _.uniq(_.pluck(result.data, 'period')).reverse();
      $scope.params = Parameters.params;
      var isGraphRendered = false;
      var datapointsVisible = true;
      var dimensions = Layout.getDimensions().timeline;

      $scope.dataset = Data.getPeriodData(result.data, $scope.params.startDate, $scope.params.endDate, $scope.params.networkComparison.selectedNetworks, $scope.params.networkComparison.selectedMetric);

      var parseDate = d3.time.format("%Y-%m-%d").parse;

      var tip = d3.tip().attr('class', 'd3-tip').html(function (d) {
        return moment(d.period).format('MMM Do YYYY') + ': ' + d.amount;
      });

      var margin = {top: 20, right: 20, bottom: 0, left: 40},
        width = dimensions.width - margin.left - margin.right,
        height = dimensions.height - margin.top - margin.bottom;

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

      svg.call(tip);

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
        seriesNames = $scope.getSeriesNames();
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

      var circleAttributes = {
        'class': 'datapoint',
        r: Layout.circleRadius,
        cx: function (d) {
          return x(d.period);
        },
        cy: function (d) {
          return y(d.amount);
        }
      };

      var pathAttributes = {
        'class': 'line',
        d: function (d) {
          return line(d.values);
        }
      };

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

      $scope.updateAxes = function () {
        svg.selectAll('.x.axis')
          .call(xAxis);
        svg.selectAll('.y.axis')
          .call(yAxis);
      };

      $scope.renderGridlines = function () {
        var gridLines = svg.selectAll("line.horizontalGrid")
          .data(y.ticks());

        var gridlineAttributes = {
          "class": "horizontalGrid",
          "x1": 0,
          "x2": width,
          "y1": function (d) {
            return y(d);
          },
          "y2": function (d) {
            return y(d);
          }
        };

        gridLines
          .exit()
          .remove();

        gridLines
          .attr(gridlineAttributes)
          .transition()
          .duration(500);

        gridLines
          .enter()
          .append("line")
          .attr(
          gridlineAttributes);

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
            return 'series ' + d.name;
          });

        source.append('path')
          .attr(pathAttributes);

        source.append('g').selectAll('circle')
          .data(function (d) {
            return d.values;
          })
          .enter()
          .append('circle')
          .attr(circleAttributes)
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);

        isGraphRendered = true;

        $scope.renderGridlines();
      };

      $scope.renderInitialGraph();

      $scope.updateGraph = function () {
        // Update data
        $scope.dataset = Data.getPeriodData(result.data, $scope.params.startDate, $scope.params.endDate, $scope.params.networkComparison.selectedNetworks, $scope.params.networkComparison.selectedMetric);

        $scope.parseDatasetDates();

        sources = $scope.getSources();

        // Update domains and scales
        $scope.setDomains();
        $scope.updateAxes();

        var sel = svg.selectAll('.series')
          .data(sources, function (d) {
            // Return the name as the unique key for this collection so that it knows which series to add/remove
            return d.name;
          });

        // Add new series if any
        var newSources = sel.enter().append('g')
          .attr('class', function (d, i) {
            return 'series ' + d.name;
          });

        // Remove series that no longer exist
        sel.exit().remove();

        // Update path
        sel
          .select('path')
          .transition()
          .ease(Layout.easeMethod)
          .duration(Layout.dataUpdateDuration)
          .attr(pathAttributes);

        // Re-add path to newly created series
        newSources.append('path')
          .attr(pathAttributes);

        var circles = sel
          .selectAll('.datapoint')
          .data(function (d) {
            return d.values;
          });

        // Update datapoints
        circles
          .transition()
          .ease(Layout.easeMethod)
          .duration(Layout.dataUpdateDuration)
          .attr(circleAttributes);

        // Add new datapoints
        circles
          .enter()
          .append('circle')
          .attr(circleAttributes)
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);

        // Remove old datapoints
        circles
          .exit()
          .remove();

        $scope.renderGridlines();
      };

      $scope.$watch('params', function (newValue, oldValue) {
        if (isGraphRendered) {
          $scope.updateGraph();
        }
      }, true);

    });
  });
