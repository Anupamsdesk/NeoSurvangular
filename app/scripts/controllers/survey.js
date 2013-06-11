'use strict';

angular.module('node4jsHttpApp').
    controller('SurveyUpdateCtrl', 
         ['$scope', '$location', 'Models', '$routeParams', SurveyCtrl]).
    controller('SurveyConductCtrl', 
         ['$scope', '$location', 'Models', '$routeParams', SurveyConductCtrl]);


function SurveyConductCtrl($scope,$location,Models,$routeParams){
     var _surveyId;
    _surveyId = $routeParams.surveyId.substring(1);
    $scope.currentSurvey = "";
    $scope.questions = {};
    $scope.message = '';
    init();
    
    function init() {
        $scope.dirty = false;
        $scope.currentSurvey='';
        Models.Survey.get(_surveyId).then(function(value) {       
            $scope.currentSurvey = value;
            console.log($scope.currentSurvey);
        });
        Models.Question.getAllWithOptionsForSurvey(_surveyId).then(function(value) {
            $scope.questions = value;
            value.forEach(function(obj, index) {
            });
        });

    }
    
    
    
    
}


function SurveyCtrl($scope, $location, Models, $routeParams) {
    var _surveyId;
    _surveyId = $routeParams.surveyId.substring(1);
    $scope.currentSurvey = "";
    $scope.questions = {};
    $scope.message = 'Make changes as desired and click save.';
    init();

    $scope.changed = function() {
        $scope.dirty = true;
    };
    $scope.reload = function() {
        console.log('reload called!')
        init();
    };
    $scope.save = function() {
        console.log('save called');
        $scope.message='Saving please wait....';
        Models.Survey.update($scope.currentSurvey).then(function(){
            $scope.message ='Successfully Saved data!';  
        }, function(){
            $scope.message = 'Sorry! Could not update data';
        });
        
        
    };

    function init() {
        $scope.dirty = false;
        $scope.currentSurvey='';
        Models.Survey.get(_surveyId).then(function(value) {
            
            $scope.currentSurvey = value;
            console.log($scope.currentSurvey);
        });
        Models.Question.getAllForSurvey(_surveyId).then(function(value) {
            $scope.questions = value;
            value.forEach(function(obj, index) {
               // console.log(obj)
            });
        });

    }

}



