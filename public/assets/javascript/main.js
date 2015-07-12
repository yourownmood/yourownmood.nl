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

        // about page
        .when('/project/steven-bax', {
            templateUrl: 'partials/project.html'
        })
        .when('/project/gert-jan-de-goede', {
            templateUrl: 'partials/project.html'
        });



    }]);


    app.controller('homeCtrl', function ( $scope ) {

        $scope.pageClass = 'page-home';

        setTimeout(function(){
            $(".page .lazy").lazyload({
                effect : "fadeIn"
            });
        }, 50);

        new WOW().init();

        $('.card__profile, .card__project').on("touchstart", function (e) {});
    });
    

    app.controller('projectCtrl', ['$location', '$scope', '$http', '$filter', function($location, $scope, $http, $filter){

        var get_url = $location;
        $scope.lastPart = get_url.$$url.split("/").pop();

        var project = this;

        project.projects =
        $http.get('/products.json').success(function(data){
            project.projects = data;
        });
        
        $scope.pageClass = 'page-project';

        setTimeout(function(){
            $(".page .lazy").lazyload({
                effect : "fadeIn"
            });
        }, 50);

        new WOW().init();

    }]);

    app.directive('navigation', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/navigation.html',
            controller:function($scope){

                new WOW().init();

                $scope.visibleProjects = false;
                $scope.visibleNavigation = false;

                var loaded = false;

                $scope.toggle = function(trigger) {
                    
                    if(trigger == 'projects'){
                        $scope.visibleProjects = !$scope.visibleProjects;

                        if($scope.visibleProjects === true){
                            $( "#js-scrollbox" ).scrollLeft( 10000 );

                            if(loaded === false){

                                $("header .lazy").lazyload({
                                    effect : "fadeIn"
                                });
                                $("header .lazy").trigger('appear');
                            }

                            loaded = true;

                            $('#js-scrollbox').animate( { scrollLeft: '0' }, 750);
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

