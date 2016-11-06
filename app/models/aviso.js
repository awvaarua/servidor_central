var mongoose = require('mongoose');

var avisoSchema = mongoose.Schema({

    fecha: { type: Date, required: true },
    mensaje: { type: String, required: [true, 'Se requiere un mensaje'] },

});

module.exports = mongoose.model('Aviso', avisoSchema);