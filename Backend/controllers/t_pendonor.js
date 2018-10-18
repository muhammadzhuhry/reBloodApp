'use strict';

const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectId;
const pendonorModel = require('../models/t_pendonor.model');

var now = new Date();

const PendonorController = {
    GetAllHandler : (req, res, next) => {
        global.dbo.collection('t_pendonor').find({ status : false }).toArray((error, data) => {
            if(error){
                return next(new Error());
            }

            let modelCollection = data.map((entity) => {
                return new pendonorModel(entity);
            });

            Response.send(res, 200, modelCollection);
        });
    },
    GetDetailByIDHandler : (req, res, next) => {
        let id = req.params.id;
        global.dbo.collection('t_pendonor').find({ status : false, '_id' : ObjectID(id) }).toArray((error, data) => {
            if(error){
                return next(new Error());
            }

            let model = data.map((entity) => {
                return new pendonorModel(entity);
            });

            Response.send(res, 200, model);
        });
    },
    CreateHandler : (req, res, next) => {
        let reqdata = req.body;
        var data = {};

        data.nama_lengkap   = reqdata.nama_lengkap;
        data.alamat         = reqdata.alamat;
        data.jenis_kelamin  = reqdata.jenis_kelamin;
        data.status_donor   = reqdata.status_donor
        data.created_date   = now;
        data.created_by     = global.user.username;
        data.updated_date   = null;
        data.updated_by     = null;
        data.status         = false;
        data.no_ktp         = reqdata.no_ktp;
        data.tanggal_lahir  = new Date(reqdata.tanggal_lahir);
        data.no_telp        = reqdata.no_telp;
        data.tanggal_donor  = now;
        data.id_goldarah    = ObjectID(reqdata.id_goldarah);

        var model = new pendonorModel(data);

        global.dbo.collection('t_pendonor').insertOne(model, function(error, data){
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

        global.dbo.collection('t_pendonor').find({ status : false, '_id' : ObjectID(id) }).toArray((error, data) => {
            if(error){
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new pendonorModel(entity);
            });

            // Insert Data
            updatemodel._id = ObjectID(id);

            if(reqdata.nama_lengkap == null || reqdata.nama_lengkap == undefined || reqdata.nama_lengkap == ""){
                updatemodel.nama_lengkap = oldmodel[0].nama_lengkap;
            } else {
                updatemodel.nama_lengkap = reqdata.nama_lengkap;
            }

            if(reqdata.alamat == null || reqdata.alamat == undefined || reqdata.alamat == ""){
                updatemodel.alamat = oldmodel[0].alamat;
            } else {
                updatemodel.alamat = reqdata.alamat;
            }

            if(reqdata.jenis_kelamin == null || reqdata.jenis_kelamin == undefined || reqdata.jenis_kelamin == ""){
                updatemodel.jenis_kelamin = oldmodel[0].jenis_kelamin;
            } else {
                updatemodel.jenis_kelamin = reqdata.jenis_kelamin;
            }

            if(reqdata.status_donor == null || reqdata.status_donor == undefined || reqdata.status_donor == ""){
                updatemodel.status_donor = oldmodel[0].status_donor;
            } else {
                updatemodel.status_donor = reqdata.status_donor;
            }

            if(reqdata.no_ktp == null || reqdata.no_ktp == undefined || reqdata.no_ktp == ""){
                updatemodel.no_ktp = oldmodel[0].no_ktp;
            } else {
                updatemodel.no_ktp = reqdata.no_ktp;
            }

            if(reqdata.tanggal_lahir == null || reqdata.tanggal_lahir == undefined || reqdata.tanggal_lahir == ""){
                updatemodel.tanggal_lahir = oldmodel[0].tanggal_lahir;
            } else {
                updatemodel.tanggal_lahir = new Date(reqdata.tanggal_lahir);
            }

            if(reqdata.no_telp == null || reqdata.no_telp == undefined || reqdata.no_telp == ""){
                updatemodel.no_telp = oldmodel[0].no_telp;
            } else {
                updatemodel.no_telp = reqdata.no_telp;
            }

            if(reqdata.tanggal_donor == null || reqdata.tanggal_donor == undefined || reqdata.tanggal_donor == ""){
                updatemodel.tanggal_donor = oldmodel[0].tanggal_donor;
            } else {
                updatemodel.tanggal_donor = new Date(reqdata.tanggal_donor);
            }

            if(reqdata.id_goldarah == null || reqdata.id_goldarah == undefined || reqdata.id_goldarah == ""){
                updatemodel.id_goldarah = ObjectID(oldmodel[0].id_goldarah);
            } else {
                updatemodel.id_goldarah = ObjectID(reqdata.id_goldarah);
            }

            updatemodel.created_date = oldmodel[0].created_date;
            updatemodel.created_by = oldmodel[0].created_date;
            updatemodel.updated_date = now;
            updatemodel.updated_by = global.user.username;
            updatemodel.status = false;

            var model = new pendonorModel(updatemodel);

            global.dbo.collection('t_pendonor').findOneAndUpdate
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

        global.dbo.collection('t_pendonor').find({ status : false, '_id' : ObjectID(id) }).toArray((error, data) => {
            if(error){
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new pendonorModel(entity);
            });

            deletemodel._id            = ObjectID(id);
            deletemodel.nama_lengkap   = oldmodel[0].nama_lengkap;
            deletemodel.alamat         = oldmodel[0].alamat;
            deletemodel.jenis_kelamin  = oldmodel[0].jenis_kelamin;
            deletemodel.status_donor   = oldmodel[0].status_donor
            deletemodel.created_date   = oldmodel[0].created_date;
            deletemodel.created_by     = oldmodel[0].created_by;
            deletemodel.updated_date   = now;
            deletemodel.updated_by     = global.user.username;
            deletemodel.status         = true;
            deletemodel.no_ktp         = oldmodel[0].no_ktp;
            deletemodel.tanggal_lahir  = oldmodel[0].tanggal_lahir;
            deletemodel.no_telp        = oldmodel[0].no_telp;
            deletemodel.tanggal_donor  = oldmodel[0].tanggal_donor;
            deletemodel.id_goldarah    = ObjectID(oldmodel[0].id_goldarah);
        
            var model = new pendonorModel(deletemodel);

            global.dbo.collection('t_pendonor').findOneAndUpdate
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
    }
};

module.exports = PendonorController;