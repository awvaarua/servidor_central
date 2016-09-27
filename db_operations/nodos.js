var Nodo       = require('../app/models/nodo');
var Pendientes = require('../db_operations/pendientes.js');
var Constantes = require('../app/constantes/constantes.js');
var Ssh        = require('../ssh_operations/init-node.js');

var self = module.exports = {
  GetListado: function(res) {
    Nodo.find({}, 'ip',function (err, nodos) {
      var listado = [];      
      nodos.forEach(function(nodo) {
        listado.push(nodo);
      });
      res.render('gestionnodos.ejs', {
            nodos : listado
        });
    });
  },

  GetNodo: function(ip,res) {
    Nodo.findOne({ip:ip},function (err, nodo) {      
      res.render('nodo.ejs', {
            nodo : nodo
        });
    });
  },

  GetScripts: function(ip,res) {
    Nodo.findOne({ip:ip},function (err, nodo) {      
      res.send({data:nodo});
    });
  },

  Status: function(ip, res){
    Ssh.CheckStatus(ip, res);
  },

  ScriptStatus: function(ip, pid, res){
    Ssh.CheckScriptStatus(ip, pid, res);
  },

  ScriptDelete: function(ip, pid, res){
    Ssh.ScriptDelete(ip, pid, res, function(ip, pid, res){
      Nodo.collection.update({ ip : ip },
                            { $pull : { scripts : {pid : pid} } },
                            function (err){});
    });
  },

  Add: function(req, res, started) {
    var scripts = [];
    req.body.confirmacion.scripts.forEach(function(n, i) {
      scripts.push({tipo:Constantes.Tipo(n.tipo), frec:n.frec, pid: started[i].pid});
    });
    Nodo.collection.insert({ip:req.body.confirmacion.ip, scripts:scripts, date:new Date()}, {}, function(err){
      if (err) {
        console.log(err); 
      }else{
        Pendientes.DeletePendiente(res, req.body.confirmacion.ip, started);
      }
    });
  }
};