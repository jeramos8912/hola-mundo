/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------


/**
 * Móodulos internos propios de la aplicación
 */

var clienteMongoDB  = require("./dav/introtativo/repositorio/adaptador/servicios/clienteMongoDB");
var clienteFacebook  = require("./dav/introtativo/repositorio/adaptador/servicios/clienteFacebook");
var clienteApiConnect = require("./dav/introtativo/repositorio/adaptador/servicios/clienteApiConnectDav");
var utils  = require("./dav/introtativo/util/utils");
var rotativo =  require("./dav/introtativo/dominio/rotativo");
var cantidad = 0;
var cantidadnit=0;
var cantidadMonto=0;
var cedula;
var flujo = "";
var montoTransaccion=0;
var contadorMonto=0;

var tipoDocumento=0;
var numeroDocumento;
var tipoDocumentoNit;
//var estados = require("./dav/introtativo/dominio/estados");


// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var momenttz = require('moment-timezone');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();


/**
 * Iniciando obtener credenciales de mongoDB
 */
clienteMongoDB.init(function(err) {
    if (err) {
        console.log("error initializing mongodb: " + utils.JL(err));
        process.exit(1);
    }
});
console.log("app", "cliente MongoDB Iniciado...");

//Iniciar cliente Facebook
clienteFacebook.init(function(err){
    if (err) {
        console.log("error initializing clienteFacebook: " + err);
    }
});
console.log("app", "cliente Facebook Iniciado...");



/*
 * Use your own validation token. Check that the token used in the Webhook
 * setup is the same token used here.
 *
 */
app.get('/webhook', function(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === process.env.VALIDATION_TOKEN) {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});



/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page.
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 *
 */
app.post('/webhook', function (req, res) {

    var data = req.body;
    console.log("Entrando metodo webhook "+JSON.stringify(data));
    // Make sure this is a page subscription
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach(function(pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;

            // Iterate over each messaging event
            pageEntry.messaging.forEach(function(messagingEvent) {
                if (messagingEvent.message) {
                    receivedMessage(messagingEvent);
                } else if (messagingEvent.postback) {
                    receivedPostback(messagingEvent);
                }else{
                    console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                }
            });
        });

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know you've
        // successfully received the callback. Otherwise, the request will time out.
        res.sendStatus(200);
    }
});

/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message'
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
 *
 * For this example, we're going to echo any text that we get. If we get some
 * special keywords ('button', 'generic', 'receipt'), then we'll send back
 * examples of those bubbles to illustrate the special message bubbles we've
 * created. If we receive a message with an attachment (image, video, audio),
 * then we'll simply confirm that we've received the attachment.
 *
 */
