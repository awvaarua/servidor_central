var Alertas = require('../../operations/alertas.js');

module.exports = {

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