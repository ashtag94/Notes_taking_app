var express = require('express');
var app = express();
var mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');



// Passport Config
require('./config/passport')(passport);

//DB Config
var mongo_uri = require('./config/keys').MongoURI;

//Connect to mongoDB
mongoose.connect(mongo_uri,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB connected ...'))
    .catch(err => console.log(err));

//EJS
app.set('view engine','ejs');

//Bodyparser
app.use(express.urlencoded({ extended : false}));

//Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global variables
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/assets',express.static('public/'));
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));



var PORT = process.env.PORT || 5000;

app.listen(PORT,'0.0.0.0',function(){
    console.log(`listening to port ${PORT}`);
});