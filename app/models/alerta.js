var mongoose = require('mongoose');

var alertSchema = mongoose.Schema({

    nodo: {
        mac: { type: Number, required: [true, 'Se requiere la MAC'] },
        nombre: { type: String, required: [true, 'Se requiere el Nombre del nodo'] }
    },
    fichero: { type: String, required: [true, 'Se requiere el fichero del script al que hace referencia'] },
    condicion: { type: String, required: false, enum: ['>', '>=', '<', '<=', '=', 'entre', 'fuera'] },
    valorone: { type: Number, required: false },
    valortwo: { type: Number, required: false },
    mensaje: { type: String, required: [true, 'Se requiere un mensaje'] },
    last_event: { type: Date, required: false },
    usuarios: [],
    frecuencia: { type: Number, required: false },
    tipo: { type: Number, required: false, enum: [1, 2] },
    acciones: [{
        mac: { type: Number, required: [true, 'Cada acción debe hacer referencia a un nodo'] },
        nombre_nodo:{type: String, required: [true, 'Una acción debe tener un nombre de nodo']},
        script: {
            script_id:{type: String, required: [true, 'Un script debe tener un id']},            
            fichero: {type: String, required: [true, 'Un script debe tener un fichero']},
            comando: {type: String, required: [true, 'Un script debe tener un comando']},
            nombre: {type: String, required: [true, 'Un script debe tener un nombre']},
            argumentos: [{
                nombre: {type: String, required: [true, 'Un argumento debe tener un nombre']},
                valor: {type: String, required: [true, 'Un argumento debe tener un valor']},
                orden: {type: Number, required: [true, 'Un argumento debe tener un orden']},
                tipo: {type: String, required: [true, 'Se requiere un tipo'], enum: ['number', 'text']},
            }]
        },
    }]

});

module.exports = mongoose.model('Alerta', alertSchema);