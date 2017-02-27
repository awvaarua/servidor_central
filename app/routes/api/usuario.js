var Usuarios = require('../../operations/usuarios.js');

module.exports = {

    usuarios: function(req, res, next) {
        Usuarios.GetUsers(function(err, userlist) {
            if (err) {
                userlist = [];
            }
            return res.send({
                usuarios: userlist
            });
        });
    }

};