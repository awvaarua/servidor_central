var mongoose = require('mongoose');

var pendienteSchema = mongoose.Schema({

	ip: String,
	mac: Number,
	date: Date

});

module.exports = mongoose.model('Pendiente', pendienteSchema);