'use strict';
angular.module('node4jsHttpApp').value('appName', 'Neo-survangular').value('version', '0.0.1').value('tag', '"A higly configurable and robust Survey Tool"')
angular.module('node4jsHttpApp').factory('Models', ['$q', '$resource','$http',
function($q, $resource, $http) {
    var Question = function(obj) {
    return {
    id : obj.id,
    title : obj.text,
    count : obj.count,
    type : obj.type
    };
    },
    Survey = function(obj) {
    return {
    id : obj.id,
    title : obj.title,
    closeDate : obj.closedDate,
    openDate : obj.opendate
    };
    },


    Contact = function(obj) {
        var name = obj.name, email = obj.email, phone = obj.phone;
        return {
            name : name,
            email : email,
            phone : phone
        }
    };
    
    
    function update(id, obj) {
        var deferred = $q.defer();
        $resource('/api/surveys/:id', {
            id : '@id'
        },{update: {method: 'PUT'}}).update({
            id : id,
            data : obj
        }, function(response) {
            deferred.resolve(response.data);
        }, function(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };
    
    
    Survey.update = function(obj) {
        return update(obj.id, obj);
    };

    Survey.getAll = function() {
        var deferred = $q.defer();
        $resource('/api/surveys', {
        }).get({
        }, function(response) {
            deferred.resolve(response.data);
        }, function(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };
    Question.getAllForSurvey = function(id) {
        var deferred = $q.defer();
        $resource('/api/surveys/:id/questions', {
            id : id
        }).get({
            id : id
        }, function(response) {
            deferred.resolve(response.data);
        }, function(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };
    
    Question.getAllWithOptionsForSurvey = function(id) {
        var deferred = $q.defer();
        $resource('/api/surveys/:id/questionsWithOptions', {
            id : id
        }).get({
            id : id
        }, function(response) {
            deferred.resolve(response.data);
        }, function(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };

    
    
    Survey.get = function(id) {
        var deferred = $q.defer();
        $resource('/api/surveys/:id', {
            id : id
        }).get({
            id : id
        }, function(response) {
            deferred.resolve(response.data);
        }, function(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };

    

    /*
     //FUNCTIONS
     Question.getAllForSurvey = function(id) {
     var promise = DataService.getQuestionsWithAnswerCount(id);
     var deferred = $q.defer();
     promise.then(function(data) {
     var questions = [];
     data.forEach(function(value, index) {
     var quest = new Question(value);
     //quest.count = value[1];
     questions.push(quest);
     });
     deferred.resolve(questions);
     });
     return deferred.promise;
     };

     Survey.getAll = function() {
     var promise = DataService.getAllSurveys();
     var deferred = $q.defer();
     promise.then(function(data) {
     var surveys = [];
     data.forEach(function(value, index) {
     surveys.push(new Survey(value[0]));
     });
     deferred.resolve(surveys);
     });
     return deferred.promise;
     };
     Survey.get = function(id) {
     var promise = DataService.getById(id);
     var deferred = $q.defer();
     promise.then(function(data) {
     var x = new Survey(data[0]);
     deferred.resolve(x);
     });
     return deferred.promise;
     };*/

    Contact.getAll = function() {

        var obj;
        obj = [{
            name : 'Anupam Singh',
            'email' : 'anupamsdesk@gmail.com',
            'phone' : '+91-9884013910'
        }, {
            name : 'Pankaj Sharma',
            'email' : 'sharmap@gmail.com',
            'phone' : '+91-9228912121'
        }];
        return obj;

    };

    return {
        Survey : Survey,
        Question : Question,
        Contact : Contact
    };

}]);
