var Pendiente       = require('../app/models/pendiente');

var self = module.exports = {

  GetPendientes: function(callback) {
    Pendiente.find({}, function (err, pendientes) {
      if (err) {callback(err);}
      var listapendientes = [];      
      pendientes.forEach(function(pendiente) {
        listapendientes.push(pendiente);
      });
      callback(null,listapendientes);
    });
  },

  InsertPendiente: function(ip, callback) {
    Pendiente.collection.insert({ip:ip, date: new Date()}, function (err) {
      if (err) {callback(err);}
      callback(null);
    });
  },

  DeletePendiente: function(ip, callback) {
    Pendiente.remove({ip:ip}, function (err) {
      if (err) {callback(err);}
      callback(null);
    });
  }
};