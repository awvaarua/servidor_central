var Constantes = require('../app/constantes/constantes.js');

var self = module.exports = {
  Add: function(object){
  	console.log("El tipo es: "+object.tipo);
    var type = Constantes.Collection(object.tipo);
    type.collection.insert({ip:object.datos.ip, date: new Date(), val:parseInt(object.datos.val)}, {}, function(err){
      if (err) {console.log(err);}
    });
  }
};