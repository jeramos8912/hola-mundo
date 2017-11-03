var clienteFacebook  = require("../repositorio/adaptador/servicios/clienteFacebook");
 var clienteMongoDB  = require("../repositorio/adaptador/servicios/clienteMongoDB");
 var clienteApiConnect = require("../repositorio/adaptador/servicios/clienteApiConnectDav");
 var bodyParser = require('body-parser');
 var momenttz = require('moment-timezone');
 var fechaActual = momenttz().tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss");	
 	var estados = 3;
 	var cantidad = 0;
 	var cuerpoBotones = []; 
 	var productos = []; 
 	var columna = [];
    var contadorIntentos = 0;
    var contadorMonto = 0;


var rotativo = exports;


/*Inicio de codigo nuevo*/
rotativo.enviarMensajeInicial = function(recipientId) {
  	  console.log("rotativo.js - enviarMensajeInicial - Usuario Id FB: "+recipientId);
      //invocamos a facebook para obtener la informacion del perfil del usuario.
	  clienteFacebook.obtenerPerfilUsuario(recipientId, function(error, response, bodyPerfil){
	  	if(!error && response.statusCode == 200){
	      	  console.log("rotativo.js - enviarMensajeInicial - obtenerPerfilUsuario en Facebook: La respuesta es: "+bodyPerfil);
	      	  var res = JSON.parse(bodyPerfil);
			  var messageData2 = {
			    recipient: {
			      id: recipientId
			    },
			    message: {
				      text: "Hola "+res.first_name+", bienvenido a este nuevo canal donde podrá realizar el uso de su Crediexpress Rotativo Pyme",
				      metadata: "DEVELOPER_DEFINED_METADATA"
				    }
			     };
                var consulta = {"idFacebook" : recipientId};
                var accion = {"estado" : "", "seleccionada" : "","idFacebook":"",idProductLoan:""};
                clienteMongoDB.borrarOActualizarestado(consulta, accion, function(err, res){
                    if(!err){
                        console.log("-----------------------------Actualización exitosa----------------------------");
                    }
                        else{
                            console.log("-----------------------------Error en la actualización----------------------------");
                        }
                  });
                var consulta = {idFacebook: recipientId};
                clienteMongoDB.borrarOActualizarSession(consulta, function(err, res){
                if(!err){
                        console.log("-----------------------------Actualización exitosa----------------------------");
                } else{
                console.log("-----------------------------Error en la actualización----------------------------");
                }
                });  
			  clienteFacebook.enviarMensaje(messageData2, function (error, response, body) {
                  if (!error) {
                      console.log("rotativo.js - enviarMensajeTextoIngresado - Mensaje 2: la respuesta es: " + JSON.stringify(body, null, 4));
                      rotativo.decisionempresa(recipientId);
                  } else {

                  }
              });
        }else{
            console.log("rotativo.js - enviarMensajeInicial - obtenerPerfilUsuario FB: Failed calling Send API: " + JSON.stringify(error, null, 4));
        }
      });
};

rotativo.decisionempresa = function(recipientId) {
    
                  var messageData = {
                    recipient: {
                        id: recipientId
                    },
                    message: {
                        attachment: {
                            type: "template",
                            payload: {
                                template_type: "button",
                                text: "Usted es ?",
                                buttons:[{
                                    type: "postback",
                                    title: "Empresa   ",
                                    payload: "EMPRESA"+recipientId,
                                },{
                                    type: "postback",
                                    title: "Persona con negocio",
                                    payload: "PERSONA_CON_NEGOCIO"+recipientId,
                                }]
                            }
                        }
                    }
                };

                clienteFacebook.enviarMensaje(messageData, function(error2do, response2do, body2do){
                    if(!error2do && response2do.statusCode == 200){
                        console.log("rotativo.js - enviarMensaje2doSaberrotativo - Mensaje 1: la respuesta es: "+JSON.stringify(body2do, null, 4));
                    }else{
                        console.log("rotativo.js - enviarMensaje2doSaberrotativo - Mensaje 1: Failed calling Send API: "
                            +JSON.stringify(error2do,null,4));
                        console.log("rotativo.js - enviarMensaje2doSaberrotativo - Mensaje 1: Failed calling Send API: "
                            +JSON.stringify(response2do,null,4));
                    }


            });
};

rotativo.empresasi = function(recipientId) {

    console.log("rotativo.js - empresasi - Usuario Id FB: "+recipientId);
    //invocamos a facebook para obtener la informacion del perfil del usuario.
    clienteFacebook.obtenerPerfilUsuario(recipientId, function(error, response, bodyPerfil){

        if(!error && response.statusCode == 200){
            console.log("rotativo.js - empresasi - obtenerPerfilUsuario en Facebook: La respuesta es: "+bodyPerfil);
            var res = JSON.parse(bodyPerfil);
            var messageData2 = {
                recipient: {
                    id: recipientId
                },
                message: {
                    text: "Por favor ingrese el NIT de su empresa",
                    metadata: "DEVELOPER_DEFINED_METADATA"
                }
            };
            clienteFacebook.enviarMensaje(messageData2, function (error, response, body) {
                if (!error) {
                    console.log("rotativo.js - enviarMensajeTextoIngresado - Mensaje 2: la respuesta es: " + JSON.stringify(body, null, 4));
                    //rotativo.decisionempresaexiste(recipientId);
                } else {

                }
            });
        }else{
            console.log("rotativo.js - empresasi - obtenerPerfilUsuario FB: Failed calling Send API: " + JSON.stringify(error, null, 4));
        }

	

    });

};


rotativo.seleccionidentificacion = function(recipientId) {
    
	console.log("rotativo.js - enviarMensaje2doSaberrotativo - Usuario Id FB: "+recipientId);
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "Por favor seleccione su tipo de identificación :",
                    buttons:[{
                        type: "postback",
                        title: "CEDULA CIUDADANIA",
                        payload: "CCIUDADANIA"
                    },{
                        type: "postback",
                        title: "CEDULA EXTRANJERIA",
                        payload: "CEXTRANJERIA"
                    }]
                }
            }
        }
    };

	clienteFacebook.enviarMensaje(messageData, function(error2do, response2do, body2do){
        if(!error2do && response2do.statusCode == 200){
            console.log("rotativo.js - enviarMensaje2doSaberrotativo - Mensaje 1: la respuesta es: "+JSON.stringify(body2do, null, 4));
        }else{
            console.log("rotativo.js - enviarMensaje2doSaberrotativo - Mensaje 1: Failed calling Send API: "
                +JSON.stringify(error2do,null,4));
            console.log("rotativo.js - enviarMensaje2doSaberrotativo - Mensaje 1: Failed calling Send API: "
                +JSON.stringify(response2do,null,4));
        	}
    	});
};



rotativo.ingresonumeroide = function(recipientId) {

    console.log("rotativo.js - ingresonumeroide - Usuario Id FB: "+recipientId);

    //invocamos a facebook para obtener la informacion del perfil del usuario.
    clienteFacebook.obtenerPerfilUsuario(recipientId, function(error, response, bodyPerfil){
        if(!error && response.statusCode == 200){
            console.log("rotativo.js - ingresonumeroide - obtenerPerfilUsuario en Facebook: La respuesta es: "+bodyPerfil);
            var res = JSON.parse(bodyPerfil);
            var messageData2 = {
                recipient: {
                    id: recipientId
                },
                message: {
                    text: "Ingrese su número de identificación",
                    metadata: "DEVELOPER_DEFINED_METADATA"
                }
            };

            clienteFacebook.enviarMensaje(messageData2, function (error, response, body) {
                if (!error) {
                    console.log("rotativo.js - enviarMensajeTextoIngresado - Mensaje 2: la respuesta es: " + JSON.stringify(body, null, 4));
                    //rotativo.validacionide(recipientId);
                } else {

                }
            });
        }else{
            console.log("rotativo.js - ingresonumeroide - obtenerPerfilUsuario FB: Failed calling Send API: " + JSON.stringify(error, null, 4));
        }
    });

};


