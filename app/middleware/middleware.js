module.exports = {

	isLoggedIn: function (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		res.redirect('/login');
	},

	isAdmin: function (req, res, next) {
		if (req.user.local.admin == true) {
			return next();
		}
		res.redirect('/login');
	},

	macConfig: function (req, res, next) {
		if (req.params.mac == "req") {
			var ip = req.ip.split(':');
			req.params.mac = mac[mac.length - 1];
		}
		return next();
	},

	getIp: function (req, res, next) {
		var ip = req.ip.split(':');
		req.params.ip = ip[ip.length - 1];
		return next();
	}

};