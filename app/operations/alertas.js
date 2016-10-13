var Alerta = require('../models/alerta');
var Accion = require('../operations/accion.js');
var Nodo = require('../operations/nodos.js');

var self = module.exports = {

    AddAlerta: function (alerta, callback) {
        Alerta.collection.insert({
            mac: parseInt(alerta.mac),
            condicion: alerta.condicion,
            fichero: alerta.fichero,
            valor: parseInt(alerta.valor),
            mensaje: alerta.mensaje,
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
            mac: parseInt(mac),
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
                    Actuar(nodo, valor, alerta);
                });
            });            
        });
    }
}

function Actuar (nodo, valor, alerta) {
    switch (alerta.tipo) {
        case 1:
            CheckAlerta(nodo, valor);
            break;
        case 2:
            Informar()
            break;
        default:
            break;
    }
};

function CheckAlerta(nodo, valor, alerta) {                
    if (CheckCondition(valor, alerta.condicion, alerta.valor)) {
        if (CheckDate()) {
            Informar(alerta, nodo, valor);
        }
    }
}

function Informar(nodo, valor) {
    mensaje = CreateMensaje(nodo, valor);
    Accion.SendTelegram(mensaje, this.usuarios);
}

function CheckCondition(valor1, condicion, valor2){    
    switch (condicion) {
        case ">":
            if( valor1 > valor2) {
                return true;
            }
            return false;
        case ">=":
            if( valor1 >= valor2) {
                return true;
            }
            return false; 
        case "<":
            if( valor1 < valor2) {
                return true;
            }
            return false; 
        case "<=":
            if( valor1 <= valor2) {
                return true;
            }
            return false;
        case "=":
            if( valor1 == valor2) {
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

function CreateMensaje(nodo, valor, alerta) {
    var msg = "\u{2757}\u{2757}\u{2757}"+alerta.mensaje.replace(":nombre", nodo.nombre);
    msg = msg.replace(":valor", valor);
    return msg;
}