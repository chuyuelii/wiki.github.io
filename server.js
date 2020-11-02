
// Use the dotenv
if(process.env.NODE_ENV !== 'production'){
        require('dotenv').config()
}


// load modules from node_modules
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
// var cookie = require('cookie-parser');


var session = require('express-session');
var crypto = require('crypto');


var routes = require('./app/routes/routes');

var app = express();


app.set('views',path.join(__dirname,'app/views'));
app.use(express.urlencoded({ extended : false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());
app.set(crypto);
app.use(session(
    {secret:process.env.SESSION_SECRET, resave: false, saveUninitialized: false}
));
app.use('/',routes);
app.listen(3001,function(){
        console.log('listenning on port 3001');
});

module.exports = app;