var Nodo       = require('../app/models/nodo');

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
  GetNodo: function(ip, res) {
    Nodo.findOne({ip:ip},function (err, nodo) {
      res.render('nodo.ejs', {
            nodo : nodo
        });
    });
  }
};