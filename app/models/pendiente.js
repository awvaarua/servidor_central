var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({

	ip: String,
	date: Date

});

// create the model for users
module.exports = mongoose.model('Pendiente', userSchema);