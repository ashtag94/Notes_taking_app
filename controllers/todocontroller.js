var mongoose = require('mongoose');

var bodyParser = require('body-parser');

var mongo_uri = process.env.mongo_uri || 'mongodb://test:test@cluster0-shard-00-00-puu21.mongodb.net:27017,cluster0-shard-00-01-puu21.mongodb.net:27017,cluster0-shard-00-02-puu21.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'

mongoose.connect(mongo_uri,{useNewUrlParser: true, useUnifiedTopology: true});

var todoSchema = new mongoose.Schema({
    item: String
});

var Todo = mongoose.model('Todo',todoSchema);

var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function(app){

    app.get('/',function(req,res){
        Todo.find({},function(err,data){
            if (err) throw err;
            res.render('index',{todo_list : data});
            // console.log(`GET request handled with data :${data}`);
        });
    });

    app.post('/',urlencodedParser,function(req,res){
        Todo.find(req.body,function(err,data){
            if(err) throw err;
            if (data.length === 0){
                var newItem = new Todo(req.body);
                newItem.save(function(err,data){
                    if(err) throw err;
                    // Todo.find({},function(err,data){
                    //     res.render('index',{todo_list : data});    
                    // });
                    res.json(data);
                });
            }
            else{
                // Todo.find({},function(err,data){
                //     res.render('index',{todo_list : data});    
                // });
                res.json(data);
            }
        });
        
    });

    app.delete('/:item',function(req,res){
        // console.log(`remove requested ${req}`);
        Todo.find({item: req.params.item.replace(/\-/g," ")}).remove(function(err,data){
            if (err) throw err;
            res.json(data);
        });
    });

}