help:
	@echo ""
	@echo "smsPREP Building Script"
	@echo "-----------------------"
	@echo ""
	@echo "install: 	Install the required modules"
	@echo "uninstall: 	Clean up the installed modules"

	@echo ""

	@echo "core:	Start the core module"
	@echo "sms:		Start the sms module"
	@echo "web:		Start the web module"
	@echo "api:		Start the api module"

	@echo ""

	@echo "lcore, lsms, lweb, lapi: Tail the logs in real time"

	@echo ""

	@echo "ls: 		List the running services"
	@echo "stopall: 	Stop all the running services"
	@echo "test: 		Run tests"
	@echo "test-w: 	Run tests in Watch Mode"

install:
	@npm install

uninstall:
	@rm -r node_modules
	@npm cache clean

core:
	@forever -s stop smsprep-core
	@forever --uid smsprep-core -a -l core.log -w --minUptime 5000 start ./apps/smsprep-core/app.js
	@make lcore
sms:
	@forever -s stop sms-interface
	@forever --uid sms-interface -a -l sms.log -w --minUptime 5000 start ./apps/sms-interface/app.js
	@make lsms
web:
	@forever -s stop web-interface
	@forever --uid web-interface -a -l web.log -w --minUptime 5000 start ./apps/web-interface/app.js
	@make lweb
api:
	@forever -s stop api-interface
	@forever --uid api-interface -a -l api.log -w --minUptime 5000 start ./apps/api-interface/app.js
	@make lapi

lcore:
	@echo 'loading core logs...'
	@tail -f -n 0 ~/.forever/core.log
lsms:
	@echo 'loading sms logs...'
	@tail -f -n 0 ~/.forever/sms.log
lweb:
	@echo 'loading web logs...'
	@tail -f -n 0 ~/.forever/web.log
lapi:
	@echo 'loading api logs...'
	@tail -f -n 0 ~/.forever/api.log

ls:
	@forever list

stopall:
	@forever stopall

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter spec

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter spec --growl --watch

.PHONY: test test-w
