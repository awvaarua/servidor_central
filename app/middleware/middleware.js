module.exports = {

	isLoggedIn: function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		res.redirect('/login');
	},

	isAdmin: function(req, res, next) {
		if (req.user.local.admin == true) {
			return next();
		}
		res.redirect('/login');
	},

	ipConfig: function(req, res, next) {
		if (req.params.ip == "req") {
			var ip = req.ip.split(':');
			req.params.ip = ip[ip.length - 1];
		}
		return next();
	}

};