rotativo.validacionide = function(recipientId) {

    console.log("rotativo.js - validacionide - Usuario Id FB: "+recipientId);

    //invocamos a facebook para obtener la informacion del perfil del usuario.
    clienteFacebook.obtenerPerfilUsuario(recipientId, function(error, response, bodyPerfil){
        if(!error && response.statusCode == 200){
            console.log("rotativo.js - validacionide - obtenerPerfilUsuario en Facebook: La respuesta es: "+bodyPerfil);
            var res = JSON.parse(bodyPerfil);
            var messageData2 = {
                recipient: {
                    id: recipientId
                },
                message: {
                    text: "Ingrese su numero  de identificacion",
                    metadata: "DEVELOPER_DEFINED_METADATA"
                }
            };

            clienteFacebook.enviarMensaje(messageData2, function (error, response, body) {
                if (!error) {
                    console.log("rotativo.js - enviarMensajeTextoIngresado - Mensaje 2: la respuesta es: " + JSON.stringify(body, null, 4));
                    //rotativo.enviocodigova(recipientId);
                } else {

                }
            });
        }else{
            console.log("rotativo.js - validacionide - obtenerPerfilUsuario FB: Failed calling Send API: " + JSON.stringify(error, null, 4));
        }
    });
};


/**
 *  ASHS 08/0/17
 *  
 *  Metodo que da inicio a la generacion del metodo OTP el cual es generado desde el mmetodo a api Connect, el ual es llamado en la linea N°344,
 *  desde este lado se envia como parametro el documento.
 */

rotativo.envioCodigoOTP = function(recipientId,identificacion, tipoDocumento, numeroDocumento) {
        contadorIntentos = 0;
        var documentoUse  = identificacion;
        var rqGenerarOTP = {"typeDocument": '0'+tipoDocumento, "numberDocument":numeroDocumento};
        var resourceURL = process.env.API_CATALOG_URL+"/otp-sec/v1/generate";
        clienteApiConnect.ejecutarPOST(resourceURL, rqGenerarOTP, function(err, resGenerarOTP){
            console.log("resGenerarOTPresGenerarOTPresGenerarOTPresGenerarOTPresGenerarOTPresGenerarOTPresGenerarOTP");
            console.log( JSON.stringify(resGenerarOTP));
        if(!err && resGenerarOTP.statusCode == 200){

            clienteFacebook.obtenerPerfilUsuario(recipientId, function(error, response, bodyPerfil){

            if(!error)
            {
                if(response.statusCode == 200)
                {
                    console.log("rotativo.js - enviocodigova - obtenerPerfilUsuario en Facebook: La respuesta es: "+bodyPerfil);
                    var res = JSON.parse(bodyPerfil);
                    var messageData2 = {
                    recipient: {
                    id: recipientId
                    },
                    message: {
                    text: "Hemos enviado un codigo de verificacion a su celular, por favor ingreselo",
                    metadata: "DEVELOPER_DEFINED_METADATA"
                    }
                    };

                    clienteFacebook.enviarMensaje(messageData2, function (error, response, body) {

                    });
                }
            }else{
            console.log("rotativo.js - enviocodigova - obtenerPerfilUsuario FB: Failed calling Send API: " + JSON.stringify(error, null, 4));
            }
             });

            var filtro = {"idFacebook": recipientId};
            var queryOTP = {idFacebook:recipientId, identificacion:identificacion, sessionTokenId:resGenerarOTP.body.sessionTokenId, fechaCreado: fechaActual};

            clienteMongoDB.insertarOActualizarSession(filtro, queryOTP, function(err, data){
            if(!err)
            {
            console.log("ASHS 08/08/17 Resultado al insertar y actualizar los Cliente Actualizado (Data): "+JSON.stringify(data, null, 4));
            //rotativo.capturaDatosOtp(resGenerarOTP.body.sessionTokenId,identificacion);
            }
        });

        }else{
        console.log("activacionTC.clienteApiConnect - generarOTP - Error: "+JSON.stringify(err));
            rotativo.enviarMensajeErrorTransaccion(recipientId);
        }
        });  
};


rotativo.capturaDatosOtp= function(token_usuario,CodigoOtp)
{
	console.log(" ASHS 08/08/17  Ingreso al meotdo capturaDatosOtp ");
	

	var query = {usuario_fb:recipientId};
	clienteMongoDB.buscarSessionRotativoXQuery(query,function(err,sesionOTP)
	{
		
		 var rqValidarOTP = "grant_type=password&client_id="+process.env.X_IP_CLIENT+"&scope=review&username="+token_usuario+"&password="+CodigoOtp;
		 var resourceURLvalOTP = process.env.API_CATALOG_URL+"/oauth2-provider/type2/v1/token";
					
				 clienteApiConnect.ejecutarPOSTWwwFormUrlEncoded(resourceURLvalOTP, rqValidarOTP, function(err, resValidarOTP)
				 {
				
					 var resultOtp = JSON.stringify(resValidarOTP, null, 4);
					 console.log(" ASHS 08/08/17  respuesta del servicio ejecutarPOSTWwwFormUrlEncoded "+resultOtp);
				 
					 var queryNoSolicitud ={"usuario_fb":recipientId};
					 var validacion ={"fecha_registro":fechaActual,"token_usuario":sesionOTP.token_usuario,"documento":sesionOTP.documento,"usuario_fb":sesionOTP.usuario_fb,"otp":sesionOTP.otp,"access_token":resValidarOTP.body.access_token};
					 	
					 clienteMongoDB.insertarOActualizarSession(queryNoSolicitud,validacion,function(err,resultRegis){
					 		
					 		console.log("Resultado del motodo ASHS 04/08/17  result  ::::::::::  "+ JSON.stringify(resultRegis, null, 4))
					 		
					 			rotativo.validacionOTP(recipientId,sesionOTP.otp,resValidarOTP.body.access_token,sesionOTP,""); 
		       });
	     });	
	});
}


rotativo.validacionOTP = function(recipientId, otp, access_token, sessionTokenId)
{
	console.log("ASHS 04/08/2017 Id del usuario recipientId :"+ recipientId);
	console.log("ASHS 04/08/2017 otp del usuario :"+otp);
	console.log("ASHS 04/08/2017 access_token del usuario : "+access_token);
	console.log("ASHS 04/08/2017 sessionTokenId Sesion token creado en el primer metodo"+sessionTokenId);
	
	var resourceURL = process.env.API_CATALOG_URL+"/credit-cards-products/v1/credit-cards";
	
	 clienteApiConnect.ejecutarGET(resourceURL, access_token, function(err, resConsultarIdProduct){
		 
		 console.log("ASHS 08/08/2017 Resultado de clienteApiConnect.ejec :::::::::  "+ JSON.stringify(resConsultarIdProduct, null, 4));
		 
		 
		 /*if(!err && resConsultarIdProduct.statusCode == 200)
		 {
			 
			 console.log("ASHS 04/08/2017 rotativo.validacionOTP : El status de respuesta fue 200 y la respuesta del servicio fue : "+JSON.stringify(resConsultarIdProduct));
			 var myJSONString = JSON.parse(resConsultarIdProduct.body);
			 
		 } 
		 */
	 });
	
};



