var col 	= require('cli-color');
var util 	= require('util');

global.log = {
	format: function(s)	{ 
		if (typeof(s) === 'object') {
			return util.inspect(s);
		} else {
			return s; 
		}
	}
	, display: function(s) {
		if (!global.beQuiet) {
			console.log( s );
		}
	}
	, error: 	function(s, errObject) 	{ 
		if (errObject) {
			log.display( col.blackBright( ' *** ERROR: ' ) + col.red.bold( this.format(s) ) ); 
			log.display( col.red( this.format(errObject)) );
		}
	}
	, rabbit: {
		debug:    function(s) 	{ log.display( col.magentaBright( 	"[bus] " + log.format(s) ) ); }
		, info:   function(s) 	{ log.display( col.magentaBright( 	"[bus] " + log.format(s) ) ); }
		, warn:   function(s) 	{ log.display( col.magentaBright( 	"[bus] " + log.format(s) ) ); }
		, error:  function(s) 	{ log.display( col.red(				"[bus] " + log.format(s) ) ); }
	}
	, magenta: 	function(s) 	{ log.display( col.magentaBright( this.format(s) ) ); }
	, warn: 	function(s) 	{ log.display( col.yellow( 		this.format(s) ) ); }
	, notice: 	function(s) 	{ log.display( col.blue( 		this.format(s) ) ); }
	, debug: 	function(s) 	{ log.display( col.blue( 		this.format(s) ) ); }
	, info: 	function(s) 	{ log.display( col.cyan( 		this.format(s) ) ); }
	, success: 	function(s) 	{ log.display( col.green( 		this.format(s) ) ); }

	, route:  	function(method, url) { 
		log.display( col.blackBright( 'request ' + method + ': ' ) + col.greenBright( url ) ); 
	}
	, loading: 	function(module) {
		log.display( col.blackBright( 'loading: ' ) + col.greenBright( module ) ); 	
	}
};