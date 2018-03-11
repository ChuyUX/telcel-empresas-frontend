var loginTemplate = (function(){

	var formValidators = { 'user' : null, 'admin' : null, 'pass' : null, 'register' : null };
	var sending = { 'user' : false, 'admin' : false, 'pass' : false, 'register' : false };
	
	var currentLogin = 'admin';

	function initLoginComponent(){
		if($('.login-form-block').length>0){
			setRandomBackground();
			validateLoginAdminForm();
			validatePasswordAdminForm();
			homeAdmin();
			tooltipComponent.inicializar();
		}
	}

	function setRandomBackground(){
		var totalbg = 6,
		bg = Math.floor(Math.random() * (6 - 1 + 1)) + 1,
		$bg = $('.bg-login');

		$bg.addClass('bg-'+bg);
	}

	function handleErrorTooltip(show){
		var $error = $('.login-form-block .general-error');
		if(show)
			$error.removeClass('hidden');
		else
			$error.addClass('hidden');
	}

	function homeAdmin(){
		initActions();
		showHomeAdmin();

		$(window).hashchange({
			hash: "#administrador",
			onSet: function() {
				showHomeAdmin();
			},
			onRemove: function() {
			   showHomeUser();
			},
		});

		function showHomeAdmin(){
			resetForms();
			scrollToElement($('body'));
			$('.login-form-block .register,.login-form.user-form, #pass-user').addClass('hidden');
			$('.login-form.admin-form, #pass-admin').removeClass('hidden');
		}

		function showHomeUser(){
			resetForms();
			scrollToElement($('body'));
			$('.login-form.admin-form, #pass-admin').addClass('hidden');
			$('.login-form-block .register, .login-form.user-form, #pass-user').removeClass('hidden');

		}

		function resetForms(){
			handleErrorTooltip(false);
			$('.login-form-block').find('form').find("input[type=text], input[type=email], input[type=number], input[type=password], select").val("");
			
			// Esconder tooltip
			$('.triangle-tooltip').addClass('hidden');
			$('.login-form-block').find('form').find('button[type="submit"]').prop('disabled', true);

			$('.login-form-block .general-success').addClass('hidden');
			$('#pass-forgot-user .form-block').removeClass('hidden');

			$('.login-form-block .general-success').addClass('hidden');
			$('#pass-forgot-admin .form-block').removeClass('hidden');

			$('.login-form-block .general-success').addClass('hidden');
			$('#register-form .form-block').removeClass('hidden');
		

			if(formValidators['admin'])
				formValidators['admin'].resetForm();

			if(formValidators['user'])
				formValidators['user'].resetForm();

			if(formValidators['pass'])
				formValidators['pass'].resetForm();
			
			if(formValidators['register'])
				formValidators['register'].resetForm();

		}

		function initActions(){

			$('#a-admin-home').click(function(e){
				e.preventDefault();
				updateViewAdmin();
			});

			$('#a-user-home').click(function(e){
				e.preventDefault();
				updateViewUser();
			});
		}

		function updateViewAdmin(){
			currentLogin = 'admin';

			$('#a-admin-home').addClass('hidden');
			$('#a-user-home').removeClass('hidden');

			$('#user-select').addClass('hidden');
			$('#admin-select').removeClass('hidden');
			$('.current-login').html('como administrador');

		}

		function updateViewUser(){
			currentLogin = 'user';
			$('#a-user-home').addClass('hidden');
			$('#a-admin-home').removeClass('hidden');

			$('#admin-select').addClass('hidden');
			$('#user-select').removeClass('hidden');
			$('.current-login').html('como ejecutivo');
		}
	}	

	var tooltipComponent = function(){

		function init(){
			initElementsCTA();
			addCloseAction();
		}

		function initNuevo($element){

			var show = $element.data('show');
			var hide = ($element.data('hide')) ? $element.data('hide') : null;

			if(show) {
				addAction($element, show, hide);
			}

		}

		function initElementsCTA(){
			
			$('.login-form-block .cta-shows-block').each(function( index ) {

				var $element = $(this);

				var show = $element.data('show');

				var hide = ($element.data('hide')) ? $element.data('hide') : null;

				if(show) {
					addAction($element, show, hide);
				}

			});
			
		}

		function resetFormsTooltip(){
			handleErrorTooltip(false);
			var $inputs = $('.triangle-tooltip').find('form').find("input[type=text], input[type=email], input[type=number], input[type=password], select");
			$inputs.val("");
			$inputs.removeClass('error');

			$('.triangle-tooltip').find('form').find('button[type="submit"]').prop('disabled', true);

			if(formValidators['pass'])
				formValidators['pass'].resetForm();

			if(formValidators['register'])
				formValidators['register'].resetForm();


			$('.login-form-block .general-success').addClass('hidden');
			$('#pass-forgot .form-block').removeClass('hidden');

			$('.login-form-block .general-success').addClass('hidden');
			$('#register-form .form-block').removeClass('hidden');
		}

		function addAction($element, show, hide){
			$(show).addClass('hidden').addClass('cta-shown-block');

			$element.on("click", function(e){
				e.preventDefault();

				//$('.login-form-block .triangle-tooltip').addClass('hidden');
				$('.login-form-block .triangle-tooltip').hide();

				resetFormsTooltip();

				if(hide){
					//$(hide).addClass('hidden');
					$(hide).hide();
				}

				$(show).removeClass('hidden');
				$(show).slideToggle( 800 );
				scrollToElement($(show));
			});

		}

		function addCloseAction(){
			
			$('.close-container .icon').each(function( index ) {
				var $element = $(this);
				var hide = ($element.data('hide')) ? $element.data('hide') : null;

				$element.on("click", function(e){
					e.preventDefault();
					resetFormsTooltip();

					if(hide){
						$(hide).addClass('hidden');
					}
				});

			});
		}

		return{
			inicializar : init,
			inicializarExtra : initNuevo
		}

	}();

	function validatePasswordAdminForm(){

		var $form = $('#pass-forgot-admin .pass-forgot');

		disableSumbitButton($form, true);
		//checkRequiredElements('#pass-forgot-admin .pass-forgot');

		formValidators['pass'] = $form.validate({
		  rules: {
			password_email: {
			  required: true,
			  email: true
			}
		  },
		 
		  messages: {
			 password_email: {
			   required: "Ingresa tu correo electrónico.",
			   email: "Ingresa un correo electrónico válido."
			 }
		   },
			submitHandler: function(form) {

				if(!sending['pass'])
				{
					sendFormData(form);
				}

			}
		});

		checkGeneralValidForm($form);

		function sendFormData(form){

			sending['pass'] = true; 
			$(form).find('button[type="submit"]').prop('disabled', true);

			handleErrorTooltip(false);

			var self = $(form).serialize();
			
			loadingIcon(form, true);

			// CAMBIAR POR SERVICIO DEL POST DE LA INFORMACIÓN ADMIN
			var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
			
			$.post(  urlPOST , self )
			.done(function( data ) {

			  	loadingIcon(form, false);
			  	Services.login.passForgotCallSuccess(data, form);

				sending['pass'] = false;

			 })
			.fail(function( jqxhr, textStatus, error ) {
				loadingIcon(form, false);
			  	Services.login.passForgotCallFail(error, form);
			  	sending['pass'] = false;
			});
		}
	}

	function loadingIcon(form, show){
		var loading = '<div class="loading-block"><div class="sk-circle"> <div class="sk-circle1 sk-child"></div> <div class="sk-circle2 sk-child"></div> <div class="sk-circle3 sk-child"></div> <div class="sk-circle4 sk-child"></div> <div class="sk-circle5 sk-child"></div> <div class="sk-circle6 sk-child"></div> <div class="sk-circle7 sk-child"></div> <div class="sk-circle8 sk-child"></div> <div class="sk-circle9 sk-child"></div> <div class="sk-circle10 sk-child"></div> <div class="sk-circle11 sk-child"></div> <div class="sk-circle12 sk-child"></div> </div></div>';

		if(show){
			$(form).after(loading);
		}
		else{
			$('.loading-block').remove();
		}
	}

	/***LOGIN FORM Admin***/
	function validateLoginAdminForm(){

		var $form = $('.login-form.admin-form');

		disableSumbitButton($form, true);
		//checkRequiredElements('.login-form.admin-form');

		formValidators['admin'] = $form.validate({
		  rules: {
			admin_email: {
			  required: true,
			  email: true
			},
			admin_contrasena: {
			  required: true,
			  minlength: 8
			}
		  },
		  messages: {
			admin_contrasena: {
			   required: "Ingresa tu contraseña.",
			   minlength: "Mínimo de 8 caracteres."
			},
			 admin_email: {
			   required: "Ingresa tu correo electrónico.",
			   email: "Ingresa un correo electrónico válido."
			 }
		   },
			submitHandler: function(form) {
				if(!sending['admin']){
					sendFormData(form);
				}

			}
		});

		checkGeneralValidForm($form);

		function loadingIcon(form, show){
			var loading = '<div class="loading-block"><div class="sk-circle"> <div class="sk-circle1 sk-child"></div> <div class="sk-circle2 sk-child"></div> <div class="sk-circle3 sk-child"></div> <div class="sk-circle4 sk-child"></div> <div class="sk-circle5 sk-child"></div> <div class="sk-circle6 sk-child"></div> <div class="sk-circle7 sk-child"></div> <div class="sk-circle8 sk-child"></div> <div class="sk-circle9 sk-child"></div> <div class="sk-circle10 sk-child"></div> <div class="sk-circle11 sk-child"></div> <div class="sk-circle12 sk-child"></div> </div></div>';

			if(show){
				$(form).find('button[type="submit"]').parent().prepend(loading);
			}
			else{
				$('.loading-block').remove();
			}
		}

		function sendFormData(form){

			sending['admin'] = true;
			$(form).find('button[type="submit"]').prop('disabled', true);
			handleErrorTooltip(false);
			loadingIcon(form, true);

			var self = $(form).serialize();

			// CAMBIAR POR SERVICIO DEL POST DE LA INFORMACIÓN ADMIN
			var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
			
			$.post(  urlPOST , self )
			.done(function( data ) {

				$(form).find('input[type="password"]').val('');
			  	loadingIcon(form, false);
			  	Services.login.userLoginCallSuccess(data, form);

			  	/**Agregar funcionamiento del nuevo componente si existe**/
			  	var $new = $('.cta-shows-block.nuevo');
			  	if($new.length>0)
			  		tooltipComponent.inicializarExtra($new);
			  	/**Fin Agregar funcionamiento del nuevo componente si existe**/

				sending['admin'] = false;

			 })
			.fail(function( jqxhr, textStatus, error ) {
			  	//Mensaje de error del SISTEMA
			  	loadingIcon(form, false);
			  	Services.login.userLoginCallFail(error, form);
			  	sending['admin'] = false;
			});
		}
	}

	return{
		inicializar : initLoginComponent
	};

})();