rotativo.enviarMensajeAutenticacionValidarToken= function(recipientId,identificacion, sessionTokenId, fechaCreado, otp, tipoDocumento) {
    console.log('-----------------------------------------------enviarMensajeAutenticacionValidarToken'+identificacion);
    console.log("rotativo.js - enviarMensajeAutenticacionValidarToken - Usuario Id FB: "+recipientId);
    //se ejecuta el servicio de autenticar y validarOTP.
    var rqValidarOTP = "grant_type=password&client_id="+process.env.X_IP_CLIENT+"&scope=review&username="+sessionTokenId+"&password="+otp;
    var resourceURLvalOTP = process.env.API_CATALOG_URL+"/oauth2-provider/type2/v1/token";
    clienteApiConnect.ejecutarPOSTWwwFormUrlEncoded(resourceURLvalOTP, rqValidarOTP, function(err, resValidarOTP) {
        if (!err && resValidarOTP.statusCode == 200) {
            console.log("rotativo.enviarMensajeAutenticacionValidarToken - validarOTP y Oauth2 - Response:1 " + JSON.stringify(resValidarOTP,null,4));
            console.log("rotativo.enviarMensajeAutenticacionValidarToken - validarOTP y Oauth2 - Response:2 " + JSON.stringify(resValidarOTP.body,null,4));
            var myJSONString = JSON.parse(resValidarOTP.body);

            console.log("rotativo.enviarMensajeAutenticacionValidarToken - validarOTP y Oauth2 - Response:4 " + (myJSONString.access_token));
            var filtro = {"idFacebook": recipientId};
            var queryOTP = {
                idFacebook: recipientId,
                identificacion: identificacion,
                access_token: myJSONString.access_token,
                sessionTokenId: sessionTokenId,
                fechaCreado: fechaCreado
            };
            clienteMongoDB.insertarOActualizarSession(filtro, queryOTP, function (err, data) {
                if (!err) {
                    console.log("rotativo.enviarMensajeAutenticacionValidarToken - insertarOActualizarSessionChatbotsXFiltro - Cliente Actualizado (Data): " + JSON.stringify(data, null, 4));
                    rotativo.enviarMensajeConsultarCredApiConnect(recipientId, identificacion,myJSONString.access_token,tipoDocumento);
                } else {
                    console.log("Error - enviarMensajeAutenticacionValidarToken - insertarOActualizarSessionChatbotsXFiltro Pasando a enviarMensajeConsultarTCApiConnect: " + JSON.stringify(err));
                }
            });
        } else {
            if (resValidarOTP.statusCode == 302) {
                console.log("rotativo.enviarMensajeAutenticacionValidarToken - generarOTP - Error EN EL OTP INGRESADO: " + JSON.stringify(err));
                console.log("rotativo.enviarMensajeAutenticacionValidarToken - generarOTP - Error EN EL OTP INGRESADO:2 " + JSON.stringify(resValidarOTP));
                console.log("rotativo.js - enviarMensajeAutenticacionValidarToken - Usuario Id FB: " + contadorIntentos);
                contadorIntentos++;
                if (contadorIntentos <= 1) {
                    var messageData = {
                        recipient: {
                            id: recipientId
                        },
                        message: {
                            text: "El número ingresado no es correcto. Por favor ingreselo nuevamente",
                            metadata: "DIG_DESPEDIDA_GEN"
                        }
                    };
                    clienteFacebook.enviarMensaje(messageData, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log("activacionTC.enviarMensajeErrorIngresoOTP - enviarMensaje: Mensaje 1 la respuesta es: " + JSON.stringify(body, null, 4));

                        } else {
                            console.error("activacionTC.enviarMensajeErrorIngresoOTP - Mensaje 1: Failed calling Send API", response.statusCode, response.statusMessage, body.error);
                            console.log("activacionTC.enviarMensajeErrorIngresoOTP - Mensaje 1: Failed calling Send API: " + JSON.stringify(error, null, 4));
                        }
                    });
                } else {
                    console.log("activacionTC.enviarMensajeErrorIngresoOTP - mas de 3 intentos errados.....:");
                    //Actualizar el idUsuarioFB en la BD.
                    //Colocando fecha de la hora -05:00
                    var filtroTC = {numeroIdentificacion: identificacion, tipoIdentificacion:tipoDocumento};
                    console.log("esta mal en esto "+JSON.stringify(filtroTC,null,4));
                    var objeto = {estado:""};
                    clienteMongoDB.borrarOActualizarestado(filtroTC,objeto, function(err, res){
                        if(res){       
                            rotativo.mensajeportal(recipientId, identificacion);
                        } else {
                            console.log("error al borrar el estado del mal OTP");
                        }
                    });
                }

                fechaActual = momenttz().tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss");
                var clienteMod = {
                    idFacebook: recipientId,
                    estado: "CEDULA",
                    fechaModificado: fechaActual
                };
                clienteMongoDB.insertarOActualizarestado(filtroTC, clienteMod, function (err, data) {
                    if (!err) {
                        console.log("app.js - actualizarTarjetasXFiltro - Cliente Actualizado (ESTADO_VALIDACION_OTP):" + JSON.stringify(data, null, 4));
                    } else {
                        console.log("Error - actualizarTarjetasXFiltro - ESTADO_VALIDACION_OTP:  " + JSON.stringify(err));
                    }
                });
            }

            else
            {
                console.log("activacionTC.clienteApiConnect - generarOTP - Error del servicio: " + JSON.stringify(err));
                //Actualizar el idUsuarioFB en la BD.
                //Colocando fecha de la hora -05:00
                var filtroTC = {"identificacion": identificacion, "estado":"OTP"};
                fechaActual = momenttz().tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss");
                var clienteMod = {
                    idFacebook: recipientId,
                    estado: "CEDULA",
                    fechaModificado: fechaActual
                };
                clienteMongoDB.insertarOActualizarestado(filtroTC, clienteMod, function (err, data) {
                    if (!err) {
                        console.log("app.js - actualizarTarjetasXFiltro - Cliente Actualizado (ESTADO_VALIDACION_OTP):" + JSON.stringify(data, null, 4));
                        rotativo.enviarMensajeErrorTransaccion(recipientId);
                    } else {
                        console.log("Error - actualizarTarjetasXFiltro - ESTADO_VALIDACION_OTP:  " + JSON.stringify(err));
                    }
                });
            }
        }
    });
};




rotativo.enviarMensajeConsultarCredApiConnect = function(recipientId, identificacion, access_token,tipoDocumento) {
    var contador = 0;
    console.log("activacionTC.js - enviarMensajeConsultarTCApiConnect - Usuario Id FB: "+recipientId);
    console.log("------------------------------------------------------- enviarMensajeConsultarCred"+identificacion);
    //se ejecuta el servicio de consultarProductos.
    var resourceURL = process.env.API_CATALOG_URL+"/loans-products/v1/loans";
    clienteApiConnect.ejecutarGET(resourceURL, access_token, function(err, resConsultarIdProduct){
        if(!err && resConsultarIdProduct.statusCode == 200){
                console.log("activacionTC.clienteApiConnect - enviarMensajeConsultarCredApiConnect - Response:1 "+JSON.stringify(resConsultarIdProduct));
                var myJSONString = JSON.parse(resConsultarIdProduct.body);   
                console.log(JSON.stringify(myJSONString.Loans,null,4));             
                    if(myJSONString.Loans){
                        var producList = (myJSONString.Loans);
                        var numeroListaProductos = producList.length;
                        console.log("activacionTC.clienteApiConnect - enviarMensajeConsultarCredApiConnect consulta CREDITOS (contenedor)- Response:2 "+ JSON.stringify (producList));
                        console.log("activacionTC.clienteApiConnect - enviarMensajeConsultarCredApiConnect consulta CREDITOS (contenedor)- Response:3 "+ (numeroListaProductos));
                        cargarListaProductosEncontrados(recipientId,identificacion, producList, tipoDocumento, function(err, listaProductosEncontrados, totalRegistros) {
                            if(!err){
                                //construye los botones a retornar.
                                console.log("LLAMANDO A enviarMensajeCreditosActivosconValidacionOTP con listaProductosEncontrados: "+JSON.stringify(listaProductosEncontrados, null, 4));
                                rotativo.enviarMensajeCreditosActivosconValidacionOTP(recipientId, identificacion, listaProductosEncontrados);
                            }
                        });
                    } else {
                        rotativo.enviarMensajeErrorTransaccion(recipientId);
                    }
        }else{
            console.log("activacionTC.clienteApiConnect - enviarMensajeConsultarTCApiConnect - Error: "+JSON.stringify(err));
            //Actualizar el idUsuarioFB en la BD.
            //Colocando fecha de la hora -05:00
            var filtroTC = {"identificacion":identificacion};
            fechaActual = momenttz().tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss");
            var clienteMod = {estado:"", fechaModificado: fechaActual};
            clienteMongoDB.insertarOActualizarestadoCred(filtroTC, clienteMod, function(err, data){
                if(!err){
                    console.log("app.js - actualizarTarjetasXFiltro - Cliente Actualizado (ESTADO_VALIDACION_OTP):"+JSON.stringify(data, null, 4));
                    //activacionTC.enviarMensajeDespedidaOTP(recipientId, identificacion);
                    rotativo.enviarMensajeErrorTransaccion(recipientId);
                }else{
                    console.log("Error - actualizarTarjetasXFiltro - ESTADO_VALIDACION_OTP:  "+JSON.stringify(err));
                }
            });
        }
    });
};

//AQUI QUEDE 

