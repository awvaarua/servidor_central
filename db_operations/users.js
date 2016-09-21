var User       = require('../app/models/user');

var self = module.exports = {
  GetUsers: function(res) {
    User.find({}, function (err, users) {
      var userlist = [];
      users.forEach(function(user) {
        userlist.push(user);
      });
      res.render('adminusers.ejs', {
            users : userlist
        });
    });
  },

  DeleteUserByEmail: function(res, email) {
    User.remove({"local.email": email }, function (err, user) {
        self.GetUsers(res);
    });
  },

  UpdateUser: function(res, email, tipo) {
    User.update({"local.email": email }, {"local.admin": tipo}, function (err, user) {
        self.GetUsers(res);
    });
  }
};