var path = require('path');
var node_SSH = require('node-ssh');
var ssh = new node_SSH();

var self = module.exports = {

  StartScript: function (nodo, script, callback) {
    ssh.connect({
      host: nodo.ip,
      username: nodo.usuario,
      password: nodo.contrasenya
    }).then(function () {
      ssh.putFile('./uploads/' + script.fichero, '/home/pi/Scripts/' + script.fichero).then(function () {
        var params = "";
        script.argumentos.forEach(function(arg){
          params += arg.valor+" ";
        });
        ssh.exec('nohup '+ script.comando +' /home/pi/Scripts/' + script.fichero + ' ' + params + '> /dev/null 2>&1 & echo $!').then(function (std) {
          callback(null, std);
        }, function (err) {
          callback(err, null);
        });
      }, function (err) {
        callback(err, null);
      });
    }, function (err) {
      callback(err, null);
    });
  },

  CheckNodeStatus: function (nodo, callback) {
    var error = "";
    ssh.connect({
      host: nodo.ip,
      username: nodo.usuario,
      password: nodo.contrasenya
    }).then(function () {
      callback('online');
    }, function (err) {
      callback('offline');
    });
    ssh.dispose();
  },

  CheckScriptsRecursive: function (nodo, scripts, i, info, callback) {
    self.CheckScriptStatus(nodo, scripts[i].pid, function (err, estado) {
      if (err) {
        callback(err);
        return;
      }
      info.push({
        nombre: scripts[i].nombre,
        estado: estado
      });
      i++;
      if (i >= scripts.length) {
        callback(null, info);
      } else {
        self.CheckScriptsRecursive(nodo, scripts, i, info, callback);
      }
    });
  },

  CheckScriptStatus: function (nodo, pid, callback) {
    ssh.connect({
      host: nodo.ip,
      username: nodo.usuario,
      password: nodo.contrasenya
    }).then(function () {
      ssh.exec('kill -0 ' + pid).then(function (std) {
        callback(null, 'online');
      }, function (err) {
        callback(null, 'offline');
      });
    }, function (err) {
      callback(err, 'offline');
    });
    ssh.dispose();
  },

  StopScript: function (nodo, pid, callback) {
    ssh.connect({
      host: nodo.ip,
      username: nodo.usuario,
      password: nodo.contrasenya
    }).then(function () {
      ssh.exec('kill ' + pid).then(function (std) {
        callback(null, pid);
      }, function (error) {
        callback(null, pid);
      });
    }, function (error) {
      callback(null, pid);
    });
    ssh.dispose();
  },

  RestartNode: function (nodo, callback) {
    ssh.connect({
      host: nodo.ip,
      username: nodo.usuario,
      password: nodo.contrasenya
    }).then(function () {
      callback();
      ssh.exec('sudo reboot now').then(function () {        
      }, function (error) {
      });
    }, function (error) {
      callback(error);
    });
    ssh.dispose();
  }

};