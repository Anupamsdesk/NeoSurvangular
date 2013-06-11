var q = require('q');
var GService = require('./GraphDataService');

function Models(DataService) {
    DataService = DataService || GService;

    var Question = function(obj) {
        return {
            id : obj.id,
            title : obj.text,
            count : obj.count,
            type : obj.type,
            options: obj.options
        };
    }, Survey = function(obj) {
        return {
            id : obj.id,
            title : obj.title,
            closeDate : obj.closeDate,
            openDate : obj.openDate,
            type : obj.type
            
        }
    }, Contact = function(obj) {
        var name = obj.name, email = obj.email, phone = obj.phone;
        return {
            name : name,
            email : email,
            phone : phone
        }
    }, getById, update;

    update = function(obj) {
        var deferred = q.defer();
        DataService.update(obj, function(node) {
            deferred.resolve(node);
        }, function(err) {
            console.log(err);
            deferred.reject(new Error(err));
        });
        return deferred.promise;
    };

    Survey.update = update;

    Survey.create = function(obj) {
        var deferred = q.defer();
        DataService.insert(obj, function(node) {
            deferred.resolve(node);
        }, function(err) {
            deferred.reject(new Error(err));
        });
        return deferred.promise;
    };

    Survey.getAll = function() {
        var deferred = q.defer();
        DataService.getAllSurveys(function(results) {
            var surveys = [];
            results.forEach(function(result) {
                surveys.push(new Survey(result));
            });
            deferred.resolve(surveys);
        }, function(err) {
            console.log(err);
            deferred.reject(new Error(err));
        });
        return deferred.promise;
    };

    Question.getAllFor = function(id) {
        var deferred = q.defer();
        DataService.getQuestionsForSurvey(id, function(results) {
            var questions = [];
            results.forEach(function(result) {
                questions.push(new Question(result));
            });
            deferred.resolve(questions);
        }, function(err) {
            deferred.reject(new Error(err));
        });
        return deferred.promise;
    };
    
    Question.getWithOptionsAllFor = function(id) {
        var deferred = q.defer();
        DataService.getQuestionsWithOptionsForSurvey(id, function(results) {
            var questions = [];
            results.forEach(function(result) {
                questions.push(new Question(result));
            });
            deferred.resolve(questions);
        }, function(err) {
            deferred.reject(new Error(err));
        });
        return deferred.promise;
    };

    function handleError(err) {
        console.error('Error occured!');
        console.error(JSON.stringify(err));
        process.exit();
    }

    getById = function(id) {
        var deferred = q.defer();
        DataService.get(id, function(result) {
            deferred.resolve(result);
        }, function(err) {
            console.log('Error: ' + err);
            deferred.reject(new Error(err));
        });
        return deferred.promise;
    };

    return {
        Survey : Survey,
        Contact : Contact,
        Question : Question,
        getById : getById
    };
}

function test() {
    console.log('here!');
    var m = new Models();
    var promise = m.Survey.getAll();
    promise.then(function(surveys) {
        console.log('HELLO!');
        console.log(surveys);
    }, function(err) {
        m.handleError(err);
    });

}

module.exports = Models;

/*obj.then(function(value){
 console.log(value);
 value.title='HELLO WORLD 200000!!';
 console.log(value);
 console.log(m.Survey.update);
 m.Survey.update(value).then(function(val){
 console.log('done!');
 });
 });*/

/*

 var obj = m.getById(24);
 obj.then(function(value){
 console.log(value);
 value.title='Hello World!!';
 console.log(value);
 m.update(value).then(function(val){
 console.log(val);
 });
 });

 var prom = m.Survey.create(obj);
 prom.then(function(response){
 console.log(response);
 });

//get all questions with type and count
start s=node(6) match (s)-[R]-(q)-[P?:HAS_ANSWER]-(t) return q,R.type as type,count(P) as count ;


//get all questions with type and options
start s=node(6) match (s)-[R]-(q)-[p?:HAS_OPTIONS]-(t) return q,p,t;
start s=node(6) match (s)-[R]-(q)-[p?:HAS_OPTIONS]-(t) return q,R.type as type,t.options as options;
[23,10,19]












 start s=node(6) match (s)-[R]-(q)-[P?]-(t)
 WHERE (type(P) = 'HAS_ANSWER')
 return q,R.type as type,type(P),count(DISTINCT P) ;

 var promise = m.Question.getAllFor('S1');
 promise.then(function(questions){
 console.log(questions);
 });

 //testing Survey.getAll();
 var promise = m.Survey.getAll();
 promise.then(function(surveys){
 console.log(surveys);
 });

 //testing getById();
 var prom1 = m.getById('S2');
 prom1.then(function(node){
 console.log(node);
 });

 */