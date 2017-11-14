/* global angular, WOW, Event, $ */

(function () {
  'use strict'

  const app = angular.module('yomApp', [
    'afkl.lazyImage',
    'ngRoute',
    'ngAnimate',
    'ngSanitize'
  ])

  app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('')

    $routeProvider
    .when('/', {
      templateUrl: 'app/partials/home.html'
    })

    .when('/project/:name*', {
      templateUrl: 'app/partials/project.html'
    })

    .when('/about', {
      templateUrl: 'app/partials/about.html'
    })

    .when('/profile/:name*', {
      templateUrl: 'app/partials/profile.html'
    })

    .when('/contact', {
      templateUrl: 'app/partials/contact.html'
    })

    .otherwise({
      redirectTo: '/'
    })
  }])

  app.controller('mainController', ['$scope', '$rootScope', '$route', '$routeParams', '$location', '$window', function ($scope, $rootScope, $route, $routeParams, $location, $window) {
    $scope.$route = $route
    $scope.$location = $location
    $scope.$routeParams = $routeParams
    $scope.animationDelay = 0

    angular.element($window).bind('scroll', function () {
      const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
      const body = document.body
      const html = document.documentElement
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
      const windowBottom = windowHeight + window.pageYOffset
      if (windowBottom >= docHeight) {
        $rootScope.$broadcast('afkl.lazyImage.destroyed')
      }
    })

    $scope.$on('$routeChangeStart', function (event, toState, toParams, fromState, fromParams) {
      const body = document.body
      const toPath = toState.$$route.originalPath

      if (!document.body.classList.contains('boot')) {
        if (toPath !== '/project/:name*') {
          body.className += ' animating'
          $scope.animationDelay = 1
        } else {
          $scope.animationDelay = 0
        }
      }
    })

    $scope.$on('$routeChangeSuccess', function (event, toRoute, toParams, fromState, fromParams) {
      const body = document.body
      setTimeout(function () {
        body.classList.remove('animating')
      }, 1000)
    })

    $scope.loaded = function () {
      const body = document.body
      body.classList.remove('boot')

      setTimeout(function () {
        const wow = new WOW()
        wow.init()

        window.dispatchEvent(new Event('resize'))
      }, 100)
    }
  }])

  app.controller('homeCtrl', ['$location', '$scope', '$http', '$filter', function ($location, $scope, $http, $filter) {
    $scope.visibleProjects = false
    $scope.pageClass = 'page-home'

    // Disable touchstart for cards
    const cards = document.querySelectorAll('.card__project, .card__profile')
    angular.element(cards).on('touchstart', function (e) {})
  }])

  app.controller('projectCtrl', ['$location', '$scope', '$http', '$filter', function ($location, $scope, $http, $filter) {
    let feed
    const getUrl = $location

    $scope.lastPart = getUrl.$$url.split('/').pop()
    $scope.pageClass = 'page-project'

    if ($scope.lastPart !== 'dummy') {
      feed = 'projects.json'
    } else {
      feed = 'dummy.json'
    }

    $http.get('app/feeds/' + feed, {cache: true})
    .then(function onSuccess (response) {
      let data
      $scope.posts = response.data

      // Check if the page-name is specified in the .json
      let found = false

      for (let i = 0; i < data.length; i++) {
        if (data[i].url === $scope.lastPart) {
          found = true
        }
        // If not, send back to home
        if (i === (data.length - 1) && !found) {
          $location.path('/')
        }
      }
    })
    .catch(function onError (response) {
      // error
    })
  }])

  app.controller('profileCtrl', ['$location', '$scope', '$http', '$filter', function ($location, $scope, $http, $filter) {
    const getUrl = $location

    $scope.lastPart = getUrl.$$url.split('/').pop()
    $scope.pageClass = 'page-profile'

    $http.get('app/feeds/profiles.json', {cache: true})
    .then(function onSuccess (response) {
      let data
      $scope.posts = response.data

      // Check if the page-name is specified in the .json
      let found = false

      for (let i = 0; i < data.length; i++) {
        if (data[i].url === $scope.lastPart) {
          found = true
        }
        // If not, send back to home
        if (i === (data.length - 1) && !found) {
          $location.path('/')
        }
      }
    })
    .catch(function onError (response) {
      // error
    })
  }])

  app.controller('contactCtrl', ['$scope', function ($scope) {
    $scope.pageClass = 'page-contact'

    this.mailInfo = 'info@yourownmood.nl'
    this.mailS = 'sbax@yourownmood.nl'
    this.mailGJ = 'gjdegoede@yourownmood.nl'
  }])

  app.directive('navigation', function () {
    return {
      restrict: 'E',
      templateUrl: 'app/partials/navigation.html',
      controller: function ($scope, $http, $anchorScroll) {
        $scope.visibleProjects = false
        $scope.visibleNavigation = false

        function scrollElementToLeft (scrollDuration, element) {
          const scrollStep = -element.scrollLeft / (scrollDuration / 15)
          const scrollInterval = setInterval(function () {
            if (element.scrollLeft !== 0) {
              element.scrollLeft += scrollStep
            } else {
              clearInterval(scrollInterval)
            }
          }, 15)
        }

        // Dynamic load
        $http.get('app/feeds/projects.json', {cache: true})
        .then(function onSuccess (response) {
          $scope.posts = response.data
        })
        .catch(function onError (response) {
          // error
        })

        $scope.closeProjects = function () {
          $scope.visibleProjects = false
        }

        $scope.toggle = function (trigger) {
          if (trigger === 'projects') {
            $scope.visibleProjects = !$scope.visibleProjects

            $anchorScroll()
            if ($scope.visibleProjects === true) {
              const scrollBox = document.getElementById('js-scrollboxProjects')

              // Scroll to the horizontal end of the element
              scrollBox.scrollLeft = scrollBox.scrollWidth

              scrollElementToLeft(750, scrollBox)
            }
          } else if (trigger === 'navigation') {
            $scope.visibleNavigation = !$scope.visibleNavigation

            if ($scope.visibleProjects === true) {
              $scope.visibleProjects = false
            }
          }
        }
      }
    }
  })

  app.directive('yomfooter', function () {
    return {
      restrict: 'E',
      templateUrl: 'app/partials/footer.html',
      controller: function ($scope, $window, $anchorScroll) {
        $scope.gotoTop = function () {
          scrollTo(document.body, 0, 75)
        }

        function scrollTo (element, to, duration) {
          if (duration < 0) return
          const difference = to - element.scrollTop
          const perTick = difference / duration * 2

          setTimeout(function () {
            element.scrollTop = element.scrollTop + perTick
            scrollTo(element, to, duration - 2)
          }, 10)
        }
      }
    }
  })

  app.directive('lazy', function ($timeout) {
    return {
      restrict: 'C',
      link: function (scope, elm) {
        $timeout(function () {
          $(elm).lazyload({
            effect: 'fadeIn',
            effectspeed: 500,
            skip_invisible: false
          })
        }, 0)
      }
    }
  })

  app.run(['$rootScope', '$anchorScroll', function ($rootScope, $anchorScroll) {
    new WOW().init()

    $rootScope.$on('$routeChangeSuccess', function (next, current) {
      // Scroll to the top of the page on $routeChangeSuccess
      $anchorScroll()
    })
  }])
})()
