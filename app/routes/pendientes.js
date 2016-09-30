var Pendientes = require('../../db_operations/pendientes.js');

module.exports = {

	//=== ADD NEW  ===
	pendienteAdd : function(req, res, next) {
		Pendientes.InsertPendiente(req.body.ip, function(err){
            if(err){res.send({ ok: "false", err: err});}
            res.send({ ok: "true"});
        });
	},

	//=== GET PENDIENTE BY IP ===
	pendiente : function(req, res, next) {
		Pendientes.GetPendiente(req.params.ip, function(err, pendiente){
            if (err) {res.send({ ok:"false"});}
            res.send({ ok:"true", data:pendiente});
        });
	},

    //=== GET ALL PENDIENTES BY IP ===
    pendientes : function(req, res, next) {
        Pendientes.GetPendientes(function(err, listapendientes){
            if (err) {
                listapendientes = [];
            }
            res.render('nodos-pendientes.ejs', {
                pendientes : listapendientes
            });
        });
    },

	//=== DELETE PENDIENTE BY IP===
	pendienteDelete : function(req, res, next) {
		Pendientes.DeletePendiente(req.body.ip, function(err){
            if (err) {res.send({ ok:"false"});}
            res.send({ ok:"true"});
        });
	}

};