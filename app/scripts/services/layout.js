'use strict';

angular.module('darwinD3App')
  .service('Layout', function Layout() {
    return {
      width: 300,
      height: 150,
      easeMethod: 'elastic',
      dataUpdateDuration: 1500,
      circleRadius: 5
    }
  });