var miCuenta = (function(){

	var $mainView = $('#mi-cuenta-view');
	var formElement = {
		id : '#form-mi-cuenta',
		validator : null,
		sending: false
	};

	function init(){
		if($('#mi-cuenta-view').length>0){
			initActions();
			validateForm();
		}
	}

	function initActions(){

		$mainView.on('click', '.show-text', function(){

			var $button = $(this);
			var $input = $button.parent().prev('div').find('input');
			$button.toggleClass('active');

			if($button.hasClass('active'))
				$input.attr('type', 'text');
			else
				$input.attr('type', 'password');
		});

		$mainView.on('change', 'input[type="file"]', function(e){
		      var $file = $(this);
		      var file = $file[0].files[0];
		      var filetype = file.type;
		      var $parent = $('.avatar-block .input-box-container');

		      $parent.removeClass('error');
		      $('.avatar-block >.data-write label.error').remove();

		      if(filetype == 'image/png' || filetype == 'image/jpeg'){
		      	var reader = new FileReader();
		      
			      reader.readAsDataURL(file);
			      reader.onloadend = function () {
			        $('.avatar-block img').attr('src', reader.result);
			      }
			  }
			  else{
			  	$('.avatar-block img').attr('src', imgUrl+'avatar-general.jpg');
			  	$parent.addClass('error');
			  	$('.avatar-block >.data-write').append('<label class="error error-dd">El archivo es inválido los formatos aceptados son .jpg y .png</label>');
			  }
				var title =  $file.val().replace(/^.*[\\/]/, '');
				$parent.prop('title', title);
		});


		$mainView.on('click' , '.avatar-block img, .avatar-block .icon', function(e){
			$('#avatar_usuario').trigger('click');
		});

		$mainView.on('input' , '#nuevo-pass-usuario', function(e){
			var $passInput = $('#nuevo-pass-usuario-r');
			if($passInput.length>0 && $passInput.val().length>0)
				$passInput.valid();
		});

	}

	function validateForm(){

		var $form = $('#form-mi-cuenta');

		disableSumbitButton($form, true);
		//checkRequiredElements('#form-mi-cuenta');
		checkRequiredElementsOptional('#form-mi-cuenta');
		checkTelefonoLength($form);


		formElement['validator'] = $form.validate({
			ignore : "",
		  	rules: {
				nuevo_pass_usuario: {
					minlength: 8,
					maxlength: 15,
					pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){8,15}$/,
					notEqual : "#pass-usuario"
				},
	    		nuevo_pass_usuario_r: {
			    	equalTo: "#nuevo-pass-usuario"
			    },
			    nombre_usuario: {
					required: true,
					basicName: true,
					minlength: 3,
					maxlength: 40
				},
				avatar_usuario: {
					extension: "jpg|png",
					filesize: 10000000
				},
				puesto_usuario: {
					minlength: 2,
					maxlength: 60
				},
				numero : {
					required : true,
					digits: true,
					minlength: 10,
					maxlength: 10,
				},
				ext_usuario: {
				  digits: true,
				  maxlength: 4
				}
		  	},
		  messages: {
		  	pass_usuario: {
			   required: "Ingresa tu contraseña actual.",		   
			 },
			 nuevo_pass_usuario: {
			   required: "Ingresa una contraseña.",
			   minlength: "La contraseña debe tener de 8 a 15 caracteres (letras y números). Es sensible al uso de MAYÚSCULAS y minúsculas. No utilices acentos ni caracteres especiales ñ Ñ & ( ) ¡ ! ¿? % - / $ * + , .",
			   maxlength : "La contraseña debe tener de 8 a 15 caracteres (letras y números). Es sensible al uso de MAYÚSCULAS y minúsculas. No utilices acentos ni caracteres especiales ñ Ñ & ( ) ¡ ! ¿? % - / $ * + , .",
			   pattern: "La contraseña debe tener de 8 a 15 caracteres (letras y números). Es sensible al uso de MAYÚSCULAS y minúsculas. No utilices acentos ni caracteres especiales ñ Ñ & ( ) ¡ ! ¿? % - / $ * + , .",
			   notEqual : "La nueva contraseña debe ser diferente a la contraseña actual."
			   
			 },
			 nuevo_pass_usuario_r: {
			   required: "Ingresa nuevamente tu contraseña para confirmarla.",
			   equalTo: "Las contraseñas no coinciden. Por favor inténtalo de nuevo."
			 },
			avatar_usuario: {
				extension: "El archivo es inválido los formatos aceptados son .jpg y .png",
				filesize: "El archivo debe ser menor a 10 MB."
			},
			puesto_usuario: {
				minlength: "El puesto debe contener al menos 2 caracteres.",
			   	maxlength : "El puesto no debe ser mayor a 60 caracteres."
			},
			nombre_usuario: {
				required : "Ingresa un nombre.",
				basicName: "Este campo solo acepta letras, números, punto y espacios.",
				minlength: "El nombre debe contener al menos 3 caracteres.",
			   	maxlength : "El nombre no debe ser mayor a 40 caracteres."
			},
			numero: {
			   required: "Ingresa un número de contacto.",
			   digits: "Ingresa un número válido.",
			   minlength: "Ingresa un número de 10 dígitos.",
			   maxlength: "Ingresa un número de 10 dígitos."
			 },
			ext_usuario: {
			  digits: "Ingresa solo números.",
			  maxlength: "Ingresa máximo 4 dígitos."
			}

		   },
		   errorClass : "error",
		   errorPlacement: function(error, $element) {
			   	var $parent = $element.parent();

			   	if($element.attr("name") == "numero"){
			   		$form.find('.lada').addClass('error-dd error');
			   		$form.find('.telefono').addClass('error-dd error');
			   		$parent.append( error );
			   	}
			   	else if($element.attr("name") == "nombre_usuario" || $element.attr("name") == "puesto_usuario"){
			   		$parent = $parent.parent('.outside-input-container');
			   		$('<div class="error-aux col-sm-8 col-xs-8 col-xs-offset-4 col-sm-offset-4"></div>').insertAfter( $parent );
			   		$parent.next('.error-aux').append(error);
			   	}
			   	else{
			   		$parent.append( error );
			   	}
			   	
			},
		  	success: function(label) {
		  		
		  		if($form.find('.numero').val().length==10){
		  			$('#numero-error').remove();
		    		$form.find('.error-dd').removeClass('error-dd error');
		  		}

		  		$(label).parent('.error-aux').remove();

		  	},
		  	submitHandler: function(form) {
		  		if(!formElement['sending']){
		  			sendFormData(form);
		  		}
			}

		});

		checkGeneralValidForm($form);
	}

	function sendFormData(form){
		formElement['sending'] = true;
		$(form).find('button[type="submit"]').prop('disabled', true);

		var self = $(form).serialize();

		// CAMBIAR POR SERVICIO DEL POST DE LA INFORMACIÓN ADMIN
		var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
		
		$.post(  urlPOST , self )
		.done(function( data ) {

		  	Services.login.actualizarDatosCallSuccess(data, form);
			formElement['sending'] = false;

		 })
		.fail(function( jqxhr, textStatus, error ) {
		  	//Mensaje de error del SISTEMA
		  	Services.login.actualizarDatosCallFail(error, form);
		  	formElement['sending'] = false;
		});
	}

	return{
		inicializar: init
	}

})();

