module.exports = {
	development: {
		'web': {
			domain: 'smsprep.local'
			, port: 8200
		}, 
		'core': {
			domain: 'core.smsprep.local'
			, port: 8201
		},
		'sms': {
			domain: 'sms.smsprep.local'
			, port: 8202
		},
		'api': {
			domain: 'api.smsprep.local'
			, port: 8203
		}
	},
	production: {

		'web-www': {
			domain: 'www.smsprep.com'
			, port: 8000
		}, 
		'web': {
			domain: 'smsprep.com'
			, port: 8000
		}, 
		'core': {
			domain: 'core.smsprep.com'
			, port: 8001
		},
		'sms': {
			domain: 'sms.smsprep.com'
			, port: 8002
		},
		'api': {
			domain: 'api.smsprep.com'
			, port: 8003
		},

		'web-staging': {
			domain: 'staging.smsprep.com'
			, port: 8100
		}, 
		'core-staging': {
			domain: 'core.staging.smsprep.com'
			, port: 8101
		},
		'sms-staging': {
			domain: 'sms.staging.smsprep.com'
			, port: 8102
		},
		'api-staging': {
			domain: 'api.staging.smsprep.com'
			, port: 8103
		}

	}
}