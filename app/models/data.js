var mongoose = require('mongoose');

// define the schema for our user model
var dataSchema = mongoose.Schema({

	mac: Number,	
	fichero: String,
	valores: [{
		valor: String,
		date: Date
	}]
	
});

module.exports = mongoose.model('Data', dataSchema);