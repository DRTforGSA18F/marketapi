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

var db = mongoskin.db('mongodb://drtuser:Go*4@ds031942.mongolab.com:31942/farmersmarkets', {
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
markets/?loc=proximity&lat=x.xx&lng=x.xx&dist=x
*/
app.get('/markets/', function(req, res) {  
    var loctype = req.query.loc;
    console.log("loctype: " + loctype);
    
    //Expect URL to be: markets/?loc=zip&zip=30135
    if (loctype=="zip") {
        var zipcode = req.query.zip;
        console.log("zip: " + zipcode);
        req.db.collection('markets').find({"zip": zipcode}).toArray(function(err, items) {
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
        req.db.collection('markets').find({"state": state}).toArray(function(err, items) {
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
        req.db.collection('markets').find({"state": state,"city": city}).toArray(function(err, items) {
            if (err) {
                console.log(err);
            } else {
                res.json(items);
            }

        });
    }
    //Expect URL to be: /markets/?loc=proximity&lat=36.841885&lng=-76.135361&dist=5
    else if (loctype=="proximity") {
        
       var latitude = parseFloat(req.query.lat);
        var longitude = parseFloat(req.query.lng);
        var distance = parseInt(req.query.dist);
        var searchCriteria = [{
            $geoNear: {
                near: [longitude, latitude],
                distanceField: 'distance',
                maxDistance: ((distance / 1.25) / 3959),
                spherical: true,
                distanceMultiplier: (3959 * 1.25)
            }
        }];

        db.collection('markets').aggregate(searchCriteria, function(err, items) {
            if (err) {
                res.send(500, {
                    'error': "Server Error - While trying to query db for proximity search." + err
                });
            } else {
                res.json(items);
            }
        });

    } else {
        res.send("Error - Unhandled loctype: " + loctype +". Valid loctypes are zip, state, or city");
    }
});

app.get('/market/:id', function(req, res) {
    req.db.collection('markets').find({"_id": req.params.id}).toArray(function(err, items) {
        if (err) {
            console.log(err);
        } else {
            res.json(items);
        }
    })
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