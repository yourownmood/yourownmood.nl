(function() {
  'use strict';

  var app = angular.module('yomApp', [
    'ngRoute',
    'ngAnimate',
    'angularLazyImg'
    //'afkl.lazyImage'
  ]);
  // ]).config(function() {
  //   new WOW().init();
  // });


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

  }]);


  app.controller('homeCtrl', ['$location', '$scope', '$http', '$filter', '$window', function($location, $scope, $http, $filter, $window){

    $scope.visibleProjects = false;
    $scope.pageClass = 'page-home';

    // $scope.loaded = function() {
    //   // setTimeout(function(){
    //   //   $(".page .lazy").lazyload({
    //   //     effect : "fadeIn",
    //   //     threshold : 50
    //   //   });

    //   //   $("html,body").trigger("scroll");

    //   // }, 750);
    //   setTimeout(function(){
    //     new WOW().sync();
    //     $("html,body").trigger("scroll");
    //     $("html,body").trigger("resize");
    //   }, 750);
    // };

    $('.card__profile, .card__project').on("touchstart", function (e) {});

  }]);


  app.controller('projectCtrl', ['$rootScope', '$location', '$scope', '$http', '$filter', '$window', function($rootScope, $location, $scope, $http, $filter, $window){

    var get_url = $location;
    var project = this;

    $scope.lastPart = get_url.$$url.split("/").pop();
    $scope.pageClass = 'page-project';

    $http.get('/projects.json').success(function(data, status, headers, config) {
      $scope.posts = data;
    });

    // $scope.loaded = function() {
    //   setTimeout(function(){
    //     //new WOW().sync();
    //     $("html,body").trigger("scroll");
    //     $("html,body").trigger("resize");
    //   }, 750);
    // };

  }]);

  app.controller('profileCtrl', ['$location', '$scope', '$http', '$filter', function($location, $scope, $http, $filter){

    var get_url = $location;
    var profile = this;

    $scope.lastPart = get_url.$$url.split("/").pop();
    $scope.pageClass = 'page-profile';

    $http.get('/profiles.json').success(function(data, status, headers, config) {
      $scope.posts = data;
    });

    // $scope.loaded = function() {
    //   setTimeout(function(){
    //     new WOW().sync();
    //     $("html,body").trigger("scroll");
    //     $("html,body").trigger("resize");
    //   }, 750);
    // };

  }]);

  app.directive('navigation', function() {
    return {
      restrict: 'E',
      templateUrl: 'partials/navigation.html',
      controller:function($scope, $http){

        $scope.visibleProjects = false;
        $scope.visibleNavigation = false;

        // Dynamic load
        $http.get('/projects.json').success(function(data, status, headers, config) {
          $scope.posts = data;
        });

        $scope.toggle = function(trigger) {

          if(trigger == 'projects'){

            $scope.visibleProjects = !$scope.visibleProjects;

            //console.log($scope.visibleNavigation);

            if($scope.visibleProjects === true){
              $( "#js-scrollboxProjects" ).scrollLeft( 10000 );
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

  app.run(['$rootScope', function ($rootScope) {

         //create a new instance
         //new WOW().init();
         $("html,body").trigger("scroll");
          $("html,body").trigger("resize");

      $rootScope.$on('$routeChangeSuccess', function (next, current) {
          //when the view changes sync wow
          //new WOW().sync();

          $("html,body").trigger("scroll");
          $("html,body").trigger("resize");
      });
  }]);



})();
