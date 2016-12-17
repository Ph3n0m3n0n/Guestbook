// The commented out console.logs are for testing purposes 

var express = require('express');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var db = mongojs('MONGO_URL');
var mongojs = require('mongojs');
var db = mongojs('userlist', ['userlist']);
var bodyParser = require('body-parser');
var stormpath = require('express-stormpath');
var dotenv = require('dotenv');

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.use(stormpath.init(app, {
  website: true
}));

app.get('/userlist', function (req, res) {
  console.log('I received a GET request');

  db.userlist.find(function (err, docs) {
    // console.log(docs);
    res.json(docs);
  });
});

app.post('/userlist', function (req, res) {
  // console.log(req.body);
  db.userlist.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/userlist/:id', function (req, res) {
  var id = req.params.id;
  // console.log(id);
  db.userlist.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.get('/userlist/:id', function (req, res) {
  var id = req.params.id;
  // console.log(id);
  db.userlist.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.put('/userlist/:id', function (req, res) {
  var id = req.params.id;
  // console.log(req.body.name);
  db.userlist.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: {name: req.body.name, email: req.body.email, message: req.body.message}},
    new: true}, function (err, doc) {
      res.json(doc);
    }
  );
});


app.listen(3000);
app.on('stormpath.ready', function () {
  console.log('Server running on port 3000. Stormpath Ready!');
});
