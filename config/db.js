'use strict';

// Load Mongo Driver
const MongoClient = require('mongodb').MongoClient;
var dbo = null;

const DBConnection = {
    connect : (conn) => {
        MongoClient.connect(global.config.dbconn, { useNewUrlParser : true }, (err, db) => {
            if(!err){
                dbo = db.db(global.config.dbname);
            }
            conn(err, db);
        });
    },
    getconnection : () => {
        return dbo;
    }
};

module.exports = DBConnection;