var modelsModule = require('./Model');
var models = new modelsModule(); 



var promise = models.Question.getWithOptionsAllFor(6);
    promise.then(function(questions){
        console.log(questions);
    },function(err){
        console.log('errors!');
    });