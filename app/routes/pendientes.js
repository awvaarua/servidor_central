var Pendientes = require('../operations/pendientes.js');
var Scripts = require('../operations/scripts.js');

module.exports = {

    //=== ADD NEW  ===
    pendienteAdd: function(req, res, next) {
        Pendientes.InsertPendiente(req.params.ip, req.params.mac, function(err) {
            if (err) {
                return res.send({
                    ok: "false",
                    err: err
                });
            }
            res.send({
                ok: "true"
            });
        });
    },

    //=== GET PENDIENTE BY MAC ===
    pendiente: function(req, res, next) {
        Pendientes.GetPendiente(req.params.mac, function(err, pendiente) {
            if(err){
                return res.send({
                    ok: "false",
                    err: err,
                });
            }
            res.send({
                ok: "ok",
                pendiente: pendiente
            });          
        });
    },

    //=== GET PENDIENTE BY MAC ===
    pendienteRender: function(req, res, next) {
        Pendientes.GetPendiente(req.params.mac, function(err, pendiente) {
            Scripts.GetAllScripts(function(err, scripts){
                if(err){
                    scripts = [];
                }
                res.render('pendiente.ejs', {
                    pendiente: pendiente,
                    scripts: scripts,
                });
            });            
        });
    },

    //=== GET ALL PENDIENTES BY IP ===
    pendientes: function(req, res, next) {
        Pendientes.GetPendientes(function(err, listapendientes) {
            if (err) {
                listapendientes = [];
            }
            res.render('lista-pendientes.ejs', {
                pendientes: listapendientes
            });
        });
    },

    pendientesCount: function(req, res, next) {
        Pendientes.GetPendientes(function(err, listapendientes) {
            if (err) {
                listapendientes = [];
            }
            res.send({
                count: listapendientes.length
            });
        });
    },

    //=== DELETE PENDIENTE BY IP===
    pendienteDelete: function(req, res, next) {
        Pendientes.DeletePendiente(req.params.mac, function(err) {
            if (err) {
                res.send({
                    ok: "false"
                });
            }
            res.send({
                ok: "true"
            });
        });
    }

};