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
	, error: 	function(s) 	{ console.log( col.red.bold( 	this.format(s) ) ); }
	, warn: 	function(s) 	{ console.log( col.yellow( 		this.format(s) ) ); }
	, notice: 	function(s) 	{ console.log( col.blue( 		this.format(s) ) ); }
	, info: 	function(s) 	{ console.log( col.cyan( 		this.format(s) ) ); }
	, success: 	function(s) 	{ console.log( col.green( 		this.format(s) ) ); }
	, route:  	function(method, url) { 
		console.log( col.blackBright( 'request ' + method + ': ' ) + col.greenBright( url ) ); 
	}
	, loading: 	function(module) {
		console.log( col.blackBright( 'loading: ' ) + col.greenBright( module ) ); 	
	}
};