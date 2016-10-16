var Users = require('../operations/users.js');

module.exports = {

    users: function(req, res, next) {
        Users.GetUsers(function(err, userlist) {
            if (err) {}
            res.render('adminusers.ejs', {
                users: userlist
            });
        });
    },

    userUpdate: function(req, res, next) {
        Users.UpdateUser(req.body.email, req.body.tipo, function() {
            res.redirect('/users');
        });
    },

    userDelete: function(req, res, next) {
        Users.DeleteUserByEmail(req.body.email, function(err) {
            if (err) {}
            res.redirect('/users');
        });
    }

};