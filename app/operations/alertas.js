var Alerta = require('../models/alerta');
var Accion = require('../operations/accion.js');
var Nodo = require('../operations/nodos.js');

var self = module.exports = {

    AddAlerta: function (alerta, callback) {
        console.log(alerta);
        var alert = {
            mac: parseInt(alerta.mac),
            fichero: alerta.fichero,
            mensaje: alerta.mensaje,
            usuarios: alerta.usuarios,
            tipo: parseInt(alerta.tipo)
        };
        if (parseInt(alerta.tipo) == 1) {
            alert.condicion = alerta.condicion;
            alert.valor = parseInt(alerta.valor);
            alert.frecuencia = parseInt(alerta.frecuencia);
        }
        if(!alerta.usuarios){
            alert.usuarios = [];
        }
        Alerta.collection.insert(alert, function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
    },

    UpdateAlerta: function (alerta, cambios, callback) {
        alerta.mensaje = cambios.mensaje;
        if(!cambios.usuarios){
            alerta.usuarios = [];
        }else{
            alerta.usuarios = cambios.usuarios;
        }
        if (parseInt(alerta.tipo) == 1) {
            alerta.condicion = cambios.condicion;
            alerta.valor = parseInt(cambios.valor);
            alerta.frecuencia = parseInt(cambios.frecuencia);
        }
        alerta.save(function(err){
            if (err) {
                console.log(err);
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

    GetAlertaById: function (id, callback) {
        Alerta.findById(id, function (err, alerta) {
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
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
    },

    Check: function (mac, fichero, valor) {
        self.GetAlerta(mac, fichero, function (err, alertas) {
            if (err || !alertas) {
                return;
            }
            Nodo.GetNodo(mac, function (err, nodo) {
                if (err || !nodo) {
                    return;
                }
                alertas.forEach(function (alerta) {
                    Actuar(nodo, valor, alerta);
                });
            });
        });
    }
}

function Actuar(nodo, valor, alerta) {
    switch (alerta.tipo) {
        case 1:
            CheckAlerta(nodo, valor, alerta);
            break;
        case 2:
            Informar(alerta, nodo, valor)
            break;
        default:
            break;
    }
};

function CheckAlerta(nodo, valor, alerta) {
    if (CheckCondition(valor, alerta.condicion, alerta.valor)) {
        if (CheckDate(alerta)) {
            Informar(alerta, nodo, valor);
        }
    }
}

function Informar(alerta, nodo, valor) {
    mensaje = CreateMensaje(alerta, nodo, valor);
    Accion.SendTelegram(mensaje, alerta.usuarios);
}

function CheckCondition(valor1, condicion, valor2) {
    switch (condicion) {
        case ">":
            if (valor1 > valor2) {
                return true;
            }
            return false;
        case ">=":
            if (valor1 >= valor2) {
                return true;
            }
            return false;
        case "<":
            if (valor1 < valor2) {
                return true;
            }
            return false;
        case "<=":
            if (valor1 <= valor2) {
                return true;
            }
            return false;
        case "=":
            if (valor1 == valor2) {
                return true;
            }
            return false;
        default:
            return false;
    }
}

function CheckDate(alerta) {
    if (typeof alerta.last_event === 'undefined') {
        alerta.last_event = new Date();
        alerta.save();
        return true;
    }
    var now = new Date();
    var diffMs = (now - alerta.last_event); // milliseconds between now & last
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    if (diffMins >= alerta.frecuencia) {
        alerta.last_event = now;
        alerta.save();
        return true;
    }
    return false;
}

function CreateMensaje(alerta, nodo, valor) {
    var msg = "\u{2757}\u{2757}\u{2757}" + alerta.mensaje.replace(":nombre", nodo.nombre);
    msg = msg.replace(":valor", valor);
    return msg;
}