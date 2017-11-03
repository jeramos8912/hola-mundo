

var request = require('request');


/**CONSTANTES**/

var clienteApiConnectDav = exports;


/**Metodo proxy para invocar metodos POST en API connect de Davivienda (invocar APIs - metodo POST)**/
clienteApiConnectDav.ejecutarPOST = function(resourceURI,bodyJson, callback) {
    console.log("clienteApiConnectDav.js - ejecutarPOST: URI: "+ resourceURI);
    console.log("clienteApiConnectDav.js - ejecutarPOST: bodyJson: "+ JSON.stringify(bodyJson, null, 4));
    request({
        uri: resourceURI,
        headers: {'accept': 'application/json',
            'content-Type': 'application/json',
            'X-IBM-Client-Id': process.env.X_IP_CLIENT
        },
        method: 'POST',
        json: bodyJson
    },callback);
};

/**Metodo proxy para invocar metodos POST en API connect de Davivienda (invocar APIs - metodo POST)**/
clienteApiConnectDav.ejecutarPOSTWwwFormUrlEncoded = function(resourceURI,body, callback) {
    console.log("clienteApiConnectDav.js - ejecutarPOSTWwwFormUrlEncoded: URI: "+ resourceURI);
    console.log("clienteApiConnectDav.js - ejecutarPOSTWwwFormUrlEncoded: body: "+ JSON.stringify(body, null, 4));
    request({
        uri: resourceURI,
        headers: {'accept': 'application/json',
            'content-type' : 'application/x-www-form-urlencoded',
            'X-IBM-Client-Id': process.env.X_IP_CLIENT
        },
        method: 'POST',
        body: body
    },callback);
};

/**Metodo proxy para invocar metodos GET en API connect de Davivienda (invocar APIs - metodo GET)**/
clienteApiConnectDav.ejecutarGET = function(resourceURI, access_token, callback) {
    console.log("clienteApiConnectDav.js - ejecutarPOSTWwwFormUrlEncoded: URI: "+ resourceURI);
    console.log("clienteApiConnectDav.js - ejecutarGET "+access_token);
    request({
        uri: resourceURI,
        headers: {'accept': 'application/json',
            'content-type' : 'application/json',
            'X-IBM-Client-Id': process.env.X_IP_CLIENT,
            'APIm-Debug': 'true',
            'Authorization': 'Bearer ' +access_token
        },
        method: 'GET'
    },callback);
};

clienteApiConnectDav.ejecutarPOSTTransaccion= function(resourceURI, bodyJson ,access_token, callback) {
    console.log("clienteApiConnectDav.js - ejecutarPOSTActivarTc: URI: "+ resourceURI);
    request({
        uri: resourceURI,
        headers: {'accept': 'application/json',
            'content-type' : 'application/json',
            'X-IBM-Client-Id': process.env.X_IP_CLIENT,
            'Authorization': 'Bearer ' +access_token
        },
        method: 'POST',
        json: bodyJson
    },callback);
};

/**Metodo proxy para invocar metodos POST para activar tarjeta en API connect de Davivienda (invocar APIs - metodo POTS)**/
clienteApiConnectDav.ejecutarPOSTActivarTc= function(resourceURI, access_token, callback) {
    console.log("clienteApiConnectDav.js - ejecutarPOSTActivarTc: URI: "+ resourceURI);
    request({
        uri: resourceURI,
        headers: {'accept': 'application/json',
            'content-type' : 'application/json',
            'X-IBM-Client-Id': process.env.X_IP_CLIENT,
            'Authorization': 'Bearer ' +access_token
        },
        method: 'POST'
    },callback);
};
