install:
	npm install
uninstall:
	@sudo rm -r node_modules
	@sudo npm cache clean

start_core: 
	node apps/smsprep-core/app
start_sms: 
	node apps/sms-interface/app
start_web: 
	node apps/web-interface/app
start_api: 
	node apps/api-interface/app