module.exports = {
	buildFindQuery: function(params) {
		var query = {
			externalId: params.uid
			, partner: params.partner
		};
		return query;
	}
};