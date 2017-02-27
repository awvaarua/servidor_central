var Nodos = require('../../operations/nodos.js');
var Scripts = require('../../operations/scripts.js');

module.exports = {
    
    nodeRender: function (req, res, next) {
        Nodos.GetNodo(req.params.mac, function (err, nodo) {
            if (err || !nodo) {
                return res.send({
                    ok: "false",
                    error: (err) ? err : "Nodo no encontrado"
                });
            }
            Scripts.GetAllScripts(function (err, scripts) {
                if (err) {
                    scripts = [];
                }
                res.render('nodo.ejs', {
                    nodo: nodo,
                    listado_scripts: scripts
                });
            });
        });
    },

    nodeGet: function (req, res, next) {
        Nodos.GetNodo(req.params.mac, function (err, nodo) {
            if (err || !nodo) {
                return res.send({
                    ok: "false",
                    error: (err) ? err : "Nodo no encontrado"
                });
            }
            Scripts.GetAllScripts(function (err, scripts) {
                if (err) {
                    return res.send({
                        ok: "false",
                        error: err
                    });
                }
                res.render('nodo.ejs', {
                    nodo: nodo,
                    listado_scripts: scripts
                });
            });
        });
    },

    nodesRender: function (req, res, next) {
        Nodos.GetAllNodes(function (err, nodos) {
            if (err) {
                nodos = [];
            }
            res.render('gestionnodos.ejs', {
                nodos: nodos
            });
        });
    }
};