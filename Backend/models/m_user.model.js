'use strict';

function model (entity){
    this._id            = entity._id;
    this.nama_lengkap    = entity.nama_lengkap;
    this.email   = entity.email;
    this.username   = entity.username;
    this.password     = entity.password;
    this.id_role   = entity.id_role;
    this.updated_by     = entity.updated_by;
    this.created_date   = entity.created_date;
    this.created_by     = entity.created_by;
    this.updated_date   = entity.updated_date;
    this.updated_by     = entity.updated_by;
    this.status         = entity.status;
}

model.prototype.getData = function() {
    return {
        _id : this._id,
        nama_lengkap : this.nama_lengkap,
        email : this.email,
        username : this.username,
        password : this.password,
        id_role : this.id_role,
        created_date : this.created_date,
        created_by : this.created_by,
        updated_date : this.updated_date,
        updated_by : this.updated_by,
        status : this.status
    };
};

module.exports = model;