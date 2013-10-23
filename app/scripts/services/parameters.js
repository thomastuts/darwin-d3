'use strict';

angular.module('darwinD3App')
  .service('Parameters', function Parameters() {
    var params = {};

    // set default parameters
    params.startDate = '2013-05-25';
    params.endDate = '2013-05-31';

    params.availableNetworks = [
      {
        name: 'facebook',
        icon: 'facebook'
      },
      {
        name: 'twitter',
        icon: 'twitter'
      },
      {
        name: 'website',
        icon: 'globe'
      }
    ];
    params.availableMetrics = [
//      'action', 'advocacy', 'awareness', 'appreciation'
      {
        name: 'action',
        icon: 'ok'
      },
      {
        name: 'advocacy',
        icon: 'comment'
      },
      {
        name: 'awareness',
        icon: 'eye-open'
      },
      {
        name: 'appreciation',
        icon: 'heart'
      }
    ];

    params.networkComparison = {
      selectedMetric: 'appreciation',
      selectedNetworks: ['facebook', 'twitter', 'website']
    };

    params.metricComparison = {
      selectedNetwork: 'facebook',
      selectedMetrics: ['advocacy', 'appreciation', 'awareness']
    };

    return {
      params: params
    };
  });
