var Scripts = require('../operations/scripts.js');
var Nodos = require('../operations/nodos.js');

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

	scriptRenderAction: function (req, res, next) {
		Scripts.GetScript(req.params.id, function (err, script) {
			if (err || !script) {				
				return res.send({
					ok: "false",
					mensaje: (err) ? err.message : "No se ha encontrado el script"
				});
			}
			Nodos.GetNodo(req.params.mac, function(err, nodo){
				if(err || !nodo){
					return res.send({
						ok: "false",
						mensaje: (err) ? err : "No se ha encontrado el nodo"
					});
				}
				res.render('scriptalerta.ejs', {
					script: script,
					nodo: nodo,
					posicion: req.params.posicion,
					tipo: req.params.tipo
				});
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
				req.body.err = JSON.stringify(err.errors);
				next();
				return;			
			}
			return res.send({
				ok: "true",
			});
		});
	},

	scriptRemove: function (req, res, next) {
		Scripts.GetScript(req.params.id, function(err, script){
			if(err || !script){
				return res.render('response.ejs', {
					ok: 'false',
					titulo: 'No se ha podido eliminar el script',
					descripcion: (err) ? err : "No se ha encontrado el script"
				});
			}
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
				req.body.fichero = script.fichero;
				next();
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