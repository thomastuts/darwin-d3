'use strict';

angular.module('darwinD3App')
  .service('Fixtures', function Fixtures() {
    return {
      findDataByDate: function (data, date) {
        for (var i = 0; i < data.length; i++) {
          var datum = data[i];
          if (datum.date === date) {
            return datum;
          }
        }
        return false;
      },
      timeline: {
        companyName: 'Foobar Analytics',
        data: [
          {
            date: '2013-10-09',
            sources: {
              facebook: {
                name: 'Facebook',
                stats: [
                  {
                    type: 'likes',
                    amount: 47
                  },
                  {
                    type: 'comments',
                    amount: 23
                  },
                  {
                    type: 'conversions',
                    amount: 13
                  },
                  {
                    type: 'shares',
                    amount: 17
                  }
                ]
              }

            }
          },
          {
            date: '2013-10-10',
            sources: {
              facebook: {
                name: 'Facebook',
                stats: [
                  {
                    type: 'likes',
                    amount: 35
                  },
                  {
                    type: 'comments',
                    amount: 28
                  },
                  {
                    type: 'conversions',
                    amount: 15
                  },
                  {
                    type: 'shares',
                    amount: 11
                  }
                ]
              }

            }
          }

        ]
      }
    }
  });
