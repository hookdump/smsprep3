ENV = "development"
INSTANCE = "smsprep"

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
	@echo "web:		Start the web site"
	@echo "api:		Start the api module"
	@echo "scheduler:		Start the scheduler module"
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

deploy_config:
	@echo "Deploying configuration: $(INSTANCE)"
	@cp conf/$(INSTANCE).connections.js conf/connections.js
	@cp conf/$(INSTANCE).services.js conf/services.js
	@cp -r apps/web-interface/views/$(INSTANCE)/* apps/web-interface/views/

core:
	-@forever -s stop $(ENV).smsprep-core > /dev/null 2>&1
	@NODE_ENV=$(ENV) forever --uid $(ENV).smsprep-core -a -l $(ENV).core.log --minUptime 5000 --spinSleepTime 5000 start ./apps/smsprep-core/app.js
	$(if $(findstring $(ENV),"development") , @tail -n 0 -f ~/.forever/development.core.log )
	$(if $(findstring $(ENV),"test") , @tail -n 0 -f ~/.forever/test.core.log )
watch.staging.core:
	deploy staging exec 'tail -f /home/ubuntu/.forever/staging.core.log'
watch.core@eprep:
	deploy eprep.production exec 'tail -f /home/ubuntu/.forever/production.core.log'

sms:
	-@forever -s stop $(ENV).sms-interface > /dev/null 2>&1
	@NODE_ENV=$(ENV) forever  --uid $(ENV).sms-interface -a -l $(ENV).sms.log --minUptime 5000 --spinSleepTime 5000 start ./apps/sms-interface/app.js
	$(if $(findstring $(ENV),"development") , @tail -n 0 -f ~/.forever/development.sms.log )
	$(if $(findstring $(ENV),"test") , @tail -n 0 -f ~/.forever/test.sms.log )
watch.staging.sms:
	deploy staging exec 'tail -f /home/ubuntu/.forever/staging.sms.log'
watch.sms@eprep:
	deploy eprep.production exec 'tail -f /home/ubuntu/.forever/production.sms.log'

web:
	-@forever -s stop $(ENV).web-interface > /dev/null 2>&1
	@NODE_ENV=$(ENV) forever  --uid $(ENV).web-interface -a -l $(ENV).web.log --minUptime 5000 --spinSleepTime 5000 start ./apps/web-interface/app.js
	$(if $(findstring $(ENV),"development") , @tail -n 0 -f ~/.forever/development.web.log )
	$(if $(findstring $(ENV),"test") , @tail -n 0 -f ~/.forever/test.web.log )
watch.staging.web:
	deploy staging exec 'tail -f /home/ubuntu/.forever/staging.web.log'
watch.web@eprep:
	deploy eprep.production exec 'tail -f /home/ubuntu/.forever/production.web.log'

scheduler:
	-@forever -s stop $(ENV).scheduler > /dev/null 2>&1
	@NODE_ENV=$(ENV) forever  --uid $(ENV).scheduler -a -l $(ENV).scheduler.log --minUptime 5000 --spinSleepTime 5000 start ./apps/scheduler/app.js
	$(if $(findstring $(ENV),"development") , @tail -n 0 -f ~/.forever/development.scheduler.log )
	$(if $(findstring $(ENV),"test") , @tail -n 0 -f ~/.forever/test.scheduler.log )
watch.staging.scheduler:
	deploy staging exec 'tail -f /home/ubuntu/.forever/staging.scheduler.log'
watch.scheduler@eprep:
	deploy staging exec 'tail -f /home/ubuntu/.forever/production.scheduler.log'

api:
	-@forever -s stop $(ENV).api-interface > /dev/null 2>&1
	@NODE_ENV=$(ENV) forever  --uid $(ENV).api-interface -a -l $(ENV).api.log --minUptime 5000 --spinSleepTime 5000 start ./apps/api-interface/app.js
	$(if $(findstring $(ENV),"development") , @tail -n 0 -f ~/.forever/development.api.log )
	$(if $(findstring $(ENV),"test") , @tail -n 0 -f ~/.forever/test.api.log )
watch.staging.api:
	deploy staging exec 'tail -f /home/ubuntu/.forever/staging.api.log'
watch.api@eprep:
	deploy production exec 'tail -f /home/ubuntu/.forever/production.api.log'

db.staging:
	mongo alex.mongohq.com:10018/app15779401 -u heroku -p b0031d17596868daa5eb577e5214d9fc
db.production:
	mongo linus.mongohq.com:10093/app15670097 -u heroku -p ff57e846d04b6cb160a02fd121599c33	

db.eprep.staging:
	mongo paulo.mongohq.com:10089/app18672561 -u heroku -p 17a819929bf7f82aef5e696cab335526
db.eprep.production:
	mongo paulo.mongohq.com:10076/app18466651 -u heroku -p d036dec5cfd621324d4cee30eaa6ddaa	

bouncy:
	# $(if $(findstring $(ENV),"development") , @~/servers )
	-@sudo forever -s stop $(ENV).smsprep-bouncy > /dev/null 2>&1
	@sudo NODE_ENV=$(ENV) forever  --uid $(ENV).smsprep-bouncy -a -l bouncy.log --minUptime 5000 --spinSleepTime 5000 start ./apps/bouncy/app.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --growl --reporter spec

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha --growl --reporter min --watch

.PHONY: test test-w
