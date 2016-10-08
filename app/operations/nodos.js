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

  GetScript: function (ip, pid, callback) {
    Nodo.findOne({
      ip: ip
    }, {
        scripts: {
          $elemMatch: {
            pid: pid
          }
        }
      }, function (err, nodo) {
        if (err) {
          callback(err, null);
          return;
        }
        if (nodo == null) {
          callback("not found", null);
        }
        callback(null, nodo.scripts[0]);

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
      if(err){
        callback(err, null);
        return;
      }
      
      self.DeleteAllScripts(mac, nodo.ip, nodo.scripts, 0, [], function (err, data) {
        if(err){
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

  UpdateScript: function (ip, pid, cambio, callback) {
    self.GetScript(ip, pid, function (err, script) {
      if (err) {
        callback(err, null);
        return;
      }
      var newscript = GetNewScript(script, cambio);
      Nodo.collection.update({
        ip: ip,
        'scripts.pid': parseInt(pid)
      }, {
          $set: {
            'scripts.$.pid': parseInt(newscript.pid),
            'scripts.$.tipo': newscript.tipo,
            'scripts.$.frec': newscript.frec,
            'scripts.$.pin': newscript.pin
          }
        }, function (err) {
          if (err) {
            callback(err, null);
          }
          callback(null, newscript);
        });
    });
  }

};

function GetNewScript(script, change) {
  switch (change.tipo) {
    case "pid":
      script.pid = change.valor;
      return script;
    case "frec":
      script.frec = change.valor;
      return script;
    case "pin":
      script.pin = change.valor;
      return script;
    default:
      return script;
  }
}