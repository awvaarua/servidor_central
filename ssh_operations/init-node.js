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
  Init: function(tpo, frec, ip, error) {
    var tipo = getTipo(tpo);
    ssh.connect({
      host: ip,
      username: 'pi',
      password: 'fura4468AB'
    }).then(function() {
      // Local, Remote 
      ssh.putFile('/Users/ssb/Google Drive/Enginyeria Informatica/4 Quart any/TFG/git/nodo/scripts/'+tipo+'.py', '/home/pi/Documents/Scripts/'+tipo+'.py').then(function() {
        ssh.exec('nohup python /home/pi/Documents/Scripts/'+tipo+'.py '+frec+' &').then(function() {
          ssh.dispose();
        }, function(error){
          console.log("se ha producido algún error: "+ error);
          error = 1;
        });       
      }, function(error) {
        console.log("Error al copiar el fichero");
        console.log(error)
        error = 1;
      });
    }, function(error){
      console.log("Error al conectar "+error);
      error = 1;
    });
  }
};