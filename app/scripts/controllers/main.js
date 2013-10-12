'use strict';

angular.module('darwinD3App')
  .controller('MainCtrl', function ($scope, Fixtures, Layout, Data) {
    Data.fullData().then(function (result) {
      $scope.data = crossfilter(result.data);
      $scope.uniqueDates = _.uniq(_.pluck(result.data, 'period')).reverse();

      $scope.startDate = $scope.uniqueDates[0];
      $scope.endDate = $scope.uniqueDates[$scope.uniqueDates.length - 1];

      var filterExample = Data.filterByPeriod(result.data, '2013-09-30', '2013-09-29');
      console.log(filterExample);

//      console.log(_.groupBy(result.data, function (d) {
//        return d.period;
//      }));

      $scope.metricsByAdvocacy = $scope.data.dimension(function (d) {
        return d.advocacy;
      });

      $scope.metricsByDate = $scope.data.dimension(function (d) {
        return moment(d.period).unix();
      });

//      console.log($scope.metricsByDate.bottom(Infinity));

//      console.log(Data.filterByPeriod(result.data, '2013-09-29', '2013-09-30'));

//      console.log($scope.metricsByAdvocacy.top(Infinity));

      $scope.minDate = '2013-10-10';
      $scope.maxDate = '2013-10-15';

      $scope.open = function() {
        $timeout(function() {
          $scope.opened = true;
        });
      };

      $scope.dateOptions = {
        'year-format': "'yy'"
      };
    });

  });
