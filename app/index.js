'use strict';
var util    = require('util');
var path    = require('path');
var yeoman  = require('yeoman-generator');
var chalk   = require('chalk');


// globals
var dependsCompleted = {bower:false,npm:false};
function checkDependCompletion(){
    if ((dependsCompleted.bower == true) && (dependsCompleted.npm == true) ) {
        console.log(chalk.green("\nYour app is all wired up, enjoy!\n"))
    }
}

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
        this.copy("_.bowerrc",".bowerrc");
        this.copy("_.gitignore",".gitignore");
        this.copy("_bower.json","bower.json");
        this.copy("_gulpfile.js","gulpfile.js");
        this.copy("_package.json","package.json");
        this.copy("www/assets/images/_pin_blue.png","www/assets/images/pin_blue.png");
        this.copy("www/assets/images/_pin_green.png","www/assets/images/pin_green.png");
        this.copy("www/css/_styles.css","www/css/styles.css");
        this.copy("www/js/_scripts.js","www/js/scripts.js");

        //--copy template files-----
        this.template("www/_index.html","www/index.html",placeholderValues);
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