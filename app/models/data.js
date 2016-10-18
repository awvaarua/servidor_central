var mongoose = require('mongoose');

var dataSchema = mongoose.Schema({

	mac: Number,	
	fichero: String,
	valores: [{
		valor: String,
		date: Date
	}]
	
});

module.exports = mongoose.model('Data', dataSchema);