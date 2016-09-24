var Pendiente       = require('../app/models/pendiente');

var self = module.exports = {
  GetPendientes: function(res) {
    Pendiente.find({}, function (err, pendientes) {
      var listapendientes = [];      
      pendientes.forEach(function(pendiente) {
        listapendientes.push(pendiente);
      });
      res.render('nodos-pendientes.ejs', {
            pendientes : listapendientes
        });
    });
  },

  InsertPendiente: function(res, ip, date) {
    Pendiente.collection.insert({ip:ip, date: date}, function (err) {
      res.setHeader('Content-Type', 'application/json');
      if (err) {
        res.send(JSON.stringify({ ok: "false", err: err}));  
      }
      res.send(JSON.stringify({ ok: "true"}));
    });
  },

  DeletePendiente: function(res, ip, data) {
    if (typeof data === 'undefined') {
      data = "";
    }
    Pendiente.remove({ip:ip}, function (err) {
      if (err) {
        res.status(500).send('Algo va mal');
      }
      res.send({ ok:"true", data:data});
    });
  }
};