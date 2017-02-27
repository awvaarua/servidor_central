var Data = require('../../operations/data.js');
var Alerta = require('../../operations/alertas.js');

module.exports = {

	dataAdd: function (req, res, next) {
		if (req.body.valor) {
			Data.Add(req.body.mac, req.body.fichero, req.body.valor);
			Alerta.Check(req.body.mac, req.body.fichero, req.body.valor);
		}else{
			Alerta.Check(req.body.mac, req.body.fichero);
		}		
		res.status(200).send('Ok');
	},

	dataAddVideo: function (req, res, next) {
		res.status(200).send('Ok');
		Alerta.CheckVideo(req.body.mac, req.body.fichero, req.file.filename);
	},

	dataGet: function (req, res, next) {
		Data.Get(req.params.mac, req.body.fichero, function (err, data) {
			res.send({
				datos: data
			});
		});
	}
};