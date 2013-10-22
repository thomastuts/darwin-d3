'use strict';

angular.module('darwinD3App')
  .service('Data', function Data($http) {
    return {
      parseDate: d3.time.format('%Y-%m-%d').parse,
      getData: function () {
        return $http({method: 'GET', url: 'data/full-data.json', cache: true});
      },
      periodDataCache: {},
      sourceToKey: {
        twitter: 1,
        facebook: 2,
        website: 3
      },
      keyToSource: {
        1: 'twitter',
        2: 'facebook',
        3: 'website'
      },
      getDonutData: function (data, start, end, network, metrics) {
        var periodData = this.getMultibarData(data, start, end, network, metrics);
        var dataBuffer = [];

        var tempObj = {};
        // Loop metrics and set initial value for adding values later
        for (var k = 0; k < metrics.length; k++) {
          var metric = metrics[k];
          tempObj[metric] = 0;
        }

        // Loop all entries, adding the values to each selected metric
        for (var i = 0; i < periodData.length; i++) {
          var entry = periodData[i];
          for (var j = 0; j < metrics.length; j++) {
            var metric = metrics[j];
            tempObj[metric] += entry[metric];
          }
        }

        var keys = _.keys(tempObj);
        var values = _.values(tempObj);

        for (var l = 0; l < keys.length; l++) {
          var entryKey = keys[l];
          var value = values[l];
          dataBuffer.push({
            metric: entryKey,
            amount: value
          });
        }

        return dataBuffer;
      },
      // A multibar chart contains a single network that have all metrics grouped next to each other for a visual comparison
      getMultibarData: function (data, start, end, network, metrics) {
        // select the period we need
        var periodData = this.filterByPeriod(data, start, end);
        var dataBuffer = [];
        var groupedByDate = _.groupBy(periodData, function (d) {
          return d.period;
        });

        for (var datum in groupedByDate) {
          var dataForDay = groupedByDate[datum];
          var tempObj = {};

          for (var i = 0; i < dataForDay.length; i++) {
            var entry = dataForDay[i];
            if (entry.acc_id === this.sourceToKey[network]) {
              tempObj.period = entry.period;

              for (var j = 0; j < metrics.length; j++) {
                var metric = metrics[j];
                tempObj[metric] = entry[metric];
              }
              dataBuffer.push(tempObj);
            }
          }
        }
        return dataBuffer;
      },
      getPeriodData: function (data, start, end, networks, metric) {
        var periodData = this.filterByPeriod(data, start, end);
        var dataBuffer = [];

        var groupedByDate = _.groupBy(periodData, function (d) {
          return d.period;
        });

        for (var datum in groupedByDate) {
          var dataForDay = groupedByDate[datum];

          var tempObj = {};
          for (var i = 0; i < dataForDay.length; i++) {
            var entry = dataForDay[i];
            tempObj.period = entry.period;

            for (var j = 0; j < networks.length; j++) {
              var network = networks[j];
              if (entry.acc_id === this.sourceToKey[network]) {
                tempObj[network] = entry[metric];
              }
            }
          }
          dataBuffer.push(tempObj);
        }

        return dataBuffer;
      },
      getTotalValue: function (data) {
        for (var i = 0; i < data.length; i++) {
          var datum = data[i];
          data[i].total = datum.appreciation + datum.advocacy + datum.action + datum.awareness;
        }
        return data;
      },
      parseData: function (data) {
        for (var i = 0; i < data.length; i++) {
          var datum = data[i];
          data[i].awareness = parseInt(datum.awareness);
          data[i].appreciation = parseInt(datum.appreciation);
          data[i].action = parseInt(datum.action);
          data[i].advocacy = parseInt(datum.advocacy);
        }
        return data;
      },
      filterByPeriod: function (data, start, end) {
        if (!start) {
          throw new Error('Filter needs at least one date');
        }

        if (this.periodDataCache.start === start && this.periodDataCache.end === end) {
          return this.periodDataCache.data;
        }

        end = end ? end : start;

        var dataBuffer = [];

        for (var i = 0; i < data.length; i++) {
          var datum = data[i];

          var isSameDay = moment(datum.period).isSame(moment(start)) || moment(datum.period).isSame(moment(end));

          var isInsidePeriod = moment(datum.period).isAfter(moment(start)) && moment(datum.period).isBefore(moment(end));

          if (isSameDay || isInsidePeriod) {
            dataBuffer.push(datum);
          }
        }

        this.periodDataCache = {
          start: start,
          end: end,
          data: dataBuffer.reverse()
        };

        // sort by ascending date since the data is sorted by most recent date
        return dataBuffer.reverse();
      },
      filterBySource: function (data, source) {
        var dataBuffer = [];

        for (var i = 0; i < data.length; i++) {
          var datum = data[i];
          if (datum.acc_id === this.sourceToKey[source]) {
            dataBuffer.push(datum);
          }
        }

        return dataBuffer;
      }
    }
  });
