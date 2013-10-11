'use strict';

angular.module('darwinD3App')
  .service('Fixtures', function Fixtures() {
    return {
      findDataByProperty: function (data, property, identifier) {
        for (var i = 0; i < data.length; i++) {
          var datum = data[i];
          if (datum[property] === identifier) {
            return datum;
          }
        }
        return false;
      },
      getDataFromPeriod: function (data, start, end) {
        var dataBuffer = [];
        for (var i = 0; i < data.length; i++) {
          var datum = data[i];
          if (moment(start).unix() <= moment(datum.date).unix() && moment(datum.date).unix() <= moment(end).unix()) {
            dataBuffer.push(datum);
          }
        }
        return dataBuffer;
      },
      networks: [
        'facebook',
        'twitter'
      ],
      types: [
        'likes',
        'comments',
        'conversion',
        'shares'
      ],
      dummyData: {
        periodConversions: {
          companyName: 'Foobar Analytics',
          startDate: '2013-10-09',
          endDate: '2013-10-11',
          data: [
            {
              date: '2013-10-09',
              facebook: 50
            },
            {
              date: '2013-10-10',
              facebook: 53
            },
            {
              date: '2013-10-11',
              facebook: 37
            }
          ]
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
                },
                twitter: {
                  name: 'Twitter',
                  stats: [
                    {
                      type: 'likes',
                      amount: 20
                    },
                    {
                      type: 'comments',
                      amount: 11
                    },
                    {
                      type: 'conversions',
                      amount: 5
                    },
                    {
                      type: 'shares',
                      amount: 43
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
                },
                twitter: {
                  name: 'Twitter',
                  stats: [
                    {
                      type: 'likes',
                      amount: 13
                    },
                    {
                      type: 'comments',
                      amount: 25
                    },
                    {
                      type: 'conversions',
                      amount: 15
                    },
                    {
                      type: 'shares',
                      amount: 17
                    }
                  ]
                }
              }
            }
          ]
        }
      }
    }
  });
