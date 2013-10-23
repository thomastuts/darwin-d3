'use strict';

angular.module('darwinD3App')
  .service('Layout', function Layout() {
    return {
      easeMethod: 'elastic',
      dataUpdateDuration: 1500,
      circleRadius: 5,
      getDimensions: function () {
        var $12col = $('.large-12.columns');
        var $9col = $('.large-9.columns');

        return {
          timeline: {
            width: $12col.width(),
            height: Math.floor($12col.width() / 2)
          },
          multibar: {
            width: $9col.width() - 40,
            height: Math.floor($9col.width() / 1.61)
          },
          donut: {
            width: $('.large-3.columns').width(),
            height: Math.floor($9col.width() / 1.61)
          }
        };
      }
    }
  });
