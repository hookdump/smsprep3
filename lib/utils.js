module.exports = {
	reportError: function(title, message) {
		log.red("[!] Sending error report [" + title + "]: " + message);
	},
	buildFindQuery: function(params) {
		var query = {
			externalId: params.uid
			, partner: params.partner
		};
		return query;
	},
	requireRole: function(role) {
		return function(req, res, next) {
			if (req.user && (req.user.roles.indexOf(role) > -1)) {
				next();
			} else {
				res.send(403);
			}
		}
	},
	optionToIndex: function(msg) {
		msg = msg.toUpperCase();
		return msg.charCodeAt(0) - 65;
	},
	indexToOption: function(index) {
		return String.fromCharCode(65+index);
	}
	
};