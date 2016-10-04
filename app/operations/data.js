var Constantes = require('../constantes/constantes.js');

var self = module.exports = {

	Add: function(object) {
		var type = Constantes.Collection(object.tipo);
		type.collection.insert({
			ip: object.datos.ip,
			date: new Date(),
			val: parseInt(object.datos.val)
		}, {}, function(err) {});
	}

};