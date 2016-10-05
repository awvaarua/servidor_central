var Alertas = require('../operations/alertas.js');

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

	alertaAddView: function (req, res, next) {
		res.render('addalerta.ejs', {
            message: req.flash('signupMessage'),
            messageOk: req.flash('signupMessageOk')
        });
	}

};