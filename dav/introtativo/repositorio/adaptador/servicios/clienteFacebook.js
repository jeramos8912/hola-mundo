

var request = require('request');


/**CONSTANTES**/
var URL_FB_MSGS = 'https://graph.facebook.com/v2.6/me/messages';
var URL_FB_USER = 'https://graph.facebook.com/v2.6/';

// App Secret can be retrieved from the App Dashboard
var APP_SECRET;
// Arbitrary value used to validate a webhook
var VALIDATION_TOKEN;
// Generate a page access token for your page from the App Dashboard
var PAGE_ACCESS_TOKEN;
// URL where the app is running (include protocol). Used to point to scripts and 
// assets located at this address. 
var SERVER_URL;

var clienteFacebook = exports;



/**
 * Metodo donde se parametrizan las credenciales desde el env
 */
var set_app_vars = function(callback) {
  if(process.env.APP_SECRET && process.env.VALIDATION_TOKEN && process.env.PAGE_ACCESS_TOKEN && process.env.SERVER_URL) {
  	APP_SECRET = process.env.APP_SECRET;
  	VALIDATION_TOKEN = process.env.VALIDATION_TOKEN;
  	PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
  	SERVER_URL = process.env.SERVER_URL;
  	console.log("clienteFacebook.js - set_app_vars - Se obtuvieron las variables de entorno: " 
  		+ APP_SECRET+", "+ VALIDATION_TOKEN+", "+PAGE_ACCESS_TOKEN+", "+SERVER_URL);
  	callback();
  } else {
  	console.log("clienteFacebook.js - set_app_vars", "No se pudo obtener las credenciales para Facebook desde las variables de entorno");
  	callback("ERROR");
  }
};


//Inicializando credenciales
clienteFacebook.init = function(callback){
	set_app_vars(callback);
};


//------------------------------------------------------------------------------
clienteFacebook.obtenerPerfilUsuario = function(userId, callback) {
    console.log("clienteFacebook.js - obtenerPerfilUsuario: Id Usuario: "+ userId);
    var url_fb_user = URL_FB_USER +userId+"?fields=first_name,last_name&access_token="+PAGE_ACCESS_TOKEN;
	request({
	    uri: url_fb_user,
		headers: {'accept': 'application/json',
				  'content-Type': 'application/json'
				  },	    
	    method: 'GET'	
	},callback);
};


//------------------------------------------------------------------------------
clienteFacebook.enviarMensaje = function(messageData, callback) {
      console.log("clienteFacebook.js - enviarMensaje: Mensaje a Enviar a FB: "+ JSON.stringify(messageData,null,4));
	  request({
	    uri: URL_FB_MSGS,
	    qs: { access_token: PAGE_ACCESS_TOKEN },
	    method: 'POST',
	    json: messageData	
	  },callback);   
};

clienteFacebook.APP_SECRET = APP_SECRET;
clienteFacebook.PAGE_ACCESS_TOKEN = PAGE_ACCESS_TOKEN;
clienteFacebook.VALIDATION_TOKEN = VALIDATION_TOKEN;
clienteFacebook.SERVER_URL = SERVER_URL;
