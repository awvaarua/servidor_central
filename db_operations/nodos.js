var Nodo = require('../app/models/nodo');
var Pendientes = require('../db_operations/pendientes.js');
var Constantes = require('../app/constantes/constantes.js');
var Ssh = require('../ssh_operations/sshoperations.js');

var self = module.exports = {

  GetAllNodes: function(callback) {
    Nodo.find({}, 'ip', function(err, nodos) {
      if (err) {
        callback("", err);
      }
      var listado = [];
      nodos.forEach(function(nodo) {
        listado.push(nodo);
      });
      callback(listado);
    });
  },

  GetNodo: function(ip, callback) {
    Nodo.findOne({
      ip: ip
    }, function(err, nodo) {
      callback(err, nodo);
    });
  },

  GetScript: function(ip, pid, callback) {
    Nodo.findOne({
      ip: ip
    }, {
      scripts: {
        $elemMatch: {
          pid: pid
        }
      }
    }, function(err, nodo) {
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

  DeleteAllScripts: function(ip, scripts, index, info_array, callback) {
    if (index < scripts.length) {
      self.DeleteScript(ip, scripts[index].pid, function(err, data) {
        if (err) {
          callback(err, data);
        }
        info_array.push(data);
        self.DeleteAllScripts(ip, scripts, index + 1, info_array, callback);
      });
    } else {
      callback(null, info_array);
    }
  },

  DeleteNodo: function(ip, callback) {
    self.GetNodo(ip, function(err, nodo) {
      self.DeleteAllScripts(ip, nodo.scripts, 0, [], function(err, data) {
        Nodo.remove({
          ip: ip
        }, function(err) {
          if (err) {
            callback(err);
          }
          callback(null, data);
        });
      });
    });
  },

  DeleteScript: function(ip, pid, callback) {
    Ssh.StopScript(ip, pid, function(err, data) {
      if (err) {
        callback(err);
      }
      Nodo.collection.update({
        ip: ip
      }, {
        $pull: {
          scripts: {
            pid: parseInt(pid)
          }
        }
      }, function(err) {
        if (err) {
          callback(err);
        }
        callback(null, data);
      });
    });
  },

  AddScripts: function(ip, scripts, index, info_array, callback) {
    if (index < scripts.length) {
      self.AddScript(ip, scripts[index], function(err, data) {
        if (err) {
          callback(err, null);
        }
        info_array.push(data);
        self.AddScripts(ip, scripts, index + 1, info_array, callback);
      });
    } else {
      callback(null, info_array);
    }
  },

  AddScript: function(ip, script, callback) {
    Ssh.StartScript(ip, script.tipo, script.frec, function(err, data) {
      if (err) {
        callback(err);
      }
      Nodo.collection.update({
        ip: ip
      }, {
        $push: {
          scripts: {
            pid: parseInt(data.pid),
            tipo: data.tipo,
            frec: data.frec
          }
        }
      }, function(err) {
        if (err) {
          callback(err);
        }
        callback(null, data);
      });
    });
  },

  AddNode: function(ip, callback) {
    Nodo.collection.insert({
      ip: ip,
      scripts: [],
      date: new Date()
    }, {}, function(err) {
      if (err) {
        callback(err);
      }
      callback();
    });
  },

  UpdateScript: function(ip, pid, cambio, callback) {
    self.GetScript(ip, pid, function(err, script) {
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
          'scripts.$.frec': newscript.frec
        }
      }, function(err) {
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
    default:
      return script;
  }
}