function cargarListaProductosEncontrados(recipientId, identificacion, producList, tipoDocumento, callback) {
    var contador=0;
    var tamano = producList.length;
    var _productosEncontrados = [];
    var productoCred = null;
    var counts = 0;
    console.log("IDENTIFICACION ------Y/"+identificacion);
    producList.forEach(function(producto,index){

        var ultimosDigitos = producto.Loan.reference;
        //obtenemos el texto de entrada y consultamos por identificacion.
        console.log("FOR-EACH DIGITOSCREDITO"+producto.Loan.reference);

        var queryTC = {"tipoIdentificacion":tipoDocumento,"numeroIdentificacion": identificacion, "numeroCredito": {$regex: ultimosDigitos+"$" } };
        // consultar cliente.
        console.log("QUERYQUERYQUERYQUERYQUERYQUERYQUERYQUERYQUERYQUERY" +queryTC);
        clienteMongoDB.buscarClienteXQueryContador(queryTC, index, function (err, productRef, indexRes) {
            console.log("Contador buscarClienteXQueryContador/================================: "+ indexRes);
            if (!err) {
                if (productRef) {
                     console.log("Imprimiendo PRODUCTREF================================: "+ JSON.stringify(productRef));
                    //Actualizar e insertar el idUsuarioFB, idProduct y referencia si hacen match BD vs Servicio consultar productos.
                    //Colocando fecha de la hora -05:00
                    fechaActual = momenttz().tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss");
                    console.log('Estos son los creditos  '+ producto.Loan.idProduct);
                    var filtro = {"tipoIdentificacion":tipoDocumento, "numeroIdentificacion": identificacion, "numeroCredito":{$regex: ultimosDigitos+"$"}};
                    var objCredito = {"seleccionada":'false', idProductLoan: producto.Loan.idProduct};
                    console.log("FILTRO para actualizar las tarjetas encontradas"+JSON.stringify(filtro));
                    console.log("activacionTC.actualizarTarjetasXFiltro - queryIDP - Numero de Tarjetas Encontrados: " + JSON.stringify(objCredito));
                    clienteMongoDB.insertarOActualizarestadoCred(filtro, objCredito, function (err, data) {
                        if (!err) {
                            console.log("cargarListaProductosEncontrados - insertarOActualizarestadoCred EXITOSO: " + JSON.stringify(data, null, 4));
                            //activacionTC.enviarMensajeActivacionTCconValidacionOTP(recipientId, identificacion);

                        } else {
                            console.log("cargarListaProductosEncontrados - insertarOActualizarestadoCred ERROR ERROR ERROR: " + JSON.stringify(err));
                        }
                    });
                    
                    
                    productoCred = {
                        idProduct: producto.Loan.idProduct,
                        digitosCredito: producto.Loan.reference,
                    };
                    //console.log("Numero de productos encontrados (match): "+ productoCred);
                    _productosEncontrados.push(productoCred);
                    console.log("HICE PUSH A _productosEncontrados");
            
                }else{
                    console.log("NO SE ENCONTRO NADA PARA ESTE CREDITO DIGITOSCREDITO: "+producto.Loan.reference);
                }


                if (counts === (tamano-1)){
                    console.log("Numero de CREDITOS encontrados (match): "+ _productosEncontrados.length);
                    console.log("Numero de CREDITOS encontrados (match): "+ JSON.stringify(_productosEncontrados));
                    //activacionTC.enviarMensajeActivacionTCconValidacionOTP(recipientId, identificacion);
                    callback(null, _productosEncontrados, _productosEncontrados.length);
                }

                counts++;
            } else {
                console.log("Error - buscarTarjetasCredXQuery - buscarTarjetasCredXQuery insertando id Producto: " + JSON.stringify(err));
            }
        });
    });
}


rotativo.enviarMensajeCreditosActivosconValidacionOTP = function(recipientId, identificacion, listaProductosEncontrados ) {
    console.log("activacionTC.js - enviarMensajeActivacionTCconValidacionOTP - Usuario IDENTIFICACION: "+identificacion);

    console.log("activacionTC.enviarMensajeInicialActivarTC - count - Cliente Encontrados: "+listaProductosEncontrados.length);
    // si no existe tarjetas de cred.
    if (listaProductosEncontrados.length === 0){
        console.log("activacionTC.buscarTarjetasCredXQuery - buscarTarjetasCredXQuery - Tarjeta No Encontrado.");
        rotativo.enviarMensajeNoCreditos(recipientId);

    }else{
        //verificamos si el cliente tiene vaarias tarjetas de cred.
        if(listaProductosEncontrados.length > 0){
            rotativo.enviarCreditosCliente(listaProductosEncontrados.length, identificacion, listaProductosEncontrados, function(err, _listaTC){
                var messageData4 = {
                    recipient: {
                        id: recipientId
                    },
                    message: {
                        attachment: {
                            type: "template",
                            payload: {
                                template_type: "generic",
                                elements: _listaTC
                            }
                        }
                    }
                };
                clienteFacebook.enviarMensaje(messageData4, function(error, response, body){
                    if(!error && response.statusCode == 200){
                        console.log("activacionTC.enviarMensajeInicialActivarTC - enviarTarjetasCreditoCliente - enviarMensaje: Mensaje 1 la respuesta es: "+JSON.stringify(body, null, 4));
                        //Colocando fecha de la hora -05:00
                        /*var filtroTC = {"identificacion":identificacion, idProduct: { $exists: false },"estado": {$nin: [estadosTC.ESTADO_ACTIVADA, estadosTC.ESTADO_CAMBIO_DIRYCIUDAD,estadosTC.ESTADO_NO_AUTORIZADA]}};
                        fechaActual = momenttz().tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss");
                        var clienteMod = {idUsuarioFB:recipientId, estado: estadosTC.ESTADO_CARGADA, fechaModificado: fechaActual};
                        clienteMongoDB.actualizarTarjetasXFiltro(filtroTC, clienteMod, function(err, data){
                            if(!err){
                                console.log("app.js - actualizarTarjetasXFiltro - Cliente Actualizado (ESTADO_VALIDACION_OTP):"+JSON.stringify(data, null, 4));

                            }else{
                                console.log("Error - actualizarTarjetasXFiltro - ESTADO_VALIDACION_OTP:  "+JSON.stringify(err));
                            }
                        });*/
                    }else{
                        console.error("activacionTC.enviarMensajeInicialActivarTC - enviarTarjetasCreditoCliente - enviarMensaje - Mensaje 1: Failed calling Send API", response.statusCode, response.statusMessage, body.error);
                        console.log("activacionTC.enviarMensajeInicialActivarTC - enviarTarjetasCreditoCliente - enviarMensaje - Mensaje 1: Failed calling Send API: "+JSON.stringify(error,null,4));
                    }
                });
            });
        }
    }

};

rotativo.enviarMensajeNoCreditos = function(recipientId) {

    console.log("rotativo.js - ingresonumeroide - Usuario Id FB: "+recipientId);

    //invocamos a facebook para obtener la informacion del perfil del usuario.
    clienteFacebook.obtenerPerfilUsuario(recipientId, function(error, response, bodyPerfil){
        if(!error && response.statusCode == 200){
            console.log("rotativo.js - ingresonumeroide - obtenerPerfilUsuario en Facebook: La respuesta es: "+bodyPerfil);
            var res = JSON.parse(bodyPerfil);
            var messageData2 = {
                recipient: {
                    id: recipientId
                },
                message: {
                    text: "En estos momentos no tienes Creditos activos.",
                    metadata: "DEVELOPER_DEFINED_METADATA"
                }
            };

            //Devolver estado a "" sin nada en caso no tenga ningun credito activo

            clienteFacebook.enviarMensaje(messageData2, function (error, response, body) {
                if (!error) {
                    console.log("rotativo.js - enviarMensajeTextoIngresado - Mensaje 2: la respuesta es: " + JSON.stringify(body, null, 4));
                    //rotativo.validacionide(recipientId);
                } else {

                }
            });
        }else{
            console.log("rotativo.js - ingresonumeroide - obtenerPerfilUsuario FB: Failed calling Send API: " + JSON.stringify(error, null, 4));
        }
    });

};


