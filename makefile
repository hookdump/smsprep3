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
	-@forever -s stop $(ENV).smsprep-core > /dev/null 2>&1
	@NODE_ENV=$(ENV) forever --uid $(ENV).smsprep-core -a -l $(ENV).core.log --minUptime 5000 --spinSleepTime 5000 start ./apps/smsprep-core/app.js
	$(if $(findstring $(ENV),"development") , @tail -n 0 -f ~/.forever/development.core.log )

sms:
	-@forever -s stop $(ENV).sms-interface > /dev/null 2>&1
	@NODE_ENV=$(ENV) forever  --uid $(ENV).sms-interface -a -l $(ENV).sms.log --minUptime 5000 --spinSleepTime 5000 start ./apps/sms-interface/app.js
	$(if $(findstring $(ENV),"development") , @tail -n 0 -f ~/.forever/development.sms.log )

web:
	-@forever -s stop $(ENV).web-interface > /dev/null 2>&1
	@NODE_ENV=$(ENV) forever  --uid $(ENV).web-interface -a -l $(ENV).web.log --minUptime 5000 --spinSleepTime 5000 start ./apps/web-interface/app.js
	$(if $(findstring $(ENV),"development") , @tail -n 0 -f ~/.forever/development.web.log )

api:
	-@forever -s stop $(ENV).api-interface > /dev/null 2>&1
	@NODE_ENV=$(ENV) forever  --uid $(ENV).api-interface -a -l $(ENV).api.log --minUptime 5000 --spinSleepTime 5000 start ./apps/api-interface/app.js
	$(if $(findstring $(ENV),"development") , @tail -n 0 -f ~/.forever/development.api.log )

bouncy:
	-@sudo forever -s stop $(ENV).smsprep-bouncy > /dev/null 2>&1
	@sudo NODE_ENV=$(ENV) forever  --uid $(ENV).smsprep-bouncy -a -l bouncy.log --minUptime 5000 --spinSleepTime 5000 start ./apps/bouncy/app.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter spec

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter spec --growl --watch

.PHONY: test test-w
