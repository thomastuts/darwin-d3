'use strict';

angular.module('darwinD3App')
  .service('Dazzle', function Dazzle() {
    return {
      animation: {
        easing: 'elastic',
        updateDuration: 1500,
        delayFactor: 100
      }
    }
  });
