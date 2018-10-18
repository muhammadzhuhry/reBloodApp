'use strict';

const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectID; // convert string menjadi object id
const clientModel = require('../models/m_client.model');

var now = new Date();

const ClientController = {
    GetAllHandler : (req, res, next) => {
        global.dbo.collection('m_client').find({ status : false }).toArray((error, data) => {
            if(error){
                return next(new Error());
            }

            let modelCollection = data.map((entity) => {
                return new clientModel(entity);
            });

            Response.send(res, 200, modelCollection);
        });
    },
    GetDetailByIDHandler : (req, res, next) => {
        let id = req.params.id;
        global.dbo.collection('m_client').find({ status : false, '_id' : ObjectID(id) }).toArray((error, data) => {
            if(error){
                return next(new Error());
            }

            let model = data.map((entity) => {
                return new clientModel(entity);
            });

            Response.send(res, 200, model);
        });
    },
    CreateHandler : (req, res, next) => {
        let reqdata = req.body;
        var data = {};

        data.nama_client    = reqdata.nama_client;
        data.created_date   = now;
        data.created_by     = global.user.username;
        data.updated_date   = null;
        data.updated_by     = null;
        data.status         = false;

        var model = new clientModel(data);

        global.dbo.collection('m_client').insertOne(model, function(error, data){
            if(error){
                return next(new Error());
            }

            Response.send(res, 200, data);
        });
    },
    UpdateHandler : (req, res, next) => {
        let id = req.params.id;
        let reqdata = req.body;
        var oldmodel = {};
        var updatemodel = {};

        global.dbo.collection('m_client').find({ status : false, '_id' : ObjectID(id) }).toArray((error, data) => {
            if(error){
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new clientModel(entity);
            });

            updatemodel._id             = ObjectID(id);
            updatemodel.nama_client     = reqdata.nama_client;
            updatemodel.created_date    = oldmodel[0].created_date; // [0] karena dirubah dalam bentuk array, manggilnya secara array juga
            updatemodel.created_by      = oldmodel[0].created_by;
            updatemodel.updated_date    = now;
            updatemodel.updated_by      = global.user.username;
            updatemodel.status          = false;

            var model = new clientModel(updatemodel);

            global.dbo.collection('m_client').findOneAndUpdate
            (
                {'_id' : ObjectID(id)},
                {$set: model},
                function(err, data){
                    if(err)
                    {
                        return next(new Error());
                    }

                    Response.send(res, 200, data);
                }
            );

        });
    },
    DeleteHandler : (req, res, next) => {
        let id = req.params.id;
        var oldmodel = {};
        var deletemodel = {};

       global.dbo.collection('m_client').find({ status : false, '_id' : ObjectID(id) }).toArray((error, data) => {
           if(error){
               return next(new Error());
           }

           oldmodel = data.map((entity) => {
               return new clientModel(entity);
           });

            deletemodel._id             = ObjectID(id);
            deletemodel.nama_client     = oldmodel[0].nama_client;
            deletemodel.created_date    = oldmodel[0].created_date;
            deletemodel.created_by      = oldmodel[0].created_by;
            deletemodel.updated_date    = now;
            deletemodel.updated_by      = global.user.username;
            deletemodel.status          = true;

            var model = new clientModel(deletemodel);

            global.dbo.collection('m_client').findOneAndUpdate
            (
                {'_id' : ObjectID(id)},
                {$set: model},
                function(err, data){
                    if(err)
                    {
                        return next(new Error());
                    }

                    Response.send(res, 200, data);
                }
            );

       })
    }
};

module.exports = ClientController;