function receivedMessage(event) {
    console.log("Entrando metodo webhook " + JSON.stringify(event));
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    var isEcho = message.is_echo;
    var messageId = message.mid;
    var appId = message.app_id;
    var metadata = message.metadata;

    // You may get a text or attachment but not both
    var messageText = message.text;
    var fechaActual;
    var idHash;
    if (!isNaN(messageText)){
        console.log("se esta hasheando este "+ messageText+ "----------------" + JSON.stringify(utils.hash(messageText)));
        if(flujo=="EMPRESA"){
            tipoDocumento='3';
            numeroDocumento=messageText;
            idHash = JSON.stringify(utils.hash(messageText));
            Filtro ={"tipoIdentificacion":tipoDocumento, "numeroIdentificacion":idHash};
            objeto = {};
            console.log("estos son los datos del query"+Filtro);
            clienteMongoDB.buscarXQuery(Filtro, function(err, solicitanteIdSolNit){ 

                if(solicitanteIdSolNit!=null && solicitanteIdSolNit!=undefined)
                {
                    var queryCedula = {tipoIdentificacion: tipoDocumento, numeroIdentificacion: idHash};
                    objeto ={"estado":"CEDULA","idFacebook":senderID};
                    flujo ="";
                    clienteMongoDB.insertarOActualizarestado(queryCedula,objeto,function(err, solicitanteIdSol)
                    {
                        rotativo.seleccionidentificacion(senderID);
                    });
                }
                else
                {
                   cantidadnit = cantidadnit +1; 
                    if(cantidadnit>=2)
                    {

                    rotativo.maximocantidad(senderID); 
                    console.log("CANTIDAD MAYOR O IGUAL A 2 EN NIT");
                        
                    }
                    else
                    {
                            
                    rotativo.empresasi(senderID);
                    console.log("CANTIDAD MENOR  A 2 EN NIT");
                    
                    }   
                }                           
         });

        }else if(flujo=="PERSONA_CON_NEGOCIO"){
                numeroDocumento=messageText;
                idHash = JSON.stringify(utils.hash(messageText));
                Filtro ={"tipoIdentificacion": tipoDocumento, "numeroIdentificacion":idHash};
                objeto = {};
                console.log("Filtro para persona con negocio ------------"+JSON.stringify(Filtro));
                clienteMongoDB.buscarXQuery(Filtro, function(err, solicitanteIdSolCedula){ 
                
                    console.log("Ingreso al estado :"+switchestado+" || solicitanteIdSolCedula :"+ JSON.stringify(solicitanteIdSolCedula, null, 4) + " Angel Santiago Hernandez Solorzano");
                    
                    if(solicitanteIdSolCedula!=null && solicitanteIdSolCedula!=undefined)
                    {
                        objeto ={"estado":"OTP","idFacebook":senderID};

                                           
                        clienteMongoDB.insertarOActualizarestado(Filtro,objeto,function(err, solicitanteIdSol){
                        
                            console.log("|| El usuario "+senderID+" esta en estado: "+solicitanteIdSol.estado+"||");
                            rotativo.envioCodigoOTP(senderID,idHash,tipoDocumento, numeroDocumento);  
                            flujo ="";
                        
                        });
                    }
                    else
                    {
                            cantidad = cantidad+1;    
                                                                                    
                            if(cantidad>=2)
                            {
                                rotativo.maximocantidad(senderID);
                                console.log("CANTIDAD MAYOR O IGUAL A 2 EN CEDULA");

                                
                            }
                            else
                            {
                                rotativo.seleccionidentificacion(senderID);
                                console.log("CANTIDAD MENOR A 2 EN CEDULA"); 
                                
                            }   
                    }                           
            }); 


        }else{

        var switchestado = "";
        var Filtro ={"idFacebook":senderID};
        var objeto = {};

        clienteMongoDB.buscarUsuarioEstado(Filtro, function(err, solicitanteIdSol){ 
        
            console.log("clienteMongoDB.buscarUsuarioEstado "+JSON.stringify(solicitanteIdSol,null,4));
            switchestado = solicitanteIdSol.estado;
            
            switch(switchestado)
                {

                    case "CEDULA" : 
                    idHash = JSON.stringify(utils.hash(messageText));
                    var hashNum = JSON.stringify(utils.hash(numeroDocumento));
                    var filtroPrueba = {"tipoIdentificacion":tipoDocumento,"numeroIdentificacion": numeroDocumento }; 
                    var Filtro ={"tipoIdentificacion":tipoDocumento,"numeroIdentificacion": hashNum };
                    var objeto={};
                    console.log("modelo de filtro"+JSON.stringify(filtroPrueba,null,4));
                    console.log("filtro para bsucarla cedula que pertenezca a aun nit"+JSON.stringify(Filtro,null,4));
                    clienteMongoDB.buscarXQuery(Filtro, function(err, solicitanteIdSolCedula)
                    { 
                        console.log("Ingreso al estado :"+switchestado+" || solicitanteIdSolCedula :"+ JSON.stringify(solicitanteIdSolCedula, null, 4) + " Angel Santiago Hernandez Solorzano");    
                        if(solicitanteIdSolCedula!=null && solicitanteIdSolCedula!=undefined)
                        {   
                            var queryIdRepresentante = {
                                tipoIdentificacion:solicitanteIdSolCedula.tipoIdentificacion, 
                                numeroIdentificacion: solicitanteIdSolCedula.numeroIdentificacion,
                                tipoID_representante: tipoDocumentoNit,
                                numeroID_representante: JSON.stringify(utils.hash(messageText))
                            };
                            console.log("Este queryu trae el nit"+JSON.stringify(queryIdRepresentante,null,4));
                            clienteMongoDB.buscarUsuarioEstado(queryIdRepresentante, function(err, res)
                            {
                                 if(res)
                                 {   
                                    objeto ={"estado":"OTP","idFacebook":senderID};                  
                                    clienteMongoDB.insertarOActualizarestado(Filtro,objeto,function(err, solicitanteIdSol)
                                    {
                                    
                                        console.log("|| El usuario "+senderID+" esta en estado: "+solicitanteIdSol.estado+"||");
                                        rotativo.envioCodigoOTP(senderID,idHash);  
                                    });
                                }
                                else
                                {    

                                    cantidad = cantidad+1;   
                                                                                                
                                        if(cantidad>=2)
                                        {
                                            console.log("|| El usuario "+senderID+" no    existe y quedo en el  estado: "+solicitanteIdSol.estado+"|| cantidad de intentos :"+cantidad);

                                            rotativo.maximocantidad(senderID); 
                                            
                                        }
                                        else
                                        {
                                            
                                            console.log("|| El usuario "+senderID+" no    existe y quedo en el  estado: "+solicitanteIdSol.estado+"|| cantidad de intentos :"+cantidad);
                                                rotativo.seleccionidentificacion(senderID);                            
                                        }   
                                }
                            });
                        } 
                        else
                        {    

                            cantidad = cantidad+1;   
                                                                                        
                                if(cantidad>=2)
                                {
                                    console.log("|| El usuario "+senderID+" no    existe y quedo en el  estado: "+solicitanteIdSol.estado+"|| cantidad de intentos :"+cantidad);

                                    rotativo.maximocantidad(senderID); 
                                    
                                }
                                else
                                {
                                    
                                    console.log("|| El usuario "+senderID+" no    existe y quedo en el  estado: "+solicitanteIdSol.estado+"|| cantidad de intentos :"+cantidad);
                                        rotativo.seleccionidentificacion(senderID);                            
                                }   
                        }
                    }); 
                    break;

                case "OTP":
                    console.log("TIPO Y NUMERO DOCUMENTO ------------"+tipoDocumento+numeroDocumento);
                    var queryEstadoOTP={"idFacebook":senderID, "estado":"OTP"};
                    clienteMongoDB.buscarXQuery(queryEstadoOTP, function(err, ObjInfOTP){
                    if(!err){
                        if(ObjInfOTP){
                            console.log("app.js - buscarClienteXIdUsuarioFBYEstado :"+JSON.stringify(ObjInfOTP, null, 4));

                            //buscamos en la collection sessionChatBots.
                            var queryAutOTP ={"idFacebook":senderID};
                            clienteMongoDB.buscarSessionRotativoXQuery(queryAutOTP, function(err, OautOTP){
                                console.log("app.js - buscarSessionRotativoXQuery - Consultar SessionTokenId:"+JSON.stringify(OautOTP, null, 4));
                                if(!err){
                                    if(OautOTP){

                                        console.log("app.js - buscarSessionRotativoXQuery :"+JSON.stringify(OautOTP, null, 4));
                                        rotativo.enviarMensajeAutenticacionValidarToken(senderID, ObjInfOTP.numeroIdentificacion, OautOTP.sessionTokenId, OautOTP.fechaCreado, messageText, tipoDocumento);
                                    }
                                    else{
                                        console.log("Error - buscarSessionRotativoXQuery - error en consulta:  "+JSON.stringify(err));
                                    }
                                }
                            });
                        }else{

                            console.log("app.js - buscarClienteXIdUsuarioFBYEstado - Cliente No Encontrado.");
                        }
                    }else{
                        console.log("Error - buscarClienteXIdUsuarioFBYEstado - error en consulta:  "+JSON.stringify(err));
                    }
                    });
        
                break;
                        
                case "MONTO" :
                console.log("ENTRE A ESTADO MONTO");

                    var query={"idFacebook":senderID, "estado":"MONTO"};
                    clienteMongoDB.buscarXQuery(query, function(err, objcuenta)
                    {
                        if(!err)
                        {
                            var valoringresado = parseInt(messageText);
                            montoTransaccion = parseInt(messageText);
                            //Ejecutar transaccio[n
                            idHash = JSON.stringify(utils.hash(numeroDocumento));
                            console.log("ENTRE A CONDICION CREDITO DISPONIBLE");
                            rotativo.enviarMensajeTransaccion(senderID,messageText,objcuenta, idHash);
                        } 
                        else
                        {
                            console.log("Error - buscarXQueryCred - error en consulta:  "+JSON.stringify(err));
                        }
                    });                                                  
                break;  

                default : 
                    console.log("El usuario "+senderID+" esta en estado: "+solicitanteIdSol.estado);
                    rotativo.mensajeP(senderID);
                break;
            }
            
        }); 

        }  	
    }else{
        console.log("app.js - actualizarSolicitudesXIdUsuarioFB - Ingreso texto Incorrecto:"+JSON.stringify( null, 4));
        rotativo.mensajeportal(senderID);

        //COLOCAR AQUI MENSAJE DE ERROR PARA QUE SIEMPRE INGRESE NUMEROS

    }
  
}

