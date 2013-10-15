'use strict';

angular.module('darwinD3App')
  .service('Data', function Data($http) {
    return {
      parseDate: d3.time.format('%Y-%m-%d').parse,
      fullData: function () {
        return $http.get('data/full-data.json');
      },
      sourceKeys: {
        facebook: 1,
        twitter: 2,
        website: 3
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

        end = end ? end : start;

        var dataBuffer = [];

        for (var i = 0; i < data.length; i++) {
          var datum = data[i];
          var isSameDay = moment(datum.period).isSame(moment(start)) || moment(datum.period).isSame(moment(end));
          var isInsidePeriod = moment(datum.period).isAfter(moment(start)) && moment(datum.period).isBefore(moment(end));

          // Parse date if not parsed already
          if (datum.period.length >= 10) {
            datum.period = this.parseDate(datum.period);
          }

          if (isSameDay || isInsidePeriod) {
            dataBuffer.push(datum);
          }
        }

        // sort by ascending date since the data is sorted by most recent date
        return dataBuffer.reverse();
      },
      filterBySource: function (data, source) {
        var dataBuffer = [];

        for (var i = 0; i < data.length; i++) {
          var datum = data[i];
          if (datum.acc_id === this.sourceKeys[source]) {
            dataBuffer.push(datum);
          }
        }

        return dataBuffer;
      }
    }
  });
