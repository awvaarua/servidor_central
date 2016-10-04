var mongoose = require('mongoose');

var alertSchema = mongoose.Schema({

    ip: String,
    tipo_sensor: Number,
    descripcion: String,
    tipo_accion: Number,
    mensaje: String,
    last_event: Date

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