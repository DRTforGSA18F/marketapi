[1mdiff --git a/index.js b/index.js[m
[1mindex 54c748c..d871f41 100644[m
[1m--- a/index.js[m
[1m+++ b/index.js[m
[36m@@ -13,7 +13,7 @@[m [mapp.use(logger('dev'));[m
 var cool = require('cool-ascii-faces');[m
 //var db = require('./models/mongolab.js');[m
 [m
[31m-var db = mongoskin.db('mongodb://drtuser:Go*4@ds031832.mongolab.com:31832/farmersmarket', {[m
[32m+[m[32mvar db = mongoskin.db('mongodb://drtuser:Go*4@ds031942.mongolab.com:31942/farmersmarkets', {[m
     safe: true[m
 });[m
 [m
[36m@@ -37,6 +37,7 @@[m [mExpect URL to be of format: markets/?loc=type&[zip, city, or state]=value.  Exam[m
 markets/?loc=zip&zip=30135[m
 markets/?loc=state&state=Georgia[m
 markets/?loc=city&state=Georgia&city=Douglasville[m
[32m+[m[32mmarkets/?loc=proximity&lat=x.xx&lng=x.xx&dist=x[m
 */[m
 app.get('/markets/', function(req, res) {  [m
     var loctype = req.query.loc;[m
[36m@@ -46,7 +47,7 @@[m [mapp.get('/markets/', function(req, res) {[m
     if (loctype=="zip") {[m
         var zipcode = req.query.zip;[m
         console.log("zip: " + zipcode);[m
[31m-        req.db.collection('markets').find({"zip": parseFloat(zipcode)}).toArray(function(err, items) {[m
[32m+[m[32m        req.db.collection('markets').find({"zip": zipcode}).toArray(function(err, items) {[m
             if (err) {[m
                 console.log(err);[m
             } else {[m
[36m@@ -59,7 +60,7 @@[m [mapp.get('/markets/', function(req, res) {[m
     else if (loctype=="state") {[m
         var state = req.query.state;[m
         console.log("state: " + state);[m
[31m-        req.db.collection('markets').find({"State": state}).toArray(function(err, items) {[m
[32m+[m[32m        req.db.collection('markets').find({"state": state}).toArray(function(err, items) {[m
             if (err) {[m
                 console.log(err);[m
             } else {[m
[36m@@ -74,7 +75,7 @@[m [mapp.get('/markets/', function(req, res) {[m
         var city = req.query.city;[m
         console.log("state: " + state);[m
         console.log("city: " + city);[m
[31m-        req.db.collection('markets').find({"State": state,"city": city}).toArray(function(err, items) {[m
[32m+[m[32m        req.db.collection('markets').find({"state": state,"city": city}).toArray(function(err, items) {[m
             if (err) {[m
                 console.log(err);[m
             } else {[m
[36m@@ -83,19 +84,58 @@[m [mapp.get('/markets/', function(req, res) {[m
 [m
         });[m
     }[m
[31m-    else {[m
[31m-        console.log("Error - Unhandled loctype: " + loctype +". Valid loctypes are zip, state, or city");[m
[32m+[m[32m    //Expect URL to be: markets/?loc=proximity&lat=x.xx&lng=x.xx&dist=x[m
[32m+[m[32m    else if (loctype=="proximity") {[m
[32m+[m[41m        [m
[32m+[m[32m       var latitude = parseFloat(req.query.lat);[m
[32m+[m[32m        var longitude = parseFloat(req.query.lng);[m
[32m+[m[32m        var distance = parseInt(req.query.dist);[m
[32m+[m[32m        var searchCriteria = [{[m
[32m+[m[32m            $geoNear: {[m
[32m+[m[32m                near: [longitude, latitude],[m
[32m+[m[32m                distanceField: 'Distance',[m
[32m+[m[32m                maxDistance: ((distance / 1.25) / 3959),[m
[32m+[m[32m                spherical: true,[m
[32m+[m[32m                distanceMultiplier: (3959 * 1.25)[m
[32m+[m[32m            }[m
[32m+[m[32m        }];[m
[32m+[m
[32m+[m[32m        db.collection('markets').aggregate(searchCriteria, function(err, items) {[m
[32m+[m[32m            if (err) {[m
[32m+[m[32m                res.send(500, {[m
[32m+[m[32m                    'error': "Server Error - While trying to query db for proximity search." + err[m
[32m+[m[32m                });[m
[32m+[m[32m            } else {[m
[32m+[m[32m                res.json(items);[m
[32m+[m[32m            }[m
[32m+[m[32m        });[m
[32m+[m
[32m+[m
[32m+[m
[32m+[m
[32m+[m
[32m+[m[32m        /*req.db.collection('markets').find({"state": state}).toArray(function(err, items) {[m
[32m+[m[32m            if (err) {[m
[32m+[m[32m                console.log(err);[m
[32m+[m[32m            } else {[m
[32m+[m[32m                res.json(items);[m
[32m+[m[32m            }[m
[32m+[m[41m            [m
[32m+[m
[32m+[m[32m        });*/[m[41m [m
[32m+[m[32m    } else {[m
[32m+[m[32m        res.send("Error - Unhandled loctype: " + loctype +". Valid loctypes are zip, state, or city");[m
     }[m
 });[m
 [m
 app.get('/market/:id', function(req, res) {[m
[31m-    req.db.collection('markets').find({"_id": parseFloat(req.params.id)}).toArray(function(err, items) {[m
[32m+[m[32m    req.db.collection('markets').find({"_id": req.params.id}).toArray(function(err, items) {[m
         if (err) {[m
             console.log(err);[m
         } else {[m
             res.json(items);[m
         }[m
[31m-    });[m
[32m+[m[32m    })[m
 });[m
 [m
 app.get('/markets', function(req, res) {[m
