'use strict';

angular.module('node4jsHttpApp').controller('MainCtrl', ['$scope','$location', 'DataService', 'Models', MainCtrl]).controller('AboutCtrl', ['$scope',
function($scope) {
    $scope.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Neo4j', 'Yeomen'];
}]);

function MainCtrl($scope, $location, DataService, Models) {
    var evt, mydata, node, errorObj, handleError, surveysMaster, sortFields, selectedIndex;
    selectedIndex = 0;
    sortFields = ['title', 'openDate', 'closeDate'];
    $scope.searchText = "";
    $scope.showMessage = false;
    $scope.showSurveyInfo = false;
    $scope.selectedSurvey=null;
     //sasjka
    init();

    handleError = function(errorObj) {
        errorObj = errorObj.errors[0];
        console.log('Ooops an error has occured: ' + errorObj.code + "; " + errorObj.message + ": " + errorObj.status);
    };
    
    $scope.participate = function(id){
        console.log('participate');
        $location.url('/participateSurvey/:'+id);
    };
    
    $scope.edit = function(id){
        console.log('edit');
        $location.url('/editSurvey/:'+id);
    };
    
    $scope.viewSummary = function(id){
        console.log('view '+id+' was clicked');
        $scope.showSurveyInfo=true;     
        $scope.selectedSurvey = _.find(surveysMaster,function(value){return (value.id===id);})
        var evt = Models.Question.getAllForSurvey(id);// DataService.getQuestionsWithAnswerCount(id);
        evt.then(function(data){
           $scope.selectedSurvey.questions = data; 
           $scope.selectedSurvey.totalUsers = _.max(_.pluck(data,"count"),function(value){return value;});
           if (!$scope.selectedSurvey.closeDate) $scope.selectedSurvey.status='Open';
           else{
               var dt = new Date($scope.selectedSurvey.closeDate);
               console.log(dt);
               var today = new Date();
               if (today > dt)  $scope.selectedSurvey.status='Closed';
               else  $scope.selectedSurvey.status='Open';
           }
        });
    };
    
    function parseObjects(data){
        var objects = [], obj;
        data.forEach(function(value, index) {
            obj=value[0];
            objects.push(obj);
        });
        return objects;
    };
    
    function getObjects (data) {
        if (data.errors.length > 0) {
            handleError(data);
            return null;
        } else {
            return parseObjects(data.results[0].data);
        }
    };
    
    
    function parseSurveys(data) {
        var objects = [], obj;
        data.forEach(function(value, index) {
            obj = Models.Survey(value[0]);
            objects.push(obj);
        });
        return objects;
    };
    function init() {
        Models.Survey.getAll().then(function (data){
            surveysMaster = data;
            $scope.surveys = _.clone(surveysMaster);
        })
        
        
    };

    
    $scope.show = function(index) {
        selectedIndex = index;
    };
    $scope.isVisible = function(index) {
        return selectedIndex === index;
    };
    $scope.getClass = function(index) {
        if (selectedIndex === index)
            return 'active';
        return '';
    };
    $scope.sort = function(index) {
        var obj = _.sortBy($scope.surveys, function(survey) {
            return survey[sortFields[index]]
        });
        $scope.surveys = obj;
    };

    $scope.runQuery = function() {
        var obj = [], titlelower, srch;
        if ($scope.searchText.length === 0) {
            $scope.surveys = _.clone(surveysMaster);
        } else {
            srch = $scope.searchText.toLowerCase();
            surveysMaster.forEach(function(value, index) {
                titlelower = value.title.toLowerCase();
                if (titlelower.indexOf(srch) >= 0) {
                    obj.push(value);
                }
            });
            $scope.surveys = obj;
        }
        $scope.showMessage = ($scope.surveys.length < 1);
        $scope.message = 'Not found!';
    }
}
