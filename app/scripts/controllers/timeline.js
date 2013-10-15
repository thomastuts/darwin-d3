'use strict';

angular.module('darwinD3App')
  .controller('TimelineCtrl', function ($scope, Fixtures, Layout, Data) {
    Data.getData().then(function (result) {
      $scope.uniqueDates = _.uniq(_.pluck(result.data, 'period')).reverse();

      $scope.startDate = '2013-09-23';
      $scope.endDate = '2013-09-30';

      $scope.visibleNetworks = ['facebook', 'twitter'];
      
      $scope.selectedMetric = 'advocacy';

      $scope.periodData = {};

      Data.getPeriodData(result.data, $scope.startDate, $scope.endDate, ['facebook', 'twitter'], 'advocacy');

//      $scope.getPeriodData = function () {
//        $scope.periodData.facebook = Data.filterBySource(Data.filterByPeriod(result.data, $scope.startDate, $scope.endDate), 'facebook');
//        $scope.periodData.twitter = Data.filterBySource(Data.filterByPeriod(result.data, $scope.startDate, $scope.endDate), 'twitter');
//      };
//
//      $scope.getPeriodData();
//
//      var margin = {top: 20, right: 20, bottom: 30, left: 50},
//        width = 800 - margin.left - margin.right,
//        height = 500 - margin.top - margin.bottom;
//
//      // Render initial chart
//      var x = d3.time.scale()
//        .range([0, width]);
//
//      var y = d3.scale.linear()
//        .range([height, 0]);
//
//      var xAxis = d3.svg.axis()
//        .scale(x)
//        .orient("bottom");
//
//      var yAxis = d3.svg.axis()
//        .scale(y)
//        .orient("left");
//
//      var line = d3.svg.line()
//        .x(function (d) {
//          return x(d.period);
//        })
//        .y(function (d) {
//          return y(d[$scope.selectedMetric]);
//        });
//
//      var line2 = d3.svg.line()
//        .x(function (d) {
//          return x(d.period);
//        })
//        .y(function (d) {
//          return y(d[$scope.selectedMetric]);
//        });
//
//      var svg = d3.select('#graph-timeline').append('svg')
//        .attr({
//          width: width + margin.left + margin.right,
//          height: height + margin.top + margin.bottom
//        })
//        .append('g')
//          .attr({
//            transform: 'translate(' + margin.left + ',' + margin.top + ')'
//          });
//
//      $scope.renderInitialGraph = function () {
//        x.domain(d3.extent($scope.periodData.facebook, function (d) {
//          return d.period;
//        }));
//        y.domain(d3.extent($scope.periodData.facebook, function (d) {
//          return d[$scope.selectedMetric];
//        }));
//
//        svg.append('g')
//          .attr({
//            'class': 'x axis',
//            transform: 'translate(0,' + height + ')'
//          })
//          .call(xAxis);
//
//
//        svg.append('g')
//          .attr({
//            'class': 'y axis'
//          })
//          .call(yAxis)
//          .append('text')
//          .attr({
//            transform: 'rotate(-90)',
//            y: 6,
//            dy: '.71em'
//          })
//          .style('text-anchor', 'end')
//          .text('Advocacy');
//
//        svg.append('path')
//          .datum($scope.periodData.facebook)
//          .attr("class", "line " + 'facebook')
//          .attr("d", line);
//
//        svg.append('path')
//          .datum($scope.periodData.twitter)
//          .attr("class", "line " + 'twitter')
//          .attr("d", line2);
//
//        svg.selectAll('.datapoint.facebook')
//          .data($scope.periodData.facebook)
//          .enter()
//          .append('circle')
//          .attr({
//            cx: function (d) {
//              return x(d.period);
//            },
//            cy: function (d) {
//              return y(d[$scope.selectedMetric]);
//            },
//            r: 7,
//            'class': 'datapoint ' + 'facebook'
//          });
//
//        svg.selectAll('.datapoint.twitter')
//          .data($scope.periodData.twitter)
//          .enter()
//          .append('circle')
//          .attr({
//            cx: function (d) {
//              return x(d.period);
//            },
//            cy: function (d) {
//              return y(d[$scope.selectedMetric]);
//            },
//            r: 7,
//            'class': 'datapoint ' + 'twitter'
//          });
//
//        d3.selectAll('.datapoint')
//          .on('click', function (d) {
//            console.log(d);
//            console.log(d3.select(this));
//          });
//
//      };
//
//      $scope.updateGraph = function () {
//        $scope.getPeriodData();
//
//        x.domain(d3.extent($scope.periodData, function (d) {
//          return d.period;
//        }));
//        y.domain(d3.extent($scope.periodData, function (d) {
//          return d[$scope.selectedMetric];
//        }));
//
//        console.log('Rebuilding graph');
//
//        // update scales
//
//        // update line graph
//        svg.selectAll('path')
//          .datum($scope.periodData)
//          .attr('d', line)
//          .transition()
//          .duration(500);
//
//        svg.selectAll('circle').remove();
//
//        // update circles
//        var circles = svg.selectAll('circle')
//          .data($scope.periodData);
//
//        circles.enter()
//          .append('circle')
//          .attr({
//            cx: function (d) {
//              return x(d.period);
//            },
//            cy: function (d) {
//              return y(d[$scope.selectedMetric]);
//            },
//            r: 7,
//            'class': 'datapoint ' + 'facebook'
//          });
//
//      };
//
//      $scope.renderInitialGraph();

    });
  });
