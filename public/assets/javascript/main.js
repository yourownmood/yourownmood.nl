(function() {
    'use strict';

    var app = angular.module('yomApp', [
        'ngRoute'
        , 'ngAnimate'
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

        // about page
        // .when('/profile/steven-bax', {
        //     templateUrl: 'partials/profile.html'
        // })
        // .when('/profile/gert-jan-de-goede', {
        //     templateUrl: 'partials/project.html'
        // });


    }]);


    app.controller('homeCtrl', ['$scope', function($scope){

        $scope.visibleProjects = false;
        $scope.pageClass = 'page-home';

        setTimeout(function(){
            $(".page .lazy").lazyload({
                effect : "fadeIn",
                threshold : 50
            });
            $("html,body").trigger("scroll");
            //$(window).scrollTop($(window).scrollTop()+20);
        }, 100);

        new WOW().init();

        $('.card__profile, .card__project').on("touchstart", function (e) {});
    }]);


    app.controller('projectCtrl', ['$location', '$scope', '$http', '$filter', function($location, $scope, $http, $filter){

        var get_url = $location;
        $scope.lastPart = get_url.$$url.split("/").pop();

        var project = this;

        // $http.get('/projects.json').success(function(data, status, headers, config) {
        //     $scope.posts = data;
        // });

        $scope.pageClass = 'page-project';

        setTimeout(function(){
            $(".page .lazy").lazyload({
                effect : "fadeIn",
                threshold : 50
            });
            $("html,body").trigger("scroll");
        }, 100);

        new WOW().init();

    }]);

    app.controller('profileCtrl', ['$location', '$scope', '$http', '$filter', function($location, $scope, $http, $filter){

        var get_url = $location;
        $scope.lastPart = get_url.$$url.split("/").pop();

        var profile = this;

        // $http.get('/profiles.json').success(function(data, status, headers, config) {
        //     $scope.posts = data;
        // });

        $scope.pageClass = 'page-profile';

        setTimeout(function(){
            $(".page .lazy").lazyload({
                effect : "fadeIn",
                threshold : 50
            });
            $("html,body").trigger("scroll");
        }, 100);

        new WOW().init();

    }]);

    app.directive('navigation', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/navigation.html',
            controller:function($scope, $http){

                new WOW().init();

                $scope.visibleProjects = false;
                $scope.visibleNavigation = false;

                var loaded = false;

                // Dynamic load
                $http.get('/projects.json').success(function(data, status, headers, config) {
                    $scope.posts = data;
                });

                $scope.toggle = function(trigger) {

                    if(trigger == 'projects'){

                        $scope.visibleProjects = !$scope.visibleProjects;

                        console.log($scope.visibleNavigation);

                        if($scope.visibleProjects === true){
                            $( "#js-scrollboxProjects" ).scrollLeft( 10000 );

                            if(loaded === false){

                                $("header .lazy").lazyload({
                                    effect : "fadeIn"
                                });
                                $("header .lazy").trigger('appear');
                            }

                            loaded = true;

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



})();

