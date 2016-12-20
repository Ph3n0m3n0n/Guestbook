if (process.env.ENVIRONMENT !== "production") require('dotenv').config();

var express = require('express');
var app = express();
var dotenv = require('dotenv');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Database stuff ... =/
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/userlist');
var User = require('./models/users')
// just to make sure that I am actually connecting...
mongoose.connection.once('connected', function() {
  console.log("Connected to database")
});

// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.get('/userlist', function (req, res) {
  console.log('I received a GET request');

  User.find({}, function (err, docs) {
    if (err) throw err;
      // console.log(docs);
      res.json(docs);
  });
});

app.post('/userlist', function (req, res) {
  console.log(req.body);
  var msg = new User(
    { name: req.body.name,
      email: req.body.email,
      message: req.body.message});
  msg.save(function(err, user) {
    res.json(user);
  });
});

app.delete('/userlist/:id', function (req, res) {
  var id = req.params.id;
  // console.log(id);
  User.remove({_id: mongodb.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.get('/userlist/:id', function (req, res) {
  var id = req.params.id;
  // console.log(id);
  User.findOne({_id: mongodb.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.put('/userlist/:id', function (req, res) {
  var id = req.params.id;
  // console.log(req.body.name);
  User.findAndModify({
    query: {_id: mongodb.ObjectId(id)},
    update: {$set: {name: req.body.name, email: req.body.email, message: req.body.message}},
    new: true}, function (err, doc) {
      res.json(doc);
    }
  );
});

app.get('/login', function (req, res) {
  res.render('/login');
});

app.get('/register', function (req, res) {
  res.render('/register');
});


app.listen(process.env.PORT || 3000);
  console.log('Server running on port 3000...');
