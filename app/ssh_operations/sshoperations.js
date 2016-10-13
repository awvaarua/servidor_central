var path = require('path');
var node_SSH = require('node-ssh');
var ssh = new node_SSH();

var self = module.exports = {

  /*
    IN: ip, script, callback
    OUT: error, script with updated pid
  */
  StartScript: function (ip, script, callback) {
    ssh.connect({
      host: ip,
      username: 'pi',
      password: 'fura4468AB'
    }).then(function () {
      ssh.putFile('./uploads/' + script.fichero, '/home/pi/Scripts/' + script.fichero).then(function () {
        console.log('nohup python /home/pi/Scripts/' + script.fichero + ' ' + script.argumentos[0].valor + ' > /dev/null 2>&1 & echo $!');
        ssh.exec('nohup python /home/pi/Scripts/' + script.fichero + ' ' + script.argumentos[0].valor + ' > /dev/null 2>&1 & echo $!').then(function (std) {
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

  /*
    IN: ip, callback
    OUT: error, string, represents online or offline status
  */
  CheckNodeStatus: function (ip, callback) {
    var error = "";
    ssh.connect({
      host: ip,
      username: 'pi',
      password: 'fura4468AB'
    }).then(function () {
      callback('online');
    }, function (err) {
      callback('offline');
    });
    ssh.dispose();
  },

  CheckScriptsRecursive: function (ip, scripts, i, info, callback) {
    self.CheckScriptStatus(ip, scripts[i].pid, function (err, estado) {
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
        self.CheckScriptsRecursive(ip, scripts, i, info, callback);
      }
    });
  },

  CheckScriptStatus: function (ip, pid, callback) {
    ssh.connect({
      host: ip,
      username: 'pi',
      password: 'fura4468AB'
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


  /*
    IN: ip, pid, callback
    OUT: error
  */
  StopScript: function (ip, pid, callback) {
    ssh.connect({
      host: ip,
      username: 'pi',
      password: 'fura4468AB'
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

  /*
    IN: ip, pid, callback
    OUT: error
  */
  RestartNode: function (ip, callback) {
    ssh.connect({
      host: ip,
      username: 'pi',
      password: 'fura4468AB'
    }).then(function () {
      ssh.exec('sudo reboot now').then(function () {
        callback();
      }, function (error) {
        callback();
      });
    }, function (error) {
      console.log("Error al intentar conectar: " + error);
      callback(error);
    });
    ssh.dispose();
  }

};