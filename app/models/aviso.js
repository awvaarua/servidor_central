var mongoose = require('mongoose');

var avisoSchema = mongoose.Schema({

    fecha: Date,
    mensaje: String

});

module.exports = mongoose.model('Aviso', avisoSchema);