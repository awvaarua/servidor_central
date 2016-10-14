var mongoose = require('mongoose');

var scriptSchema = mongoose.Schema({

    nombre: {type: String, required: [true, 'Se requiere un nombre para identificar el script']},
    fichero: {type: String, required: [true, 'Se requiere esècificar un fichero']},
    argumentos: [{
        nombre: {type: String, required: [true, 'Se requiere un nombre para identificar el argumento']},
        tipo: {type: String, required: [true, 'Se requiere un tipo'], enum: ['number', 'text']},
        orden: {type: Number, required: [true, 'Se requiere especificar un orden']},
    }]

});

module.exports = mongoose.model('Script', scriptSchema);