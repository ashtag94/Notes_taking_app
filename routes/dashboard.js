var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//DB config
var mongo_uri = require('../config/keys').MongoURI;

//DB connect
mongoose.connect(mongo_uri,{useNewUrlParser: true, useUnifiedTopology: true});

//User model
const User = require('../models/User');


router.get('/',function(req,res){
    User.findOne({email:req.user.email},function(err,entry){
        if (err) throw err;
        res.render('dashboard',{todo_list : entry.items, username: entry.name});
    });
});

router.post('/',function(req,res){
    User.findOne({email:req.user.email},function(err,entry){
        if(err) throw err;
        entry.items.push(req.body.item);
        entry.save(function(err, data){
            if (err) throw err;
            res.json(data);
        });
    });
    
});

router.delete('/:item',function(req,res){
    User.findOne({email:req.user.email},function(err,data){
        if(err) throw err;
        for(var i = 0;i< data.items.length;i++){
            if(data.items[i] === req.params.item.replace(/\-/g," ")){
                data.items.splice(i,1);
            }
        }
        data.save(function(err,data2){
            res.json(data2);
        });

        });
    });

module.exports = router;