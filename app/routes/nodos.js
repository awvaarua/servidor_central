var Nodos = require('../operations/nodos.js');
var Pendientes = require('../operations/pendientes.js');
var Ssh = require('../ssh_operations/sshoperations.js');
var Constantes = require('../constantes/constantes.js');

module.exports = {

    //=== ADD NODE ===
    nodeAdd: function(req, res, next) {
        Nodos.AddNode(req.body.confirmacion, function(err) {
            if (err) {
                res.send({
                    ok: "false",
                    error: err
                });
                return;
            }
            Nodos.AddScripts(req.body.confirmacion.mac, req.body.confirmacion.ip, req.body.confirmacion.scripts, 0, [], function(err, data) {
                if (err) {
                    res.send({
                        ok: "false",
                        error: "Se ha añadido, pero en el inicio de los scripts se ha producido el siguiente error: "+err
                    });
                }
                Pendientes.DeletePendiente(req.body.confirmacion.mac, function(err) {
                    if (err) {
                        res.send({
                            ok: "false",
                            error: err
                        });
                    }
                    res.send({
                        ok: "true",
                        data: data
                    });
                });
            });
        });
    },

    //=== GET NODE BY MAC ===
    node: function(req, res, next) {
        Nodos.GetNodo(req.params.mac, function(err, nodo) {
            if (err) {}
            if (nodo == null) {
                res.render('nodo_notfound.ejs', {
                    nodo: nodo
                });
            }
            res.render('nodo.ejs', {
                nodo: nodo,
                tipos: Constantes.List()
            });
        });
    },

    //=== GET ALL NODES ===
    nodes: function(req, res, next) {
        Nodos.GetAllNodes(function(nodos, err) {
            if (err) {}
            res.render('gestionnodos.ejs', {
                nodos: nodos
            });
        });
    },

    //=== CHECK NODE STATUS ===
    nodeStatus: function(req, res, next) {
        Nodos.GetNodo(req.params.mac, function(err, nodo){
            if (err) {
                res.send({
                    ok: "false",
                    error: err
                });
                return;
            }
            Ssh.CheckNodeStatus(nodo.ip, function(status) {
                res.send({
                    status: status
                });
            });
        });  
    },

    //=== DELETE NODE BY IP ===
    nodeDelete: function(req, res, next) {
        Nodos.GetNodo(req.params.mac, function(err, nodo) {
            if (err) {
                    res.send({
                        status: "false",
                        error: error
                    });
                    return;
            }
            Nodos.DeleteNodo(nodo.ip, function(err, data) {
                if (err) {
                    res.send({
                        ok: "false",
                        error: err,
                        data: data
                    });
                    return;
                }
                res.send({
                    ok: "true",
                    data: data
                });
            });
        });
    },

    //=== RESTART NODE BY IP ===
    nodeRestart: function(req, res, next) {
        Nodos.GetNodo(req.params.mac, function(err, nodo) {
            if (err) {
                    res.send({
                        status: "false",
                        error: error
                    });
                    return;
            }
            Ssh.RestartNode(nodo.ip, function(err) {
                if (err) {
                    res.send({
                        ok: "false",
                        error: err
                    });
                    return;
                }
                res.send({
                    ok: "true"
                });
            });
        });
    },

    //=== GET SCRIPTS FROM NODE BY IP ===
    nodeScripts: function(req, res, next) {
        Nodos.GetNodo(req.params.mac, function(err, nodo) {
            if (err) {
                res.send({
                    ok: "false"
                });
                return;
            }
            res.send({
                ok: "true",
                data: nodo
            });
        });
    },

    //=== CHECK SCRIPT STATUS BY IP AND PID ===
    scriptStatus: function(req, res, next) {
        Nodos.GetNodo(req.params.mac, function(err, nodo) {
            if (err) {
                    res.send({
                        status: "offline",
                        error: error
                    });
                    return;
            }
            Ssh.CheckScriptStatus(nodo.ip, req.params.pid, function(err, status) {
                if (err) {
                    res.send({
                        status: "offline",
                        error: error
                    });
                    return;
                }
                res.send({
                    status: status
                });
            });
        });
    },

    //=== SCRIPT DELETE BY IP AND PID ===
    scriptDelete: function(req, res, next) {
        Nodos.GetNodo(req.params.mac, function(err, nodo) {
            if (err) {
                    res.send({
                        status: "offline",
                        error: error
                    });
                    return;
            }
            Nodos.DeleteNodo(nodo.ip, function(err, data) {
                if (err) {
                    res.send({
                        ok: "false",
                        error: err,
                        data: data
                    });
                    return;
                }
                res.send({
                    ok: "true",
                    data: data
                });
            });
        });
    },

    //=== ADD SCRIPTS TO EXISTENT NODE ===
    scriptsAdd: function(req, res, next) {
        Nodos.GetNodo(req.params.mac, function(err, nodo) {
            if (err) {
                res.send({
                    ok: "false",
                    message: err.message
                });
                return;
            }
            Nodos.AddScripts(nodo.ip, req.body.scripts, 0, [], function(err, data) {
                if (err) {
                    res.send({
                        ok: "false",
                        message: err.message
                    });
                    return;
                }
                res.send({
                    ok: "true",
                    data: data
                });
            });
        });
    },

    //=== SCRIPT UPDATE BY IP AND PID ===
    scriptUpdate: function(req, res, next) {
        Nodos.GetNodo(req.params.mac, function(err, nodo) {
            if (err) {
                res.send({
                    ok: "false",
                    message: err
                });
            }
            Ssh.StopScript(nodo.ip, req.params.pid, function(err) {
                if (err) {
                    res.send({
                        ok: "false",
                        message: err
                    });
                }
                Nodos.UpdateScript(nodo.ip, req.params.pid, req.body.cambio, function(err, script) {
                    if (err) {
                        res.send({
                            ok: "false",
                            message: err
                        });
                    }
                    Ssh.StartScript(nodo.ip, script, function(err, newscript) {
                        if (err) {
                            res.send({
                                ok: "false",
                                message: err
                            });
                        }
                        Nodos.UpdateScript(nodo.ip, req.params.pid, {
                            tipo: "pid",
                            valor: newscript.pid
                        }, function(err, script) {
                            if (err) {
                                res.send({
                                    ok: "false",
                                    message: err
                                });
                            }
                            res.send({
                                ok: "true",
                                data: newscript
                            });
                        });
                    });
                });
            });
        });
    }

};