rotativo.enviarCreditosCliente = function(tamano, identificacion, listaTarjetasCred,  callback) {
    console.log("activacionTC.enviarTarjetasCreditoCliente - Inicio. ");

    var _objElement = [];
    var _objDataElement = { title : "Seleccione el producto origen de los fondos", buttons : []};
    var _listaAux = [];
    var _botonFCTarjetaC;
    var contador = 0;

    for (var i = 0; i< tamano; i++){
        var tarjetaCred = listaTarjetasCred[i];
        console.log(tarjetaCred,null,4);
        _botonFCTarjetaC = {
            type: "postback",
            title: "CrediExpress "+tarjetaCred.digitosCredito,
            payload: "CREDITO_ESCOGIDO,"+identificacion+","+tarjetaCred.digitosCredito+","+tarjetaCred.idProduct
        };

        _listaAux.push(_botonFCTarjetaC);



        if(_listaAux.length == 3){
            _objDataElement.buttons = _listaAux;
            _objElement.push(JSON.parse(JSON.stringify(_objDataElement)));
            _listaAux = [];
            _objDataElement.buttons = [];
        }else if((i+1) == tamano){

            _objDataElement.buttons = _listaAux;
            _objElement.push(JSON.parse(JSON.stringify(_objDataElement)));
            _listaAux = [];
            _objDataElement.buttons = [];
        }
    }

    console.log("activacionTC.enviarTarjetasCreditoCliente - _objElement. " + JSON.stringify(_objElement));
    callback(null, _objElement);

};

/*Inicio de codigo para servicio de cuentas*/

rotativo.enviarMensajeConsultarCuentasApiConnect = function(recipientId, identificacion, tipoDocumento, numeroCredito, access_token) {
    var contador = 0;
    console.log("activacionTC.js - enviarMensajeConsultarTCApiConnect - Usuario Id FB: "+recipientId);

    //se ejecuta el servicio de consultarProductos.
    var resourceURL = process.env.API_CATALOG_URL+"/accounts-products/v1/accounts";
    clienteApiConnect.ejecutarGET(resourceURL, access_token, function(err, resConsultarIdProduct){
        console.log(JSON.stringify(resConsultarIdProduct,null,4));
        if(!err && resConsultarIdProduct.statusCode == 200){
            console.log("activacionTC.clienteApiConnect - enviarMensajeConsultarTCApiConnect - CUENTAS Response:1 "+JSON.stringify(resConsultarIdProduct));
            var myJSONString = JSON.parse(resConsultarIdProduct.body);
                if(myJSONString.Accounts){
                    var producList = (myJSONString.Accounts);
                    console.log("activacionTC.clienteApiConnect - enviarMensajeConsultarTCApiConnect consulta productos (contenedor)- CUENTAS Response:2 "+ JSON.stringify (producList));
                    var numeroListaProductos = producList.length;
                    console.log("activacionTC.clienteApiConnect - enviarMensajeConsultarTCApiConnect consulta productos (contenedor)- CUENTAS Response:3 "+ JSON.stringify (producList));
                    console.log("activacionTC.clienteApiConnect - enviarMensajeConsultarTCApiConnect consulta productos (contenedor)- CUENTAS Response:4 "+ (numeroListaProductos));
                    console.log("LISTA DE CUENTAS PARA COMPRAR "+ producList);
                    cargarListaProductosEncontrados2(recipientId,identificacion,tipoDocumento, numeroCredito, producList, function(err, listaProductosEncontrados, totalRegistros) {
                        if(!err){
                            //construye los botones a retornar.
                            var query = {idFacebook: recipientId, idProduct: {$exists: true}};
                            clienteMongoDB.buscarXQuery(query, function(err,res){
                                if(res){
                                    console.log("SI encontr oa una persona ");
                                    console.log("LISTA de cuentas del APIIIIIIIIIIIIIIIIIII"+JSON.stringify(producList));
                                    rotativo.enviarMensajeCuentasActivasconValidacionOTP(recipientId, identificacion, tipoDocumento, numeroCredito, listaProductosEncontrados);
                                } else {
                                    console.log("No encontro a esa tal persona" + err );
                                    rotativo.mensajeportal(recipientId);
                                }
                            });
                            
                        }
                    });
                } else {
                    rotativo.enviarMensajeErrorTransaccion(recipientId);
                }
        }else{
            console.log("activacionTC.clienteApiConnect - enviarMensajeConsultarTCApiConnect - Error: "+JSON.stringify(err));
            //Actualizar el idUsuarioFB en la BD.
            //Colocando fecha de la hora -05:00
            var filtroTC = {"identificacion":identificacion};
            fechaActual = momenttz().tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss");
            var clienteMod = {estado:"", fechaModificado: fechaActual};
            clienteMongoDB.insertarOActualizarestado(filtroTC, clienteMod, function(err, data){
                if(!err){
                    console.log("app.js - actualizarTarjetasXFiltro - Cliente Estado Actualizado a vacio:"+JSON.stringify(data, null, 4));
                    rotativo.enviarMensajeErrorTransaccion(recipientId);
                }else{
                    console.log("Error - actualizarTarjetasXFiltro - Cliente Estado Actualizado a vacio:"+JSON.stringify(err));
                }
            });
        }
    });
};

function cargarListaProductosEncontrados2(recipientId, identificacion, tipoDocumento, numeroCredito, producList, callback) {
    //incluir la selección de la persona en creditos
    var contador=0;
    var tamano = producList.length;
    var _productosEncontrados = [];
    var productoCred = null;
    var counts = 0;

    producList.forEach(function(producto,index){
        //obtenemos el texto de entrada y consultamos por identificacion.
        var ultimosDigitos =  producto.Account.reference;
        var queryTC = {"tipoIdentificacion":tipoDocumento, "numeroIdentificacion": identificacion,"numeroCuenta": {$regex: ultimosDigitos+"$" }, "numeroCredito":{$regex:numeroCredito+"$"}};
        // consultar cliente.
        console.log("SOLO agrega los datos de la cuenta a quellas que hagan match"+JSON.stringify(queryTC,null,4));
        clienteMongoDB.buscarClienteXQueryContadorCuentas(queryTC, index, function (err, productRef, indexRes) {
            console.log("Contador buscarClienteXQueryContador/================================: "+ indexRes);
            if (!err) {
                if (productRef) {
                    //Actualizar e insertar el idUsuarioFB, idProduct y referencia si hacen match BD vs Servicio consultar productos.
                    //Colocando fecha de la hora -05:00

                    fechaActual = momenttz().tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss");
                    //validar tambien que el numeroCredito termina en lo que escogio la persona
                    var filtro = {"tipoIdentificacion":tipoDocumento, "numeroIdentificacion": identificacion,"numeroCuenta": {$regex: producto.Account.reference+"$" },seleccionada:'true'};
                    var objCuenta = {"idProduct": producto.Account.idProduct,"codigoProducto":producto.Account.codeProduct, "fechaModificado": fechaActual};
                    console.log("Query filtro actualizar estado"+JSON.stringify(filtro,null,4));
                    console.log("activacionTC.actualizarTarjetasXFiltro - queryIDP - Numero de Tarjetas Encontrados: " + JSON.stringify(objCuenta));
                    clienteMongoDB.insertarOActualizarestado(filtro, objCuenta, function (err, data) {
                        if (!err) {
                            console.log("activacionTC.enviarMensajeConsultarTCApiConnect - actualizarTarjetasXFiltro - actualizado idProcut (Data): " + JSON.stringify(data, null, 4));
                            // activacionTC.enviarMensajeActivacionTCconValidacionOTP(recipientId, identificacion);
                        } else {
                            console.log("Error - enviarMensajeConsultarTCApiConnect - actualizarTarjetasXFiltro insertando id Producto: " + JSON.stringify(err));
                        }
                    });
                    productoCred = {
                        idProduct: producto.Account.idProduct,
                        codigoProducto: producto.Account.codeProduct,
                        digitosCuenta: producto.Account.reference,
                        identificacion: identificacion
                    };
                    console.log("Numero de productos encontrados (match): "+ productoCred);
                    _productosEncontrados.push(productoCred);
                } 
                if (counts === (tamano-1)){
                    console.log("Numero de productos encontrados (match): "+ _productosEncontrados.length);
                    console.log("Numero de productos encontrados (match): "+ JSON.stringify(_productosEncontrados));
                    //activacionTC.enviarMensajeActivacionTCconValidacionOTP(recipientId, identificacion);
                    callback(null, _productosEncontrados, _productosEncontrados.length);
                }
                counts++;
            } else {
                console.log("Error - buscarTarjetasCredXQuery - buscarTarjetasCredXQuery insertando id Producto: " + JSON.stringify(err));
            }
        });
    });
}


