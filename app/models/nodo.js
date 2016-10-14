var mongoose = require('mongoose');

var nodoSchema = mongoose.Schema({

	ip: {type: String, required: [true, 'Se requiere la IP']},
	date: {type: Date, required: [true, 'Se requiere fecha']},
	mac: {type: Number, required: [true, 'Se requiere una MAC única']},
	nombre: {type: String, required: [true, 'Se requiere Nombre']},
	descripcion: {type: String, required: [true, 'Se requiere una Descripcion']},
	scripts: [{
		pid: {type: Number, required: [true, 'Se requiere un PID']},
		nombre: {type: String, required: [true, 'Se requiere Nombre para el script']},
		fichero: {type: String, required: [true, 'Se requiere un Nombre de fichero']},
		argumentos: [{
			nombre: {type: String, required: [true, 'Se requiere Nombre para el argumnto']},
			valor: {type: String, required: [true, 'Se requiere un Valor para el argumento']},
			orden: {type: Number, required: [true, 'Se requiere un Orden']},
		}]
	}]

});

nodoSchema.methods.sort = function () {
	scripts.forEach(function(script) {
		script.argumentos.sort(function(a, b){return a.orden - b.orden})
	}, this);
}

module.exports = mongoose.model('Nodo', nodoSchema);