'use strict';

angular.module('darwinD3App')
  .controller('HeaderCtrl', function ($scope) {
    $scope.isSidebarOpen = false;
    var $sidebar = $('.sidebar');
    var $wrapper = $('.wrapper');
    var $menuActivator = $('.menu-activator');

    // get sidebar width & hide it off-screen
    var sidebarWidth = $sidebar.width() + (parseInt($sidebar.css('padding-left')) * 2);
//    $sidebar.css('margin-left', -sidebarWidth);

    $scope.toggleSidebar = function () {
      $sidebar.stop();
      var xValue = $scope.isSidebarOpen ? -sidebarWidth : sidebarWidth;

      $sidebar.transition(
        {
          x: xValue,
          duration: 500,
          easing: 'ease'
        }
      );

      $menuActivator.fadeToggle();

      // Move body along with menu
//      $wrapper.transition(
//        {
//          x: $scope.isSidebarOpen ? 0 : sidebarWidth,
//          duration: 500,
//          easing: 'ease'
//        }
//      );

      $scope.isSidebarOpen = !$scope.isSidebarOpen;
    };
  });