rotativo.enviarMensajeCuentasActivasconValidacionOTP = function(recipientId, identificacion, listaProductosEncontrados ) {
    console.log("activacionTC.js - enviarMensajeActivacionTCconValidacionOTP - Usuario IDENTIFICACION: "+identificacion);

    console.log("activacionTC.enviarMensajeInicialActivarTC - count - Cliente Encontrados: "+listaProductosEncontrados.length);
    // si no existe tarjetas de cred.
    if (listaProductosEncontrados.length === 0){
        console.log("activacionTC.buscarTarjetasCredXQuery - buscarTarjetasCredXQuery - Tarjeta No Encontrado.");
        rotativo.enviarMensajeNoCuentas(recipientId);

    }else{
        //verificamos si el cliente tiene vaarias tarjetas de cred.
        if(listaProductosEncontrados.length > 0){
            console.log('encontro datos en las cuentas asi que se puede actualizar a estado monto');
            rotativo.enviarMensajeIngreseMonto(recipientId);
        } else {
                rotativo.enviarMensajeNoCuentas(recipientId);
        }
    }

};

rotativo.enviarMensajeNoCuentas = function(recipientId) {

    console.log("rotativo.js - ingresonumeroide - Usuario Id FB: "+recipientId);

    //invocamos a facebook para obtener la informacion del perfil del usuario.
    clienteFacebook.obtenerPerfilUsuario(recipientId, function(error, response, bodyPerfil){
        if(!error && response.statusCode == 200){
            console.log("rotativo.js - ingresonumeroide - obtenerPerfilUsuario en Facebook: La respuesta es: "+bodyPerfil);
            var res = JSON.parse(bodyPerfil);
            var messageData2 = {
                recipient: {
                    id: recipientId
                },
                message: {
                    text: "En estos momentos no tienes cuentas activas.",
                    metadata: "DEVELOPER_DEFINED_METADATA"
                }
            };

            //Devolver estado a "" sin nada en caso no tenga ningun credito activo

            clienteFacebook.enviarMensaje(messageData2, function (error, response, body) {
                if (!error) {
                    console.log("rotativo.js - enviarMensajeTextoIngresado - Mensaje 2: la respuesta es: " + JSON.stringify(body, null, 4));
                    //rotativo.validacionide(recipientId);
                } else {

                }
            });
        }else{
            console.log("rotativo.js - ingresonumeroide - obtenerPerfilUsuario FB: Failed calling Send API: " + JSON.stringify(error, null, 4));
        }
    });

};

/*End codigo para servicio de cuentas*/

rotativo.enviarMensajeIngreseMonto = function(recipientId) {
    console.log("rotativo.js - ingresonumeroide - Usuario Id FB: "+recipientId);
    //invocamos a facebook para obtener la informacion del perfil del usuario.
    clienteFacebook.obtenerPerfilUsuario(recipientId, function(error, response, bodyPerfil){
        if(!error && response.statusCode == 200){
            console.log("rotativo.js - ingresonumeroide - obtenerPerfilUsuario en Facebook: La respuesta es: "+bodyPerfil);
            var res = JSON.parse(bodyPerfil);
            var messageData2 = {
                recipient: {
                    id: recipientId
                },
                message: {
                    text: "Indique el valor a transferir sin puntos ni comas.",
                    metadata: "DEVELOPER_DEFINED_METADATA"
                }
            };
            //Devolver estado a "" sin nada en caso no tenga ningun credito activo
            clienteFacebook.enviarMensaje(messageData2, function (error, response, body) {
                if (!error) {
                    console.log("rotativo.js - enviarMensajeTextoIngresado - Mensaje 2: la respuesta es: " + JSON.stringify(body, null, 4));
                    //rotativo.validacionide(recipientId);
                }else {

                }
            });
        }else{
            console.log("rotativo.js - ingresonumeroide - obtenerPerfilUsuario FB: Failed calling Send API: " + JSON.stringify(error, null, 4));
        }
    });

};

rotativo.enviarMensajeTransaccion = function(recipientId, valorTransaccion, datosPersona, numeroIdentificacion) 
{
    console.log("rotativo.js - ingresonumeroide - Usuario Id FB: "+recipientId);
    //invocamos a facebook para obtener la informacion del perfil del usuario.
    clienteFacebook.obtenerPerfilUsuario(recipientId, function(error, response, bodyPerfil)
    {
            if(!error && response.statusCode == 200)
            {
                var filtroTipoCuenta = {"tipoIdentificacion": datosPersona.tipoIdentificacion, "numeroIdentificacion":datosPersona.numeroIdentificacion, "seleccionada":'true'};
                console.log('Mensaje transaccion con el siguiente query' + JSON.stringify(filtroTipoCuenta));
                clienteMongoDB.buscarTipoCuentaXQuery(filtroTipoCuenta, function(err, objTipoCuenta)
                {
                    if(objTipoCuenta!=null && objTipoCuenta!=undefined)
                    {
                        console.log("rotativo.js - ingresonumeroide - obtenerPerfilUsuario en Facebook: La respuesta es: "+bodyPerfil);
                        console.log("en la base de datos encontro el siguiente objeto"+JSON.stringify(objTipoCuenta,null,4));
                        var res = JSON.parse(bodyPerfil);
                        var messageData2 = 
                        {
                            recipient: 
                            {
                                id: recipientId
                            },
                            message: 
                            {
                                //tratar a lo que llega de la base de datos en el campo numeroCuenta para que solo se muestren los ultimos 4 digitos
                                text: "Su transacción por $ "+valorTransaccion+" será abonada en su "+ objTipoCuenta.tipoCuenta+ " terminada en "+objTipoCuenta.numeroCuenta.substring(objTipoCuenta.numeroCuenta.length-4,objTipoCuenta.numeroCuenta.length),
                                metadata: "DEVELOPER_DEFINED_METADATA"
                            }
                        };
                        clienteFacebook.enviarMensaje(messageData2, function (error, response, body) 
                            {
                                if (!error) 
                                {
                                    console.log("rotativo.js - enviarMensajeTextoIngresado - Mensaje 2: la respuesta es: " + JSON.stringify(body, null, 4));
                                    //rotativo.validacionide(recipientId)
                                    rotativo.enviarMensajeConfirmarTransaccion(recipientId);
                                }
                            });
                        
                    } else {
                        console.log(JSON.stringify(err,null,4));
                        rotativo.enviarMensajeErrorTransaccion(recipientId);
                    }
                });
                //Devolver estado a "" sin nada en caso no tenga ningun credito activo 
            }
            else
            {
                console.log("rotativo.js - ingresonumeroide - obtenerPerfilUsuario FB: Failed calling Send API: " + JSON.stringify(error, null, 4));
            }
    });
};

rotativo.enviarMensajeConfirmarTransaccion = function(recipientId) {

    contadorMonto++;
    if(contadorMonto<=2){
         console.log("rotativo.js - enviarMensaje2doSaberrotativo - Usuario Id FB: "+recipientId);
        var messageData = 
        {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: "¿Confirma su transacción?",
                        buttons:[{
                            type: "postback",
                            title: "SI",
                            payload: "CONFIRMAR_TRANSACCION"
                        },{
                            type: "postback",
                            title: "NO",
                            payload: "RECHAZAR_TRANSACCION"
                        }]
                    }
                }
            }
        };
        } else {
            rotativo.mensajeportal(recipientId);
        }
    clienteFacebook.enviarMensaje(messageData, function(error2do, response2do, body2do){
        if(!error2do && response2do.statusCode == 200){
            console.log("rotativo.js - enviarMensaje2doSaberrotativo - Mensaje 1: la respuesta es: "+JSON.stringify(body2do, null, 4));
        }else{
            console.log("rotativo.js - enviarMensaje2doSaberrotativo - Mensaje 1: Failed calling Send API: "
                +JSON.stringify(error2do,null,4));
            console.log("rotativo.js - enviarMensaje2doSaberrotativo - Mensaje 1: Failed calling Send API: "
                +JSON.stringify(response2do,null,4));
            }
        });


};

