'use strict';

angular.module('node4jsHttpApp', ['ui.bootstrap','ui.bootstrap.collapse']).config(['$routeProvider',
function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl : 'views/main.html',
        controller : 'MainCtrl'
    }).when('/about', {
        templateUrl : 'views/about.html',
        controller : 'AboutCtrl'
    }).when('/contact', {
        templateUrl : 'views/contact.html',
        controller : 'ContactsCtrl'
    }).when('/editSurvey/:surveyId', {
        templateUrl : 'views/surveyEdit.html',
        //controller : 'ContactsCtrl'
    }).when('/participateSurvey/:surveyId', {
        templateUrl : 'views/surveyParticipate.html',
        //controller : 'ContactsCtrl'
    }).otherwise({
        redirectTo : '/'
    });
}]).filter('truncate', function() { 
    return function(text, value) {
        value=value-3;
        if (!value){
            value = 12;
        }
        if (text && text.length>value)
            return text.substring(0, value)+"...";
        else return text;
    };
});
