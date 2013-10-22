'use strict';

angular.module('darwinD3App')
  .controller('MultibarCtrl', function ($scope, Data, Layout, Parameters) {
    $scope.params = Parameters.params;
    var isGraphRendered = false;

    Data.getData().then(function (result) {
      $scope.dataset = Data.getMultibarData(result.data, $scope.params.startDate, $scope.params.endDate, 'facebook', ['advocacy', 'appreciation', 'awareness']);

      var parseDate = d3.time.format("%Y-%m-%d").parse;

      var tip = d3.tip().attr('class', 'd3-tip').html(function (d) {
        return moment(d.period).format('MMM Do YYYY') + ': ' + d.amount;
      });

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

      var svg = d3.select('#graph-multibar').append('svg')
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

      $scope.setDomains = function () {
        x.domain(d3.extent($scope.dataset, function (d) {
          return d.period;
        }));
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
        console.log(sources);
        xAxis.ticks(sources[0].values.length);

        svg.selectAll('.x.axis')
          .call(xAxis);
        svg.selectAll('.y.axis')
          .call(yAxis);
      };

      var rectAttributes = {
        x: function (d) {
          return x(d.period);
        },
        y: function (d) {
          return y(d.amount);
        },
        width: function () {
          return (width - 200) / sources[0].values.length / sources.length;
        },
        height: function (d) {
          return height - y(d.amount);
        }
      };


      $scope.renderInitialGraph = function () {
        $scope.setDomains();

        xAxis.ticks(sources[0].values.length);

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
          .attr({
            'class': function (d, i) {
              return 'series ' + d.name;
            },
            transform: function (d, i) {
              return 'translate(' + ((width - 200) / sources[0].values.length / sources.length) * i + ',0)';
            }
          });

        source.selectAll('rect')
          .data(function (d) {
            return d.values;
          })
          .enter()
          .append('rect')
          .attr(rectAttributes)
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);

        isGraphRendered = true;
      };

      $scope.renderInitialGraph();

      $scope.updateGraph = function () {
        $scope.dataset = Data.getMultibarData(result.data, $scope.params.startDate, $scope.params.endDate, 'facebook', ['advocacy', 'appreciation', 'awareness']);
        $scope.parseDatasetDates();
        sources = $scope.getSources();

        $scope.setDomains();
        $scope.updateAxes();

        var sel = svg.selectAll('.series')
          .data(sources, function (d) {
            return d.name;
          })
          .attr({
            transform: function (d, i) {
              return 'translate(' + ((width - 200) / sources[0].values.length / sources.length) * i + ',0)';
            }
          });

        var rects = sel.selectAll('rect')
          .data(function (d) {
            return d.values;
          });

        rects
          .enter()
          .append('rect')
          .attr(rectAttributes)
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);

        rects.exit().remove();

        rects
          .transition()
          .duration(Layout.dataUpdateDuration)
          .ease(Layout.easeMethod)
          .attr(rectAttributes);
      };

      $scope.$watch('params', function (newValue, oldValue) {
        if (isGraphRendered) {
          $scope.updateGraph();
        }
      }, true);
    });

  });
