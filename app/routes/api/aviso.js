var Aviso = require('../../operations/aviso.js');

module.exports = {

	avisosGetAfterDate: function (req, res, next) {
		var date = new Date(req.body.date);
		date.setHours(0,0,0,0);
		Aviso.GetAvisosAfterDate(date, function (err, avisos) {
			res.send({
				avisos: avisos
			});
		});
	}
};