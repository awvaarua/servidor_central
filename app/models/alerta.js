var mongoose = require('mongoose');

var alertSchema = mongoose.Schema({

    nodo: {
        mac: {type: Number, required: [true, 'Se requiere la MAC']},
        nombre: {type: String, required: [true, 'Se requiere el Nombre del nodo']}
    },
    fichero: {type: String, required: [true, 'Se requiere el fichero del script al que hace referencia']},
    condicion: {type: String, required: false, enum: ['>', '>=','<','<=','=']},
    valor: {type: Number, required: false},
    mensaje: {type: String, required: [true, 'Se requiere un mensaje']},
    last_event: {type: Date, required: false},
    usuarios: [],
    frecuencia: {type: Number, required: false},
    tipo: {type: Number, required: false, enum: [1, 2]}

});

module.exports = mongoose.model('Alerta', alertSchema);