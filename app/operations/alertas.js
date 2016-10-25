var Alerta = require('../models/alerta');
var Aviso = require('../operations/aviso');
var Accion = require('../operations/accion.js');
var Nodo = require('../operations/nodos.js');

var self = module.exports = {

    AddAlerta: function (alerta, callback) {
        var alert = new Alerta({
            nodo: {
                mac: parseInt(alerta.mac),
                nombre: alerta.nombre
            },
            fichero: alerta.fichero,
            mensaje: alerta.mensaje,
            usuarios: alerta.usuarios,
            tipo: parseInt(alerta.tipo)
        });
        if (parseInt(alerta.tipo) == 1) {
            alert.condicion = alerta.condicion;
            (parseFloat(alerta.valorone)) ? alert.valorone =  parseFloat(alerta.valorone) : "Nodo no encontrado"
            if(!isNaN(parseFloat(alerta.valorone))){
                alert.valorone =  parseFloat(alerta.valorone);
            }
            if(!isNaN(parseFloat(alerta.valortwo))){
                alert.valortwo =  parseFloat(alerta.valortwo);
            }
            //alert.valorone =  parseFloat(alerta.valorone) || 0;
            //alert.valortwo =  parseFloat(alerta.valortwo) || 0;
            alert.frecuencia = parseInt(alerta.frecuencia);
        }
        if(!alerta.usuarios){
            alert.usuarios = [];
        }
        alert.save(function (err) {
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    },

    UpdateAlerta: function (alerta, cambios, callback) {
        console.log(cambios);
        alerta.mensaje = cambios.mensaje;
        if(!cambios.usuarios){
            alerta.usuarios = [];
        }else{
            alerta.usuarios = cambios.usuarios;
        }
        if (parseInt(alerta.tipo) == 1) {
            alerta.condicion = cambios.condicion;
            alerta.frecuencia = parseInt(cambios.frecuencia);
            if(!isNaN(parseFloat(cambios.valorone))){
                alerta.valorone =  parseFloat(cambios.valorone);
            }
            if(!isNaN(parseFloat(cambios.valortwo))){
                alerta.valortwo =  parseFloat(cambios.valortwo);
            }
        }
        alerta.save(function(err){
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    },

    GetAlerta: function (mac, fichero, callback) {
        Alerta.find({
            "nodo.mac": parseInt(mac),
            fichero: fichero
        }, function (err, alerta) {
            if (err) {
                return callback(err);
            }
            callback(null, alerta);
        });
    },

    GetAlertaById: function (id, callback) {
        Alerta.findById(id, function (err, alerta) {
            if (err) {
                return callback(err);
            }
            callback(null, alerta);
        });
    },

    GetAllAlertas: function (callback) {
        Alerta.find({}, function (err, alertas) {
            if (err) {
                return callback(err);
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
                return callback(err);
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
            Avisar(alerta, nodo, valor)
            break;
        default:
            break;
    }
};

function CheckAlerta(nodo, valor, alerta) {
    if (CheckCondition(valor, alerta)) {
        if (CheckDate(alerta)) {
            Avisar(alerta, nodo, valor);
        }
    }
}

function Avisar(alerta, nodo, valor){
    Informar(alerta, nodo, valor);
    Aviso.AddAviso({
        mensaje: CreateMensaje(alerta, nodo, valor)
    }, function(){});
}

function Informar(alerta, nodo, valor) {
    mensaje = CreateMensaje(alerta, nodo, valor);
    Accion.SendTelegram(mensaje, alerta.usuarios);
}

function CheckCondition(val_dato, alerta) {
    switch (alerta.condicion) {
        case ">":
            if (val_dato > alerta.valorone) {
                return true;
            }
            return false;
        case ">=":
            if (val_dato >= alerta.valorone) {
                return true;
            }
            return false;
        case "<":
            if (val_dato < alerta.valorone) {
                return true;
            }
            return false;
        case "<=":
            if (val_dato <= alerta.valorone) {
                return true;
            }
            return false;
        case "=":
            if (val_dato == alerta.valorone) {
                return true;
            }
            return false;
        case "entre":
            if (alerta.valorone <= val_dato && val_dato <= alerta.valortwo) {
                return true;
            }
            return false;
        case "fuera":
            if (val_dato <= alerta.valorone && val_dato >= alerta.valortwo) {
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
    var diffMs = (now - alerta.last_event);
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