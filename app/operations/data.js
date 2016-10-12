var Data = require('../models/data.js');

var self = module.exports = {

	Add: function(mac, fichero, valor) {
		Data.collection.insert({
			mac: mac,
			date: new Date(),
			valor: valor,
			fichero: fichero
		}, {}, function(err) {});
	}

};