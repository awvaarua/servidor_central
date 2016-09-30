var Nodos = require('../../db_operations/nodos.js');
var Pendientes = require('../../db_operations/pendientes.js');
var Ssh = require('../../ssh_operations/sshoperations.js');

module.exports = {

	//=== ADD NODE ===
	nodeAdd : function(req, res, next) {
		Nodos.AddNode(req.body.confirmacion.ip, function(err){
            if(err){res.send({ ok:"false", error:err});}
            Nodos.AddScripts(req.body.confirmacion.ip, req.body.confirmacion.scripts, 0, [], function(err, data){
                if(err){res.send({ ok:"false", error:err});}
                Pendientes.DeletePendiente(req.body.confirmacion.ip, function(err){
                    if(err){res.send({ ok:"false", error:err});}
                    res.send({ ok:"true", data:data});
                });
            });
        });
	},

	//=== GET NODE BY IP ===
	node : function(req, res, next) {
		Nodos.GetNodo(req.params.ip, function(err, nodo){
            if (err) {}
            res.render('nodo.ejs', {
                nodo : nodo
            });
        });
	},

    //=== GET ALL NODES BY IP ===
    nodes : function(req, res, next) {
        Nodos.GetAllNodes(function(nodos, err){
            if(err){}
            res.render('gestionnodos.ejs', {
                nodos : nodos
            });
        });
    },

	//=== CHECK NODE STATUS ===
	nodeStatus : function(req, res, next) {
		Ssh.CheckNodeStatus(req.params.ip, function(status){
            res.send({ status:status });
        });
	},

	//=== DELETE NODE BY IP ===
	nodeDelete : function(req, res, next) {
		Nodos.DeleteNodo(req.params.ip, function(err, data){
            if (err) {res.send({ ok:"false", error: err, data:data});}
            res.send({ ok:"true", data:data});
        });
	},

	//=== RESTART NODE BY IP ===
	nodeRestart : function(req, res, next) {
		Ssh.RestartNode(req.params.ip, function(err){
            if (err) {res.send({ ok:"false", error: err});}
            res.send({ ok:"true" });
        });
	},

	//=== GET SCRIPTS FROM NODE BY IP ===
	nodeScripts : function(req, res, next) {
		Nodos.GetNodo(req.params.ip, function(err, nodo){
            if (err) {res.send({ok:"false"});}
            res.send({ok:"true", data:nodo});
        });
	},

	//=== CHECK SCRIPT STATUS BY IP AND PID ===
	scriptStatus : function(req, res, next) {
		Ssh.CheckScriptStatus(req.params.ip, req.params.pid, function(err, status){            
            if(err){res.send({ status:"offline", error:error});}            
            res.send({ status : status });
        });
	},

	//=== SCRIPT DELETE BY IP AND PID ===
	scriptDelete : function(req, res, next) {
		Nodos.DeleteScript(req.params.ip, req.params.pid, function(err){
            if (err) {
                res.send({ ok:"false", message:err});
            }
            res.send({ ok:"true"});
        });
	}

};