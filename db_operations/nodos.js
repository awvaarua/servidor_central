var Nodo       = require('../app/models/nodo');
var Pendientes = require('../db_operations/pendientes.js');
var Constantes = require('../app/constantes/constantes.js');
var Ssh        = require('../ssh_operations/sshoperations.js');

var self = module.exports = {

  GetAllNodes: function(callback) {
    Nodo.find({}, 'ip',function (err, nodos) {
      if (err) {callback("", err);}
      var listado = [];      
      nodos.forEach(function(nodo) {
        listado.push(nodo);
      });
      callback(listado);
    });
  },

  GetNodo: function(ip, callback) {
    Nodo.findOne({ip:ip},function (err, nodo) {      
      callback(err, nodo);
    });
  },

  DeleteAllScripts: function(ip, callback) {
    Nodo.findOne({ip:ip},function (err, nodo) {
      if (err) {callback(err);return;}
      nodo.scripts.forEach(function(script, i, array){
        self.DeleteScript(ip, script.pid);
      });
    });
    callback();
  },

  DeleteNodo: function(ip, callback) {
    self.DeleteAllScripts(ip, function(){
      Nodo.remove({ip:ip}, function (err) {
        if (err) {callback(err);}
        callback();
      });
    })
  },

  DeleteScript: function(ip, pid, callback){
    Ssh.DeleteScript(ip, pid, function(err){
      if (err) {console.log("error1");callback(error);}
      Nodo.findOneAndUpdate({ ip : ip },{ $pull : { scripts : {pid : pid} }}, { safe: true }, function (err, obj){
        if (err) {callback(err);}
        callback();
      });      
    });
  },

  AddScripts: function(ip, scripts, callback){
    var scripts_info = [];
    scripts.forEach(function(script, i, array){
      self.AddScript(ip, script, function(err, data){
        if (err) {callback(err);}
        scripts_info.push(data);
        if (i === array.length - 1) {
          callback(null, scripts_info);
        }
      })
    });
  },  

  AddScript: function(ip, script, callback){
    Ssh.StartScript(ip, script.tipo, script.frec, function(err, data){
      if (err) {callback(err);}
      Nodo.collection.update({ ip : ip },{ $push : { scripts : {pid : data.pid, tipo : data.tipo, frec : data.frec} } }, function (err){
        if (err) {callback(err);}
      });
      callback(null, data);
    });
  },

  AddNode: function(ip, callback) {
    Nodo.collection.insert({ip:ip, scripts:[], date:new Date()}, {}, function(err){
      if(err){callback(err);}
      callback();
    });
  }
  
};