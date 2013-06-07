angular.module('node4jsHttpApp').factory('Models', ['GraphDBService','$q',function(DataService, $q) {
    Question = function(obj) {
        return {
            id : obj.id,
            title : obj.text,
            count : obj.count
        };
    };
     Survey = function(obj) {
        return {
            id : obj.id,
            title : obj.title,
            closeDate : obj.closedDate,
            openDate : obj.opendate
        };
    };
    
     Contact = function (obj){
        var name = obj.name,
         email= obj.email, phone=obj.phone;
         return{
             name: name,
             email: email,
             phone: phone
         }
    };
    
    //FUNCTIONS 
    Question.getAllForSurvey = function(id) {
        var promise = DataService.getQuestionsWithAnswerCount(id);
        var deferred = $q.defer();
        promise.then(function(data) {
            var questions = [];
            data.forEach(function(value, index) {
                var quest = new Question(value[0]);
                quest.count = value[1];
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
    Survey.get = function(id){
        var promise = DataService.getById(id);
        var deferred = $q.defer();
        promise.then(function(data) {
            var survey=null;
            data.forEach(function(value, index) {
                survey=new Survey(value[0]);
            });
            deferred.resolve(survey);
        });
        return deferred.promise;
    };
    
    Contact.getAll= function(){
        contacts=[];
        var obj = DataService.getAllContacts();
        obj.forEach(function(value, index){
            contacts.push(new Contact(value));
        });
        return contacts;
    };

    return {
        Survey : Survey,
        Question : Question,
        Contact: Contact
    };

}]);
