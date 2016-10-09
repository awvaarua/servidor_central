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
    ;
    Nodo.findOne({
      mac: parseInt(mac),
      'scripts.pid': parseInt(pid)
    }, { 'scripts.$': 1 },
      function (err, nodo) {
        if (err) {
          callback(err, null);
          return;
        }
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

  AddScripts: function (mac, ip, scripts, index, info_array, callback) {
    if (index < scripts.length) {
      self.AddScript(mac, ip, scripts[index], function (err, data) {
        if (err) {
          callback(err, null);
          return;
        }
        info_array.push(data);
        self.AddScripts(mac, ip, scripts, index + 1, info_array, callback);
      });
    } else {
      callback(null, info_array);
    }
  },

  AddScript: function (mac, ip, script, callback) {
    Ssh.StartScript(ip, script, function (err, pid) {
      if (err) {
        callback(err);
        return;
      }
      script.argumentos.forEach(function(arg){
        arg.orden = parseInt(arg.orden);
      });
      Nodo.collection.update({
        mac: parseInt(mac)
      }, {
          $push: {
            scripts: {
              pid: parseInt(pid),
              nombre: script.nombre,
              fichero: script.fichero,
              argumentos: script.argumentos
            }
          }
        }, function (err) {
          if (err) {
            callback(err);
          }
          callback(null);
        });
    });
  },

  AddNode: function (node, callback) {
    Nodo.collection.insert({
      ip: node.ip,
      nombre: node.nombre,
      descripcion: node.descripcion,
      mac: parseInt(node.mac),
      scripts: [],
      date: new Date()
    }, {}, function (err) {
      if (err) {
        callback(err);
      }
      callback();
    });
  },

  UpdateScript: function (mac, pid, cambio, callback) {
    self.GetNodo(mac, function (err, nodo) {
      if (err) {
        callback(err, null);
        return;
      }
      Update(nodo, pid, cambio, function(err, script){
        if(err){
          callback(err);
          return;
        }
        callback(null, script);
      })
    });
  }

};

function Update(nodo, pid, change, callback) {
  switch (change.tipo) {
    case "pid":
      nodo.scripts.forEach(function(script){
        if(script.pid == parseInt(pid)){
          script.pid = parseInt(change.valor);
          nodo.save(callback(null, script));
          return;
        }
      });
      break;
    case "argumentos":
      nodo.scripts.forEach(function(script){
        if(script.pid == parseInt(pid)){
          script.argumentos.forEach(function(arg){
            if(arg.orden == parseInt(change.orden)){
              arg.valor = change.valor;
              nodo.save(callback(null, script));
              return;
            }
          });
        }
      });
      break;
    default:
      callback("Tipo no encontrado");
  }
}