var activacionCuenta = (function(){

	var $mainView = $('#activacion-cuenta-view');
	var formElement = {
		id : '#form-activacion-cuenta',
		validator : null,
		sending: false
	};

	function init(){
		if($('#activacion-cuenta-view #form-activacion-cuenta').length>0){
			initActions();
			validateForm();
		}
	}


	function initActions(){
		$mainView.on('click', '.show-text', function(){

			var $button = $(this);
			var $input = $button.parent().prev('.input-container').find('input');
			$button.toggleClass('active');

			if($button.hasClass('active'))
				$input.attr('type', 'text');
			else
				$input.attr('type', 'password');
		});

		$mainView.on('input' , '#nuevo-pass', function(e){
			var $passInput = $('#nuevo-pass-r');
			if($passInput.length>0 && $passInput.val().length>0)
				$passInput.valid();
		});
	}

	function validateForm(){

		var $form = $('#form-activacion-cuenta');

		disableSumbitButton($form, true);
		//checkRequiredElements('#form-activacion-cuenta');

		formElement['validator'] = $form.validate({
		  rules: {
			nuevo_pass: {
				required: true,
				minlength: 8,
				maxlength: 15,
				pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){8,15}$/
			},
    		nuevo_pass_r: {
		    	equalTo: "#nuevo-pass"
		    },
		    checkboxTerminos: {
				required : true
			}

		  },
		  messages: {
			 nuevo_pass: {
			   required: "Ingresa una contraseña.",
			   minlength: "La contraseña debe tener de 8 a 15 caracteres (letras y números). Es sensible al uso de MAYÚSCULAS y minúsculas. No utilices acentos ni caracteres especiales ñ Ñ & ( ) ¡ ! ¿? % - / $ * + , .",
			   maxlength : "La contraseña debe tener de 8 a 15 caracteres (letras y números). Es sensible al uso de MAYÚSCULAS y minúsculas. No utilices acentos ni caracteres especiales ñ Ñ & ( ) ¡ ! ¿? % - / $ * + , .",
			   pattern: "La contraseña debe tener de 8 a 15 caracteres (letras y números). Es sensible al uso de MAYÚSCULAS y minúsculas. No utilices acentos ni caracteres especiales ñ Ñ & ( ) ¡ ! ¿? % - / $ * + , ."
			   
			 },
			 nuevo_pass_r: {
			   required: "Ingresa nuevamente tu contraseña para confirmarla.",
			   equalTo: "Las contraseñas no coinciden. Por favor inténtalo de nuevo."
			 },
			 checkboxTerminos: {
				required: "Acepta los términos y condiciones para continuar."
			}

		   },
		   errorClass : "error-dd error",
		   errorPlacement: function(error, $element) {
			   	var $parent = $element.parent('.input-container');
			   	$parent.append(error);
			},
			submitHandler: function(form) {
				if(!formElement['sending']){
		  			sendFormData(form);
		  		}
			}
		});

		checkGeneralValidForm($form);
	}

	function sendFormData(form){
		formElement['sending'] = true;
		$(form).find('button[type="submit"]').prop('disabled', true);

		var self = $(form).serialize();

		// CAMBIAR POR SERVICIO DEL POST DE LA INFORMACIÓN ADMIN
		var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
		
		$.post(  urlPOST , self )
		.done(function( data ) {

		  	Services.login.activarCuentaCallSuccess(data, form);
			formElement['sending'] = false;

		 })
		.fail(function( jqxhr, textStatus, error ) {
		  	//Mensaje de error del SISTEMA
		  	Services.login.activarCuentaCallFail(error, form);
		  	formElement['sending'] = false;
		});
	}

	return{
		inicializar: init
	}

})();