rotativo.enviarMensajeMontoMayor = function(recipientId) {
    console.log("rotativo.js - ingresonumeroide - Usuario Id FB: "+recipientId);
    //invocamos a facebook para obtener la informacion del perfil del usuario.
    clienteFacebook.obtenerPerfilUsuario(recipientId, function(error, response, bodyPerfil){
        if(!error && response.statusCode == 200){
            console.log("rotativo.js - ingresonumeroide - obtenerPerfilUsuario en Facebook: La respuesta es: "+bodyPerfil);
            var res = JSON.parse(bodyPerfil);
            var messageData2 = {
                recipient: {
                    id: recipientId
                },
                message: {
                    text: "El monto ingresado es superior al disponible, por favor ingrese otro valor.",
                    metadata: "DEVELOPER_DEFINED_METADATA"
                }
            };
            //Devolver estado a "" sin nada en caso no tenga ningun credito activo
            clienteFacebook.enviarMensaje(messageData2, function (error, response, body) {
                if (!error) {
                    console.log("rotativo.js - enviarMensajeTextoIngresado - Mensaje 2: la respuesta es: " + JSON.stringify(body, null, 4));
                    //rotativo.validacionide(recipientId)

                }else {

                }
            });
        }else{
            console.log("rotativo.js - ingresonumeroide - obtenerPerfilUsuario FB: Failed calling Send API: " + JSON.stringify(error, null, 4));
        }
    });

};


rotativo.maximocantidad = function(recipientId) {

    console.log("rotativo.js - enviarMensajeInicial - Usuario Id FB: "+recipientId);

    //invocamos a facebook para obtener la informacion del perfil del usuario.
    clienteFacebook.obtenerPerfilUsuario(recipientId, function(error, response, bodyPerfil){
        if(!error && response.statusCode == 200){
            console.log("rotativo.js - enviarMensajeInicial - obtenerPerfilUsuario en Facebook: La respuesta es: "+bodyPerfil);
            var res = JSON.parse(bodyPerfil);
            var messageData2 = {
                recipient: {
                    id: recipientId
                },
                message: {
                    text: "El número ingresado no es correcto o no existe",
                    metadata: "DEVELOPER_DEFINED_METADATA"
                }
            };

            clienteFacebook.enviarMensaje(messageData2, function (error, response, body) {
                if (!error) {
                    console.log("rotativo.js - enviarMensajeTextoIngresado - Mensaje 2: la respuesta es: " + JSON.stringify(body, null, 4));
                   rotativo.maximocantidaderrores(recipientId);
                } else {

                }
            });
        }else{
            console.log("rotativo.js - enviarMensajeInicial - obtenerPerfilUsuario FB: Failed calling Send API: " + JSON.stringify(error, null, 4));
        }
    });

};


rotativo.maximocantidaderrores = function(recipientId) {

    console.log("rotativo.js - enviarMensajeInicial - Usuario Id FB: "+recipientId);

    //invocamos a facebook para obtener la informacion del perfil del usuario.
    clienteFacebook.obtenerPerfilUsuario(recipientId, function(error, response, bodyPerfil){
        if(!error && response.statusCode == 200){
            console.log("rotativo.js - enviarMensajeInicial - obtenerPerfilUsuario en Facebook: La respuesta es: "+bodyPerfil);
            var res = JSON.parse(bodyPerfil);
            var messageData2 = {
                recipient: {
                    id: recipientId
                },
                message: {
                    text: "Por favor realice el uso por su Portal Empresarial o acérquese a la oficina más cercana ",
                    metadata: "DEVELOPER_DEFINED_METADATA"
                }
            };

            clienteFacebook.enviarMensaje(messageData2, function (error, response, body) {
                if (!error) {
                var filtro = {"idFacebook":recipientId};
                var actualizacion = {estado:""};
                clienteMongoDB.insertarOActualizarestado(filtro, actualizacion, function(err, data){
                    if(!err){
                        console.log("app.js - actualizarTarjetasXFiltro - Cliente Estado Actualizado a vacio:"+JSON.stringify(data, null, 4));
                        //activacionTC.enviarMensajeDespedidaOTP(recipientId, identificacion);
                    }else{
                        console.log("Error - actualizarTarjetasXFiltro - Cliente Estado Actualizado a vacio:"+JSON.stringify(err));
                    }
                });
                    
                    console.log("rotativo.js - enviarMensajeTextoIngresado - Mensaje 2: la respuesta es: " + JSON.stringify(body, null, 4));
                } else {

                }
            });
        }else{
            console.log("rotativo.js - enviarMensajeInicial - obtenerPerfilUsuario FB: Failed calling Send API: " + JSON.stringify(error, null, 4));
        }
    });

};

