'use strict';

angular.module('darwinD3App')
  .service('Dazzle', function Dazzle() {
    return {
      animation: {
        easing: 'cubic-in-out',
        updateDuration: 700,
        delayFactor: 100
      }
    }
  });
