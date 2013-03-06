REPORTER = 'dot'

install:
	npm install
uninstall:
	@sudo rm -r node_modules
	@sudo npm cache clean

start_core: 
	clear
	node apps/smsprep-core/app
start_sms: 
	clear
	node apps/sms-interface/app
start_web: 
	clear
	node apps/web-interface/app
start_api: 
	clear
	node apps/api-interface/app

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter spec

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter spec --growl --watch

.PHONY: test test-w
