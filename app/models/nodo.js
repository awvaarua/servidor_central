var mongoose = require('mongoose');

var nodoSchema = mongoose.Schema({

	ip: {type: String, required: [true, 'Se requiere la IP']},
	date: {type: Date, required: [true, 'Se requiere fecha']},
	mac: {type: Number, required: [true, 'Se requiere una MAC única']},
	nombre: {type: String, required: [true, 'Se requiere Nombre']},
	usuario: {type: String, required: [true, 'Se requiere un Usuario de acceso a SSH']},
	contrasenya: {type: String, required: [true, 'Se requiere una contraseña de acceso aSSH']},
	scripts: [{
		pid: {type: Number, required: [true, 'Se requiere un PID']},
		script_id: {type: String, required: [true, 'Se requiere un ID para el script']},
		nombre: {type: String, required: [true, 'Se requiere Nombre para el script']},
		comando: {type: String, required: [true, 'Se requiere un Comando para el Script']},
		fichero: {type: String, required: [true, 'Se requiere un Nombre de fichero']},
		argumentos: [{
			nombre: {type: String, required: false},
			valor: {type: String, required: false},
			orden: {type: Number, required: [true, 'Se requiere un Orden para el argumento']},
			tipo: {type: String, required: false,}
		}]
	}]

});

nodoSchema.methods.sort = function () {
	scripts.forEach(function(script) {
		script.argumentos.sort(function(a, b){return a.orden - b.orden})
	}, this);
}

module.exports = mongoose.model('Nodo', nodoSchema);