var mongoose = require('mongoose');

// define the schema for our user model
var dataSchema = mongoose.Schema({

	mac: Number,
	date: Date,
	valor: String,
	fichero: String
});

module.exports = mongoose.model('Data', dataSchema);