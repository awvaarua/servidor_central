var Pendientes = require('../../operations/pendientes.js');
var Scripts = require('../../operations/scripts.js');

module.exports = {
    
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

    pendientesRender: function(req, res, next) {
        Pendientes.GetPendientes(function(err, listapendientes) {
            if (err) {
                listapendientes = [];
            }
            res.render('lista-pendientes.ejs', {
                pendientes: listapendientes
            });
        });
    }

};