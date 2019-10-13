var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/',function(req,res){
    res.render('welcome');
});

router.use('/dashboard',ensureAuthenticated ,require('./dashboard'));
module.exports = router;