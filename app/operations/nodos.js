var Nodo = require('../models/nodo');
var Pendientes = require('./pendientes.js');
var Ssh = require('../ssh_operations/sshoperations.js');

var self = module.exports = {

  GetAllNodes: function (callback) {
    Nodo.find({}, 'nombre ip mac', function (err, nodos) {
      if (err) {
        callback("", err);
      }
      var listado = [];
      nodos.forEach(function (nodo) {
        listado.push(nodo);
      });
      callback(listado);
    });
  },

  GetNodo: function (mac, callback) {
    Nodo.findOne({
      mac: mac
    }, function (err, nodo) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, nodo);
    });
  },

  GetScript: function (mac, pid, callback) {
    Nodo.findOne({
      mac: parseInt(mac),
      'scripts.pid': parseInt(pid)
    }, { 'scripts.$': 1 },
      function (err, nodo) {
        if (err) {
          callback(err, null);
          return;
        }
        nodo.methods.sort();
        callback(null, nodo);
      });
  },

  DeleteAllScripts: function (mac, ip, scripts, index, info_array, callback) {
    if (index < scripts.length) {
      self.DeleteScript(mac, ip, scripts[index].pid, function (err, data) {
        if (err) {
          callback(err, data);
        }
        info_array.push(data);
        self.DeleteAllScripts(mac, ip, scripts, index + 1, info_array, callback);
      });
    } else {
      callback(null, info_array);
    }
  },

  DeleteNodo: function (mac, callback) {
    self.GetNodo(mac, function (err, nodo) {
      if (err) {
        callback(err, null);
        return;
      }
      self.DeleteAllScripts(mac, nodo.ip, nodo.scripts, 0, [], function (err, data) {
        if (err) {
          callback(err, null);
          return;
        }
        Nodo.remove({
          mac: parseInt(mac)
        }, function (err) {
          if (err) {
            callback(err);
          }
          callback(null, data);
        });
      });
    });
  },

  DeleteScript: function (mac, ip, pid, callback) {
    Ssh.StopScript(ip, pid, function (err, data) {
      if (err) {
        callback(err);
      }
      Nodo.collection.update({
        mac: parseInt(mac)
      }, {
          $pull: {
            scripts: {
              pid: parseInt(pid)
            }
          }
        }, function (err) {
          if (err) {
            callback(err);
          }
          callback(null, data);
        });
    });
  },

  AddScript: function (nodo, script, callback) {
    Ssh.StartScript(nodo.ip, script, function (err, pid) {
      if (err) {
        return callback(err);
      }
      script.pid = pid;
      script.argumentos.forEach(function (arg) {
        arg.orden = parseInt(arg.orden);
      });
      nodo.scripts.push(script);
      nodo.save(function(){
        if (err) {
          return callback(err);
        }
        callback();
      });
    });
  },

  AddNode: function (data, callback) {
    var nodo = new Nodo({
      ip: data.ip,
      nombre: data.nombre,
      descripcion: data.descripcion,
      mac: parseInt(data.mac),
      scripts: [],
      date: new Date()
    });
    nodo.save(function(err){
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  },

  UpdateScript: function (mac, pid, cambio, callback) {
    self.GetNodo(mac, function (err, nodo) {
      if (err) {
        return callback(err, null);
      }
      Update(nodo, pid, cambio, function (err, script) {
        if (err) {
          return callback(err);
        }
        callback(null, script);
      })
    });
  }

};

function Update(nodo, pid, change, callback) {
  switch (change.tipo) {
    case "pid":
      nodo.scripts.forEach(function (script) {
        if (script.pid == parseInt(pid)) {
          script.pid = parseInt(change.valor);
          return nodo.save(callback(null, script));
        }
      });
      break;
    case "argumentos":
      nodo.scripts.forEach(function (script) {
        if (script.pid == parseInt(pid)) {
          script.argumentos.forEach(function (arg) {
            if (arg.orden == parseInt(change.orden)) {
              arg.valor = change.valor;
              return nodo.save(callback(null, script));
            }
          });
        }
      });
      break;
    default:
      callback("Tipo no encontrado");
  }
}