var col 	= require('cli-color');
var util 	= require('util');

// Displays formatted log messages if global.beQuiet is not true

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
			// Do not use display method. This is ALWAYS displayed.
			console.log( col.blackBright( ' *** ERROR: ' ) + col.red.bold( this.format(s) ) ); 
			console.log( col.red( this.format(errObject)) );
		}
	}
	, rabbit: {
		debug:    function(s) 	{ log.display( col.blackBright( 	"[bus] " + log.format(s) ) ); }
		, info:   function(s) 	{ log.display( col.blackBright( 	"[bus] " + log.format(s) ) ); }
		, warn:   function(s) 	{ log.display( col.blackBright( 	"[bus] " + log.format(s) ) ); }
		, error:  function(s) 	{ log.display( col.red(				"[bus] " + log.format(s) ) ); }
	}
	, database: function(s) 	{ log.display( col.blackBright( this.format(s) ) ); }
	, magenta: 	function(s) 	{ log.display( col.magentaBright( this.format(s) ) ); }
	, warn: 	function(s) 	{ log.display( col.yellow( 		this.format(s) ) ); }
	, notice: 	function(s) 	{ log.display( col.blue( 		this.format(s) ) ); }
	, debug: 	function(s) 	{ log.display( col.blue( 		this.format(s) ) ); }
	, info: 	function(s) 	{ log.display( col.cyan( 		this.format(s) ) ); }
	, success: 	function(s) 	{ log.display( col.green( 		this.format(s) ) ); }

	, gray: 	function(s) 	{ log.display( col.blackBright( this.format(s) ) ); }
	, red: 		function(s) 	{ log.display( col.red.bold(  	this.format(s) ) ); }
	, green: 	function(s) 	{ log.display( col.green( 		this.format(s) ) ); }
	, cyan: 	function(s) 	{ log.display( col.cyan( 		this.format(s) ) ); }
	, blue: 	function(s) 	{ log.display( col.blue( 		this.format(s) ) ); }
	, yellow: 	function(s) 	{ log.display( col.yellow( 		this.format(s) ) ); }

	, route:  	function(method, url) { 
		log.display( col.blackBright( 'request ' + method + ': ' ) + col.greenBright( url ) ); 
	}
	, loading: 	function(module) {
		log.display( col.blackBright( 'loading: ' ) + col.greenBright( module ) ); 	
	}
	, apiMethod: 	function(myMethod) {
		log.display( col.blackBright( '[api] ' ) + col.greenBright( myMethod ) ); 	
	}
	, highlight: 	function(prefix, message) {
		log.display( col.blackBright( '[' + prefix + '] ' ) + col.greenBright( message ) ); 	
	}
	, highlightRed: function(prefix, message) {
		log.display( col.blackBright( '[' + prefix + '] ' ) + col.red.bold( message ) ); 	
	}
};