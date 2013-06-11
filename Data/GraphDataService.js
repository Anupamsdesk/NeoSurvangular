var neo4j = require('neo4j-js');
var _ = require('underscore');
var dbpath = 'http://localhost:7474/db/data/';

var querys = {
    getAllSurveys : 'match n where n.type! = {survey} return n',
    getById : 'match n where n.id = {id} return n',
    getQuestionsForSurvey : 
            'start s=node({id}) match (s)-[R]-(q)-[P?:HAS_ANSWER]-(t) return ' 
            + 'q,R.type as type,count(P) as count',
    getQuestionsWithOptionsForSurvey : 
            'start s=node({id}) match (s)-[R]-(q)-[p?:HAS_OPTIONS]-(t) '+
            'return q,R.type as type,t.options as options'
    
};
function getAllSurveys(callback, err) {
    executeQuery(querys.getAllSurveys, {survey: 'survey'}, function(results) {
        var data = [];
        results.forEach(function(result) {
            var obj = _.clone(result.n.data);
            obj.id = result.n.id;
            data.push(obj);
        });
        callback(data);
    }, err);
}

function insert(obj, callback, err) {
    neo4j.connect(dbpath, function(err, graph) {
        if (err) {
            error(err);
        } else {
            graph.createNode(obj, function(err, node) {
                if (err)
                    error(err);
                else
                    callback(node);
            });
        }
    });
}

var update = function(obj, callback, err) {
    neo4j.connect(dbpath, function(err, graph) {
        if (err) {
            error(err);
        } else {
            var newobj = _.clone(obj);
            delete(newobj.id);
            graph.getNode(obj.id, function(err,node){
               if (err){
                   error(err);
               } else{
                   var batch = graph.createBatch();
                   node.replaceAllProperties(batch,newobj,callback);
                   batch.run();
               }
            });
        }
    });
};

function getById(id, callback, err) {
    executeQuery(querys.getById, {
        id : id
    }, function(result) {
        var obj = _.clone(result[0].n.data);
        obj.id = result[0].n.id;
        callback(obj);
    }, err);
};

function getQuestionsWithOptionsForSurvey(id, callback, err) {
    executeQuery(querys.getQuestionsWithOptionsForSurvey, {
        id : +id
    }, function(results) {
        
        var data = [];
        results.forEach(function(result) {
            var obj = _.clone(result.q.data);
            obj.id = result.q.id;
            obj.type = result.type;
            obj.options = result.options;
            data.push(obj);
        });
        callback(data);
    }, err);
}



function getQuestionsForSurvey(id, callback, err) {
    executeQuery(querys.getQuestionsForSurvey, {
        id : +id
    }, function(results) {
        var data = [];
        results.forEach(function(result) {
            var obj = _.clone(result.q.data);
            obj.id = result.q.id;
            obj.type = result.type;
            obj.count = result.count;
            data.push(obj);
        });
        callback(data);
    }, err);
}

function get(id, callback, err) {
    neo4j.connect(dbpath, function(err, graph) {
        if (err) {
            error(err);
        } else {
            graph.getNode(id, function(err, result) {
                if (err)
                    error(err);
                else {
                    var obj = _.clone(result.data);
                    obj.id = result.id;
                    callback(obj);
                }
            });
        }
    });
}

function executeQuery(query, params, callback, error) {
    neo4j.connect(dbpath, function(err, graph) {
        if (err) {
            error(err);
        } else {
            graph.query(query, params, function(err, results) {
                if (err)
                    error(err);
                else
                    callback(results);
            });
        }
    });
}

module.exports = {
    getAllSurveys : getAllSurveys,
    getById : getById,
    getQuestionsForSurvey : getQuestionsForSurvey,
    getQuestionsWithOptionsForSurvey: getQuestionsWithOptionsForSurvey,
    get : get,
    insert : insert,
    update : update
};

