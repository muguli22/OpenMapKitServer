'use strict';

var test = require('tape');
var request = require('supertest');
var app = require('../../index');
var getDeployments = require('../../api/deployments/controllers/deployments');

getDeployments._setParentDirectory(__dirname + '/../fixtures');

test('/omk/deployments endpoint exists and returns correct response content', function (t) {
    request(app)
        .get('/omk/deployments')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {

            var response = res.body;

            t.equal(response instanceof Array, true, "Response is an Array.");
            t.equal(response.length, 1, "Response array has length 1.");

            response.forEach(function(deployment){

                ["name", "files", "url", "listingUrl", "manifest"].forEach(function(property){
                    t.equal(deployment.hasOwnProperty(property), true, 'Has "' + property + '" property.');
                });

                t.equal(deployment.files.hasOwnProperty("osm"), true, 'Has "files.osm" property.');
                t.equal(deployment.files.hasOwnProperty("mbtiles"), true, 'Has "files.mbtiles" property.');

                t.equal(deployment.files.osm instanceof Array, true, 'Has "files.osm" is an Array.');
                t.equal(deployment.files.mbtiles instanceof Array, true, 'Has "files.mbtiles" is an Array.');

                deployment.files.osm.forEach(function(file){
                    ["name", "url", "size", "lastModified"].forEach(function(property){
                        t.equal(file.hasOwnProperty(property), true, 'files.osm item has "' + property + '" property.');
                    });
                });

                deployment.files.mbtiles.forEach(function(file){
                    ["name", "url", "size", "lastModified"].forEach(function(property){
                        t.equal(file.hasOwnProperty(property), true, 'files.mbtiles item has "' + property + '" property.');
                    });
                });
            });
            //console.log(res.body);
            t.end();
        });
});

test('/omk/deployments/:deployment endpoint exists and returns correct response content', function (t) {

    request(app)
        .get('/omk/deployments/Arcade%20Creek')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {

            var response = res.body;

            t.equal(typeof response === "object", true, "Response is an Object.");

            ["name", "files", "url", "listingUrl", "manifest"].forEach(function(property){
                t.equal(response.hasOwnProperty(property), true, 'Has "' + property + '" property.');
            });

            t.equal(response.files.hasOwnProperty("osm"), true, 'Has "files.osm" property.');
            t.equal(response.files.hasOwnProperty("mbtiles"), true, 'Has "files.mbtiles" property.');

            t.equal(response.files.osm instanceof Array, true, 'Has "files.osm" is an Array.');
            t.equal(response.files.mbtiles instanceof Array, true, 'Has "files.mbtiles" is an Array.');

            response.files.osm.forEach(function(file){
                ["name", "url", "size", "lastModified"].forEach(function(property){
                    t.equal(file.hasOwnProperty(property), true, 'files.osm item has "' + property + '" property.');
                });
            });

            response.files.mbtiles.forEach(function(file){
                ["name", "url", "size", "lastModified"].forEach(function(property){
                    t.equal(file.hasOwnProperty(property), true, 'files.mbtiles item has "' + property + '" property.');
                });
            });

            t.end();
        });
});
