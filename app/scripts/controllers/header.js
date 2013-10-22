'use strict';

angular.module('darwinD3App')
  .controller('HeaderCtrl', function ($scope) {
    $scope.isSidebarOpen = false;
    var $sidebar = $('.sidebar');
    var $wrapper = $('.wrapper');
    var $menuActivator = $('.menu-activator');

    // get sidebar width & hide it off-screen
    var sidebarWidth = $sidebar.width() + 120;
    $sidebar.css('margin-left', -sidebarWidth);

    $(document).on('keyup', function (e) {
      if (e.keyCode === 27) {
        $sidebar.transition(
          {
            x: -sidebarWidth,
            duration: 500,
            easing: 'ease'
          }
        );

        $scope.isSidebarOpen = false;
      }
    });

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

//      $menuActivator.fadeToggle();

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
