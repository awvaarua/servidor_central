var self = module.exports = {
	Tipo: function(tpo) {
	    switch(tpo) {
	      case "0":
	          return "temperatura";
	      case "1":
	          return "humedad";
	      default:
	          return "temperatura";
	    }
	}
};