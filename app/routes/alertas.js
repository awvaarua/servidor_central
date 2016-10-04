var Alertas = require('../operations/alertas.js');

module.exports = {

	//=== GET ALL ALERTS  ===
	alertsGet: function (req, res, next) {
		res.render('alertas.ejs');
	},

	alertAdd: function (req, res, next) {
		Alertas.AddAlerta(req.body.alerta, function (err, data) {

		});
	},

	alertaAddView: function (req, res, next) {
		res.render('addalerta.ejs', {
            message: req.flash('signupMessage'),
            messageOk: req.flash('signupMessageOk')
        });
	}

};