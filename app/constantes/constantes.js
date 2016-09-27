var Temperatura = require('../models/temperatura.js');
var Humedad 	= require('../models/humedad.js');
var Nodo = require('../models/nodo.js');
var self = module.exports = {
	
	Tipo: function(tpo) {
	    switch(tpo) {
	      case "0":
	          return "temperatura";
	      case "1":
	          return "humedad";
	      default:
	          return "temperatura";
	    }
	},

	Collection: function(tpo) {
	    switch(tpo) {
	      case "Temperatura":
	          	return Temperatura;
	      case "Humedad":
	          return Humedad;
	      default:
	          return "temperatura";
	    }
	}
};