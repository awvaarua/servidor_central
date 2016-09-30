var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({

	ip: String,
	date: Date,
	val: Number
});

module.exports = mongoose.model('Temperatura', userSchema);