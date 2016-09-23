var path = require('path');
var node_SSH = require('node-ssh');
var ssh = new node_SSH();

/*var self = module.exports = {
  Init: function(object) {    
    var ssh = new SSH({
      host: '192.168.1.142',
      user: 'pi',
      pass: 'fura4468AB'
    });
    ssh.exec('node /home/pi/Documents/ExpressAppProva/bucle.js', {
        out: function(stdout) {
            console.log(stdout);
        },
        err: function(stderr) {
            console.log(stderr);
        }
    });
    ssh.start({
      fail: function (err) {
        console.log(err);
      }
    });
  }
};*/

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
  Init: function(tpo, frec) {
    var tipo = getTipo(tpo);
    ssh.connect({
      host: '192.168.1.142',
      username: 'pi',
      password: 'fura4468AB'
    }).then(function() {
      // Local, Remote 
      ssh.putFile('/Users/ssb/Google Drive/Enginyeria Informatica/4 Quart any/TFG/git/nodo/scripts/'+tipo+'.py', '/home/pi/Documents/Scripts/'+tipo+'.py').then(function() {
        console.log("The File thing is done") 
        ssh.exec('nohup python /home/pi/Documents/Scripts/'+tipo+'.py '+frec+' &').then(function(std) {
          ssh.dispose();
          console.log('STDERR: ' + std);
        });       
      }, function(error) {
        console.log("Something's wrong")
        console.log(error)
      });
    });
  }
};