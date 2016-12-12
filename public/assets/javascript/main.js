(function() {
  'use strict';

  var app = angular.module('yomApp', [
    'ngRoute',
    'ngAnimate',
    'afkl.lazyImage'
  ]);

  app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider

    // home page
    .when('/', {
      templateUrl: 'partials/home.html',
      controller: 'homeCtrl'
    })

    // project page
    .when('/project/:name*', {
      templateUrl: 'partials/project.html',
      controller: 'projectCtrl'
    })

    // about page
    .when('/about', {
      templateUrl: 'partials/about.html',
    })

    // profile page
    .when('/profile/:name*', {
      templateUrl: 'partials/profile.html',
      controller: 'profileCtrl'
    })

    // contact page
    .when('/contact', {
      templateUrl: 'partials/contact.html',
      controller: 'contactCtrl'
    })

  }]);


  app.controller('homeCtrl', ['$location', '$scope', '$http', '$filter', function($location, $scope, $http, $filter){

    $scope.visibleProjects = false;
    $scope.pageClass = 'page-home';

    $scope.loaded = function() {
      setTimeout(function(){
        var wow = new WOW();
        wow.init();

        window.dispatchEvent(new Event('resize'));
      }, 0);
    };

    $('.card__profile, .card__project').on("touchstart", function (e) {});

  }]);


  app.controller('projectCtrl', ['$rootScope', '$location', '$scope', '$http', '$filter', function($rootScope, $location, $scope, $http, $filter){

    var get_url = $location;
    var project = this;

    $scope.lastPart = get_url.$$url.split("/").pop();
    $scope.pageClass = 'page-project';

    $http.get('/projects.json', { cache: true}).success(function(data, status, headers, config) {
      $scope.posts = data;
    });

    $scope.loaded = function() {
      setTimeout(function(){
        var wow = new WOW();
        wow.init();

        window.dispatchEvent(new Event('resize'));
      }, 0);
    };

  }]);

  app.controller('profileCtrl', ['$location', '$scope', '$http', '$filter', function($location, $scope, $http, $filter){

    var get_url = $location;
    var profile = this;

    $scope.lastPart = get_url.$$url.split("/").pop();
    $scope.pageClass = 'page-profile';

    $http.get('/profiles.json', { cache: true}).success(function(data, status, headers, config) {
      $scope.posts = data;
    });

    $scope.loaded = function() {
      setTimeout(function(){
        var wow = new WOW();
        wow.init();

        window.dispatchEvent(new Event('resize'));
      }, 0);
    };

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
      templateUrl: 'partials/navigation.html',
      controller:function($scope, $http){

        $scope.visibleProjects = false;
        $scope.visibleNavigation = false;

        // Dynamic load
        $http.get('/projects.json', { cache: true}).success(function(data, status, headers, config) {
          $scope.posts = data;
        });

        $scope.toggle = function(trigger) {

          if(trigger == 'projects'){

            $scope.visibleProjects = !$scope.visibleProjects;

            $('body').animate( {scrollTop: '0'}, 150);

            if($scope.visibleProjects === true){
              $('#js-scrollboxProjects').scrollLeft( 10000 );
              $('#js-scrollboxProjects').animate( { scrollLeft: '0' }, 750);
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

  app.run(['$rootScope', function ($rootScope) {
    // Create a new instance
    var wow = new WOW();
    wow.init();

    $rootScope.$on('$routeChangeSuccess', function (next, current) {
      // When the view changes sync wow
      wow.sync();

      // And scroll to the top of the page
      $('body').animate( {scrollTop: '0'}, 150);
    });
  }]);

})();
