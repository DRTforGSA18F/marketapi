var express = require('express'),
    mongoskin = require('mongoskin'),
    bodyParser = require('body-parser'),
    logger = require('morgan');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(logger('dev'));

var cool = require('cool-ascii-faces');
//var db = require('./models/mongolab.js');

var db = mongoskin.db('mongodb://drtuser:Go*4@ds031832.mongolab.com:31832/farmersmarket', {
    safe: true
});

app.set('port', (process.env.PORT || 5000));


app.use(function(req, res, next) {
    req.db = db;
    next();
});


app.get('/', function(req, res) {
    var result = 'Hello World'
    res.send(result);
});


/* Location API 
Expect URL to be of format: markets/?loc=type&[zip, city, or state]=value.  Examples:
markets/?loc=zip&zip=30135
markets/?loc=state&state=Georgia
markets/?loc=city&state=Georgia&city=Douglasville
*/
app.get('/markets/', function(req, res) {  
    var loctype = req.query.loc;
    console.log("loctype: " + loctype);
    
    //Expect URL to be: markets/?loc=zip&zip=30135
    if (loctype=="zip") {
        var zipcode = req.query.zip;
        console.log("zip: " + zipcode);
        req.db.collection('markets').find({"zip": parseFloat(zipcode)}).toArray(function(err, items) {
            if (err) {
                console.log(err);
            } else {
                res.json(items);
            }

        });    
    }
    //Expect URL to be: markets/?loc=state&state=Georgia
    else if (loctype=="state") {
        var state = req.query.state;
        console.log("state: " + state);
        req.db.collection('markets').find({"State": state}).toArray(function(err, items) {
            if (err) {
                console.log(err);
            } else {
                res.json(items);
            }

        });
    }
    //Expect URL to be: markets/?loc=city&state=Georgia&city=Douglasville
    else if (loctype=="city") {
        var state = req.query.state;
        var city = req.query.city;
        console.log("state: " + state);
        console.log("city: " + city);
        req.db.collection('markets').find({"State": state,"city": city}).toArray(function(err, items) {
            if (err) {
                console.log(err);
            } else {
                res.json(items);
            }

        });
    }
    else {
        console.log("Error - Unhandled loctype: " + loctype +". Valid loctypes are zip, state, or city");
    }
});

app.get('/market/:id', function(req, res) {
    req.db.collection('markets').find({"_id": parseFloat(req.params.id)}).toArray(function(err, items) {
        if (err) {
            console.log(err);
        } else {
            res.json(items);
        }
    });
});

app.get('/markets', function(req, res) {
    req.db.collection('markets').find().toArray(function(err, items) {
        if (err) {
            console.log(err);
        } else {
            res.json(items);
        }
    });
});

app.listen(app.get('port'), function() {
    console.log("Node app is running on port:" + app.get('port'))
})