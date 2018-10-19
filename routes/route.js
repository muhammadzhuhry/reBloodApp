'use strict';

// Import Logger Module
var winston = require('../config/winston');
var morgan = require('morgan');

// Import Client Module
var client = require('../controllers/m_client');
var user = require('../controllers/m_user');
var role = require('../controllers/m_role');
var pendonor = require('../controllers/t_pendonor');

var validate = require('../controllers/validate');
var menuakses = require('../controllers/m_menu_akses');

// Import Middleware
var middleware = require('../middleware/checktoken');

module.exports = exports = function(server){

    // CORS (Cross Origin Resource Sharing) ->  Setting agar bisa menambahkan header yang berisi auth untuk mengecek token
    var corsMiddleware = require('restify-cors-middleware');
    var cors = corsMiddleware({
        origins : ['*'],
        allowHeaders : ['authorization']
    });

    server.pre(cors.preflight);
    server.use(cors.actual);

    // Validate Route
    server.get('/api/validate/checkclient/:name', validate.clientCheckName);
    server.get('/api/validate/checkrole/:name', validate.roleCheckName);

    // Client Route
    server.get('/api/client/', middleware.checkToken, client.GetAllHandler);
    server.get('/api/client/:id', middleware.checkToken, client.GetDetailByIDHandler);
    server.post('/api/client/insert/', middleware.checkToken, client.CreateHandler); // method post karena mengirim data client yang mau diinsert
    server.put('/api/client/update/:id', middleware.checkToken, client.UpdateHandler);
    server.put('/api/client/delete/:id', middleware.checkToken, client.DeleteHandler);

    // User Route
    server.post('/api/user/login', user.Login); // method post karena mengirim username dan pass
    server.get('/api/user/logout', user.Logout);
    server.get('/api/user/', middleware.checkToken, user.GetAllHandler);
    server.get('/api/user/:id', middleware.checkToken, user.GetDetailByIDHandler);
    server.post('/api/user/insert/', middleware.checkTokenAndRoleAdmin, user.CreateHandler);
    server.put('/api/user/update/:id', middleware.checkTokenAndRoleAdmin, user.UpdateHandler);
    server.put('/api/user/delete/:id', middleware.checkTokenAndRoleAdmin, user.DeleteHandler);

    // Role Route
    server.get('/api/role/', middleware.checkToken, role.GetAllHandler);
    server.get('/api/role/:id', middleware.checkToken, role.GetDetailByIDHandler);
    server.post('/api/role/insert/', middleware.checkToken, role.CreateHandler);
    server.put('/api/role/update/:id', middleware.checkToken, role.UpdateHandler);
    server.put('/api/role/delete/:id', middleware.checkToken, role.DeleteHandler);
    
    // Pendonor Route
    server.get('/api/pendonor/', middleware.checkToken, pendonor.GetAllHandler);
    server.get('/api/pendonor/:id', middleware.checkToken, pendonor.GetDetailByIDHandler);
    server.post('/api/pendonor/insert/', middleware.checkToken, pendonor.CreateHandler);
    server.put('/api/pendonor/update/:id', middleware.checkToken, pendonor.UpdateHandler);
    server.put('/api/pendonor/delete/:id', middleware.checkToken, pendonor.DeleteHandler);

    // Menu Akses Route
    server.get('/api/menuakses/', middleware.checkToken, menuakses.checkMenuAkses);

    // error handler
    server.use(function(err, req, res, next) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        if (err.name === 'UnauthorizedError') {
            res.status(401).json({ status: 0, code: 401, type: "unauthorised", message: err.name + ": " + err.message });
        } else {
            res.status(404).json({ status: 0, code: 404, type: "ENOENT", message: "file not found" });
        }

        res.status(err.status || 500);
        res.render('error');
    });

    server.use(morgan('combined', { stream: winston.stream }));
}