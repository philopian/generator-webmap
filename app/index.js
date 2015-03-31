'use strict';
var util    = require('util');
var path    = require('path');
var yeoman  = require('yeoman-generator');
var chalk   = require('chalk');


var MYGenerator = yeoman.generators.Base.extend({

    // prompt messages in terminal
    promptUser: function() {
        var done = this.async();

        // have Yeoman greet the user
        console.log(this.yeoman);

        var prompts = [
            {
                name: 'appName',
                message: 'What is your app\'s name ?',
                write: "your app name: " + this.appName
            }
        ];

        this.prompt(prompts, function (props) {
            this.appName              = props.appName;
            done();
        }.bind(this));
    },


    // show the results that the user has chosen
    showResults: function(){
        var context = {
            app_name: this.appName
        };
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
        var placeholderValues = {
            YOUR_APP_NAME_HERE : this.appName
        }

        //--copy files directory-----
        this.copy(
            "baseApp/app/_styles.css",  
            "app/styles.css"
        );

        //--copy files containing placeholder values------
        this.template(
            "baseApp/_index.html",                
            "index.html", 
            placeholderValues
        );

        // ... WHATEVER OTHER TEMPLATES/FILES YOU WANT TO COPY OVER
    },




});

module.exports = MYGenerator;