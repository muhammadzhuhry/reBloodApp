'use strict';

const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectId;
const roleModel = require('../models/m_role.model');

var now = new Date();

const RoleController = {
    GetAllHandler : (req, res, next) => {
        global.dbo.collection('m_role').find({ status : false }).toArray((error, data) => {
            if(error){
                return next(new Error());
            }

            let modelCollection = data.map((entity) => {
                return new roleModel(entity);
            });

            Response.send(res, 200, modelCollection);
        });
    },
    GetDetailByIDHandler : (req, res, next) => {
        let id = req.params.id;
        global.dbo.collection('m_role').find({ status : false, '_id' : ObjectID(id) }).toArray((error, data) => {
            if(error){
                return next(new Error());
            }

            let model = data.map((entity) => {
                return new roleModel(entity);
            });

            Response.send(res, 200, model);
        });
    },
    CreateHandler : (req, res, next) => {
        let reqdata = req.body;
        var data = {};

        data.role           = reqdata.role;
        data.created_date   = now;
        data.created_by     = global.user.username;
        data.updated_date   = null;
        data.updated_by     = null;
        data.status         = false;

        var model = new roleModel(data);

        global.dbo.collection('m_role').insertOne(model, function(error, data){
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

        global.dbo.collection('m_role').find({ status : false, '_id' : ObjectID(id) }).toArray((error, data) => {
            if(error){
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new roleModel(entity);
            });

            updatemodel._id             = ObjectID(id);
            updatemodel.role            = reqdata.role;
            updatemodel.created_date    = oldmodel[0].created_date;
            updatemodel.created_by      = oldmodel[0].created_by;
            updatemodel.updated_date    = now;
            updatemodel.updated_by      = global.user.username;
            updatemodel.status          = false;

            var model = new roleModel(updatemodel);

            global.dbo.collection('m_role').findOneAndUpdate
            (
                {'_id' : ObjectID(id)},
                {$set : model},
                function(error, data){
                    if(error){
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

        global.dbo.collection('m_role').find({ status : false, '_id' : ObjectID(id) }).toArray((error, data) => {
            if(error){
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new roleModel(entity);
            });

            deletemodel._id             = ObjectID(id);
            deletemodel.role            = oldmodel[0].role;
            deletemodel.created_date    = oldmodel[0].created_date;
            deletemodel.created_by      = oldmodel[0].created_by;
            deletemodel.updated_date    = now;
            deletemodel.updated_by      = global.user.username;
            deletemodel.status          = true;

            var model = new roleModel(deletemodel);

            global.dbo.collection('m_role').findOneAndUpdate
            (
                {'_id' : ObjectID(id)},
                {$set : model},
                function(error, data){
                    if(error){
                        return next(new Error());
                    }

                    Response.send(res, 200, data);
                }
            );

        })
    }
};

module.exports = RoleController;