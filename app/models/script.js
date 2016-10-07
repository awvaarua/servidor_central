var mongoose = require('mongoose');

var scriptSchema = mongoose.Schema({

    nombre: String,
    fichero: String,
    argumentos: [{
        nombre: String,
        tipo: String,
        orden: Number,
        descripcion: String
    }]

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

module.exports = mongoose.model('Script', scriptSchema);