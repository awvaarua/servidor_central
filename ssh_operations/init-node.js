var path = require('path');
var node_SSH = require('node-ssh');
var ssh = new node_SSH();
var Constantes = require('../app/constantes/constantes.js');

var self = module.exports = {
  Init: function(req, res, i, started, callback) {
    var tipo = Constantes.Tipo(req.body.confirmacion.scripts[i].tipo);
    var frec = req.body.confirmacion.scripts[i].frec;
    var error = "";
    ssh.connect({
      host: req.body.confirmacion.ip,
      username: 'pi',
      password: 'fura4468AB'
    }).then(function() {
      //Copiamos el fichero
      ssh.putFile('/Users/ssb/Google Drive/Enginyeria Informatica/4 Quart any/TFG/git/nodo/scripts/'+tipo+'.py', '/home/pi/Documents/Scripts/'+tipo+'.py').then(function() {
        //Iniciamos la ejecucion
        ssh.exec('nohup python /home/pi/Documents/Scripts/'+tipo+'.py '+frec+' > /dev/null 2>&1 & echo $!').then(function(std) {          
          started.push({"pid":std, "tipo":tipo, "frec":frec});
          callback(error, i+1, req, res, started);
        }, function(error){
          error = "Error en la ejecucion: " + error;
          callback(error, i+1, req, res, started);
        });       
      }, function(error) {
        error = "Error al copiar el fichero: " + error;
        callback(error, i+1, req, res, started);
      });
    }, function(error){
      error = "Error al intentar conectar: " + error;
      callback(error, i+1, req, res, started);
    });
    ssh.dispose();
  }
};