var express = require("express");
 
var app = express();
app.use(express.logger());

// Configuration
var modelsModule = require('./Data/Model');
var models = new modelsModule(); 


app.configure(function(){
  app.set('views', __dirname + '/app');
  //app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/app'));
  app.use(app.router);
  app.engine('html', require('ejs').renderFile);
});

app.get('/', function(request, response) {
  response.render('index.html')
});

app.get('/api/surveys', function (req,res){
    var promise = models.Survey.getAll();
    promise.then(function(surveys){
        res.send({data: surveys});
    },sendError);    
});
app.get('/api/surveys/:id', function (req,res){
    var promise = models.getById(req.params.id);
    promise.then(function(data){
        res.send({data: data});
    },sendError);    
});

app.put('/api/surveys/:id', function (req,res){
    if (req.body.data){
        var promise = models.Survey.update(req.body.data);
        promise.then(res.send(200),
            function (err){
                res.send(500,{error: 'Some error occured'});
            }
    );
    }else{
        res.send(400,{error: 'Illegal Operation'});
    }
    
    console.log('body');
    console.log(req.body);
    console.log('params');    
    console.log(req.params);
});



app.get('/api/surveys/:id/questions', function (req,res){    
    var promise = models.Question.getAllFor(req.params.id);
    promise.then(function(questions){
        res.send({data: questions});
    },sendError);
});

app.get('/api/surveys/:id/questionsWithOptions', function (req,res){    
    var promise = models.Question.getWithOptionsAllFor(req.params.id);
    promise.then(function(questions){
        res.send({data: questions});
    },sendError);
});




function sendError(err,res){
    handleError(err);
    res.status(500);
    res.send(500, {error: 'Some Error Occured!'});
}

function handleError(err){
    console.err("Error: "+ err)
}


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
