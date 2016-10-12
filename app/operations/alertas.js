var Alerta = require('../models/alerta');
var Accion = require('../operations/accion.js');
var Nodo = require('../operations/nodos.js');

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

    GetAlerta: function (mac, fichero, callback) {
        Alerta.find({
            mac: mac,
            fichero: fichero
        }, function (err, alerta) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, alerta);
        });
    },

    GetAllAlertas: function (callback) {
        Alerta.find({}, function (err, alertas) {
            if (err) {
                callback(err);
                return;
            }
            var listado = [];
            alertas.forEach(function (alerta) {
                listado.push(alerta);
            });
            callback(null, listado);
        })
    },

    RemoveAlerta: function (id, callback) {
        Alerta.remove({
            _id: id
        }, function (err) {
            if(err){
                callback(err);
                return;
            }
            callback(null);
        });
    },

    Check: function (mac, fichero, valor){
        self.GetAlerta(mac, fichero, function(err, alertas){
            if(err || !alertas){
                return;
            }
            Nodo.GetNodo(mac, function(err, nodo){
                if(err || !nodo){
                    return;
                }
                alertas.forEach(function(alerta){
                    var mensaje = "";
                    if (CheckCondition(valor, alerta.condicion, alerta.valor)){                    
                        if(CheckDate(alerta, nodo)){
                            mensaje = CreateMensaje(alerta, nodo, valor);
                            console.log("Debemos alertar");
                            console.log(alerta.usuarios);
                            Accion.SendTelegram(mensaje, alerta.usuarios);
                        }
                    }
                });
                console.log("Fin del bucle");
            });            
        });
    }

}

function CheckCondition(valor1, condicion, valor2){
    switch (condicion) {
        case ">":
            if( valor1 > valor2) {
                return true;
            }
            return false;            
    
        default:
            return false;
    }
}

function CheckDate(alerta){
    if(typeof alerta.last_event === 'undefined'){
        alerta.last_event = new Date();
        alerta.save();
        return true;
    }
    var now = new Date();
    var diffMs = (now - alerta.last_event); // milliseconds between now & last
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    if(diffMins >= alerta.frecuencia){
        alerta.last_event = now;
        alerta.save();
        return true;
    }
    return false;
}

function CreateMensaje(alerta, nodo, valor) {
    var msg = "\u{2757}"+alerta.mensaje.replace(":mac", nodo.mac);
    msg = msg.replace(":valor", valor);
    return msg;
}