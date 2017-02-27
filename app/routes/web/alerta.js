var Alertas = require('../../operations/alertas.js');
var Nodos = require('../../operations/nodos.js');
var Scripts = require('../../operations/scripts.js');

module.exports = {

	alertsGet: function (req, res, next) {
		Alertas.GetAllAlertas(function (err, alertas) {
			if (err) { }
			Nodos.GetAllNodes(function(err, nodos){
				if (err || !nodos) {
					nodos = [];
				}
				Scripts.GetAllScripts(function(err, scripts){
					if(err || !scripts){
						scripts = [];
					}
					res.render('alertas.ejs', {
						alertas: alertas,
						nodos: nodos,
						scripts : scripts
					});
				});
			});
		});
	},

	alertAdd: function (req, res, next) {
		Nodos.GetNodo(req.body.mac, function(err, nodo){
			if (err || !nodo) {
				return res.status(200).render('response.ejs', {
					ok: 'false',
					titulo: 'Alerta no creada',
					descripcion: (err) ? err : "Nodo no encontrado",
					responseok: 'false'
				});
			}
			req.body.nombre = nodo.nombre;
			Scripts.GetScriptByFile(req.body.fichero, function(err, script){
				if (err || !script) {
					return res.status(200).render('response.ejs', {
						ok: 'false',
						titulo: 'Alerta no creada',
						descripcion: (err) ? err : "Script no encontrado",
						responseok: 'false'
					});
				}
				Alertas.AddAlerta(req.body, function (err) {
					if (err) {
						return res.status(200).render('response.ejs', {
							ok: 'false',
							titulo: 'Alerta no creada',
							descripcion: err
						});
					}
					res.status(201).render('response.ejs', {
						ok: 'true',
						titulo: 'Alerta creada correctamente',
						descripcion: ""
					});
				});
			});
		});
	},

	alertaAddView: function (req, res, next) {
		Nodos.GetAllNodes(function(err, nodos){
			if(err){
				nodos = [];
			}
			Scripts.GetAllScripts(function(err1, scripts){
				if(err1){
					scripts = [];
				}
				res.render('addalerta.ejs', {
					nodos: nodos,
					scripts: scripts
				});
			});
		});
	},

	alertUpdate: function (req, res, next) {
		Alertas.GetAlertaById(req.params.id, function (err, alerta) {			
			if(err || !alerta){
				return res.send({
                    ok: "false",
                    error: err
                });
			}
			Alertas.UpdateAlerta(alerta, req.body, function (err) {
				if(err){
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

	alertRemove: function (req, res, next) {
		Alertas.RemoveAlerta(req.params.id, function (err) {
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
	}

};