var estableceContrasena = (function(){

	var $mainView = $('#activacion-cuenta-view');
	var formElement = {
		id : '#form-establece-contrasena',
		validator : null,
		sending: false
	};

	function init(){
		if($('#activacion-cuenta-view #form-establece-contrasena').length>0){
			initActions();
			validateForm();
		}
	}


	function initActions(){
		$mainView.on('click', '.show-text', function(){

			var $button = $(this);
			var $input = $button.parent().prev('.input-container').find('input');
			$button.toggleClass('active');

			if($button.hasClass('active'))
				$input.attr('type', 'text');
			else
				$input.attr('type', 'password');
		});

		$mainView.on('input' , '#nuevo-pass', function(e){
			var $passInput = $('#nuevo-pass-r');
			if($passInput.length>0 && $passInput.val().length>0)
				$passInput.valid();
		});
	}

	function validateForm(){

		var $form = $('#form-establece-contrasena');

		disableSumbitButton($form, true);
		//checkRequiredElements('#form-establece-contrasena');

		formElement['validator'] = $form.validate({
		  rules: {
			nuevo_pass: {
				required: true,
				minlength: 8,
				maxlength: 15,
				pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){8,15}$/
			},
    		nuevo_pass_r: {
		    	equalTo: "#nuevo-pass"
		    },
		    checkboxTerminos: {
				required : true
			},

		  },
		  messages: {
			 nuevo_pass: {
			   required: "Ingresa una contraseña.",
			   minlength: "La contraseña debe tener de 8 a 15 caracteres (letras y números). Es sensible al uso de MAYÚSCULAS y minúsculas. No utilices acentos ni caracteres especiales ñ Ñ & ( ) ¡ ! ¿? % - / $ * + , .",
			   maxlength : "La contraseña debe tener de 8 a 15 caracteres (letras y números). Es sensible al uso de MAYÚSCULAS y minúsculas. No utilices acentos ni caracteres especiales ñ Ñ & ( ) ¡ ! ¿? % - / $ * + , .",
			   pattern: "La contraseña debe tener de 8 a 15 caracteres (letras y números). Es sensible al uso de MAYÚSCULAS y minúsculas. No utilices acentos ni caracteres especiales ñ Ñ & ( ) ¡ ! ¿? % - / $ * + , ."
			   
			 },
			 nuevo_pass_r: {
			   required: "Ingresa nuevamente tu contraseña para confirmarla.",
			   equalTo: "Las contraseñas no coinciden. Por favor inténtalo de nuevo."
			 },
			 checkboxTerminos: {
				required: "Acepta los términos y condiciones para continuar."
			}

		   },
		   errorClass : "error-dd error",
		   errorPlacement: function(error, $element) {
			   	var $parent = $element.parent('.input-container');
			   	$parent.append(error);
			},
			submitHandler: function(form) {
				if(!formElement['sending']){
					sendFormData(form);
		  		}
			}
		});

		checkGeneralValidForm($form);
	}

	function sendFormData(form){
		formElement['sending'] = true;
		$(form).find('button[type="submit"]').prop('disabled', true);

		var self = $(form).serialize();
		var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
		
		$.post(  urlPOST , self )
		.done(function( data ) {

		  	Services.login.reestablecerContrasenaCallSuccess(data, form);
			formElement['sending'] = false;

		 })
		.fail(function( jqxhr, textStatus, error ) {
		  	//Mensaje de error del SISTEMA
		  	Services.login.reestablecerContrasenaCallFail(error, form);
		  	formElement['sending'] = false;
		});
	}

	return{
		inicializar: init
	}

})();