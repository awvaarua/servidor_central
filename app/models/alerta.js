var mongoose = require('mongoose');

var alertSchema = mongoose.Schema({

    nodo: {
        mac: Number,
        nombre: String
    },
    fichero: String,
    condicion: String,
    valor: Number,
    mensaje: String,
    last_event: Date,
    usuarios: [],
    frecuencia: Number,
    tipo: Number

});

module.exports = mongoose.model('Alerta', alertSchema);