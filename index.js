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

//markets/loc=type&zip=value

app.get('/markets/', function(req, res) {
    //look for the location parameter and zipcode parameter
    var zipcode = req.query.zip;
    var loctype = req.query.loc;
    console.log(zipcode);
    console.log(loctype);
    //res.send(zipcode);

    req.db.collection('markets').find({"zip": parseFloat(zipcode)}).toArray(function(err, items) {
        if (err) {
            console.log(err);
        } else {
            res.json(items);
        }

    });
});


/* Example URLs:
/markets/?loc=zip&zip=23462
/markets/?loc=state&state=VA
/markets/?loc=city&state=VA&city=Fairfax


//markets/loc=type&zip=value


/*app.get('/markets/', returnZIP);

function returnZIP(req, res) {
    //look for the location parameter and zipcode parameter
    var zipcode = req.query.zip;
    var loctype = req.query.loc;
    console.log(zipcode);
    console.log(loctype);
    res.send(zipcode);
}*/


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