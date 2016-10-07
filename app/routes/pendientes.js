var Pendientes = require('../operations/pendientes.js');
var Scripts = require('../operations/scripts.js');
var Constantes = require('../constantes/constantes.js');

module.exports = {

    //=== ADD NEW  ===
    pendienteAdd: function(req, res, next) {
        Pendientes.InsertPendiente(req.params.ip, req.params.mac, function(err) {
            if (err) {
                res.send({
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
            Scripts.GetAllScripts(function(err, scripts){
                if(err){
                    scripts = [];
                }
                res.render('pendiente.ejs', {
                    pendiente: pendiente,
                    scripts: scripts,
                    tipos: Constantes.List()
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
                pendientes: listapendientes,
                tipos: Constantes.List()
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