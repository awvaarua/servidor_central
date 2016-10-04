var Alerta = require('../models/alerta');

var self = module.exports = {

    AddAlerta: function (alerta) {
        Nodo.collection.insert({
            ip: alerta.ip,
            tipo_sensor: parseInt(alerta.tipo_sensor),
            descripcion: alerta.descripcion,
            tipo_accion: parseInt(alerta.tipo_accion),
            mensaje: alerta.mensaje,
            last_event: new Date()

        }, function (err) {
            if (err) {
                callback(err);
            }
            callback(null);
        });
    }

}