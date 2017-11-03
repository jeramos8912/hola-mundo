/*eslint-env node */
/**
 * Adaptador Cliente a MongoDB.
 **/
var utils = require("../../../util/utils");

/**CONSTANTES**/
//var DB_COLLECTION_DAVICOMPRAS = "solicitudes";


var DB_COLLECTION_CUENTAS = "crediexpressRotativo";
var DB_COLLECTION_CREDITOS = "crediexpressRotativo";
var DB_COLLECTION_SESSION_TOKEN = "session_token";
var DB_COLLECTION_CREDIEXPRESS_ROTATIVO = "crediexpressRotativo";



//var DB_COLLECTION_USUARIO = "usuario";
//var DB_COLLECTION_PRODUCTO = "producto";






/**VARIABLES**/
var mongoCred;
var mongoClient;
var connMongoDB;
var collectionMongoDB;


var clienteMongoDB = exports;


//------------------------------------------------------------------------------
clienteMongoDB.init = function(callback) {
    console.log("Entrando clienteMongoDB.js - init");
    setMongoDBCredentials();
    console.log("clienteMongoDB.js - init url: " + mongoCred.uri);

    mongoClient     = require('mongodb').MongoClient;

    // Connect using MongoClient
    mongoClient.connect(mongoCred.uri, function(err, db) {
        // Create a DB connection.
        connMongoDB = db;
        collectionMongoDB = connMongoDB.collection(DB_COLLECTION_CUENTAS);
    });
    console.log("Saliendo clienteMongoDB.js - init");
    callback();
};


//------------------------------------------------------------------------------
function setMongoDBCredentials() {

    //Parse the process.env for the port and host that we've been assigned
    if (process.env.VCAP_SERVICES) {
        // Running on Bluemix. Parse the port and host that we've been assigned.
        var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
        // Also parse Mon settings.
        mongoCred = vcapServices['compose-for-mongodb'][0]['credentials'];
    }else{
        //TODO manejar el error.
        utils.log("clienteMongoDB.js - setMongoDBCredentials","Error al recuperar las credenciales del servicio de MongoDB");
    }
}

/*****++++++++++++++++++++++++++++++++++++METODOS NUEVOS+++++++++++++++++++++++++++++++++++++++++++++++++++*****/

clienteMongoDB.buscarXQuery = function(query, callback) {
    console.log("clienteMongoDB.js - buscarXQuery: Query: CAQQ: "+ JSON.stringify(query,null,4));
    var collectionCuentasRotativo = connMongoDB.collection(DB_COLLECTION_CUENTAS);
    collectionCuentasRotativo.findOne(query,callback);
};

clienteMongoDB.buscarXQueryCred = function(query, callback) {
    console.log("clienteMongoDB.js - buscarDaviComprasXQuery: Query: CAQQ: "+ JSON.stringify(query,null,4));
    var collectionCredRotativo = connMongoDB.collection(DB_COLLECTION_CREDITOS);
    collectionCredRotativo.findOne(query,callback);
};

clienteMongoDB.buscarTipoCuentaXQuery = function(query, callback){
    console.log("clienteMongoDB.js -buscarTipoCuentaXQuery: Query: "+JSON.stringify(query,null,4));
    var collectionCrediExpress = connMongoDB.collection(DB_COLLECTION_CREDIEXPRESS_ROTATIVO);
    collectionCrediExpress.findOne(query,callback);
}
clienteMongoDB.insertarOActualizarestado = function(filtro, actualizacion, callback) {
    console.log(filtro);
    console.log(actualizacion);
    var collectionCuentasRotativo = connMongoDB.collection(DB_COLLECTION_CUENTAS);
    collectionMongoDB.updateMany(filtro, {$set: actualizacion}, callback);
};

clienteMongoDB.buscarNumeroIdentificacion = function(query, callback) {
    console.log("clienteMongoDB.js - buscarNumeroIdentificacion: Query: "+ JSON.stringify(query,null,4));
    var collectionCreditoRotativo = connMongoDB.collection(DB_COLLECTION_CREDIEXPRESS_ROTATIVO);
    collectionCreditoRotativo.findOne(query, callback);
};

clienteMongoDB.insertarOActualizarestadoCred = function(filtro, actualizacion, callback) {
    var collectionCredRotativo = connMongoDB.collection(DB_COLLECTION_CREDITOS);
    collectionCredRotativo.updateMany(filtro, {$set: actualizacion}, callback);
};

clienteMongoDB.borrarOActualizarestado = function(filtro, actualizacion, callback) {
    console.log("clienteMongoDB.js borrarOActualizarestadoCred");
    var collectionCredRotativo = connMongoDB.collection(DB_COLLECTION_CREDIEXPRESS_ROTATIVO);
    collectionCredRotativo.updateMany(filtro, {$unset: actualizacion}, callback);
};