rotativo.ingresarNuevoMonto = function(recipientId) 
{
    console.log("rotativo.js - enviarMensajeInicial - Usuario Id FB: "+recipientId);
    //invocamos a facebook para obtener la informacion del perfil del usuario.
    console.log("rotativo.js - enviarMensaje2doSaberrotativo - Usuario Id FB: "+recipientId);
    var messageData = 
    {
        recipient: {
            id: recipientId
        },
        message: 
        {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "¿Desea ingresar un nuevo monto?",
                    buttons:[{
                        type: "postback",
                        title: "SI",
                        payload: "SI_MONTO"
                    },{
                        type: "postback",
                        title: "NO",
                        payload: "NO_MONTO,"
                    }]
                }
            }
        }
    };
    clienteFacebook.enviarMensaje(messageData, function (error, response) {
        console.log("se envio correctamente el mensaje");
    });
}

   rotativo.realizarTransaccion = function(recipientId,identificacion,valorTransaccion, objPersona) {
    console.log("OBJPERSONA QUE llega para realizar la transaccion"+objPersona);
    var query ={"idFacebook":recipientId,"identificacion":identificacion};
    clienteMongoDB.buscarSessionRotativoXQuery(query, function(err, resultado){
        if(!err){
            if(resultado){
                var access_token = resultado.access_token;
                //remoteAccount idProduct de accounts
                //remoteAccountType tipo de la cuenta de accounts sale de codeProduct en /accounts
                //revisar el request que se le envia al API
                var objeto = {"remoteAccount": objPersona.idProduct , "amount":""+valorTransaccion,"remoteAccountType":objPersona.codigoProducto};
                //var objeto = {"remoteAccount": objPersona.numeroCuenta , "amount":valorTransaccion,"remoteAccountType":objPersona.codigoProducto};
                console.log('ESTE ES EL BODY QUE SE HACE REQUEST AL API DE TRANSFERS'+ JSON.stringify(objeto,null,4));
                var resourceURL = process.env.API_CATALOG_URL+"/loans-products/v1/revolving-loan/"+objPersona.idProductLoan+"/transfers";
                //var resourceURL = process.env.API_CATALOG_URL+"/loans-products/v1/revolving-loan/"+objPersona.numeroCredito+"/transfers";
                console.log('ESTE ES EL NELACE DE LA TRANSACCION'+ resourceURL);
                clienteApiConnect.ejecutarPOSTTransaccion(resourceURL, objeto, access_token, function(err, respuesta){
                    console.log("realizarTransaccionrealizarTransaccionrealizarTransaccionrealizarTransaccionrealizarTransaccion");
                    console.log("RESPUESTA");
                    console.log("RESPUESTA"+JSON.stringify(respuesta, null, 4));

                    if(!err && respuesta.statusCode == 200){
                        var myJSONString = respuesta.body;

                        if(myJSONString.errorCode)
                        {

                            //HUBO UN ERROR DE ERRORCODE
                            if(myJSONString.errorCode=='97')
                            {
                                 console.log("respuesta exitosa del servicio"+JSON.stringify(respuesta.body));
                                var messageData2 = 
                                {
                                    recipient: {
                                        id: recipientId
                                    },
                                    message: {
                                        text: "El monto a transferir es menor al permitido.",
                                        metadata: "DEVELOPER_DEFINED_METADATA"
                                    }
                                };
                                clienteFacebook.enviarMensaje(messageData2, function (error, response) 
                                    {
                                        if(!error)
                                        {
                                            console.log('EL MONTO MENOR SE ELE ENVIO A LA PERSONA CO NERROR');
                                            rotativo.ingresarNuevoMonto(recipientId);
                                        } else {
                                            console.log('Error al enviarle el mensaje de erorr de monto a la persona'+error);
                                        }
                                    });
                            } else if(myJSONString.errorCode == 20)
                            {
                                console.log("respuesta errónea del servicio" + JSON.stringify(respuesta.body.errorCode));
                                var messageData2 = {
                                    recipient: {
                                        id: recipientId
                                    },
                                    message: {
                                        text: "Usted no cuenta con los fondos suficientes para esta transacción",
                                        metadata: "DEVELOPER_DEFINED_METADATA"
                                    }
                                };
                                clienteFacebook.enviarMensaje(messageData2, function (error, response)
                                {
                                    if(!error)
                                    {
                                        console.log('EL MONTO MAYOR SE LE ENVIO A LA PERSONA CON ERROR');
                                        rotativo.ingresarNuevoMonto(recipientId);
                                    }
                                });
                            }  else {

                            var filtro = {"idFacebook":recipientId,"numeroIdentificacion":identificacion};
                            var actualizacion = {estado:"", idProductLoan:""};
                            clienteMongoDB.insertarOActualizarestado(filtro, actualizacion, function(err, data){
                                if(!err){
                                    rotativo.enviarMensajeErrorTransaccion(recipientId);
                                    console.log("app.js - actualizarTarjetasXFiltro - Cliente Estado Actualizado a vacio:"+JSON.stringify(data, null, 4));
                                    //activacionTC.enviarMensajeDespedidaOTP(recipientId, identificacion);
                                     var consulta = {idFacebook: recipientId};
                                     clienteMongoDB.borrarOActualizarSession(consulta, function(err, res){
                                        if(!err){
                                            console.log("-----------------------------Actualización exitosa----------------------------");
                                        }
                                            else{
                                                console.log("-----------------------------Error en la actualización----------------------------");
                                            }
                                      });
                                }else{
                                    rotativo.enviarMensajeErrorTransaccion(recipientId);
                                    console.log("Error - actualizarTarjetasXFiltro - Cliente Estado Actualizado a vacio:"+JSON.stringify(err));
                                }
                            });
                            }
                        }else{
                            console.log("respuesta exitosa del servicio"+JSON.stringify(respuesta.body));
                            var messageData2 = {
                                recipient: {
                                    id: recipientId
                                },
                                message: {
                                    text: "Transacción ha sido exitosa.",
                                    metadata: "DEVELOPER_DEFINED_METADATA"
                                }
                            };
                            clienteFacebook.enviarMensaje(messageData2, function (error, response) {
                                if(!error && response.statusCode == 200){

                                    var messageData3 = {
                                        recipient: {
                                            id: recipientId
                                        },
                                        message: {
                                            text: "Gracias por usar nuestros servicios. Que tenga un feliz día.",
                                            metadata: "DEVELOPER_DEFINED_METADATA"
                                        }
                                    };
                                    clienteFacebook.enviarMensaje(messageData3, function (error, response, body) {
                                        if(!error){
                                            if(response){
                                                //colocar aqui actualizacion de estado a vacio
                                                var filtro = {"idFacebook":recipientId, "numeroIdentificacion":objPersona.numeroIdentificacion, "tipoIdentificacion":objPersona.tipoIdentificacion};
                                                var actualizacion = {estado:"", idFacebook:"", idProduct:"",codigoProducto:"",fechaModificado:"",seleccionada:""};
                                                clienteMongoDB.borrarOActualizarestado(filtro, actualizacion, function(err, data){
                                                    if(!err){
                                                        console.log('Estado actualizado correctamente');
                                                    }else{
                                                        console.log("Error - actualizarTarjetasXFiltro - Cliente Estado Actualizado a vacio:"+JSON.stringify(err));
                                                    }
                                                });

                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }else{
                        console.log("ERROR AL EJECUTAR clienteApiConnect.ejecutarPOST()");
                        console.log("ERROR AL EJECUTAR clienteApiConnect.ejecutarPOST()"+JSON.stringify(err));

                        //colocar aqui actualizacion de estado a vacio

                        var filtro = {"idFacebook":recipientId,"numeroIdentificacion":identificacion};
                        var actualizacion = {estado:""};
                        clienteMongoDB.insertarOActualizarestado(filtro, actualizacion, function(err, data){
                            if(!err){
                                rotativo.enviarMensajeErrorTransaccion(recipientId);
                                console.log("app.js - actualizarTarjetasXFiltro - Cliente Estado Actualizado a vacio:"+JSON.stringify(data, null, 4));
                                //activacionTC.enviarMensajeDespedidaOTP(recipientId, identificacion);
                            }else{
                                rotativo.enviarMensajeErrorTransaccion(recipientId);
                                console.log("Error - actualizarTarjetasXFiltro - Cliente Estado Actualizado a vacio:"+JSON.stringify(err));
                            }
                        });
                    }
                });
            }
            else{
            }
        }
    });
};


rotativo.enviarMensajeErrorTransaccion = function(recipientId) {

    console.log("rotativo.js - enviarMensajeInicial - Usuario Id FB: "+recipientId);

    //invocamos a facebook para obtener la informacion del perfil del usuario.
    clienteFacebook.obtenerPerfilUsuario(recipientId, function(error, response, bodyPerfil){
        if(!error && response.statusCode == 200){
            console.log("rotativo.js - enviarMensajeInicial - obtenerPerfilUsuario en Facebook: La respuesta es: "+bodyPerfil);
            var res = JSON.parse(bodyPerfil);
            var messageData2 = {
                recipient: {
                    id: recipientId
                },
                message: {
                    text: "En estos momentos no podemos atenderlo por favor intente más tarde. ",
                    metadata: "DEVELOPER_DEFINED_METADATA"
                }
            };

            clienteFacebook.enviarMensaje(messageData2, function (error, response, body) {
                if (!error) {
                    rotativo.mensajeportal(recipientId);
                    
                } else {

                }
            });
        }else{
            console.log("rotativo.js - enviarMensajeInicial - obtenerPerfilUsuario FB: Failed calling Send API: " + JSON.stringify(error, null, 4));
        }
    });

};

rotativo.mensajeportal = function(recipientId) {

    console.log("rotativo.js - enviarMensajeInicial - Usuario Id FB: "+recipientId);

    //invocamos a facebook para obtener la informacion del perfil del usuario.
    clienteFacebook.obtenerPerfilUsuario(recipientId, function(error, response, bodyPerfil){
        if(!error && response.statusCode == 200){
            console.log("rotativo.js - enviarMensajeInicial - obtenerPerfilUsuario en Facebook: La respuesta es: "+bodyPerfil);
            var res = JSON.parse(bodyPerfil);
            var messageData2 = {
                recipient: {
                    id: recipientId
                },
                message: {
                    text: "Por favor realice el uso por su portal Empresarial o acérquese a la oficina más cercana",
                    metadata: "DEVELOPER_DEFINED_METADATA"
                }
            };
            var consulta = {"idFacebook" : recipientId};
            var accion = {"estado" : "", "seleccionada" : "","idFacebook":"","idProduct":"",codigoProducto:"",fechaModificado:"",idProductLoan:""};
            clienteMongoDB.borrarOActualizarestado(consulta, accion, function(err, res){
                if(!err){
                    console.log("-----------------------------Actualización exitosa----------------------------");
                }
                    else{
                        console.log("-----------------------------Error en la actualización----------------------------");
                    }
              }); 
            var consulta = {idFacebook: recipientId};
            clienteMongoDB.borrarOActualizarSession(consulta, function(err, res){
                if(!err){
                    console.log("-----------------------------Actualización exitosa en la sesion----------------------------");
                }
                    else{
                        console.log("-----------------------------Error en la actualización de la sesion----------------------------");
                    }
              });
            clienteFacebook.enviarMensaje(messageData2, function (error, response, body) {
                if (!error) {
                    console.log("rotativo.js - enviarMensajeTextoIngresado - Mensaje 2: la respuesta es: " + JSON.stringify(body, null, 4));
                    //rotativo.fin(recipientId);
                } else {

                }
            });
        }else{
            console.log("rotativo.js - enviarMensajeInicial - obtenerPerfilUsuario FB: Failed calling Send API: " + JSON.stringify(error, null, 4));
        }
    });

};

/*-----------------------------------------------------End Código nuevo--------------------------------------------------------------------------*/

