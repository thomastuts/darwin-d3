'use strict';

angular.module('darwinD3App')
  .service('Parameters', function Parameters() {
    var params = {};

    // set default parameters
    params.startDate = '2013-09-08';
    params.endDate = '2013-09-30';

    params.availableNetworks = ['facebook', 'twitter', 'website'];
    params.selectedNetworks = ['facebook', 'twitter'];

    params.availableMetrics = ['action', 'advocacy', 'awareness', 'appreciation'];
    params.selectedMetric = 'advocacy';

    return {
      params: params
    };
  });
