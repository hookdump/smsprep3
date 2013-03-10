install:
	npm install

uninstall:
	@sudo rm -r node_modules
	@sudo npm cache clean

_core:
	@sudo forever -w start ./apps/smsprep-core/app.js
_sms:
	@sudo forever -w start ./apps/sms-interface/app.js
_web:
	@sudo forever -w start ./apps/web-interface/app.js
_api:
	@sudo forever -w start ./apps/api-interface/app.js

lweb:
	@./logs web

ls:
	@sudo forever list

stopall:
	@sudo forever stopall

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter spec

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter spec --growl --watch

.PHONY: test test-w
