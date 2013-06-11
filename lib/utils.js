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
	}
};