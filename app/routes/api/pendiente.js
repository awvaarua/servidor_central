var Pendientes = require('../../operations/pendientes.js');

module.exports = {

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

    pendienteGetAll: function(req, res, next) {
        Pendientes.GetPendientes(function(err, listapendientes) {
            if (err) {
                listapendientes = [];
            }
            res.send({
                ok: "true",
                pendientes: listapendientes
            });
        });
    },

    pendienteGet: function(req, res, next) {
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
    }
};