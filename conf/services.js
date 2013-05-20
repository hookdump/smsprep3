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
	staging: {
		'web': {
			domain: 'staging.smsprep.com'
			, port: 8100
		}, 
		'core': {
			domain: 'core.staging.smsprep.com'
			, port: 8101
		},
		'sms': {
			domain: 'sms.staging.smsprep.com'
			, port: 8102
		},
		'api': {
			domain: 'api.staging.smsprep.com'
			, port: 8103
		}
	},
	production: {
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
		}
	}
}