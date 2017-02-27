var mongoose = require('mongoose');

var pendienteSchema = mongoose.Schema({

	ip: {type: String, required: [true, 'Se una dirección IP']},
	mac: {type: Number, required: [true, 'Se requiere una MAC única']},
	date: {type: Date, required: [true, 'Se requiere una fecha']},

});

module.exports = mongoose.model('Pendiente', pendienteSchema);