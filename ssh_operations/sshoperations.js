var path = require('path');
var node_SSH = require('node-ssh');
var ssh = new node_SSH();
var Constantes = require('../app/constantes/constantes.js');

var self = module.exports = {

  StartScript: function(ip, tipo, frec, callback){
    var Tipo = Constantes.Tipo();
    ssh.connect({
      host: ip,
      username: 'pi',
      password: 'fura4468AB'
    }).then(function() {
      //Copiamos el fichero
      ssh.putFile('/Users/ssb/Google Drive/Enginyeria Informatica/4 Quart any/TFG/git/nodo/scripts/'+Tipo+'.py', '/home/pi/Documents/Scripts/'+Tipo+'.py').then(function() {
        ssh.exec('nohup python /home/pi/Documents/Scripts/'+Tipo+'.py '+frec+' > /dev/null 2>&1 & echo $!').then(function(std) {
          callback(null, {"pid":std, "tipo":tipo, "frec":frec});
        }, function(error){
          callback(error);
        });       
      }, function(error) {
        callback(error);
      });
    }, function(error){
      callback(error);
    });
  },

  CheckNodeStatus: function(ip, callback){
    var error = "";
    ssh.connect({
      host: ip,
      username: 'pi',
      password: 'fura4468AB'
    }).then(function() {
      callback('online');      
    }, function(error){
      callback('offline');
    });
    ssh.dispose();
  },

  CheckScriptStatus: function(ip, pid, callback){
    ssh.connect({
      host: ip,
      username: 'pi',
      password: 'fura4468AB'
    }).then(function() {
      ssh.exec('kill -0 '+pid).then(function(std) {        
        callback(null, 'online');
      }, function(error){
        callback(null, 'offline');
      });
    }, function(error){
      callback(error,'offline');
    });
    ssh.dispose();
  },

  DeleteScript: function(ip, pid, callback){
    ssh.connect({
      host: ip,
      username: 'pi',
      password: 'fura4468AB'
    }).then(function() {
      ssh.exec('kill '+pid).then(function(std) {
        callback(null, pid);
      }, function(error){
        callback(null, pid);
      });
    }, function(error){
      callback(null, pid);
    });
    ssh.dispose();
  },

  RestartNode: function(ip, callback){
    ssh.connect({
      host: ip,
      username: 'pi',
      password: 'fura4468AB'
    }).then(function() {
      ssh.exec('sudo reboot now').then(function( ){
        callback();
      }, function(error){
        callback();
      });
    }, function(error){
      console.log("Error al intentar conectar: " + error);
      callback(error);
    });
    ssh.dispose();
  }

};