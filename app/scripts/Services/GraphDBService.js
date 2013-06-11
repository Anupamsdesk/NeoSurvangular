'use strict';
angular.module('node4jsHttpApp')
.value('appName','Neo-survangular')
.value('version','0.0.1')
.value('tag','"A higly configurable and robust Survey Tool"')

.factory('GraphDBService',['$http','$q',function ($http, $q){
    var getAllContacts, getAllSurveys, neo4jRequest,getQuestions,
            getQuestionsWithAnswerCount,getById, handleError, updateSurvey, 
            commit;
    
    handleError = function(errorObj) {
        errorObj = errorObj.errors[0];
        console.log('Ooops an error has occured: ' + errorObj.code + "; " + 
                errorObj.message + ": " + errorObj.status);
    };
    
    updateSurvey=function(obj){
        var stmt1 = "match s where s.id='"+obj.id+"' set s.title='"+obj.title+
                "', s.closedDate='"+obj.closeDate+"', s.opendate='"+ 
                obj.openDate+"' return s",
        deferred = $q.defer(),
        promise = neo4jRequest([{'statement': stmt1}]);
        console.log(stmt1);
        promise.then(function(response){
           if (response.errors.length>0){
                handleError(response);
                deferred.resolve(null);
            }else{
                console.log(response);
                var newprom = commit(response.commit)
                newprom.then(function(commitResponse){
                    if (commitResponse.errors.length>0){
                        handleError(commitResponse);
                        deferred.resolve(null);
                    }else{
                        console.log(commitResponse);
                        deferred.resolve(response.results[0].data);
                    }  
                });
            }
        });
        return  deferred.promise;
        
    };
    
    commit = function(commitRequest){
        var deferred = $q.defer();
        var url=commitRequest,
        config = {'Accept':'application/json', 
                'Content-Type':'application/json'},
        data=null;
        var deferred = $q.defer();
        $http.post(url,data,config).
        success(function(data,status){
            deferred.resolve(data);
        }).error(function(response,status){
            deferred.resolve(response);
        });
        return deferred.promise;        
    };
    
    getQuestionsWithAnswerCount = function (surveyId){
        var stmt1 = "match (s)-[R]-(q) where s.id='"+surveyId+
        "' return q,R.type";
        
        var stmt = "match (s)-[R]-(q)-[r]-(p)-[r2]-(x) where s.id='"+surveyId+
                "' return count(distinct x)",
            queryStatements=[{'statement':stmt1},{'statement':stmt}],
            deferred = $q.defer(),
            promise = neo4jRequest(queryStatements);
         promise.then(function (response){
            if (response.errors.length>0){
                handleError(response);
                deferred.reject('INVALID REQUEST!');
            }else{
                var data = response.results[0].data;
                var count = response.results[1].data[0][0];
                var questions = [];
                data.forEach(function (value, index){
                    var obj = value[0];
                    obj.type = value[1];
                    obj.count = count;
                    questions.push(obj)
                });
                deferred.resolve(questions);
            }
        });   
        return deferred.promise;
    };
    getAllContacts = function(){
        var obj;
        obj = [{name: 'Anupam Singh', 'email': 'anupamsdesk@gmail.com', 
                'phone':'+91-9884013910' },
                {name: 'Pankaj Sharma', 'email': 'sharmap@gmail.com', 
                'phone':'+91-9228912121' }
        ];    
        return obj;
    };
    
    getById = function(id){
        var queryStatements = [{'statement': 'match n where n.id = "'+id+
                '" return n'}],
            deferred = $q.defer(),
            promise = neo4jRequest(queryStatements);
         promise.then(function (response){
            if (response.errors.length>0){
                handleError(response);
                deferred.reject('INVALID REQUEST!');
            }else{
                deferred.resolve(response.results[0].data[0]);
            }
        });   
        return deferred.promise;
    };
    
    getAllSurveys = function(){
        var queryStatements = 
                [{'statement': 'match n where n.id =~ "(?i)S.*" return n'}],
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
        config = {'Accept':'application/json', 
                'Content-Type':'application/json'},
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
        getById: getById,
        updateSurvey: updateSurvey
    };
            
 }]);   
    /*
    //count of answers per question in a survey: 
        match (m)-[R]-(q)-[T]-(o) where m.id='S1' WITH q,T, count(*) as cnt WHERE type(T)='HAS_ANSWER' return q,cnt;
    
    match (m)-[R]-(q)-[T]-(o)-[R1]-x where m.id=~'S.*' WITH m,q,T,o,R1,x,count(*) as cnt 
      WHERE type(T)='HAS_ANSWER' AND type(R1)='ANSWERED_BY' return m.id,q,x;
    
    
    match (m)-[R]-(q)-[T]-(o)-[R1]-x where m.id=~'S.*' WITH m,q,T,o,R1,x,count(*) as cnt 
      WHERE type(T)='HAS_ANSWER' AND type(R1)='ANSWERED_BY' return m.id,q,cnt
    
    match (m)-[R]-(q)-[T]-(o) where m.id=~'S.*'  Return m.id,q,T
    
    
    match (s)-[R]-(q)-[T]-(o) WHERE q.id =~ '(?i)q2.*' return R,q,T,o;
    match (s)-[R]-(q) WHERE q.id =~ '(?i)q.*' AND type(R)='CONTAINS' return R,q; 
              
              
              match (m)-[R]-(q)-[T]-(o)-[R1]-x where m.id=~'S.*' WITH m,R,q,T,o,R1,x,count(*) as cnt 
      WHERE type(T)='HAS_ANSWER' AND type(R1)='ANSWERED_BY' return m.id,q,R.type,cnt;
              
              
     //QUERY TO GET ALL QUESTIONS FOR A SURVEY
              match (s)-[R]-(q) where s.id='S1' return q,R.type;
              
              match (s)-[R]-(q)-[R1]-p where s.id =~ '(?i)S.*' WITH 
                q,R.type as type,R1, count(p) as cnt 
                  return q,type,R1,cnt;
              
              
               match (s)-[R]-(q) where s.id='S1' WITH q,R.type as type
              match (q)-[R1]-b   return q,type,R1,count(b);
              
              
              match (s)-[R]-(q)-[r]-(p)-[r2]-(x) where s.id='S1' return count(distinct x);
                      
    */
    

