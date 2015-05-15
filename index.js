var express = require('express');
var app = express();
var cool = require('cool-ascii-faces');
var db = require('./models/mongolab.js');

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  var result = 'Hello World'
  response.send(result);
});


app.get('/markets', function(request, response) {
  var result = 'markets'
  response.send(result);
});




app.listen(app.get('port'), function() {
  console.log("Node app is running on port:" + app.get('port'))
})