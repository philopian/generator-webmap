'use strict';
var util    = require('util');
var path    = require('path');
var yeoman  = require('yeoman-generator');
var chalk   = require('chalk');
var async   = require('async');
var request = require('request');

// globals
var MAP_CENTER;
var dependsCompleted = {bower:false,npm:false};
function checkDependCompletion(){
    if ((dependsCompleted.bower == true) && (dependsCompleted.npm == true) ) {
        console.log(chalk.green("\nYour app is all wired up, enjoy!\n"))
    }
}
function createGoogleGeocodingUrl(cityname){
    var googlegeocodingapibase = ["http://maps.googleapis.com/maps/api/geocode/json?address="];
    googlegeocodingapibase.push(cityname)
    googlegeocodingapibase.push("&sensor=false")
    return googlegeocodingapibase.join("");
}
function geocode(url){
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body)
            if (data.status == "OK"){
                var formatedAddress = data.results[0].formatted_address;
                var coords = data.results[0].geometry.location
                var mapCenterCoord = [coords.lat, coords.lng];
                return mapCenterCoord;
            }
        }
    });
}




var MYGenerator = yeoman.generators.Base.extend({

    // prompt messages in terminal
    promptUser: function() {
        var done = this.async();

        // have Yeoman greet the user
        // console.log(this.yeoman);

        var prompts = [
            {
                name: 'appName',
                message: 'What is your app\'s name ?',
                write: "your app name: " + this.appName
            },{
                name: 'mapCenter',
                message: 'Where do you want to center the map?',
                write: "Will try to center map on: " + this.mapCenter
            },{
                name: 'appBasemap',
                type: 'list',
                message: 'Select your basemap?',
                choices: ["streets", "satellite", "topo", "grey"]
            }
        ];

        this.prompt(prompts, function (props) {
            this.appName    = props.appName;
            this.mapCenter = props.mapCenter;
            this.appBasemap = props.appBasemap;

            done();
        }.bind(this));
    },


    // show the results that the user has chosen
    showResults: function(){
        var complete = this.async();

        var context = {
            app_name: this.appName
        };

        // geocode
        var url
        if(this.mapCenter == "") {
            url = createGoogleGeocodingUrl("Portland, OR")
        } else {
            url = createGoogleGeocodingUrl(this.mapCenter)
        }
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body)
                if (data.status == "OK"){
                    var formatedAddress = data.results[0].formatted_address;
                    var coords = data.results[0].geometry.location
                    var mapCenterCoord = [coords.lat, coords.lng];

                    MAP_CENTER = mapCenterCoord; 
                    complete();
                }
            }
        });
    },// showResults


    // create the folders for your app
    scaffoldFolders: function(){
        this.mkdir("www");
        this.mkdir("www/js");
        this.mkdir("www/css");
        this.mkdir("www/assets/images");
    },

    // copy all the template files
    copyMainFiles: function(){

        //--copy files directory-----
        this.copy("_.bowerrc",".bowerrc");
        this.copy("_.gitignore",".gitignore");
        this.copy("_bower.json","bower.json");
        this.copy("_gulpfile.js","gulpfile.js");
        this.copy("_package.json","package.json");
        this.copy("www/assets/images/_pin_blue.png","www/assets/images/pin_blue.png");
        this.copy("www/assets/images/_pin_green.png","www/assets/images/pin_green.png");
        this.copy("www/css/_styles.css","www/css/styles.css");

        //--copy template files-----
        var basemapOptions = {
            streets: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
            satellite: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            topo: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
            grey: "https://{s}.tiles.mapbox.com/v3/examples.map-20v6611k/{z}/{x}/{y}.png"
        }
        var placeholderValues = {
            YOUR_APP_NAME_HERE: this.appName,
            YOUR_BASEMAP: basemapOptions[this.appBasemap],
            MAP_CENTER: MAP_CENTER
        }
        this.template("www/_index.html","www/index.html",placeholderValues);
        this.template("www/js/_scripts.js","www/js/scripts.js",placeholderValues);
    },


    installDepends: function(){
        // install bower components
        this.bowerInstall("", function(){
            dependsCompleted.bower = true;
            checkDependCompletion();
        });

        // install npm components
        this.npmInstall("", function(){
            dependsCompleted.npm = true;
            checkDependCompletion();
        });
    }

});

module.exports = MYGenerator;