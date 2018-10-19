'use strict';

const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectID;
const menuaksesModel = require('../models/m_menu_akses.model');

const MenuAkses = {
    checkMenuAkses : (req, res, next) => {
        var idrole = global.user.id_role;

        global.dbo.collection('m_role').aggregate([
            {
                $lookup : 
                {
                    from : "m_menu_access",
                    localField : "_id",
                    foreignField : "id_role",
                    as : "show_menu_access"
                }
            },
            {
                $unwind : "$show_menu_access"
            },
            {
                $lookup : {
                    from : "m_menu",
                    localField : "show_menu_access.id_menu",
                    foreignField : "_id",
                    as : "show_menu"
                }
            },
            {
                $unwind : "$show_menu"
            },
            {
                $match : { _id : ObjectID(idrole) }
            },
            {
                $project : 
                {
                    'menu' : '$show_menu.menu_name',
                    'role' : '$role'
                }
            }
        ]).toArray((error, data) => {
            if(data){
                // let result = {
                //     content : {
                //         "Menu" : Menu,
                //         "Role" : data.role
                //     }
                // };
                let result = data;
                Response.send(res, 200, result);
                next();
            } else {
                Response.send(res, 200, "role not exist");
            }                        
        });
    }
};

module.exports = MenuAkses;