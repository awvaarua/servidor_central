var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({

	ip: String,
	date: Date,
	mac: Number,
	nombre: String,
	descripcion: String,
	scripts: [{
		pid: Number,
		nombre: String,
		fichero: String,
		argumentos: [{
			nombre: String,
			valor: String,
			orden: Number
		}]
	}]

});

// create the model for users
module.exports = mongoose.model('Nodo', userSchema);