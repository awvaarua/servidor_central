var Alerta = require('../models/alerta');

var self = module.exports = {

    AddAlerta: function (alerta, callback) {
        Alerta.collection.insert({
            ip: alerta.ip,
            tipo: parseInt(alerta.tipo),
            condicion: parseInt(alerta.condicion),
            valor: parseInt(alerta.valor),
            mensaje: alerta.mensaje,
            last_event: new Date(),
            usuarios: alerta.usuarios,
            frecuencia: parseInt(alerta.frecuencia)
        }, function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
    },

    GetAllAlertas: function(callback){
        Alerta.find({}, function(err, alertas){
            if (err) {
                callback(err);
                return;
            }
            var listado = [];
            alertas.forEach(function (alerta) {
                listado.push(alerta);
            });
            callback(null,listado);
        })
    }

}