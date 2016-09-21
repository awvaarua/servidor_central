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
  }
};

