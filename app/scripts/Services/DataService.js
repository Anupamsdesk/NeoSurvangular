'use strict';
angular.module('node4jsHttpApp')
.value('appName','Neo-survangular')
.value('version','0.0.1')
.value('tag','"A higly configurable and robust Survey Tool"')
.factory('Models', function(){
    var Contact, Survey, Question;
    Contact = function (obj){
        var name = obj.name,
         email= obj.email, phone=obj.phone;
         return{
             name: name,
             email: email,
             phone: phone
         }
    };
    Survey = function(obj){
        var id = obj.id;
        var title = obj.title;
        var opendate = obj.opendate;
        var closedDate = obj.closedDate;
        return {
            id: id,
            title: title,
            closeDate: closedDate,
            openDate: opendate
        };
    };
    Question = function (obj){
        return {
            id: obj.id,
            title: obj.title,
            count: obj.count
        };
    };
    
    return{
        Contact: Contact,
        Survey: Survey,
        Question: Question
    };
})
.factory('DataService',['$http','$q','Models',function ($http, $q, Models){
    var getAllContacts, getAllSurveys, neo4jRequest,getQuestions,getQuestionsWithAnswerCount,
    handleError;
    
    getQuestions = function(surveyId){
        var queryStatements = [{'statement': 'match (n)-[R]-(q) where n.id = "'+surveyId+'" return q'}], successFn, errorFn;
        return neo4jRequest(queryStatements);
    };
    
    
    getQuestionsWithAnswerCount = function (surveyId){
        var stmt = "match (m)-[R]-(q)-[T]-(o)-[R1]-x where m.id='"+surveyId+"' WITH m,q,T,o,R1,x,count(*) as cnt " + "WHERE type(T)='HAS_ANSWER' AND type(R1)='ANSWERED_BY' return q,cnt";
        var queryStatements=[{'statement':stmt}];
        var promise = neo4jRequest(queryStatements);
        var deferred = $q.defer();
        promise.then(function (response){
            if (response.errors.length>0){
                handleError(response);
                deferred.reject('INVALID REQUEST!');
            }else{
                var questions = [];
                response.results[0].data.forEach(function(value, index){
                    var obj = {id: value[0].id, title: value[0].text, count: value[1]};
                    questions.push(Models.Question(obj));    
                });
                deferred.resolve(questions);
            }
        });        
        return deferred.promise;

    };
    getAllContacts = function(){
        var obj,contacts;
        obj = [{name: 'Anupam Singh', 'email': 'anupamsdesk@gmail.com', 'phone':'+91-9884013910' },
        {name: 'Pankaj Sharma', 'email': 'sharmap@gmail.com', 'phone':'+91-9228912121' },
        ];    
        contacts=[];
        obj.forEach(function(value, index){
            contacts.push(new Models.Contact(value));
        })
        return contacts;
    };
    
    getAllSurveys = function(){
        var queryStatements = [{'statement': 'match n where n.id =~ "(?i)S.*" return n'}], successFn, errorFn;
        return neo4jRequest(queryStatements);
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
        getQuestionsWithAnswerCount: getQuestionsWithAnswerCount
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
