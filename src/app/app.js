(function() {
  'use strict';

  var app = angular.module('yomApp', [
    'afkl.lazyImage',
    'ngRoute',
    'ngAnimate',
  ]);

  app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'app/partials/home.html'
    })

    .when('/project/:name*', {
      templateUrl: 'app/partials/project.html'
    })

    .when('/about', {
      templateUrl: 'app/partials/about.html',
    })

    .when('/profile/:name*', {
      templateUrl: 'app/partials/profile.html'
    })

    .when('/contact', {
      templateUrl: 'app/partials/contact.html'
    })

    .otherwise({
      redirectTo: '/'
    });
  }]);

  app.controller('mainController', ['$scope', '$rootScope', '$route', '$routeParams', '$location', '$window', function($scope, $rootScope, $route, $routeParams, $location, $window) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    angular.element($window).bind("scroll", function() {
      var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
      var body = document.body, html = document.documentElement;
      var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
      var windowBottom = windowHeight + window.pageYOffset;
      if (windowBottom >= docHeight) {
        $rootScope.$broadcast('afkl.lazyImage.destroyed');
      }
    });

    $scope.loaded = function() {
      setTimeout(function(){
        var wow = new WOW();
        wow.init();

        window.dispatchEvent(new Event('resize'));
      }, 0);
    };

  }]);

  app.controller('homeCtrl', ['$location', '$scope', '$http', '$filter', function($location, $scope, $http, $filter){

    $scope.visibleProjects = false;
    $scope.pageClass = 'page-home';

    // Disable touchstart for cards
    var cards = document.querySelectorAll('.card__project, .card__profile');
    angular.element(cards).on("touchstart", function (e) {});

  }]);


  app.controller('projectCtrl', ['$location', '$scope', '$http', '$filter', function($location, $scope, $http, $filter){

    var get_url = $location;
    var project = this;

    $scope.lastPart = get_url.$$url.split("/").pop();
    $scope.pageClass = 'page-project';

    $http.get('app/feeds/projects.json', { cache: true}).success(function(data, status, headers, config) {
      $scope.posts = data;

      // Check if the page-name is specified in the .json
      var found = false;

      for(var i = 0; i < data.length; i++) {
        if (data[i].url === $scope.lastPart) {
          found = true;
        }
        // If not, send back to home
        if(i == (data.length - 1) && !found) {
          $location.path('/');
        }
      }
    });

  }]);

  app.controller('profileCtrl', ['$location', '$scope', '$http', '$filter', function($location, $scope, $http, $filter){

    var get_url = $location;
    var profile = this;

    $scope.lastPart = get_url.$$url.split("/").pop();
    $scope.pageClass = 'page-profile';

    $http.get('app/feeds/profiles.json', { cache: true}).success(function(data, status, headers, config) {
      $scope.posts = data;

      // Check if the page-name is specified in the .json
      var found = false;

      for(var i = 0; i < data.length; i++) {
        if (data[i].url === $scope.lastPart) {
          found = true;
        }
        // If not, send back to home
        if(i == (data.length - 1) && !found) {
          $location.path('/');
        }
      }
    });

  }]);

  app.controller('contactCtrl', ['$scope', function($scope){

    $scope.pageClass = 'page-contact';

    this.mailInfo = "info@yourownmood.nl";
    this.mailS = "sbax@yourownmood.nl";
    this.mailGJ = "gjdegoede@yourownmood.nl";
  }]);

  app.directive('navigation', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/partials/navigation.html',
      controller:function($scope, $http, $anchorScroll){

        $scope.visibleProjects = false;
        $scope.visibleNavigation = false;

        // Dynamic load
        $http.get('app/feeds/projects.json', { cache: true}).success(function(data, status, headers, config) {
          $scope.posts = data;
        });

        $scope.toggle = function(trigger) {

          if(trigger == 'projects'){

            $scope.visibleProjects = !$scope.visibleProjects;

            $anchorScroll();

            if($scope.visibleProjects === true){
              var scrollBox = document.getElementById('js-scrollboxProjects');

              // Scroll to the horizontal end of the element
              scrollBox.scrollLeft = scrollBox.scrollWidth;

              function scrollElementToLeft(scrollDuration, element) {
                var scrollStep = -element.scrollLeft / (scrollDuration / 15),
                  scrollInterval = setInterval(function(){
                  if ( element.scrollLeft != 0 ) {
                    element.scrollLeft += scrollStep;
                  }
                  else clearInterval(scrollInterval);
                },15);
              }

              scrollElementToLeft(750, scrollBox);
            }

          }else if (trigger == 'navigation') {
            $scope.visibleNavigation = !$scope.visibleNavigation;

            if($scope.visibleProjects === true){
              $scope.visibleProjects = false;
            }

          };

        };

      }

    };
  });

  app.directive('yomfooter', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/partials/footer.html',
      controller:function($scope, $window, $anchorScroll){

        $scope.gotoTop = function() {
          scrollTo(document.body, 0, 75);
        };

        function scrollTo(element, to, duration) {
          if (duration < 0) return;
            var difference = to - element.scrollTop;
            var perTick = difference / duration * 2;

            setTimeout(function() {
              element.scrollTop = element.scrollTop + perTick;
              scrollTo(element, to, duration - 2);
            }, 10);
        }

      }
    };
  });

  app.directive('lazy', function($timeout) {
    return {
      restrict: 'C',
      link: function (scope, elm) {
        $timeout(function() {
          $(elm).lazyload({
            effect: 'fadeIn',
            effectspeed: 500,
            skip_invisible: false
          });
        }, 0);
      }
    };
  });

  app.run(['$rootScope', '$anchorScroll', function ($rootScope, $anchorScroll) {
    $rootScope.$on('$routeChangeSuccess', function (next, current) {
      // Scroll to the top of the page on $routeChangeSuccess
      $anchorScroll();
    });
  }]);

})();
