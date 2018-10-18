'use strict';

// Import Package Restify
const restify = require("restify");

// Import Package Moment
var moment = require('moment');
var time = moment().format("DD/MM/YYYY hh:mm:ss a");

// Import Logger Module
var winston = require('./config/winston');

const DB = require('./config/db');

// Global Configuration
global.config = require('./config/app');

DB.connect((err, db) => {
    if(err != null){
        console.log(err);
        winston.error(err);
        process.exit();
    } else {
        // Create Server with Restify
        const server = restify.createServer(
            {
                name : "Bloody API",
                version : "1.0.0"
            }
        );

        console.log('[DATABASE] connected');
        winston.info('[DATABASE]' + config.dbconn + ' connected ');

        global.dbo = DB.getconnection();

        // Body Parser to parse form body with http method POST
        server.use(restify.plugins.bodyParser());

        require('./routes/route')(server);

        // Default Route
        server.get('/', restify.plugins.serveStatic(
            {
                directory : __dirname, // using to get this current directory
                default : "/index.html"
            }
        ));

        server.listen(config.port, function(){
            console.log("%s listen at %s on %s", server.name, server.url, time);
            winston.info(server.name + " listen at " +  server.url + " on " + time);
        });
    }
});