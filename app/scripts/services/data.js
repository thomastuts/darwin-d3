'use strict';

angular.module('darwinD3App')
  .service('Data', function Data($http) {
    return {
      parseDate: d3.time.format('%Y-%m-%d').parse,
      getData: function () {
        return $http.get('data/full-data.json');
      },
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
      getPeriodData: function (data, start, end, networks, metric) {
        console.time('Data parsing');
        // select the period we need
        var periodData = this.filterByPeriod(data, start, end);
        var dataBuffer = [];

        // loop this array and add data to a new object of the structure:
//        {
//          period: '2013-10-10',
//          facebook: 50,
//          twitter: 20
//        }

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

//        for (var i = 0; i < groupedByDate.length; i++) {
//          var dataForDay = groupedByDate[i];
//
//          entry = {};
//          entry.period = dataForDay.period;
//
//          for (var j = 0; j < networks.length; j++) {
//            var network = networks[j];
//            if (dataForDay.acc_id = this.sourceKeys[network]) {
//              entry[network] = dataForDay[metric];
//            }
//          }
//
//          dataBuffer.push(entry);
//        }
//
//        console.log(dataBuffer);

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
          if (datum.acc_id === this.sourceToKey[source]) {
            dataBuffer.push(datum);
          }
        }

        return dataBuffer;
      }
    }
  });