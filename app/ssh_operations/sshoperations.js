var path = require('path');
var node_SSH = require('node-ssh');
var ssh = new node_SSH();
var Constantes = require('../constantes/constantes.js');

var self = module.exports = {

  /*
    IN: ip, script, callback
    OUT: error, script with updated pid
  */
  StartScript: function(ip, script, callback) {
    var Tipo = Constantes.Tipo(script.tipo);
    ssh.connect({
      host: ip,
      username: 'pi',
      password: 'fura4468AB'
    }).then(function() {
      ssh.putFile('/Users/ssb/Google Drive/Enginyeria Informatica/4 Quart any/TFG/git/nodo/scripts/' + Tipo + '.py', '/home/pi/Documents/Scripts/' + Tipo + '.py').then(function() {
        ssh.exec('nohup python /home/pi/Documents/Scripts/' + Tipo + '.py ' + script.frec + ' > /dev/null 2>&1 & echo $!').then(function(std) {
          script.pid = std;
          script.tipo = Tipo;
          callback(null, script);
        }, function(err) {
          callback(err, null);
        });
      }, function(err) {
        callback(err, null);
      });
    }, function(err) {
      callback(err, null);
    });
  },

  /*
    IN: ip, callback
    OUT: error, string, represents online or offline status
  */
  CheckNodeStatus: function(ip, callback) {
    var error = "";
    ssh.connect({
      host: ip,
      username: 'pi',
      password: 'fura4468AB'
    }).then(function() {
      callback('online');
    }, function(err) {
      callback('offline');
    });
    ssh.dispose();
  },

  /*
    IN: ip, pid, callback
    OUT: error, string, represents online or offline status
  */
  CheckScriptStatus: function(ip, pid, callback) {
    ssh.connect({
      host: ip,
      username: 'pi',
      password: 'fura4468AB'
    }).then(function() {
      ssh.exec('kill -0 ' + pid).then(function(std) {
        callback(null, 'online');
      }, function(err) {
        callback(null, 'offline');
      });
    }, function(err) {
      callback(err, 'offline');
    });
    ssh.dispose();
  },


  /*
    IN: ip, pid, callback
    OUT: error
  */
  StopScript: function(ip, pid, callback) {
    ssh.connect({
      host: ip,
      username: 'pi',
      password: 'fura4468AB'
    }).then(function() {
      ssh.exec('kill ' + pid).then(function(std) {
        callback(null, pid);
      }, function(error) {
        callback(null, pid);
      });
    }, function(error) {
      callback(null, pid);
    });
    ssh.dispose();
  },

  /*
    IN: ip, pid, callback
    OUT: error
  */
  RestartNode: function(ip, callback) {
    ssh.connect({
      host: ip,
      username: 'pi',
      password: 'fura4468AB'
    }).then(function() {
      ssh.exec('sudo reboot now').then(function() {
        callback();
      }, function(error) {
        callback();
      });
    }, function(error) {
      console.log("Error al intentar conectar: " + error);
      callback(error);
    });
    ssh.dispose();
  }

};