ENV = "development"

help:
	@echo ""
	@echo "smsPREP Building Script"
	@echo "-----------------------"
	@echo ""
	@echo "install: 	Install the required modules"
	@echo "uninstall: 	Clean up the installed modules"

	@echo ""

	@echo "core:		Start the core module"
	@echo "sms:		Start the sms module"
	@echo "web:		Start the web module"
	@echo "api:		Start the api module"
	@echo "bouncy:		Start the listener module"

	@echo ""

	@echo "lcore, lsms, lweb, lapi, lbouncy: Tail the logs in real time"

	@echo ""

	@echo "ls: 		List the running services"
	@echo "stopall: 	Stop all the running services"
	@echo "test: 		Run tests"
	@echo "test-w: 	Run tests in Watch Mode"

install:
	@npm install

uninstall:
	@sudo rm -r node_modules > /dev/null 2>&1
	@npm cache clean > /dev/null 2>&1
	@sudo npm cache clean > /dev/null 2>&1

core:
	@forever -s stop smsprep-core > /dev/null 2>&1
	@NODE_ENV=$(ENV) forever --uid smsprep-core -a -l core.log --minUptime 5000 start ./apps/smsprep-core/app.js
sms:
	@forever -s stop sms-interface > /dev/null 2>&1
	@NODE_ENV=$(ENV) forever  --uid sms-interface -a -l sms.log --minUptime 5000 start ./apps/sms-interface/app.js
web:
	@forever -s stop web-interface > /dev/null 2>&1
	@NODE_ENV=$(ENV) forever  --uid web-interface -a -l web.log --minUptime 5000 start ./apps/web-interface/app.js
api:
	@forever -s stop api-interface > /dev/null 2>&1
	@NODE_ENV=$(ENV) forever  --uid api-interface -a -l api.log --minUptime 5000 start ./apps/api-interface/app.js
bouncy:
	@sudo forever -s stop smsprep-bouncy > /dev/null 2>&1
	@NODE_ENV=$(ENV) sudo forever  --uid smsprep-bouncy -a -l bouncy.log --minUptime 5000 start ./apps/bouncy/app.js

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
lbouncy:
	@echo 'loading bouncy logs...'
	@sudo tail -f -n 0 ~/.forever/bouncy.log

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter spec

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter spec --growl --watch

.PHONY: test test-w
