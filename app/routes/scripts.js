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
			if (err) {
				return res.render('response.ejs', {
					ok: 'false',
					titulo: 'No se ha podido eliminar el script',
					descripcion: ""
				});	
			}
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

	scriptRemove: function (req, res, next) {
		Scripts.RemoveScript(req.params.id, function(err){
			if(err){
				return res.render('response.ejs', {
					ok: 'false',
					titulo: 'No se ha podido eliminar el script',
					descripcion: ""
				});	
			}
			res.render('response.ejs', {
				ok: 'true',
				titulo: 'Script eliminado correctamente',
				descripcion: ""
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