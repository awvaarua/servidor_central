var Script = require('../models/script');

var self = module.exports = {

    GetAllScripts: function (callback) {
        Script.find({}, 'nombre', function (err, scripts) {
            if (err) {
                callback(err);
                return;
            }
            var listado = [];
            scripts.forEach(function (script) {
                listado.push(script);
            });
            callback(null, listado);
        })
    },

    GetScript: function (id, callback) {
        Script.findById(id, function (err, script) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, script);
        })
    }

}