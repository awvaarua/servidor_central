var mongoose = require('mongoose');

var alertSchema = mongoose.Schema({

    ip: String,
    tipo: Number,
    condicion: Number,
    valor: Number,
    mensaje: String,
    last_event: Date,
    usuarios: [],
    frecuencia: Number

});

/*alertSchema.prototype.actuar = function () {
    switch (this._tipo_accion) {
        case 1:
            break;
        case 2:
            break;
        default:
            break;
    }
};*/

module.exports = mongoose.model('Alerta', alertSchema);