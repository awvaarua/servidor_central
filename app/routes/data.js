var Data = require('../../db_operations/data.js');

module.exports = {

	//=== ADD DATA  ===
	dataAdd : function(req, res, next) {
		Data.Add(req.body);
        res.status(200).send('Ok');
	}

};