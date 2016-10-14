var Alertas = require('../operations/alertas.js');
var Nodos = require('../operations/nodos.js');
var Scripts = require('../operations/scripts.js');

module.exports = {

	//=== GET ALL ALERTS  ===
	alertsGet: function (req, res, next) {
		Alertas.GetAllAlertas(function (err, alertas) {
			if (err) { }
			res.render('alertas.ejs', {
				alertas: alertas
			});
		});
	},

	alertAdd: function (req, res, next) {
		Alertas.AddAlerta(req.body, function (err) {
			if (err) {
				res.render('addalerta.ejs', {
					message: "No se ha podido añadir la alerta: " + err,
					messageOk: req.flash('signupMessage')
				});
			}
			res.render('addalerta.ejs', {
				message: req.flash('signupMessage'),
				messageOk: "Alerta añadida correctamente"
			});
		});
	},

	alertUpdate: function (req, res, next) {
		Alertas.GetAlertaById(req.params.id, function (err, alerta) {
			if(err || !alerta){
				res.send({
                    ok: "false",
                    error: err
                });
				return;
			}
			Alertas.UpdateAlerta(alerta, req.body, function (err) {
				res.send({
					ok: "true"
				});	
			});
		});
	},

	alertaAddView: function (req, res, next) {
		Nodos.GetAllNodes(function(nodos){
			Scripts.GetAllScripts(function(err, scripts){
				console.log(nodos);
				res.render('addalerta.ejs', {
					nodos: nodos,
					scripts: scripts,
					message: req.flash('signupMessage'),
					messageOk: req.flash('signupMessageOk')
				});
			});
		});
	},

	alertRemove: function (req, res, next) {
		Alertas.RemoveAlerta(req.params.id, function (err) {
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
	}

};