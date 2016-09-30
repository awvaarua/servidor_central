module.exports = {

	isLoggedIn : function(req, res, next) {
		if (req.isAuthenticated()){
			return next();
		}
		res.redirect('/login');
	},

	isAdmin : function(req, res, next) {
		if (req.user.local.admin == true){
	        return next();
	    }
	    res.redirect('/login');
	}

};