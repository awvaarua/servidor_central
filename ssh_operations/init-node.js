var path = require('path');
var node_SSH = require('node-ssh');
var ssh = new node_SSH();

function getTipo(tpo) {
  switch(tpo) {
    case "0":
        return "temperatura";
    case "1":
        return "humedad";
    default:
        return "temperatura";
  }
}

var self = module.exports = {
  Init: function(req, res, i, started, callback) {
    var tipo = getTipo(req.body.confirmacion.scripts[i].tipo);
    var frec = req.body.confirmacion.scripts[0].frec;
    var error = "";
    ssh.connect({
      host: req.body.confirmacion.ip,
      username: 'pi',
      password: 'fura4468AB'
    }).then(function() {
      //Copiamos el fichero
      ssh.putFile('/Users/ssb/Google Drive/Enginyeria Informatica/4 Quart any/TFG/git/nodo/scripts/'+tipo+'.py', '/home/pi/Documents/Scripts/'+tipo+'.py').then(function() {
        //Iniciamos la ejecucion
        ssh.exec('nohup python /home/pi/Documents/Scripts/'+tipo+'.py '+frec+' & echo $! 2>&1').then(function(result) {
          //Guardamos el pid resultante de la ejecucion
          started.push(result.split("\n")[0]);
          ssh.dispose();
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
  }
};