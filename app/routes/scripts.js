var Scripts = require('../operations/scripts.js');

module.exports = {

	scriptsGet: function (req, res, next) {
		Scripts.GetAllScripts(function (err, scripts) {
			if (err) { }
			res.render('scripts.ejs', {
				scripts: scripts
			});
		});
	},

    scriptRender: function (req, res, next) {
		Scripts.GetScript(req.params.id, function (err, script) {
			if (err) { }
			res.render('script.ejs', {
				script: script,
				posicion: req.params.posicion
			});
		});
	}

};