var app = angular.module('spotifyApp', ['spotifyApp.controllers', 'spotifyApp.directives']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'partials/index',
        controller: 'IndexController'
    }).otherwise({
        redirectTo: '/'
    });
}]).config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);