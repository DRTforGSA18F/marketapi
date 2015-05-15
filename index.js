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
  var result = {
    "_id":1005969,
    "MarketName":"\"Y Not Wednesday Farmers Market at Town Center\"",
    "Website":"http://www.sandlercenter.org/index/ynotwednesdays",
    "street":"201 Market Street,",
    "city":"Virginia Beach",
    "County":"Virginia Beach",
    "State":"Virginia",
    "zip":23462,
    "Season1Date":"June to August",
    "Season1Time":"Wed:5:00 PM - 8:00 PM;",
    "Season2Date":"",
    "Season2Time":"",
    "Season3Date":"",
    "Season3Time":"",
    "Season4Date":"",
    "Season4Time":"",
    "lng":-76.135361,
    "lat":36.841885,
    "Location":"Other",
    "Credit":"Y",
    "WIC":"N",
    "WICcash":"N",
    "SFMNP":"N",
    "SNAP":"N",
    "Bakedgoods":"Y",
    "Cheese":"Y",
    "Crafts":"N",
    "Flowers":"Y",
    "Eggs":"Y",
    "Seafood":"Y",
    "Herbs":"N",
    "Vegetables":"Y",
    "Honey":"Y",
    "Jams":"Y",
    "Maple":"N",
    "Meat":"N",
    "Nursery":"N",
    "Nuts":"N",
    "Plants":"N",
    "Poultry":"N",
    "Prepared":"Y",
    "Soap":"Y",
    "Trees":"N",
    "Wine":"Y",
    "updateTime":"5/5/2012 17:56"
  };
  response.json(result);
});




app.listen(app.get('port'), function() {
  console.log("Node app is running on port:" + app.get('port'))
})