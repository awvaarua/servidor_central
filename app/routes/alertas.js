var Alertas = require('../operations/alertas.js');

module.exports = {

	//=== GET ALL ALERTS  ===
	alertsGet: function (req, res, next) {
		res.render('alertas.ejs');
	},

	alertAdd: function (req, res, next) {
		console.log(req.body);
		res.render('addalerta.ejs', {
            message: req.flash('signupMessage'),
            messageOk: "Alerta añadida correctamente"
        });
	},

	alertaAddView: function (req, res, next) {
		res.render('addalerta.ejs', {
            message: req.flash('signupMessage'),
            messageOk: req.flash('signupMessageOk')
        });
	}

};