clienteMongoDB.buscarUsuarioEstado = function(query, callback) {
    console.log("clienteMongoDB.js - buscarContratosXQuery: Query: "+ JSON.stringify(query,null,4));
    var collectionCuentasRotativo = connMongoDB.collection(DB_COLLECTION_CUENTAS);
    collectionCuentasRotativo.findOne(query, callback);
};

clienteMongoDB.buscarNitEmpresa = function(query, callback) {
    console.log("clienteMongoDB.js - buscarNitQuery: Query: "+ JSON.stringify(query,null,4));
    var collectionCuentasRotativo = connMongoDB.collection(DB_COLLECTION_CREDIEXPRESS_ROTATIVO);
    collectionCuentasRotativo.findOne(query, callback);
};

clienteMongoDB.insertarOActualizarSession = function(filtro,  actualizacion, callback) {
    console.log("clienteMongoDB.js - insertarOActualizarSession filtro : "+ JSON.stringify(filtro,null,4));
    var collectionSessionRotativo = connMongoDB.collection(DB_COLLECTION_SESSION_TOKEN);
    collectionSessionRotativo.replaceOne(filtro, actualizacion, {upsert: true}, callback);
};

clienteMongoDB.borrarOActualizarSession = function(filtro, callback) {
    console.log("clienteMongoDB.js - insertarOActualizarSession filtro : "+ JSON.stringify(filtro,null,4));
    var collectionSessionRotativo = connMongoDB.collection(DB_COLLECTION_SESSION_TOKEN);
    collectionSessionRotativo.deleteOne(filtro, callback);
};

clienteMongoDB.buscarSessionRotativoXQuery = function(query, callback) {
    console.log("clienteMongoDB.js - buscarContratosXQuery: Query: "+ JSON.stringify(query,null,4));
    var collectionSessionRotativo = connMongoDB.collection(DB_COLLECTION_SESSION_TOKEN);
    collectionSessionRotativo.findOne(query, callback);
};

clienteMongoDB.buscarClienteXQueryContador = function(query,index, callbackRes) {
    console.log("clienteMongoDB.js - buscarClienteXQueryContador Query: "+ JSON.stringify(query, null, 4));
    console.log("clienteMongoDB.js - buscarClienteXQueryIndex Query: "+ index);
    var collectionCreditosRotativo = connMongoDB.collection(DB_COLLECTION_CREDITOS);
    collectionCreditosRotativo.findOne(query, function (err, resp) {
        if(!err){
            if(resp){
                callbackRes(null, resp, index);
            }else{
                callbackRes(null, null, index);
            }
        }else{
            callbackRes(err, null, index);
        }

    });
};

clienteMongoDB.buscarCreditos = function(query,callback){
    console.log("clienteMongoDB.js - buscarCreditos");
    var collectionCuentasRotativo = connMongoDB.collection(DB_COLLECTION_CREDIEXPRESS_ROTATIVO);
    collectionCuentasRotativo.find(query, callback);
}

clienteMongoDB.buscarDatosCuenta = function(query,callback){
    console.log("clienteMongoDB.js - buscarDatosCuenta");
    var collectionCuentasRotativo = connMongoDB.collection(DB_COLLECTION_CREDIEXPRESS_ROTATIVO);
    collectionCuentasRotativo.findOne(query, callback);
}

clienteMongoDB.buscarClienteXQueryContadorCuentas = function(query,index, callbackRes) {
    console.log("clienteMongoDB.js - buscarClienteXQueryContador Query: "+ JSON.stringify(query, null, 4));
    console.log("clienteMongoDB.js - buscarClienteXQueryIndex Query: "+ index);
    var collectionCuentasRotativo = connMongoDB.collection(DB_COLLECTION_CUENTAS);
    collectionCuentasRotativo.findOne(query, function (err, resp) {
        if(!err){
            if(resp){
                callbackRes(null, resp, index);
            }else{
                callbackRes(null, null, index);
            }
        }else{
            callbackRes(err, null, index);
        }

    });
};

clienteMongoDB.buscarClienteXQuery = function(query, callback) {
    console.log("clienteMongoDB.js - buscarClienteXQuery: Query: "+ JSON.stringify(query, null, 4));
    var collectionCreditosRotativo = connMongoDB.collection(DB_COLLECTION_CREDITOS);
    collectionCreditosRotativo.findOne(query, callback);
};

clienteMongoDB.buscarClienteXQueryCuentas = function(query, callback) {
    console.log("clienteMongoDB.js - buscarClienteXQuery: Query: "+ JSON.stringify(query, null, 4));
    var collectionCuentasRotativo = connMongoDB.collection(DB_COLLECTION_CUENTAS);
    collectionCuentasRotativo.findOne(query, callback);
};
