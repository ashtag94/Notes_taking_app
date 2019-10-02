var express = require('express');

var app = express();

app.use('/assets',express.static('public/'));

app.set('view engine','ejs');

var todocontroller = require('./controllers/todocontroller');

todocontroller(app);

var PORT = process.env.PORT || 3000;

app.listen(PORT,'0.0.0.0',function(){
    console.log(`listening to port ${PORT}`);
});