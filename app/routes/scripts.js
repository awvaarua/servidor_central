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

	scriptGet: function (req, res, next) {
		Scripts.GetScript(req.params.id, function (err, script) {
			if (err) { }
			console.log(script);
			res.render('scriptadmin.ejs', {
				script: script
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
	},

	scriptsAddView: function (req, res, next) {
		res.render('addscript.ejs', {
			messageOk: "",
		});
	},

	scriptAdd: function (req, res, next) {
		Scripts.AddScript(req.body, function(err){
			if(err){
				res.send({
					ok: "false",
					error: err
				});	
			}
			res.send({
				ok: "true",
			});
		});
	},

	fileUpload: function (req, res, next) {
		res.send({
			ok: "true",
			filename: req.file.filename
		});
	}

};