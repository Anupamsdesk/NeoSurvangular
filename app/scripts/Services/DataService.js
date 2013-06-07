'use strict';
angular.module('node4jsHttpApp')
.value('appName','Neo-survangular')
.value('version','0.0.1')
.value('tag','"A higly configurable and robust Survey Tool"')

.factory('GraphDBService',['$http','$q',function ($http, $q){
    var getAllContacts, getAllSurveys, neo4jRequest,getQuestions,getQuestionsWithAnswerCount,getById,
    handleError;
    
    
    getQuestionsWithAnswerCount = function (surveyId){
        var stmt = "match (m)-[R]-(q)-[T]-(o)-[R1]-x where m.id='"+surveyId+"' WITH m,q,T,o,R1,x,count(*) as cnt " + "WHERE type(T)='HAS_ANSWER' AND type(R1)='ANSWERED_BY' return q,cnt",
            queryStatements=[{'statement':stmt}],
            deferred = $q.defer(),
            promise = neo4jRequest(queryStatements);
         promise.then(function (response){
            if (response.errors.length>0){
                handleError(response);
                deferred.reject('INVALID REQUEST!');
            }else{
                deferred.resolve(response.results[0].data);
            }
        });   
        return deferred.promise;
    };
    getAllContacts = function(){
        var obj;
        obj = [{name: 'Anupam Singh', 'email': 'anupamsdesk@gmail.com', 'phone':'+91-9884013910' },
        {name: 'Pankaj Sharma', 'email': 'sharmap@gmail.com', 'phone':'+91-9228912121' },
        ];    
        
        return obj;
    };
    
    getById = function(id){
        var queryStatements = [{'statement': 'match n where n.id = "'+id+'" return n'}],
            deferred = $q.defer(),
            promise = neo4jRequest(queryStatements);
         promise.then(function (response){
            if (response.errors.length>0){
                handleError(response);
                deferred.reject('INVALID REQUEST!');
            }else{
                deferred.resolve(response.results[0].data);
            }
        });   
        return deferred.promise;
    };
    
    
    
    getAllSurveys = function(){
        var queryStatements = [{'statement': 'match n where n.id =~ "(?i)S.*" return n'}],
            deferred = $q.defer(),
            promise = neo4jRequest(queryStatements);
         promise.then(function (response){
            if (response.errors.length>0){
                handleError(response);
                deferred.reject('INVALID REQUEST!');
            }else{
                deferred.resolve(response.results[0].data);
            }
        });   
        return deferred.promise;
    };
    
    neo4jRequest = function(statements, successCallback, errorCallback){
        var url='http://localhost:7474/db/data/transaction',
        config = {'Accept':'application/json', 'Content-Type':'application/json'},
        data={'statements':statements};
        var deferred = $q.defer();
        $http.post(url,data,config).
        success(function(data,status){
            deferred.resolve(data);
        }).error(function(response,status){
            deferred.resolve(response);
        });
        return deferred.promise;
    };
    
    return{
        getAllContacts: getAllContacts,
        getAllSurveys: getAllSurveys,
        getQuestions: getQuestions,
        getQuestionsWithAnswerCount: getQuestionsWithAnswerCount,
        getById: getById
    };
            
    handleError = function(errorObj) {
        errorObj = errorObj.errors[0];
        console.log('Ooops an error has occured: ' + errorObj.code + "; " + errorObj.message + ": " + errorObj.status);
    };
    
    /*
    //count of answers per question in a survey: 
        match (m)-[R]-(q)-[T]-(o) where m.id='S1' WITH q,T, count(*) as cnt WHERE type(T)='HAS_ANSWER' return q,cnt;
    
    match (m)-[R]-(q)-[T]-(o)-[R1]-x where m.id=~'S.*' WITH m,q,T,o,R1,x,count(*) as cnt 
      WHERE type(T)='HAS_ANSWER' AND type(R1)='ANSWERED_BY' return m.id,q,x;
    
    
    match (m)-[R]-(q)-[T]-(o)-[R1]-x where m.id=~'S.*' WITH m,q,T,o,R1,x,count(*) as cnt 
      WHERE type(T)='HAS_ANSWER' AND type(R1)='ANSWERED_BY' return m.id,q,cnt
              
    */
    
}]);
