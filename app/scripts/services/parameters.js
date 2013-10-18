'use strict';

angular.module('darwinD3App')
  .service('Parameters', function Parameters() {
    var params = {};

    // set default parameters
    params.startDate = '2013-05-01';
    params.endDate = '2013-05-31';

    params.availableNetworks = ['facebook', 'twitter', 'website'];
    params.selectedNetworks = ['facebook', 'twitter', 'website'];

    params.availableMetrics = ['action', 'advocacy', 'awareness', 'appreciation'];
    params.selectedMetric = 'appreciation';

    return {
      params: params
    };
  });
