install:
	npm install

uninstall:
	@sudo rm -r node_modules
	@sudo npm cache clean

core:
	@sudo forever -s stop smsprep-core
	@sudo forever --uid smsprep-core -a -l core.log start ./apps/smsprep-core/app.js
	@make lcore
sms:
	@sudo forever -s stop sms-interface
	@sudo forever --uid sms-interface -a -l sms.log start ./apps/sms-interface/app.js
	@make lsms
web:
	@sudo forever -s stop web-interface
	@sudo forever --uid web-interface -a -l web.log start ./apps/web-interface/app.js
	@make lweb
api:
	@sudo forever -s stop api-interface
	@sudo forever --uid api-interface -a -l api.log start ./apps/api-interface/app.js
	@make lapi

lcore:
	@echo 'loading core logs...'
	@tail -f ~/.forever/core.log
lsms:
	@echo 'loading sms logs...'
	@tail -f ~/.forever/sms.log
lweb:
	@echo 'loading web logs...'
	@tail -f ~/.forever/web.log
lapi:
	@echo 'loading api logs...'
	@tail -f ~/.forever/api.log

ls:
	@sudo forever list

stopall:
	@sudo forever stopall

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter spec

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter spec --growl --watch

.PHONY: test test-w
