'use strict';

const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectID;

const ValidateController = {
    clientCheckName : (req, res, next) => {
        let nama = req.params.name;
        global.dbo.collection('m_client').findOne({status : false, nama_client : nama}, (err, data) => {
            if(data)
            {
                let result = {
                    message : "existing",
                    content : {
                        "_id" : ObjectID(data._id),
                        "nama" : data.nama_client
                    }
                };

                Response.send(res, 200, result);
            }
            else
            {
                Response.send(res, 200, "not exist");
            }
        });
    },
    roleCheckName : (req, res, next) => {
        let name = req.params.name;
        global.dbo.collection('m_role').findOne({status : false, role : name}, (err, data) => {
            if(data)
            {
                let result = {
                    message : "existing",
                    content : {
                        "_id" : ObjectID(data._id),
                        "role" : data.role
                    }
                };

                Response.send(res, 200, result);
            }
            else
            {
                Response.send(res, 200, "not exist");
            }
        });
    }
};

module.exports = ValidateController;