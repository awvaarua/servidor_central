var Users = require('../operations/users.js');

module.exports = {

    //=== GET ALL USERS  ===
    users: function(req, res, next) {
        Users.GetUsers(function(err, userlist) {
            if (err) {}
            res.render('adminusers.ejs', {
                users: userlist
            });
        });
    },

    //=== GET PENDIENTE BY IP ===
    userUpdate: function(req, res, next) {
        Users.UpdateUser(req.body.email, req.body.tipo, function() {
            res.redirect('/users');
        });
    },

    //=== GET ALL PENDIENTES BY IP ===
    userDelete: function(req, res, next) {
        Users.DeleteUserByEmail(req.body.email, function(err) {
            if (err) {}
            res.redirect('/users');
        });
    },

    //=== DELETE PENDIENTE BY IP===
    pendienteDelete: function(req, res, next) {
        Pendientes.DeletePendiente(req.body.ip, function(err) {
            if (err) {
                res.send({
                    ok: "false"
                });
            }
            res.send({
                ok: "true"
            });
        });
    }

};