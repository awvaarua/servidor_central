var Temperatura = require('../models/temperatura.js');
var Humedad = require('../models/humedad.js');
var Nodo = require('../models/nodo.js');
var self = module.exports = {

	Tipo: function(tpo) {
		switch (tpo) {
			case "0":
				return "Temperatura";
			case "1":
				return "Humedad";
			default:
				return "Temperatura";
		}
	},

	Collection: function(tpo) {
		switch (tpo) {
			case "Temperatura":
				return Temperatura;
			case "Humedad":
				return Humedad;
			default:
				return Temperatura;
		}
	},

	List: function() {
		return [{
			nombre: 'Temperatura',
			valor: '0'
		}, {
			nombre: 'Humedad',
			valor: '1'
		}];
	}
};