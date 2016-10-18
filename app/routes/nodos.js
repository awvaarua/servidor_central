var Nodos = require('../operations/nodos.js');
var Pendientes = require('../operations/pendientes.js');
var Ssh = require('../ssh_operations/sshoperations.js');
var Scripts = require('../operations/scripts.js');

module.exports = {

    //Añadir nodo a la base de datos i eliminarlo de pendientes
    nodeAdd: function (req, res, next) {
        Nodos.AddNode(req.body.confirmacion, function (err) {
            if (err) {
                return res.send({
                    ok: "false",
                    error: "Error al insertar el nodo en la base de datos: " + err
                });
            }
            Pendientes.DeletePendiente(req.body.confirmacion.mac, function (err) {
                if (err) {
                    return res.send({
                        ok: "false",
                        error: "El nodo se ha creado correctamente, pero no se ha podido eliminar de pendientes: " + err
                    });
                }
                res.send({
                    ok: "true"
                });
            });
        });
    },

    //Devuelve una vista renderizada del nodo
    node: function (req, res, next) {
        Nodos.GetNodo(req.params.mac, function (err, nodo) {
            if (err || !nodo) {
                return res.send({
                    ok: "false",
                    error: (err) ? err : "Nodo no encontrado"
                });
            }
            Scripts.GetAllScripts(function (err, scripts) {
                if (err || !scripts) {
                    return res.send({
                        ok: "false",
                        error: (err) ? err : "Scripts no encontrados"
                    });
                }
                res.render('nodo.ejs', {
                    nodo: nodo,
                    listado_scripts: scripts
                });
            });
        });
    },

    //Devuelve una vista renderizada con todos los nodos
    nodesRender: function (req, res, next) {
        Nodos.GetAllNodes(function (err, nodos) {
            if (err) {
                return res.send({
                    ok: "false",
                    error: (err) ? err : "Nodos no encontrados no encontrados"
                });
            }
            res.render('gestionnodos.ejs', {
                nodos: nodos
            });
        });
    },

    //Devuelve un objeto con todos los nodos
    nodes: function (req, res, next) {
        Nodos.GetAllNodes(function (err, nodos) {
            if (err) {
                return res.send({
                    ok: "false",
                    error: (err) ? err : "Nodos no encontrados no encontrados"
                });
            }
            res.send({
                nodos: nodos
            });
        });
    },

    nodeStatus: function (req, res, next) {
        Nodos.GetNodo(req.params.mac, function (err, nodo) {
            if (err || !nodo) {
                return res.send({
                    ok: "false",
                    error: "Error al recuperar el nodo de la BBDD: " + err
                });
            }
            Ssh.CheckNodeStatus(nodo.ip, function (status) {
                res.send({
                    status: status
                });
            });
        });
    },

    nodeDelete: function (req, res, next) {
        Nodos.DeleteNodo(req.params.mac, function (err, data) {
            if (err) {
                return res.send({
                    ok: "false",
                    error: err,
                    data: data
                });
            }
            res.send({
                ok: "true",
                data: data
            });
        });
    },

    nodeRestart: function (req, res, next) {
        Nodos.GetNodo(req.params.mac, function (err, nodo) {
            if (err) {
                return res.send({
                    status: "false",
                    error: error
                });
            }
            Ssh.RestartNode(nodo.ip, function (err) {
                if (err) {
                    return res.send({
                        ok: "false",
                        error: err
                    });
                }
                res.send({
                    ok: "true"
                });
            });
        });
    },

    nodePendiente: function (req, res, next) {
        Nodos.GetNodo(req.params.mac, function (err, nodo) {
            if (err) {
                return res.send({
                    status: "false",
                    error: error
                });
            }
            Nodos.DeleteNodo(req.params.mac, function () {
                if (err) {
                    return res.send({
                        status: "false",
                        error: error
                    });
                }
                Ssh.RestartNode(nodo.ip, function (err) {
                    if (err) {
                        return res.send({
                            ok: "false",
                            error: err
                        });
                    }
                    res.send({
                        ok: "true"
                    });
                });
            });
        });
    },

    nodeScripts: function (req, res, next) {
        Nodos.GetNodo(req.params.mac, function (err, nodo) {
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

    scriptStatus: function (req, res, next) {
        Nodos.GetNodo(req.params.mac, function (err, nodo) {
            if (err) {
                return res.send({
                    status: "offline",
                    error: error
                });
            }
            Ssh.CheckScriptStatus(nodo.ip, req.params.pid, function (err, status) {
                if (err) {
                    return res.send({
                        status: "offline",
                        error: error
                    });
                }
                res.send({
                    status: status
                });
            });
        });
    },

    scriptStart: function (req, res, next) {
        Nodos.GetNodo(req.params.mac, function (err, nodo) {
            if (err || !nodo) {
                return res.send({
                    ok: "false",
                    error: error
                });
            }
            nodo.scripts.forEach(function (script, i) {
                if (script.pid == parseInt(req.params.pid)) {
                    Ssh.StartScript(nodo.ip, script, function (err, pid) {
                        if (err || !pid) {
                            return res.send({
                                ok: "false",
                                error: error
                            });
                        }
                        nodo.scripts[i].pid = parseInt(pid); nodo.save();
                        return res.send({
                            ok: "true"
                        });
                    });
                }
            });
        });
    },

    scriptDelete: function (req, res, next) {
        Nodos.GetNodo(req.params.mac, function (err, nodo) {
            if (err) {
                return res.send({
                    status: "offline",
                    error: err
                });
            }
            Nodos.DeleteScript(req.params.mac, nodo.ip, req.params.pid, function (err, data) {
                if (err) {
                    return res.send({
                        ok: "false",
                        error: err,
                        data: data
                    });
                }
                res.send({
                    ok: "true",
                    data: data
                });
            });
        });
    },

    scriptAdd: function (req, res, next) {
        Nodos.GetNodo(req.params.mac, function (err, nodo) {
            if (err) {
                return res.send({
                    ok: "false",
                    message: "Error al recuperar el nodo: " + err.message
                });
            }
            Nodos.AddScript(nodo, req.body.script, function (err) {
                if (err) {
                    return res.send({
                        ok: "false",
                        message: "Error al añadir el script: " + err.message
                    });
                }
                res.send({
                    ok: "true"
                });
            });
        });
    },

    scriptUpdate: function (req, res, next) {
        Nodos.GetNodo(req.params.mac, function (err, nodo) {
            if (err) {
                return res.send({
                    ok: "false",
                    message: err
                });
            }
            Ssh.StopScript(nodo.ip, req.params.pid, function (err) {
                if (err) {
                    return res.send({
                        ok: "false",
                        message: err
                    });
                }
                Nodos.UpdateScript(req.params.mac, req.params.pid, req.body.cambio, function (err, script) {
                    if (err) {
                        return res.send({
                            ok: "false",
                            message: err
                        });
                    }
                    Ssh.StartScript(nodo.ip, script, function (err, newpid) {
                        if (err) {
                            return res.send({
                                ok: "false",
                                message: err
                            });
                        }
                        Nodos.UpdateScript(req.params.mac, req.params.pid, {
                            tipo: "pid",
                            valor: newpid
                        }, function (err, scriptfinal) {
                            if (err) {
                                return res.send({
                                    ok: "false",
                                    message: err
                                });
                            }
                            res.send({
                                ok: "true",
                                data: scriptfinal
                            });
                        });
                    });
                });
            });
        });
    }
};