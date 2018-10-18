'use strict';

module.exports = {
    send :  (res, statuscode, message) => {
        let resp = {};
        resp.statuscode = statuscode;
        resp.message = message;
        res.send(statuscode, resp);
    }
};