/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 *
 */
function receivedPostback(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;

    // The 'payload' param is a developer-defined field which is set in a postback
    // button for Structured Messages.
    var payload = event.postback.payload;

    console.log("Received postback for user %d and page %d with payload '%s' " +
        "at %d", senderID, recipientID, payload, timeOfPostback);


    if (payload) {
        // If we receive a text message, check to see if it matches any special
        // keywords and send back the corresponding example. Otherwise, just echo
        // the text we received.
        //recuperamos el payload personalizado para obtener el estado de la conversacion y si el caso el nroIdentificacion
        var arrayPayload = payload.split(",");
        console.log("Payload/=====================" + arrayPayload[0]);
        switch (arrayPayload[0]) {
            case 'INICIO_ROTATIVO':
            	//CAQQ 1
                rotativo.enviarMensajeInicial(senderID);
                cantidad = 0;
                cantidadnit=0;
                tipoDocumentoNit=0;
                tipoDocumento=0;
                cantidadMonto=0;
                break;
            case "EMPRESA"+senderID:
            	//empresa = "0";
                rotativo.empresasi(senderID);
                flujo = "EMPRESA";
                break;
            case "PERSONA_CON_NEGOCIO"+senderID:
                rotativo.seleccionidentificacion(senderID);
                flujo = "PERSONA_CON_NEGOCIO";
                break;
            case "CCIUDADANIA":
                if(tipoDocumento!='3'){
                    tipoDocumento='1';
                    console.log("no cambio el tipo de documento------------------------------");
                } else if (tipoDocumento=='3'){
                    console.log("cambio el tipo de documento---------------------");
                    tipoDocumentoNit='1';
                }
                console.log("tras seleecionar este es el tipo de documento CCIUDADANIA"+tipoDocumento);
                rotativo.ingresonumeroide(senderID);
                break;
            case "CEXTRANJERIA":
                if(tipoDocumento!='3'){
                    tipoDocumento='2';
                    console.log(" no cambio el tipo de documento--------------");
                } else {
                    tipoDocumentoNit='2';
                    console.log("cambio el tipo de documento ------------------")
                }
                console.log("tras seleecionar este es el tipo de documento CEXTRANJERIA"+tipoDocumento);
                rotativo.ingresonumeroide(senderID);
                break;

            case 'CREDITO_ESCOGIDO':
                //Recuperamos los datos de la tarjeta de cred.
                console.log(' ');
                console.log('escogio credito');
                console.log(' ');
                var query = {"tipoIdentificacion":tipoDocumento,"numeroIdentificacion":numeroDocumento,"numeroCredito": {$regex: arrayPayload[2]+"$"}};
                console.log("QUERY DE CREDITO ESCOGIDO"+ query);
                clienteMongoDB.buscarClienteXQuery(query, function(err, credito){
                    if(!err)
                    {
                        var newquery = {"identificacion":arrayPayload[1]};
                        console.log("Saca los datos de la collecion de seesion"+newquery);
                        clienteMongoDB.buscarSessionRotativoXQuery(newquery, function(err, objcuenta)
                        {
                            if(!err)
                            {

                                console.log("EEEEEEEEEEEEEEEEEEesta fue la cuenta "+JSON.stringify(objcuenta));
                                idHash = JSON.stringify(utils.hash(numeroDocumento));
                                var query = {"tipoIdentificacion": tipoDocumento, "numeroIdentificacion":idHash,"numeroCredito": {$regex: arrayPayload[2]+"$" }};
                                var objeto = {idFacebook: senderID, estado:"MONTO", seleccionada:"true"};
                                console.log("------------------------------------------------ CREDITO_ESCOGIDO"+query);
                                clienteMongoDB.insertarOActualizarestadoCred(query,objeto, function(err, actualizado)
                                {
                                    if(!err){
                                        console.log("DEberia estar setteando este valor en el query "+arrayPayload[2]);
                                        var objeto = {"idFacebook":" ", "estado":" ", seleccionada:" ",idProductLoan:""};
                                        var query = {"numeroIdentificacion":idHash, "tipoIdentificacion":tipoDocumento, 'seleccionada': 'false'};

                                        console.log("QUERY PARA BORRAR EL ESTADO DE LOS QUE NO SE SELECCIONARON"+JSON.stringify(query,null,4));
                                        console.log("OBJETO PARA BORRAR EL ESTADO _________________"+JSON.stringify(objeto,null,4));
                                        clienteMongoDB.borrarOActualizarestado(query,objeto,function(err,res){
                                            if(res){
                                                console.log("NOERRROR----------------------------------------------"+JSON.stringify(res,null,4));
                                                rotativo.enviarMensajeConsultarCuentasApiConnect(senderID, idHash, tipoDocumento, arrayPayload[2], objcuenta.access_token);
                                            } else {
                                                console.log("ERROR----------------------------------------------------"+JSON.stringify(err,null,4));
                                            }
                                        });
                                        
                                    }else{
                                        console.log("ERROR AL ACTUALIZAR ESTADO DE SELECCION");
                                    }
                                });
                                //JESUS:
                                //Borrar el idFacebook de los que no se seleccionaron
                                
                                //COLOCAR AQUI CODIGO PARA ACTUALIZAR SELECCION DE TARJETA

                            } else {
                                console.log("Hubo un error buscarSessionRotativoXQuery PAYLOAD: CREDITO_ESCOGIDO");
                            }
                        });
                    } else{
                        console.log("app.js - receivedPostback: Error - buscarClienteXQuery: "+JSON.stringify(err));
                    }
                });
                break;

                case "CONFIRMAR_TRANSACCION":
                cantidadMonto = 0;
                idHash = JSON.stringify(utils.hash(numeroDocumento));
                var query = {"tipoIdentificacion":tipoDocumento, "numeroIdentificacion":idHash, seleccionada:'true', estado:'MONTO'};
                console.log("Confirmo la transaccion para el siguiente credito"+ JSON.stringify(query,null,4));
                 clienteMongoDB.buscarDatosCuenta(query, function(err, resultado)
                 {
                        if(resultado){
                            console.log(resultado);
                            //revisar campos que se envian a enviarMensajeTransaccion
                            console.log("existe una cuenta lista para realizar la transaccion"+ resultado);
                            rotativo.realizarTransaccion(senderID,resultado.numeroIdentificacion,montoTransaccion, resultado);
                        }
                     else {
                        console.log(err);
                    }
                });
                break;
                case "RECHAZAR_TRANSACCION":
                console.log("SE RECHAZO LA TRANSACCION");
                rotativo.enviarMensajeIngreseMonto(senderID);
                cantidadMonto = 0;
                //rotativo.ingresonumeroide(senderID);
                break;
                case "SI_MONTO":
                console.log("AUN CUENTA CON ESTADOS SUFICIENTES "+ contadorMonto);
                rotativo.enviarMensajeIngreseMonto(senderID);
                break;
                case "NO_MONTO":
                    rotativo.mensajeportal(senderID);
                break;

            default:
                console.log("app.js - receivedPostback - El siguietne ESTADO no es valido: "+arrayPayload[0]);
                break;
        }
    }
}


// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function () {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});

/**
 * Captura de excepciones
 */
process.on('uncaughtException', function (err) {
    utils.log("app.js", "UncaughtException: " + err);
    utils.log("app.js", "UncaughtException: " + err.stack);
});










