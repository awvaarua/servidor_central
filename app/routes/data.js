var Data = require('../operations/data.js');
var Alerta = require('../operations/alertas.js');

module.exports = {

	dataAdd: function (req, res, next) {
		console.log(req.body.valor);
		if (req.body.valor) {
			Data.Add(req.body.mac, req.body.fichero, req.body.valor);
			Alerta.Check(req.body.mac, req.body.fichero, req.body.valor);
		}else{
			Alerta.Check(req.body.mac, req.body.fichero);
		}		
		res.status(200).send('Ok');
	},

	dataGet: function (req, res, next) {
		Data.Get(req.params.mac, req.body.fichero, function (err, data) {
			res.send({
				datos: data
			});
		});
	}
};