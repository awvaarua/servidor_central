var Data = require('../operations/data.js');
var Alerta = require('../operations/alertas.js');

module.exports = {

	//=== ADD DATA  ===
	dataAdd: function(req, res, next) {
		Data.Add(req.body.mac, req.body.fichero, req.body.valor);
		Alerta.Check(req.body.mac, req.body.fichero, req.body.valor);
		res.status(200).send('Ok');
	}

};