'use strict';

module.exports = {
    port : process.env.PORT || 8000,
    //db on mlab
    dbconn : process.env.PORT ? "mongodb://batch173:qwaszx0202@ds133533.mlab.com:33533/db_donordarah" : "mongodb://localhost:27017/db_donordarah",
    dbname : "db_donordarah"
};