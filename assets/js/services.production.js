//JS: Gluo
var EnvironmentServicesProduction = function(){

	var autocompleteTokenfield = function (term, groups, cuentas){

		return true;

	}

	var login = {
		getPassForgotResponse : function(data, form){
			/**Posibles mensajes
				  		
				SIN REGISTRARSE UF
					El número que ingresaste no puede ser registrado en Mi Telcel Empresas, debido a que no es una cuenta Corporativa Telcel.

				SIN REGISTRARSE
					El correo electrónico que ingresaste no está asociado a una cuenta Corporativa Telcel. 
					¿Necesitas ayuda? Contacta a tu Ejecutivo.

				SIN REGISTRARSE CON CORREO ELECTRONICO COPORATIVO
					El correo electrónico que ingresaste no está registrado en Mi Telcel Empresas. 
					¿Necesitas ayuda? Contacta a tu Ejecutivo.

				ERROR
					Esta consulta por el momento no está disponible. 
					Estamos trabajando para servirte mejor, por favor intenta más tarde.

				ÉXITO
					Tu contraseña ha sido enviada con éxito al correo electrónico que proporcionaste en tu registro.

				ERROR (intento 6)
					Tu contraseña recuperada fue enviada al correo electrónico que proporcionaste en tu registro. ¿Necesitas ayuda? Contacta a tu Ejecutivo.
			**/

			/* Error */
			if(error){
				var msgHTML = 'Esta consulta por el momento no está disponible.';
				$('.login-form-block .general-error .text').html(msgHTML);
				handleErrorTooltip(true);
				scrollToElement($('.login-form'));
			}

			else{
				$(form).find('.form-block').addClass('hidden');
				$(form).find('.success-tooltip').removeClass('hidden');
			}

			function handleErrorTooltip(show){
				var $error = $('.login-form-block .general-error');
				if(show)
					$error.removeClass('hidden');
				else
					$error.addClass('hidden');
			}
		},

		getPassForgotFailResponse : function (error, form){		
			console.log(error);
		},
		getUserLoginResponse : function(data, form){
			/**Posibles mensajes
		  		
		  		Error (Intentos 1-5, 7, 9)
			  		La contraseña es incorrecta. Por favor, verifícala. ¿Olvidaste tu contraseña?
				
				Bloqueo 15 mins (Intento 6) 
				Bloqueo 30 mins (Intento 8)
					Has excedido el número de intentos. Por seguridad no podrás iniciar sesión en este momento. Por favor, intenta más tarde.

				Bloqueo total (Intento 10)
					Has excedido el número de intentos permitidos. Para cualquier aclaración, comunícate con tu ejecutivo.

			**/

			/** ERROR**/
			if(error){
				var msgHTML = 'Has excedido el número de intentos permitidos. Para cualquier aclaración, comunícate con tu ejecutivo.';
				$('.login-form-block .general-error .text').html(msgHTML);
				$('.login-form-block .general-error').removeClass('hidden');
			}
			else
				location.reload();
		},
		getUserLoginFailResponse : function(error, form){
			console.log(error);
		},
		getActivarCuentaResponse : function(data, form){
			console.log('Formulario enviado.');
		},
		getActivarCuentaFailResponse : function(error, form){
			console.log(error);
		},
		getEstablecerContrasenaResponse : function(data, form){
			console.log('Formulario enviado.');
		},
		getEstablecerContrasenaFailResponse : function(error, form){
			console.log(error);
		},
		getActualizarDatosResponse : function(data, form){
			console.log('Formulario enviado.');
		},
		getActualizarDatosFailResponse : function(error, form){
			console.log(error);
		},
	}


	return{

		general : {
			autocomplete : autocompleteTokenfield
		},
		login : {
			passForgotCallSuccess : login.getPassForgotResponse,
			passForgotCallFail : login.getPassForgotFailResponse,
			userLoginCallSuccess : login.getUserLoginResponse,
			userLoginCallFail : login.getUserLoginFailResponse,
			activarCuentaCallSuccess : login.getActivarCuentaResponse,
			activarCuentaCallFail : login.getActivarCuentaFailResponse,
			reestablecerContrasenaCallSuccess : login.getEstablecerContrasenaResponse,
			reestablecerContrasenaCallFail : login.getEstablecerContrasenaFailResponse,
			actualizarDatosCallSuccess : login.getActualizarDatosResponse,
			actualizarDatosCallFail : login.getActualizarDatosFailResponse
		}

	}

}();