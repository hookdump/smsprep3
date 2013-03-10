install:
	npm install

uninstall:
	@sudo rm -r node_modules
	@sudo npm cache clean

start_core: 
	@sudo forever -w start ./apps/smsprep-core/app.js
start_sms:
	@sudo forever -w start ./apps/sms-interface/app.js
start web: 
	@sudo forever -w start ./apps/web-interface/app.js
start_api: 
	@sudo forever -w start ./apps/api-interface/app.js

ls:
	@sudo forever list

stop_all:
	@sudo forever stopall

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter spec

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter spec --growl --watch

.PHONY: test test-w
