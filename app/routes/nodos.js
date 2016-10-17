var Nodos = require('../operations/nodos.js');
var Pendientes = require('../operations/pendientes.js');
var Ssh = require('../ssh_operations/sshoperations.js');
var Scripts = require('../operations/scripts.js');

module.exports = {
    //=== ADD NODE ===
    nodeAdd: function(req, res, next) {
        Nodos.AddNode(req.body.confirmacion, function(err) {
            if (err) {
                return res.send({
                    ok: "false",
                    error: "Error al insertar el nodo en la base de datos: "+err
                });
            }
            Pendientes.DeletePendiente(req.body.confirmacion.mac, function(err) {
                if (err) {
                    res.send({
                        ok: "false",
                        error: "El nodo se ha creado correctamente, pero no se ha podido eliminar de pendientes: " + err
                    });
                    return;
                }
                res.send({
                    ok: "true"
                });
            });
        });
    },

    //=== GET NODE BY MAC ===
    node: function(req, res, next) {
        Nodos.GetNodo(req.params.mac, function(err, nodo) {
            if (err) {}
            if (nodo == null) {
                return res.send({
                        ok: "false"
                    });
            }
            Scripts.GetAllScripts(function(err, scripts){
                if(err){
                    
                }
                res.render('nodo.ejs', {
                    nodo: nodo,
                    listado_scripts: scripts
                });
            });
        });
    },

    //=== GET ALL NODES ===
    nodesRender: function(req, res, next) {
        Nodos.GetAllNodes(function(nodos, err) {
            if (err) {}
            res.render('gestionnodos.ejs', {
                nodos: nodos
            });
        });
    },

    nodes: function(req, res, next) {
        Nodos.GetAllNodes(function(nodos, err) {
            if (err) {}
            res.send({
                nodos: nodos
            });
        });
    },

    //=== CHECK NODE STATUS ===
    nodeStatus: function(req, res, next) {
        Nodos.GetNodo(req.params.mac, function(err, nodo){
            if (err || !nodo) {
                return res.send({
                    ok: "false",
                    error: "Error al recuperar el nodo de la BBDD: "+err
                });
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
        Nodos.DeleteNodo(req.params.mac, function(err, data) {
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
    },

    //=== RESTART NODE BY IP ===
    nodeRestart: function(req, res, next) {
        Nodos.GetNodo(req.params.mac, function(err, nodo) {
            if (err) {
                    return res.send({
                        status: "false",
                        error: error
                    });
            }
            Ssh.RestartNode(nodo.ip, function(err) {
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

    nodePendiente: function(req, res, next) {
        Nodos.GetNodo(req.params.mac, function(err, nodo) {
            if (err) {
                    return res.send({
                        status: "false",
                        error: error
                    });
            }
            Nodos.DeleteNodo(req.params.mac, function(){
                if (err) {
                    return res.send({
                        status: "false",
                        error: error
                    });
                }
                Ssh.RestartNode(nodo.ip, function(err) {
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

    scriptStart: function(req, res, next) {
        Nodos.GetNodo(req.params.mac, function(err, nodo) {
            if (err || !nodo) {
                    res.send({
                        ok:"false",
                        error: error
                    });
                    return;
            }
            nodo.scripts.forEach(function(script, i){
                if(script.pid == parseInt(req.params.pid)){
                    Ssh.StartScript(nodo.ip, script, function(err, pid){
                        if(err || !pid){
                            res.send({
                                ok:"false",
                                error: error
                            });
                            return;
                        }
                        nodo.scripts[i].pid = parseInt(pid);
                        nodo.save();
                         res.send({
                            ok:"true"
                        });
                        return;
                    });
                }
            });
        });
    },

    //=== SCRIPT DELETE BY IP AND PID ===
    scriptDelete: function(req, res, next) {
        Nodos.GetNodo(req.params.mac, function(err, nodo) {
            if (err) {
                    res.send({
                        status: "offline",
                        error: err
                    });
                    return;
            }
            Nodos.DeleteScript(req.params.mac, nodo.ip, req.params.pid, function(err, data) {
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
    scriptAdd: function(req, res, next) {
        Nodos.GetNodo(req.params.mac, function(err, nodo) {
            if (err) {
                return res.send({
                    ok: "false",
                    message: "Error al recuperar el nodo: "+err.message
                });
            }
            Nodos.AddScript(nodo, req.body.script, function(err) {
                if (err) {
                    return res.send({
                        ok: "false",
                        message: "Error al añadir el script: "+err.message
                    });
                }
                res.send({
                    ok: "true"
                });
            });
        });
    },

    //=== SCRIPT UPDATE BY IP AND PID ===
    scriptUpdate: function(req, res, next) {
        Nodos.GetNodo(req.params.mac, function(err, nodo) {
            if (err) {
                return res.send({
                    ok: "false",
                    message: err
                });
            }
            Ssh.StopScript(nodo.ip, req.params.pid, function(err) {
                if (err) {
                    return res.send({
                        ok: "false",
                        message: err
                    });                    
                }
                Nodos.UpdateScript(req.params.mac, req.params.pid, req.body.cambio, function(err, script) {
                    if (err) {
                        return res.send({
                            ok: "false",
                            message: err
                        });                        
                    }
                    Ssh.StartScript(nodo.ip, script, function(err, newpid) {
                        if (err) {
                            return res.send({
                                ok: "false",
                                message: err
                            });                            
                        }
                        Nodos.UpdateScript(req.params.mac, req.params.pid, {
                            tipo: "pid",
                            valor: newpid
                        }, function(err, scriptfinal) {
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