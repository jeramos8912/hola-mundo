/**
 * Utilidades JS.
**/


var utils = exports;

//------------------------------------------------------------------------------
utils.log = function(modulo, message) {
    console.log(modulo + ": " + message); 
};

//------------------------------------------------------------------------------
utils.JS = function(object) { return JSON.stringify(object); };
utils.JL = function(object) { return JSON.stringify(object, null, 4); };
utils.hashCode = function(object) {
		var hash = 0;
		var c;
		if (object.length === 0) {
			return hash;
		}
		
		for(var i = 0; i < object.length; i++) {
			c = object.charCodeAt(i);
			hash = ((hash << 5) - hash) + c;
			hash = hash & hash;
		}
		
		return hash;
};

utils.hash = function(object) {
	var hash = 1;
	
	hash = hash * 31 + utils.hashCode(object);
	console.log(hash);
	
	return hash;
};