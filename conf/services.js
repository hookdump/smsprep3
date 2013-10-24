// Instance: eprep
// Config: services

module.exports = {
	test: {
		'web': {
			domain: 'sms.eprep.local'
			, port: 8200
		}, 
		'core': {
			domain: 'core.sms.eprep.local'
			, port: 8201
		},
		'sms': {
			domain: 'sms.sms.eprep.local'
			, port: 8202
		},
		'api': {
			domain: 'api.sms.eprep.local'
			, port: 8203
		}
	},
	development: {
		'web': {
			domain: 'sms.eprep.local'
			, port: 8200
		}, 
		'core': {
			domain: 'core.sms.eprep.local'
			, port: 8201
		},
		'sms': {
			domain: 'sms.sms.eprep.local'
			, port: 8202
		},
		'api': {
			domain: 'api.sms.eprep.local'
			, port: 8203
		}
	},
	staging: {
		'web': {
			domain: 'staging.sms.eprep.com'
			, port: 8100
		}, 
		'core': {
			domain: 'core.staging.sms.eprep.com'
			, port: 8101
		},
		'sms': {
			domain: 'sms.staging.sms.eprep.com'
			, port: 8102
		},
		'api': {
			domain: 'api.staging.sms.eprep.com'
			, port: 8103
		}
	},
	production: {
		'watchmen-web': {
			domain: 'status.sms.eprep.com'
			, port: 3003
		}, 
		'loopback-ping': {
			domain: '127.0.0.1'
			, port: 8000
		}, 

		'web-www': {
			domain: 'www.sms.eprep.com'
			, port: 8000
		}, 
		'web': {
			domain: 'sms.eprep.com'
			, port: 8000
		}, 
		'core': {
			domain: 'core.sms.eprep.com'
			, port: 8001
		},
		'sms': {
			domain: 'sms.sms.eprep.com'
			, port: 8002
		},
		'api': {
			domain: 'api.sms.eprep.com'
			, port: 8003
		},

		'web-staging': {
			domain: 'staging.sms.eprep.com'
			, port: 8100
		}, 
		'core-staging': {
			domain: 'core.staging.sms.eprep.com'
			, port: 8101
		},
		'sms-staging': {
			domain: 'sms.staging.sms.eprep.com'
			, port: 8102
		},
		'api-staging': {
			domain: 'api.staging.sms.eprep.com'
			, port: 8103
		}

	}
}