'use strict';

angular.module('node4jsHttpApp').controller('SurveyCtrl', ['$scope','$location', 'Models','$routeParams', SurveyCtrl]);

function SurveyCtrl($scope, $location, Models, $routeParams){
    var _surveyId;
    _surveyId=$routeParams.surveyId;
    
    init();
    
    
    function init(){
        $scope.currentSurvey = Models.Survey.get(_surveyId);
    }
}
