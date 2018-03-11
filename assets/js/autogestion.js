var autogestionTelcel = (function(){

	var months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

	var elementsForm = {
		id : null,
		validator : null,
		sending: false
	};

	var autogestionSection = null,
	getListadoConfirmacionSection = null;

	//Simular error de que es invalido el archivo
	function showInvalidErrorArchivo(){
		var msg = 'Este archivo está dañado o es ilegible, intenta con un nuevo archivo.';

		$('#archivo-invalido').remove();
		$('.lineas-archivo .extra-info').hide();
		$('.lineas-archivo .add-lines-ge-mod' ).append('<div class="error-dd error" id="archivo-invalido">'+msg+'</div>');
		$('#archivo').parent().addClass('error');

		$('#autogestion-form').find('button[type="submit"]').prop('disabled', true);
	}

	/** confirmación de líneas **/
	function initConfirmacionListado(){
		var $sinsuspender = $('#listado-sin-autogestion-container');

		initActions();

		function initActions(){
			/**
				Mostrar/Ocultar listado de líneas sin suspender
			**/
			$sinsuspender.on('click', '.btn-like-a', function(e){
				e.preventDefault();
				$sinsuspender.toggleClass('active');
				$sinsuspender.find('.listado-container').slideToggle( 800 );
			});

			/**
				Mostrar información extra del folio contenedor.
			**/
			$('.linea-batch .folio-container').on('click', 'button', function(){

				var $element = $(this).closest('.linea-batch');
				
				if($element.hasClass('active')){
					$element.removeClass('active');
					$(this).find('span').removeClass('i-angle-up');
				}
				else{

					if(is_mobile())
					{
						$('.linea-batch .folio-container').removeClass('active');
						$('.linea-batch .folio-container span').removeClass('i-angle-up');
					}

					$element.addClass('active');
					$(this).find('span').addClass('i-angle-up');
				}


			});

			$('.linea-batch').on('click', '.show-details', function(){
				var $element = $(this).parent().parent().find('.extra-info');
				$element.toggleClass('active');

				$(this).toggleClass('active');
			
			});

		}
	}
	/** fin confirmación de líneas **/

	/**suspension single**/
	function initFormularioSuspensionSingle(){
		var $mainForm = $('#autogestion-form-single');

		validateMainForm();

		function validateMainForm(){

			disableSumbitButton($mainForm, true);

			elementsForm['validator'] = 
				$mainForm.validate({
				  rules: {
					checkboxAutogestion : {
						required : true
					}
				  },
				  messages: {
					checkboxAutogestion : {
						required : "Acepta los términos y condiciones para continuar"
					}
				   },
					errorPlacement: function(error, $element) {
					   	/** no mostramos errores **/
					},
			        submitHandler: function(form) {
						if(!elementsForm['sending']){
							sendFormData(form);
				  		}
					}
			});	

			checkGeneralValidForm($mainForm);

			function sendFormData(form){
				elementsForm['sending'] = true;
				$(form).find('button[type="submit"]').prop('disabled', true);

				var self = $(form).serialize();

				var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
				
				/**Quitar una vez en producción**/
				var sendTo = urlPOST;

				urlPOST = checkDevelopmentPostHTML(urlPOST);

				$.post(  urlPOST , self )
				.done(function( data ) {
				  	Services.autogestion.singleSuspensionCallSuccess(data, form, sendTo );
					elementsForm['sending'] = false;

				 })
				.fail(function( jqxhr, textStatus, error ) {
				  	//Mensaje de error del sistema
				  	Services.autogestion.singleSuspensionCallFail(error, form);
				  	elementsForm['sending'] = false;
				});
			}
		}
	}
	/**fin suspension single**/

	function updateFormPostURL(value){
		var $single = $('#autogestion-form-single');
		var $masivo = $('#autogestion-form');

		var singlePosts = {
			'mismo-chip-equipo' : 'reactivacion-3.html',
			'nuevo-chip-equipo' : 'reactivacion-2.html',
			'cambio-chip': 'cambio-2-c.html',
			'cambio-equipo': 'cambio-2-b.html',
			'cambio-equipo-y-chip': 'cambio-2-a.html',
			'activar-servicios' : 'servicios-2.html',
			'desactivar-servicios' : 'servicios-2-desactivar.html',
			'facturacion-electronica-si' : 'facturacion-electronica-2.html',
			'facturacion-electronica-no' : 'facturacion-electronica-2.html',
			'aviso-visita-cac' : 'citas-2-a.html',
			'agendar-cita-cac' : 'citas-2-b.html',
			'cobro-prepago' : 'cobro-de-datos-3-una-linea.html',
			'cobro-postpago' : 'cobro-de-datos-3-una-linea.html'
		};

		var masivoPosts = {
			'mismo-chip-equipo' : 'reactivacion-masivo-2-a.html',
			'nuevo-chip-equipo' : 'reactivacion-masivo-2-b.html',
			'cambio-chip': 'cambio-masivo-2-c.html',
			'cambio-equipo': 'cambio-masivo-2-b.html',
			'cambio-equipo-y-chip': 'cambio-masivo-2-a.html',
			'activar-servicios' : 'servicios-masivo-2.html',
			'desactivar-servicios' : 'servicios-masivo-2-desactivar.html',
			'facturacion-electronica-si' : 'facturacion-electronica-masivo-2.html',
			'facturacion-electronica-no' : 'facturacion-electronica-masivo-2.html',
			'aviso-visita-cac' : 'citas-masivo-2-a.html',
			'agendar-cita-cac' : 'citas-masivo-2-b.html',
			'cobro-prepago' : 'cobro-de-datos-2.html',
			'cobro-postpago' : 'cobro-de-datos-2.html'
		};

		//Single
		if($single.length>0)
			$single.prop('action', singlePosts[value]);			
		//Masivo
		else{
			$masivo.prop('action', masivoPosts[value]);
			$masivo.data('actionmobile', singlePosts[value]);
		}

	}
		
	/**autogestion single**/
	function initFormularioGeneralSingle(){
		var $mainForm = $('#autogestion-form-single');
		initActions();
		validateMainForm();
		function initActions(){
			/**
				Setea la info del Motivo
			**/
			$('.motivo-autogestion').change(function() {
				var $checkbox = $(this);

				var buttontext =  (typeof $checkbox.data('btexto')!='undefined' ? $checkbox.data('btexto') : null );

				if(buttontext != null)
					$('#autogestion-btn').html(buttontext);

				updateFormPostURL($checkbox.val());
			});

		}


		function validateMainForm(){

			disableSumbitButton($mainForm, true);

			elementsForm['validator'] = 
				$mainForm.validate({
				  rules: {
				  	motivoAutogestion : {
				  		required : true
				  	},
					checkboxAutogestion : {
						required : true
					}
				  },
				  messages: {
					 checkboxAutogestion : {
						required : "Acepta los términos y condiciones para continuar"
					}
				   },
					errorPlacement: function(error, $element) {
					   /**No agregamos los mensajes**/
					},
			        submitHandler: function(form) {
						if(!elementsForm['sending']){
							sendFormData(form);
				  		}
					}
			});	

			checkGeneralValidForm($mainForm);

			function sendFormData(form){
				elementsForm['sending'] = true;
				$(form).find('button[type="submit"]').prop('disabled', true);

				var self = $(form).serialize();

				var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
				
				/**Quitar una vez en producción**/
				var sendTo = urlPOST;

				urlPOST = checkDevelopmentPostHTML(urlPOST);

				$.post(  urlPOST , self )
				.done(function( data ) {
				  	Services.autogestion.singleAutogestionGeneralCallSuccess(data, form, sendTo );
					elementsForm['sending'] = false;

				 })
				.fail(function( jqxhr, textStatus, error ) {
				  	//Mensaje de error del sistema
				  	Services.autogestion.singleAutogestionGeneralCallFail(error, form);
				  	elementsForm['sending'] = false;
				});
			}
		}

	}
	/**fin autogestion single**/

	/**fomulario suspensión masivo**/
	function initFormularioSuspensionMasivo(){
		var $mainForm = $('#autogestion-form');

		var tipoIngreso = null;
		var solicitarCHIP = false;

		initActions();
		validateMainForm();

		function validateMainForm(){

			disableSumbitButton($mainForm, true);

			elementsForm['validator'] = 
				$mainForm.validate({
					  rules: {
						archivo: {
							extension: "xls",
							filesize: 10000000
						},
						motivoAutogestion: {
							required: true
						},
						checkboxAutogestion: {
							required: true
						}
					  },
					  messages: {
						 archivo: {
						   required: "Ingresa un archivo de 10 MB máximo.",
						   extension: "Ingresa un archivo con extensión: .xls",
						   filesize: "Ingresa un archivo de 10 MB máximo."
						 },
						 motivoAutogestion: {
						   required: "Selecciona un motivo.",
						 },
						 checkboxAutogestion: {
						   required: "Acepta términos y condiciones.",
						 }
					   },
					   errorClass : "error-dd error",
						errorElement : 'div',
						errorPlacement: function(error, element) {
						
							var elementInput = element[0];
							
							if(elementInput['id']==='archivo' && $(elementInput).val() != ''){
								$('.lineas-archivo .extra-info').hide();
								error.appendTo( $('.lineas-archivo .add-lines-ge-mod' ));
								element.parent().addClass('error');
							}
						},
				   		onclick: false,
						success: function ($error) {
							if($error.length>0 && $('#autogestion-form #archivo').val() != ''){
								$('.lineas-archivo .extra-info').hide();
								$('.lineas-archivo .file.error' ).removeClass('error');
				   				$error.remove();
							}

				        },
				        submitHandler: function(form) {
							if(!elementsForm['sending']){
								sendFormData(form);
					  		}
						}
						
				});	

				function sendFormData(form){
					elementsForm['sending'] = true;
					$(form).find('button[type="submit"]').prop('disabled', true);

					var self = $(form).serialize();

					var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
					
					/**Quitar una vez en producción y aqui solo checamos si es una línea en development para mandar a otra liga**/
					var sendTo = ( (ingresarLineasComponentTotal ==1 && is_mobile() && typeof $(form).data('actionmobile') != 'undefined') ? $(form).data('actionmobile') : urlPOST);

					urlPOST = checkDevelopmentPostHTML(urlPOST);

					$.post(  urlPOST , self )
					.done(function( data ) {
					  	Services.autogestion.masivoSuspensionCallSuccess(data, form, sendTo, showInvalidErrorArchivo );
						elementsForm['sending'] = false;
					 })
					.fail(function( jqxhr, textStatus, error ) {
					  	//Mensaje de error del sistema
					  	Services.autogestion.masivoSuspensionCallFail(error, form);
					  	elementsForm['sending'] = false;
					});
				}
		}

		function validateFormData(){

			var dataLineas = [];
			var lineasValid = false;
			//var dataArchivo = ingresarLineasComponent.getDataArchivo();

			var dataType = ingresarLineasComponent.getType();

			if(dataType === '.componente-lineas-block .lineas-autocomplete')
				dataLineas = ingresarLineasComponent.getDataAutocomplete();
			else if(dataType === '.componente-lineas-block .lineas-arbol')
				dataLineas = ingresarLineasComponent.getDataArbol();
			else
				dataLineas.push(null);

			if(is_admin_mode() && !is_mobile()){
				if(dataLineas.length>1 && $mainForm.valid())
					lineasValid = true;
			}
			else{
				if(dataLineas.length>0 && $mainForm.valid())
					lineasValid = true;
			}

	    	$('#lineas-hidden-input').val(JSON.stringify(dataLineas));

			if($('#checkbox-autogestion-terminos').is(":checked") && $('.motivo-autogestion').is(":checked") && lineasValid && (!solicitarCHIP || (solicitarCHIP && $('#nombre-cac').val().length>0)))
				return true;

			return false;
		}




		function resetMainForm(){

			$mainForm.find("input[type=text], input[type=email], input[type=password], select").val("");
			$mainForm.find("input[type=checkbox], input[type=radio]").prop("checked", false);
			$mainForm.find('button[type="submit"]').prop('disabled', true);
			$mainForm.find('#chip-cac-container').removeClass('active');
			
			if(elementsForm['validator']){
				elementsForm['validator'].resetForm();
			}
		}


		function initActions(){

			/**
				Cuando se esconda el step 2
			**/
			var fullReset = false;

			$('#componente-ingresar-lineas .btn-al').on('click', function(event) {
				fullReset = true;
			});

			$('#autogestion-paso-2').on('hide', function(event) {
				var target = $(event.target).attr('id');
				if(target==='autogestion-paso-2' && fullReset)
			      resetMainForm();

			  	fullReset = false;
			});

			/**
				Setea la info del Motivo
			**/
			$('.motivo-autogestion').change(function() {
				$('#suspender-btn').prop('disabled', !validateFormData());
			});

			/**
				Checar cuando cambia el checkbox
			**/

			$('#checkbox-autogestion-terminos').change(function() {

				$('#suspender-btn').prop('disabled', !validateFormData());
			});

			// $('body').bind('resetManualForm', '#autogestion-form', function(){
			// 	 resetMainForm();
			// 	 $('#autogestion-paso-2').hide();
			// });
		}

	}
	/**FIN fomulario suspensión masivo**/

	//FORMULARIO AUTOGESTION MASIVO
	function initFormularioGeneralMasivo(){

		var $mainForm = $('#autogestion-form');

		var tipoIngreso = null;

		initActions();
		validateMainForm();

		function validateMainForm(){
			
			disableSumbitButton($mainForm, true);

			elementsForm['validator'] = 
				$mainForm.validate({
					  rules: {
						archivo: {
							extension: "xls",
							filesize: 10000000
						},
						motivoAutogestion: {
							required: true
						},
						checkboxAutogestion: {
							required: true
						}
					  },
					  messages: {
						 archivo: {
						   required: "Ingresa un archivo de 10 MB máximo.",
						   extension: "Ingresa un archivo con extensión: .xls",
						   filesize: "Ingresa un archivo de 10 MB máximo."
						 },
						 motivoAutogestion: {
						   required: "Selecciona un motivo.",
						 },
						 checkboxAutogestion: {
						   required: "Acepta términos y condiciones.",
						 }
					   },
						errorClass : "error-dd error",
						errorElement : 'div',
						errorPlacement: function(error, element) {
							var elementInput = element[0];
							if(element[0]['id']==='archivo' && $(elementInput).val() != ''){
								$('.lineas-archivo .extra-info').hide();
								error.appendTo( $('.lineas-archivo .add-lines-ge-mod' ));
								element.parent().addClass('error');

							}
						},
						success: function ($error) {
							if($error.length>0 && $('#archivo').val() != ''){
								$('.lineas-archivo .extra-info').hide();
								$('.lineas-archivo .file.error' ).removeClass('error');
				   				$error.remove();
							}
			
				        },
				        submitHandler: function(form) {
							if(!elementsForm['sending']){
								sendFormData(form);
					  		}
						}
				});

				function sendFormData(form){
					elementsForm['sending'] = true;
					$(form).find('button[type="submit"]').prop('disabled', true);

					var self = $(form).serialize();

					var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
					
					/**Quitar una vez en producción y aqui solo checamos si es una línea en development para mandar a otra liga**/
					var sendTo = ( (ingresarLineasComponentTotal ==1 && is_mobile() && typeof $(form).data('actionmobile') != 'undefined') ? $(form).data('actionmobile') : urlPOST);

					urlPOST = checkDevelopmentPostHTML(urlPOST);

					$.post(  urlPOST , self )
					.done(function( data ) {
					  	Services.autogestion.masivoAutogestionGeneralCallSuccess(data, form, sendTo, showInvalidErrorArchivo );
						elementsForm['sending'] = false;
					 })
					.fail(function( jqxhr, textStatus, error ) {
					  	//Mensaje de error del sistema
					  	Services.autogestion.masivoAutogestionGeneralCallFail(error, form);
					  	elementsForm['sending'] = false;
					});
				}	
		}


		function validateFormData(){

			
			var dataLineas = [];
			var lineasValid = false;
			//var dataArchivo = ingresarLineasComponent.getDataArchivo();

			var dataType = ingresarLineasComponent.getType();

			if(dataType === '.componente-lineas-block .lineas-autocomplete')
				dataLineas = ingresarLineasComponent.getDataAutocomplete();
			else if(dataType === '.componente-lineas-block .lineas-arbol')
				dataLineas = ingresarLineasComponent.getDataArbol();
			else
				dataLineas.push(null);

			var $motivo = $('input[name="motivoAutogestion"]:checked').val(),
	  		inAdmin = (typeof  $motivo!= 'undefined' && $motivo == 'nuevo-chip-equipo' ? false : true);

			if(is_admin_mode() && inAdmin && !is_mobile()){
				if(dataLineas.length>1 && $mainForm.valid())
					lineasValid = true;
			}
			else{
				if(dataLineas.length>0 && $mainForm.valid())
					lineasValid = true;
			}

	    	$('#lineas-hidden-input').val(JSON.stringify(dataLineas));


	    	// var data = $('#autogestion-form').serialize();

			if($('#checkbox-autogestion-terminos').is(":checked") && $('.motivo-autogestion').is(":checked") && lineasValid)
				return true;

			return false;
		}


		function initActions(){

			/**
				Cuando se esconda el step 2
			**/

			var fullReset = false;

			$('#componente-ingresar-lineas .btn-al').on('click', function(event) {
				fullReset = true;
			});

			$('#autogestion-paso-2').on('hide', function(event) {
				var target = $(event.target).attr('id');
				if(target==='autogestion-paso-2' && fullReset)
			      resetMainForm();

			  	fullReset = false;
			});
			/**
				Setea la info del Motivo
			**/
			$('.motivo-autogestion').change(function() {
				var $checkbox = $(this);
				var buttontext =  (typeof $checkbox.data('btexto')!='undefined' ? $checkbox.data('btexto') : null );

				if(buttontext != null)
					$('#autogestion-btn').html(buttontext);

				$('#autogestion-btn').prop('disabled', !validateFormData());

				/**Quitar una vez en producción solo es para propositos de development y simular**/
				updateFormPostURL($checkbox.val());
			});

			/**
				Checar cuando cambia el checkbox
			**/

			$('#checkbox-autogestion-terminos').change(function() {

				$('#autogestion-btn').prop('disabled', !validateFormData());
			});
		}

		function resetMainForm(){
			$mainForm.find("input[type=text], input[type=email], input[type=password], select").val("");
			$mainForm.find("input[type=checkbox], input[type=radio]").prop("checked", false);
			$mainForm.find('button[type="submit"]').prop('disabled', true);
			
			if(elementsForm['validator']){
				elementsForm['validator'].resetForm();
			}
		}

	}	
	//FIN FORMULARIO AUTOGESTION MASIVO

	//FORMULARIO Citas
	function initFormularioCitas(){

		var $mainForm = ($('#autogestion-form-single').length>0 ? $('#autogestion-form-single') : $('#autogestion-form') ),
		isSingle = $('#autogestion-form-single').length>0 ? true : false;
		initActions();
		validateMainForm();

		function validateMainForm(){

			disableSumbitButton($mainForm, true);

			elementsForm['validator'] = 
				$mainForm.validate({
					  rules: {
						motivoAutogestion: {
							required: true
						}
					  },
					  messages: {
						 motivoAutogestion: {
						   required: "Selecciona un motivo.",
						 }
					   },
						errorClass : "error-dd error",
						errorElement : 'div',
						errorPlacement: function(error, element) {
							
						},
						success: function ($error) {

				        },
				        submitHandler: function(form) {
							if(!elementsForm['sending']){
								sendFormData(form);
					  		}
						}
				});

				function sendFormData(form){
					elementsForm['sending'] = true;
					$(form).find('button[type="submit"]').prop('disabled', true);

					var self = $(form).serialize();

					var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
					
					/**Quitar una vez en producción y aqui solo checamos si es una línea en development para mandar a otra liga**/
					var sendTo = ( (ingresarLineasComponentTotal ==1 && is_mobile() && typeof $(form).data('actionmobile') != 'undefined') ? $(form).data('actionmobile') : urlPOST);

					urlPOST = checkDevelopmentPostHTML(urlPOST);

					$.post(  urlPOST , self )
					.done(function( data ) {
					  	Services.autogestion.masivoAutogestionGeneralCallSuccess(data, form, sendTo, showInvalidErrorArchivo );
						elementsForm['sending'] = false;
					 })
					.fail(function( jqxhr, textStatus, error ) {
					  	//Mensaje de error del sistema
					  	Services.autogestion.masivoAutogestionGeneralCallFail(error, form);
					  	elementsForm['sending'] = false;
					});
				}	
		}


		function validateFormData(){
			var lineasValid = false;
			var validTerminos = false;

			if(isSingle){
				lineasValid = true;
				validTerminos = $('#checkbox-autogestion-terminos').is(":checked")
			}
			else{
				var dataLineas = getDataAutocomplete();
				if(dataLineas.length>0 && $mainForm.valid())
					lineasValid = true;
		    	$('#lineas-hidden-input').val(JSON.stringify(dataLineas));
		    	validTerminos = true;
			}
			
			if(validTerminos && $('.motivo-autogestion').is(":checked") && lineasValid)
				return true;

			return false;
		}
		

		function getDataAutocomplete(){
			var tokens = $('#tokenfield-agregar-lineas').tokenfield('getTokens');

			return formatDataAutocomplete(tokens);
		}

		function formatDataAutocomplete(data){

			var dataT = null,
			elementsPost = [];

			$.each(data, function( index, item ) {
			 	dataT = {
			 		id : ( typeof item.id != 'undefined' ? item.id : null ),
			 		tipo : item.tipo,
			 		selected : (item.tipo == 'group' ? 'all' : 'single')
			 	};

			 	if(item.tipo=='general')
			 		dataT.value = item.value;

			 	elementsPost.push(dataT);
			});

			return elementsPost;
		}


		function initActions(){

			/**
				Cuando se esconda el step 2
			**/

			var fullReset = false;

			$('#autogestion-paso-2').on('hide', function(event) {
				var target = $(event.target).attr('id');
				if(target==='autogestion-paso-2' && fullReset)
			      resetMainForm();

			  	fullReset = false;
			});
			/**
				Setea la info del Motivo
			**/
			$('.motivo-autogestion').change(function() {
				var $checkbox = $(this);
				var buttontext =  (typeof $checkbox.data('btexto')!='undefined' ? $checkbox.data('btexto') : null );

				if(buttontext != null)
					$('#autogestion-btn').html(buttontext);

				$('#autogestion-btn').prop('disabled', !validateFormData());

				/**Quitar una vez en producción solo es para propositos de development y simular**/
				updateFormPostURL($checkbox.val());
			});

			$('#checkbox-autogestion-terminos').change(function() {
				$('#autogestion-btn').prop('disabled', !validateFormData());
			});
		}

		function resetMainForm(){

			$mainForm.find("input[type=text], input[type=email], input[type=password], select").val("");
			$mainForm.find("input[type=checkbox], input[type=radio]").prop("checked", false);
			$mainForm.find('button[type="submit"]').prop('disabled', true);
			
			$mainForm.find('#autogestion-paso-2').hide();
			
			if(elementsForm['validator']){
				elementsForm['validator'].resetForm();
			}
		}

	}	
	//FIN FORMULARIO Citas

	//FORMULARIO RED PRIVADA
	function initFormularioRedPrivada(){
		var $mainForm = $('#autogestion-form');
		initActions();

		function validateFormData(){
			var lineasValid = false,
			dataLineas = [];

			var dataType = ingresarLineasComponent.getType();

			if(dataType === '.componente-lineas-block .lineas-autocomplete')
				dataLineas = ingresarLineasComponent.getDataAutocomplete();
			else if(dataType === '.componente-lineas-block .lineas-arbol')
				dataLineas = ingresarLineasComponent.getDataArbol();
			else
				dataLineas.push(null);

			if(dataLineas.length>0 && $mainForm.valid())
				lineasValid = true;
	    	
	    	if($('.motivos-autogestion-container').length>0)
	    		if($('.motivos-autogestion-container .motivo-autogestion:checked').length>0)
	    			lineasValid = true;
	    		else
	    			lineasValid = false;


	    	$('#lineas-hidden-input').val(JSON.stringify(dataLineas));
			
			if(lineasValid)
				return true;

			return false;
		}
		

		function getDataAutocomplete(){
			var tokens = $('#tokenfield-agregar-lineas').tokenfield('getTokens');

			return formatDataAutocomplete(tokens);
		}

		function formatDataAutocomplete(data){

			var dataT = null,
			elementsPost = [];

			$.each(data, function( index, item ) {
			 	dataT = {
			 		id : ( typeof item.id != 'undefined' ? item.id : null ),
			 		tipo : item.tipo,
			 		selected : (item.tipo == 'group' ? 'all' : 'single')
			 	};

			 	if(item.tipo=='general')
			 		dataT.value = item.value;

			 	elementsPost.push(dataT);
			});

			return elementsPost;
		}


		function initActions(){

			/**
				Cuando se esconda el step 2
			**/

			var fullReset = false;

			$('#componente-ingresar-lineas .btn-al').on('click', function(event) {
				fullReset = true;
			});

			$('#autogestion-paso-2').on('hide', function(event) {
				var target = $(event.target).attr('id');
				if(target==='autogestion-paso-2' && fullReset)
					resetMainForm();

			 	fullReset = false;
			});

			$('#autogestion-paso-2').on('show', function(event) {
				var target = $(event.target).attr('id');
				if(target==='autogestion-paso-2')
					$('#autogestion-btn').prop('disabled', !validateFormData());
			});

			/**
				Setea la info del Motivo
			**/
			$('.motivo-autogestion').change(function() {
				var $checkbox = $(this);
				var buttontext =  (typeof $checkbox.data('btexto')!='undefined' ? $checkbox.data('btexto') : null );

				if(buttontext != null)
					$('#autogestion-btn').html(buttontext);

				$('#autogestion-btn').prop('disabled', !validateFormData());

				/**Quitar una vez en producción solo es para propositos de development y simular**/
				updateFormPostURL($checkbox.val());
			});

			$('#autogestion-form').submit(function(e){
				e.preventDefault();
				if(!elementsForm['sending']){
					sendFormData();
		  		}
			});

			function sendFormData(){
				var form = '#autogestion-form';
				elementsForm['sending'] = true;
				$(form).find('button[type="submit"]').prop('disabled', true);

				var self = $(form).serialize();

				var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
				
				/**Quitar una vez en producción**/
				var sendTo = urlPOST;

				/**Quitar una vez en producción y aqui solo checamos si es una línea en development para mandar a otra liga**/
				var sendTo = ( (ingresarLineasComponentTotal == 1 && is_mobile() && typeof $(form).data('actionmobile') != 'undefined') ? $(form).data('actionmobile') : urlPOST);

				urlPOST = checkDevelopmentPostHTML(urlPOST);

				$.post(  urlPOST , self )
				.done(function( data ) {
				  	Services.autogestion.redPrivadaCallSuccess(data, form, sendTo );
					elementsForm['sending'] = false;

				 })
				.fail(function( jqxhr, textStatus, error ) {
				  	//Mensaje de error del sistema
				  	Services.autogestion.redPrivadaCallFail(error, form);
				  	elementsForm['sending'] = false;
				});
			}

		}

		function resetMainForm(){

			$mainForm.find("input[type=text], input[type=email], input[type=password], select").val("");
			$mainForm.find("input[type=checkbox], input[type=radio]").prop("checked", false);
			$mainForm.find('button[type="submit"]').prop('disabled', true);

			if(elementsForm['validator']){
				elementsForm['validator'].resetForm();
			}
		}

	}	
	//FIN FORMULARIO RED PRIVADA

	//FORMULARIO ABONO DE SALDO
	function initFormularioAbonoDeSaldo(){
		var $mainForm = $('#autogestion-form-abono');
		initActions();

		function validateFormData(){
			var dataLineas = [];
			var lineasValid = false;

			var dataType = ingresarLineasComponent.getType();

			if(dataType === '.componente-lineas-block .lineas-autocomplete')
				dataLineas = ingresarLineasComponent.getDataAutocomplete();
			else if(dataType === '.componente-lineas-block .lineas-arbol')
				dataLineas = ingresarLineasComponent.getDataArbol();
			else
				dataLineas.push(null);

			if(dataLineas.length>0 && $('#monto').val()!='')
				lineasValid = true;


	    	$('#lineas-hidden-input').val(JSON.stringify(dataLineas));
			
			if(lineasValid)
				return true;

			return false;
		}
		

		function getDataAutocomplete(){
			var tokens = $('#tokenfield-agregar-lineas').tokenfield('getTokens');

			return formatDataAutocomplete(tokens);
		}

		function formatDataAutocomplete(data){

			var dataT = null,
			elementsPost = [];

			$.each(data, function( index, item ) {
			 	dataT = {
			 		id : ( typeof item.id != 'undefined' ? item.id : null ),
			 		tipo : item.tipo,
			 		selected : (item.tipo == 'group' ? 'all' : 'single')
			 	};

			 	if(item.tipo=='general')
			 		dataT.value = item.value;

			 	elementsPost.push(dataT);
			});

			return elementsPost;
		}


		function initActions(){

			/**
				Cuando se esconda el step 2
			**/

			var fullReset = false;

			$('#componente-ingresar-lineas .btn-al').on('click', function(event) {
				fullReset = true;
			});

			$('#autogestion-paso-2').on('show', function(event) {
				var target = $(event.target).attr('id');
				if(target==='autogestion-paso-2')
					$('#autogestion-btn').prop('disabled', !validateFormData());
			});

			/**
				Setea la info del Motivo
			**/
			$('#monto').change(function() {
				var $monto = $(this);

				if($monto.val()!='')
					$('#autogestion-paso-1').removeClass('hidden');
				else{
					$('#autogestion-paso-1').addClass('hidden');
					$('#autogestion-paso-2').hide();

					if(typeof ingresarLineasComponent != 'undefined')
						ingresarLineasComponent.reset();
				}

				$('#autogestion-btn').prop('disabled', !validateFormData());
			});

			$('#autogestion-form-abono').submit(function(e){
				e.preventDefault();
				if(!elementsForm['sending']){
					sendFormData();
		  		}
			});

			function sendFormData(){
				var form = '#autogestion-form-abono';
				elementsForm['sending'] = true;
				$(form).find('button[type="submit"]').prop('disabled', true);

				var self = $(form).serialize();

				var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
				
				/**Quitar una vez en producción**/
				var sendTo = urlPOST;

				/**Quitar una vez en producción y aqui solo checamos si es una línea en development para mandar a otra liga**/
				var sendTo = ( (ingresarLineasComponentTotal == 1 && is_mobile() && typeof $(form).data('actionmobile') != 'undefined') ? $(form).data('actionmobile') : urlPOST);

				urlPOST = checkDevelopmentPostHTML(urlPOST);

				$.post(  urlPOST , self )
				.done(function( data ) {
				  	Services.autogestion.abonoDeSaldoCallSuccess(data, form, sendTo );
					elementsForm['sending'] = false;

				 })
				.fail(function( jqxhr, textStatus, error ) {
				  	//Mensaje de error del sistema
				  	Services.autogestion.abonoDeSaldoCallFail(error, form);
				  	elementsForm['sending'] = false;
				});
			}

		}

		function resetMainForm(){

			$mainForm.find("input[type=text], input[type=email], input[type=password], select").val("");
			$mainForm.find("input[type=checkbox], input[type=radio]").prop("checked", false);
			$mainForm.find('button[type="submit"]').prop('disabled', true);
			
			$mainForm.find('#autogestion-paso-2').hide();
			
			if(elementsForm['validator']){
				elementsForm['validator'].resetForm();
			}
		}

	}	
	//FIN FORMULARIO ABONO DE SALDO

	//Página de confirmación para autogestion
	function initConfirmacionAutogestion(){

		var $main = $('#listado-autogestion-container');
		
		var $listaconfirmar = $('#listado-confirmacion-autogestion');

		var $mainForm = $('#listado-confirmacion-autogestion');

		var $mainReactivacion = $('#autogestion-confirmacion.autogestion-reactivacion-block');

		var $mainCambio = $('#autogestion-confirmacion.autogestion-cambio-block');

		var $mainFacturacion = $('#autogestion-confirmacion.autogestion-facturacion-block');
		
		var $mainSertec = $('#autogestion-confirmacion.autogestion-sertec-block');

		var $mainControlCostos = $('#autogestion-confirmacion.autogestion-control-costos-block');

		var datosValidos = false,
		datosValidosInit = false;

		var validando = true;
		var doneValidando = false;
		var firstClick = true;
		var onlyRead = false;

		if($mainForm.hasClass('validated-data'))
			onlyRead = true;

		var lastdeleted = [];

		var dataListadoConfirmacion = [];

		var eliminarIndividual = false;

		var allChecked = false;

		var validarFormConfirmacion = (function(){
		var initComponent = false;

		function getAutogestionSection(){
			return ($mainReactivacion.length>0 ? 'reactivacion' : ($mainCambio.length>0 ? 'cambio' : ($mainFacturacion.length>0 ? ($mainFacturacion.hasClass('reporte-lineas') ? 'facturacion_lineas' : ($mainFacturacion.hasClass('reporte-facturas') ? 'facturacion_facturas' :'facturacion' ) ) : ( $mainSertec.length>0 ? 'sertec' : ( $mainControlCostos.length>0 ? 'controlcostos' : ( $('.autogestion-red-privada-block').length>0 || $('.autogestion-roaming-block').length>0 ? 'general_asignado' : 'general')) )) ));
		}

		autogestionSection = getAutogestionSection();

		var generarHTMLConfirmacion = {
			general : generarHTMLGeneral,
			general_asignado : generarHTMLGeneralAsignado,
			reactivacion : generarHTMLReactivacion,
			facturacion : generarHTMLFacturacion,
			facturacion_lineas : generarHTMLFacturacionLineas,
			facturacion_facturas : generarHTMLFacturacionFacturas,
			cambio : generarHTMLCambio,
			sertec : generarHTMLSertec,
			controlcostos : generarHTMLControlCostos
		};

		getListadoConfirmacionSection = typeof generarHTMLConfirmacion[autogestionSection] != 'undefined' ? generarHTMLConfirmacion[autogestionSection] : null ;


		function init(){
				elementsForm['validator'] = 
					$mainForm.validate({
					ignore:":disabled",
					rules: {
						chip: {
						  	minlength: 19,
							exactlength: 19,
							required : true,
							digits : true
						},
						imei: {
						  	minlength: 15,
							exactlength: 15,
							required : true,
							digits : true
						}
				  	},
					messages: {
						chip:{
							exactlength: "Ingresa los 19 dígitos del chip.",
							minlength: "Ingresa los 19 dígitos del chip.",
							required : "Ingresa los 19 dígitos del chip.",
							digits: "Ingresa los 19 dígitos del chip."
						},
						imei :{
							exactlength: "Ingresa los 15 dígitos del IMEI.",
							minlength: "Ingresa los 15 dígitos del IMEI.",
							required : "Ingresa los 15 dígitos del IMEI.",
							digits: "Ingresa los 15 dígitos del IMEI."
						}
					},
					unhighlight: function(element, errorClass, validClass) {

						var $element = $(element);
						
						var index = ( typeof $element.data('index') != 'undefined' ? $element.data('index') : null );

						$element.parent().closest('label.show-error').remove();

						var $parent = $element.parent('.input-container');

					 	$parent.find('.icon-validation').addClass('i-check');

					 	$element.addClass('valid-element').removeClass('error not-valid-element');

					 	var $container = $parent.closest('.value-container');

			   			actualizarElementoListado(index, 'validated', true);

						var $parentContainer = $parent.closest('.linea-batch');

			        },
			        highlight : function(element, errorClass){
			        	var $element = $(element);
			        	$element.parent().closest('label.show-error').remove();

			        	var $parent = $element.parent('.input-container');

			        	$parent.find('.icon-validation').removeClass('i-check');

			        	var $container = $parent.closest('.value-container');

			        	$element.addClass('error not-valid-element').removeClass('valid-element');

			        },
			        errorPlacement: function(error, element) {
			        	var $element = element;
			        	var index = ( typeof $element.data('index') != 'undefined' ? $element.data('index') : null );

			        	var $parent = $element.parent('.input-container');
						error.insertAfter( $parent );
			        	actualizarElementoListado(index, 'validated', true);

					}
				});	

				initComponent = true;
				addRules();
			}

			function addRules(init){

				$("[name^=chip]").each(function () {

				    $(this).rules("add", {
				        minlength: 19,
						exactlength: 19,
						required : true,
						digits : true,
						messages : {
					        exactlength: "Ingresa los 19 dígitos del chip.",
							minlength: "Ingresa los 19 dígitos del chip.",
							required : "Ingresa los 19 dígitos del chip.",
							digits: "Ingresa los 19 dígitos del chip."
				    	}

				    });

				});

				$("[name^=imei]").each(function () {

				    $(this).rules("add", {
				        minlength: 15,
						exactlength: 15,
						required : true,
						digits : true,
						messages : {
					        exactlength: "Ingresa los 15 dígitos del IMEI.",
							minlength: "Ingresa los 15 dígitos del IMEI.",
							required : "Ingresa los 15 dígitos del IMEI.",
							digits: "Ingresa los 15 dígitos del IMEI."
				    	}
				    });

				});

				checkThisValidForm();

				//Unicamente cuando se inicializa desde afuera
				if(typeof init != 'undefined')
				{
					var $button = $('.btn-autogestion-submit');

					if(datosValidosInit)
						$button.prop('disabled', false);
					else
						$button.prop('disabled', true);
				}
			}

			function checkThisValidForm(){
				$mainForm.find('input').on('keyup change input keydown', function (e) { 
			        validateForm();
			    });
			}


		    function validateForm($input){
		    	
		    	var $button = $('.btn-autogestion-submit');
		    	datosValidos = $mainForm.validate().checkForm();

		    	if (datosValidos) {                  
		            $button.prop('disabled', false); 
		        } else {
		           $button.prop('disabled', true); 
		        }

		        if(typeof $input != 'undefined' && $input.is(':checkbox')){
		    		var $container = $input.closest('.linea-batch');
		    		var $elementIMEI = $container.find('.imei');
		    		var $elementCHIP = $container.find('.chip');

		    		if($elementIMEI.length>0 && $elementIMEI.val().length>0){
		    			$elementIMEI.valid();
		    		}

		    		if($elementCHIP.length>0 && $elementCHIP.val().length>0){
		    			$elementCHIP.valid();
		    		}
		    	}
		    }

			return{
				inicializar : init,
				checkButtonsActive: validateForm,
				addNewValidationRules : addRules,
				checkInit : function(){
					return initComponent;
				},
				validateFormErrors : validateForm
			}

		})();

		if($('.autogestion-confirmacion-block #listado-confirmacion-autogestion').length>0)
			validarFormConfirmacion.inicializar();

		initActions();
		onSubmitConfirmacionAutogestion();
		generarListadoConfirmacionInicial();
		preSelectAll();

		if(validarFormConfirmacion.checkInit())
			validarFormConfirmacion.addNewValidationRules(true);

		function preSelectAll(){
			$("#listado-autogestion-container .listado-header-autogestion .checkbox-container input").trigger('click');
		}
		
		var _modalConfirmarEliminar = {};
		var modalConfirmarEliminar = null;
		initmodalConfirmarEliminar();

		function initmodalConfirmarEliminar(){

			var lastLine = false;

			modalConfirmarEliminar = new modalesTelcel($('#modal-confirmar-eliminar'),{
				onInit : function(){
					initActionsModalAuxiliar();
				},
				onReset : function(){
					if($('#listado-confirmacion-autogestion .linea-batch input[type="checkbox"]:checked').length>0)
						$('.listado-header-autogestion button, .btn-autogestion-simular').prop('disabled', false);
					else
						$('.listado-header-autogestion button, .btn-autogestion-simular').prop('disabled', true);

					$('#modal-confirmar-eliminar .added-lines .div-nal').html('');
				},
				onOpen : function(){
					checkOneElement();
					updateTableData();
				}
			});


			function checkOneElement(){

				var allSelected = $('#listado-confirmacion-autogestion input[type="checkbox"]:checked').length == $('#listado-confirmacion-autogestion input[type="checkbox"]').length;

				var oneLeft = $('#listado-confirmacion-autogestion .linea-batch').length == 1;

				if( allSelected || oneLeft ){

					lastLine = true;

					$('#modal-confirmar-eliminar .last-line-confirmation').removeClass('hidden');
				}else{
					lastLine = false;
					$('#modal-confirmar-eliminar .last-line-confirmation').addClass('hidden');
				}
			}

			function updateTableData(){
				var $elements = null;

				if(!eliminarIndividual)
					$elements = $('#listado-confirmacion-autogestion .linea-batch input[type="checkbox"]:checked');
				else
					$elements = $('#listado-confirmacion-autogestion .linea-batch .delete-container .btn-delete'); 

				var totalchecked = $elements.length;

				$elements.each(function( index ) {
					var value = $(this).data('index');
					var identifier = ($mainFacturacion.length>0 ? dataListadoConfirmacion[value].cuenta : dataListadoConfirmacion[value].numero);
					lastdeleted.push(value);
				  	$('#modal-confirmar-eliminar .added-lines .div-nal').append('<div class="col-xs-12 '+(totalchecked>1 ? 'col-sm-6' : 'col-sm-12') +'"><p>'+identifier+'</p></div>');
				});

			}
			function initActionsModalAuxiliar(){

				$('#modal-confirmar-eliminar').on('click', '#btn-confirmar-eliminar', function(e){
					e.preventDefault();
					eliminarElementosListado();
					$('.listado-header-autogestion button, .btn-autogestion-simular').prop('disabled', true);
					modalConfirmarEliminar.closeModal();

					if(lastLine){
						var url = ( typeof $(this).data('redirect') != 'undefined' ? $(this).data('redirect') : homeURL );
						lastLine = false;
						window.location.href= url;
					}
				});

			}

		}

		var _modalConfirmarAutogestion = {};
		var modalConfirmarAutogestion = null;
		initmodalConfirmarAutogestion();

		function initmodalConfirmarAutogestion(){

			modalConfirmarAutogestion = new modalesTelcel($('#modal-confirmar-autogestion'),{
				onInit : function(){
					initActionsModalAuxiliar();
				},
				onOpen : function(){
					updateModalData();
				},
				onReset : function(){

				}
			});


			function updateModalData(){
				var selected = $('#listado-confirmacion-autogestion input[type="checkbox"]:checked').length;

				var total = $('#listado-confirmacion-autogestion input[type="checkbox"]').length;

				$('#modal-confirmar-autogestion .c-lines').html(selected);
				$('#modal-confirmar-autogestion .t-lines').html(total);
			}

			function initActionsModalAuxiliar(){

				$('#modal-confirmar-autogestion').on('click', '#btn-confirmar-autogestion', function(){
					
					$(_modalConfirmarAutogestion.element+' #listado-confirmacion-autogestion').submit();

				});

			}

		}

		function checkAllSelected(element){
			_modalConfirmarAutogestion.element = element;

			if(!allChecked)
				modalConfirmarAutogestion.openModal();
			else
				$(element+' #listado-confirmacion-autogestion').submit();
		}

		function onSubmitConfirmacionAutogestion(){
			$mainForm.submit(function( e ) {
				var form = '#listado-confirmacion-autogestion';
				e.preventDefault();

				sendFormData(form);
			});

			function sendFormData(form){
				elementsForm['sending'] = true;
				$(form).find('button[type="submit"]').prop('disabled', true);

				/*Id's*/
				var self = $(form).serialize();

				var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
				
				/**Quitar una vez en producción**/
				var sendTo = urlPOST;

				urlPOST = checkDevelopmentPostHTML(urlPOST);

				$.post(  urlPOST , self )
				.done(function( data ) {
				  	Services.autogestion.masivoAutogestionConfirmacionGeneralCallSuccess(data, form, sendTo, showInvalidErrorArchivo);
					elementsForm['sending'] = false;
				 })
				.fail(function( jqxhr, textStatus, error ) {
				  	//Mensaje de error del sistema
				  	Services.autogestion.masivoAutogestionConfirmacionGeneralCallFail(error, form);
				  	elementsForm['sending'] = false;
				});
			}	
		}

		function submitForm(){
			$('#cambiar-lineas-btn').click(function(e){
				checkAllSelected('.autogestion-facturacion-block');
	    	});

			$('#autogestion-s-lineas-btn').click(function(e){
				checkAllSelected('.autogestion-suspension-block');
	    	});

			$('#autogestion-general-lineas-btn').click(function(e){
				checkAllSelected('.autogestion-general-block');
	    	});


			$('#modificar-lineas-btn').click(function(e){
				var $button = $(this);
				if(datosValidos){
					checkAllSelected('.autogestion-confirmacion-block');
				}
	    	});

	    	$('#validar-lineas-btn').click(function(e){
	    		var $button = $(this);
	    		checkButtonsAction($button);
	    	});


		}


		function checkButtonsAction($button){

   			if($('#listado-confirmacion-autogestion.autogestion-single').length>0)
				$('.autogestion-confirmacion-block #listado-confirmacion-autogestion').submit();
			else
				checkAllSelected('.autogestion-confirmacion-block');

		}

		function bindElementActions(){
				
			$("[name^=chip]").bind('input', function() {
				var $input = $(this);
				bindAction($input, 'chip');

			});

			$("[name^=imei]").bind('input', function() {
				var $input = $(this);
				bindAction($input, 'imei');
			});

			checkOnlyNumberElements();

			function bindAction($input, name){

				var value = $input.val();
				var index = ( typeof $input.data('index') != 'undefined' ? $input.data('index') : null );

				actualizarElementoListado(index, name, value);

				if(!firstClick){
					validElement($input);
				}

				// if(doneValidando){
				// 	resetValidaciones(false ,true, false,'Validar datos');
				// 	// if(elementsForm['validator']){
				// 	// 	elementsForm['validator'].resetForm();
				// 	// }
				// }
			}
		}

		function validElement($input){

			var valid = $input.valid();

			if(!valid){
				var $parent = $input.parent('.input-container');

		        $parent.find('.icon-validation').removeClass('i-check');
		        
		        $input.addClass('not-valid-element').removeClass('valid-element');
			}

		}

		//Fin validación 
		function actualizarElementoListado(i, key, value, error){

			if(i!=null && typeof dataListadoConfirmacion[i][key] != 'undefined')
			{
				if(typeof error != 'undefined')
					dataListadoConfirmacion[i]['error'][key] = value;
				else
					dataListadoConfirmacion[i][key] = value;
			}
			
		}

		function validarDatosReactivacion(){

			var postData = [];

			$('#listado-confirmacion-autogestion .linea-batch input[type="checkbox"]:checked').each(function( index ) {
				var $linea = $(this).parent().closest('.linea-batch');
				var id = $(this).val();
				var $chip = $linea.find('input.chip');
				var chip = $chip.val();

				var $imei = $linea.find('input.imei');
				var imei = $imei.val();

				postData.push({'id': id, 'chip': chip, 'imei': imei});
				
			});

			return postData;
		}


		function initActions(){

			/**
				Ordenar elementos de listado de líneas a confirmar
			**/
			$main.on('click', '.order-by-modal button', function(e){
				
				var opciones = ( typeof $(this).data('opc') != 'undefined' ? $(this).data('opc') : null );
				var sorted = [];

				if(opciones!=null)
					sorted = sortByAZ(dataListadoConfirmacion, opciones.key);

				if(opciones.orderby == 'desc')
					sorted.reverse();

				dataListadoConfirmacion = sorted;
				
				generarListadoConfirmacion();

			});

			/**
				Eliminar varios elementos del listado de líneas a confirmar
			**/

			$main.on('click', '#btn-delete-all', function(e){
				e.preventDefault();
				eliminarIndividual = false;
				var oneLeft = $('#listado-confirmacion-autogestion .linea-batch').length == 1;

				var moreOneSelected = $('#listado-confirmacion-autogestion input[type="checkbox"]:checked').length>1;

				if( moreOneSelected || oneLeft ){
					modalConfirmarEliminar.openModal();
					$('.listado-header-autogestion button, .btn-autogestion-simular').prop('disabled', true);
				}
				else
					eliminarElementosListado();
				
			});

			/**
				Eliminar elemento del listado de líneas a confirmar
			**/

			$listaconfirmar.on('click', '.linea-batch .btn-delete', function(){
				var $button = $(this);
				lastdeleted = [];
				 
				var oneLeft = $('#listado-confirmacion-autogestion .linea-batch').length == 1;

				if(oneLeft)
				{
					eliminarIndividual = true;
					modalConfirmarEliminar.openModal();
					$('.listado-header-autogestion button, .btn-autogestion-simular').prop('disabled', true);
				}else{
					eliminarElementoListado($button);
				}

				if($('#listado-confirmacion-autogestion .linea-batch input[type="checkbox"]:checked').length>0)
					$('.listado-header-autogestion button, .btn-autogestion-simular').prop('disabled', false);
				else
					$('.listado-header-autogestion button, .btn-autogestion-simular').prop('disabled', true);

				showDeshacerBlock(true);
			});		

			/**
				Acciones Checkbox
			**/

			setActionsCheckbox();

			/**
				SubmitForm
			**/
			submitForm();


			/**
				Deshacer Última acción
			**/
			$('#deshacer-eliminado').click(function(e){
				e.preventDefault();
				deshacerEliminado();
				showDeshacerBlock(false);
			});

		}

		function deshacerEliminado(){
			
			$.each(lastdeleted, function (index, value) {
				if(dataListadoConfirmacion[value])
					dataListadoConfirmacion[value].eliminado = false;
			});

			// var lastOne = (lastdeleted.length>1 ? lastdeleted[lastdeleted.length-1] : lastdeleted[0]);
			// if(dataListadoConfirmacion[lastOne])
			// 	dataListadoConfirmacion[lastOne].eliminado = false;

			generarListadoConfirmacion();
		}

		function setActionsCheckbox(){

			function checkButtonsActive(){
				if($('#listado-confirmacion-autogestion .linea-batch input[type="checkbox"]:checked').length==0)
					$('.listado-header-autogestion button, .btn-autogestion-simular').prop('disabled', true);
				else
					$('.listado-header-autogestion #btn-delete-all, .btn-autogestion-simular').prop('disabled', false);
					
			}

			//CHECKBOX INDIVIDUAL
			$('#listado-confirmacion-autogestion').on('change', '.linea-batch input[type="checkbox"]', function(){

				var $element = $(this).closest('.linea-batch');
				$element.toggleClass('checked-element');

				//Actualizar propiedad de Seleccionado
				var value = $(this).is(':checked');
				seleccionarElementoListado( $(this) , value);

				/**
					Agregar al input la clase de required para jquery.validate
				**/
				if($element.hasClass('checked-element')){
					$element.find('.input-container input[type="text"]').addClass('requerido');
					checkLineActive($element, true);
				}
				else{
					$element.find('.input-container input[type="text"]').removeClass('requerido');
					checkLineActive($element, false);
				}


				// if(!$element.find('.input-container input[type="text"]').hasClass('requerido'))
				// 	checkLineActive($element, false);
				// else
				// 	checkLineActive($element, true);


				if($('#listado-confirmacion-autogestion .linea-batch input[type="checkbox"]').length == $('#listado-confirmacion-autogestion .linea-batch input[type="checkbox"]:checked').length){
					$('#listado-autogestion-container .listado-header-autogestion .checkbox-container input').prop('checked', true);

						allChecked = true;
				}
				else{
					$('#listado-autogestion-container .listado-header-autogestion .checkbox-container input').prop('checked', false);
						allChecked = false;
				}

				validarFormConfirmacion.validateFormErrors($(this));
				validarFormConfirmacion.checkButtonsActive();
				checkButtonsActive();
			});


			// SELECT ALL CHECKBOX
			$("#listado-autogestion-container .listado-header-autogestion .checkbox-container input").change(function() {

				var $checkboxAll = $(this);

				//firstClick = true;
				
				// if(doneValidando){
				// 	resetValidaciones(false ,false, false,'Validar');
				// }

				//SE ACTUALIZA CADA UNO DE LOS ELEMENTOS DE LA PÁGINA
				$('#listado-confirmacion-autogestion input[type="checkbox"]').each(function( index ) {

					var $parent = $(this).closest('.linea-batch');

					if($checkboxAll.is(":checked")){
						$(this).prop( "checked", true );
							
						seleccionarElementoListado( $(this) , true);
						/**
							Agregar al input la clase de required para jquery.validate
						**/

						checkLineActive($parent, true);
						$parent.addClass('checked-element');

						validarFormConfirmacion.validateFormErrors($(this));
					}
					else {
						$(this).prop( "checked", false );

						seleccionarElementoListado( $(this) , false);

						$parent.removeClass('checked-element');

						/**
							Quitarle al input la clase de required para jquery.validate
						**/
						checkLineActive($parent, false);
					}

				});


				allChecked = $checkboxAll.is(":checked");

				// if(!firstClick && allChecked){
				// 	$mainForm.validate();
				// }
				
				validarFormConfirmacion.checkButtonsActive();
				checkButtonsActive();
				
			});

			function checkLineActive($parent, active){

				var $input = $parent.find('.input-container input[type="text"]');

				if(active){
					//$input.addClass('requerido');
					// Cada vez que cambia checar los botones
					// validando = true;
					//datosValidos = false;
					// doneValidando = false;
				}	
				else{
					//$input.removeClass('requerido');
					resetField($input);	
					//validando = true;
					// doneValidando = false;
				}

				
				validarFormConfirmacion.checkButtonsActive();
				checkButtonsActive();

				$input.prop('disabled', !active);



				// if(!firstClick){
				//  	$('#validar-lineas-btn').trigger('click');
				// }

			}

		}


		function resetValidaciones(doneV,v,datosV, texto){
			// doneValidando = doneV;
			// validando = v;
			// datosValidos = datosV;
			$('#validar-lineas-btn').html(texto);
		}

		function resetField($input) {
			var $label = $input.closest('.column-line').find('label.error');

			var $icon = $input.parent().find('.icon-validation');

		    $input.removeClass('error').removeClass('not-valid-element');
		    $label.remove();

		}

		function checkFixedHeader(){
			var $starte = $listaconfirmar;
			var start = $starte.offset();

			$(window).scroll(function(){
				$starte = $listaconfirmar;
				start = $starte.offset();
				var end = $starte.height() + start.top;

			    if ($(this).scrollTop() > start.top && $(this).scrollTop() < end )
			        $('.to-fixed-block').addClass('fixed');
			    else 
			        $('.to-fixed-block').removeClass('fixed');
			});
		}


		var esconderLap = null;

		function showDeshacerBlock(value){

			var $block = $('.listado-delete-block');

			if(value){


				if($block.is(':visible') && $block.hasClass('active')){
					
					clearTimeout(esconderLap);

				}
				

				$block.fadeIn( 400, function() {
				    $block.addClass('active');
				});

				esconderLap = setTimeout(function(){

					$block.fadeOut( 400, function() {
					   $block.removeClass('active');
					});

				}, 3000);
			}

			else{

				$block.fadeOut( 400, function() {
				   $block.removeClass('active');
				});

				clearTimeout(esconderLap);
			}
		}

		function eliminarElementosListado(){
			lastdeleted = [];

			$('#listado-confirmacion-autogestion input[type="checkbox"]:checked').each(function( index ) {
				var $element = $(this);
				eliminarElementoListado($element);
				
			});

			showDeshacerBlock(true);
		}

		function eliminarElementoListado($element){
			var i = ( typeof $element.data('index') != 'undefined' ? $element.data('index') : null);

			var $parent = $element.parent().closest('.linea-batch');

			if(i!=null)
			{
				lastdeleted.push(i);
				dataListadoConfirmacion[i].eliminado = true;
				$parent.remove();
			}

		}

		function seleccionarElementoListado($element, value){
			var i = ( typeof $element.data('index') != 'undefined' ? $element.data('index') : null);

			if(i!=null)
			{
				dataListadoConfirmacion[i].checked = value;
			}

		}

		var hasFirst = (($mainReactivacion.length>0 || $mainCambio.length>0 )  ? true : false );

		function generarListadoConfirmacionInicial(){

			var total = $listaconfirmar.find('.linea-batch').length;

			$listaconfirmar.find('.linea-batch').each(function (index, value) { 
			  var meta = ( typeof $(this).data('meta') != 'undefined' ? $(this).data('meta') : null );

			  var $element = $(this);

				if(meta != null){
					var elemento = '';
					
					$.when(elemento = getListadoConfirmacionSection(meta,index, hasFirst)).done(function(){
						
						$element.html(elemento.html);
						meta.eliminado = false;
						meta.error = {};
						dataListadoConfirmacion.push(meta);

						bindElementActions();
					});

				}
			});
		}

		function generarListadoConfirmacion(){
			$listaconfirmar.html('');
			$.each(dataListadoConfirmacion, function (index, data) {
				if(!data.eliminado){
					var elemento = '';
					$.when(elemento = getListadoConfirmacionSection(data,index) ).done(function( ) {
								$listaconfirmar.append('<div class="col-sm-12 center-block flexbox h-align-center linea-batch '+elemento.additionalClass+'">'+elemento.html+'</div>');
								bindElementActions();
							});

				}
			});

			if(!firstClick){
				$mainForm.valid();
			}

		}


		function generarHTMLSertec(meta, index){
			var html = "";
			var addClass = "";

			var checked = ( typeof meta.checked!= undefined ? meta.checked : false );

			addClass = (checked ? 'checked-element' : '');

		  	html+='<div class="col-sm-1 checkbox-container"> <input type="checkbox" id="i-'+meta.id+'" name="i-'+meta.id+'" value="'+meta.id+'" data-index ="'+index+'" '+(checked ? 'checked' : '')+'> <label for="i-'+meta.id+'"><span class="check-sq"></span></label> </div>';
			html+='<div class="col-sm-10 no-padding">';
				html+='<div class="col-sm-4 flexbox v-align-center"> <p title="'+meta.imei+'">'+meta.imei+'</p> </div>';
				html+='<div class="col-sm-4 flexbox v-align-center"> <p title="'+meta.marca+'">'+meta.marca+'</p> </div>';
				
				html+='<div class="col-sm-4 flexbox v-align-center"> <p title="'+meta.modelo+'">'+meta.modelo+'</p> </div>';

			html+='</div>';

			html+='<div class="col-sm-1 flexbox v-align-center delete-container"><span class="icon io-CloseSession btn-delete" title="Quitar" data-index ="'+index+'"></span> </div>'; 

			return { additionalClass : addClass ,html: html };

		}

		function generarHTMLControlCostos(meta, index){
			var html = "";
			var addClass = "";

			var checked = ( typeof meta.checked!= undefined ? meta.checked : false );

			addClass = (checked ? 'checked-element' : '');

		  	html+='<div class="col-sm-1 checkbox-container"> <input type="checkbox" id="i-'+meta.id+'" name="i-'+meta.id+'" value="'+meta.id+'" data-index ="'+index+'" '+(checked ? 'checked' : '')+'> <label for="i-'+meta.id+'"><span class="check-sq"></span></label> </div>';
			html+='<div class="col-sm-10 no-padding">';
				html+='<div class="col-sm-2 flexbox v-align-center"> <p title="'+meta.region+'">'+meta.region+'</p> </div>';
				html+='<div class="col-sm-2 flexbox v-align-center"> <p title="'+meta.cuenta+'">'+meta.cuenta+'</p> </div>';
				
				html+='<div class="col-sm-2 flexbox v-align-center"> <p title="'+meta.numero+'">'+meta.numero+'</p> </div>';

				html+='<div class="col-sm-3 flexbox v-align-center"> <p title="'+meta.titular+'">'+meta.titular+'</p> </div>';

				html+='<div class="col-sm-3 flexbox v-align-center"> <p title="'+meta.bloqueos+'">'+meta.bloqueos+'</p> </div>';

			html+='</div>';

			html+='<div class="col-sm-1 flexbox v-align-center delete-container"><span class="icon io-CloseSession btn-delete" title="Quitar" data-index ="'+index+'"></span> </div>'; 

			return { additionalClass : addClass ,html: html };

		}

		//** R3 CON ASIGNADO Quitar comment de función **/

		
		function generarHTMLGeneralAsignado(meta, index){
			var html = "";
			var addClass = "";

			var checked = ( typeof meta.checked!= undefined ? meta.checked : false );

			addClass = (checked ? 'checked-element' : '');

		  	html+='<div class="col-sm-1 checkbox-container"> <input type="checkbox" id="i-'+meta.id+'" name="i-'+meta.id+'" value="'+meta.id+'" data-index ="'+index+'" '+(checked ? 'checked' : '')+'> <label for="i-'+meta.id+'"><span class="check-sq"></span></label> </div>';
			html+='<div class="col-sm-10 no-padding">';
				html+='<div class="col-sm-2 flexbox v-align-center"> <p title="'+meta.region+'">'+meta.region+'</p> </div>';
				html+='<div class="col-sm-3 flexbox v-align-center"> <p title="'+meta.cuenta+'">'+meta.cuenta+'</p> </div>';
				
				html+='<div class="col-sm-3 flexbox v-align-center h-align-center"> <p title="'+meta.numero+'">'+meta.numero+'</p>'+ (typeof meta.ruta != 'undefined' ? '<div class="icon io-info show-more-details"><div class="triangle-tooltip"><span class="ruta">'+meta.ruta+'</span></div></div>' : '')+ '</div>';
				html+='<div class="col-sm-4 flexbox v-align-center"> <p title="'+meta.titular+'">'+meta.titular+'</p> </div>';
				

			html+='</div>';

			html+='<div class="col-sm-1 flexbox v-align-center delete-container"><span class="icon io-CloseSession btn-delete" title="Quitar" data-index ="'+index+'"></span> </div>'; 

			return { additionalClass : addClass ,html: html };

		}
		

		function generarHTMLGeneral(meta, index){
			var html = "";
			var addClass = "";

			var checked = ( typeof meta.checked!= undefined ? meta.checked : false );

			addClass = (checked ? 'checked-element' : '');

		  	html+='<div class="col-sm-1 checkbox-container"> <input type="checkbox" id="i-'+meta.id+'" name="i-'+meta.id+'" value="'+meta.id+'" data-index ="'+index+'" '+(checked ? 'checked' : '')+'> <label for="i-'+meta.id+'"><span class="check-sq"></span></label> </div>';
			html+='<div class="col-sm-10 no-padding">';
				html+='<div class="col-sm-3 flexbox v-align-center"> <p title="'+meta.region+'">'+meta.region+'</p> </div>';
				html+='<div class="col-sm-4 flexbox v-align-center"> <p title="'+meta.cuenta+'">'+meta.cuenta+'</p> </div>';
				
				html+='<div class="col-sm-5 flexbox v-align-center h-align-center"> <p title="'+meta.numero+'">'+meta.numero+'</p>'+ (typeof meta.ruta != 'undefined' ? '<div class="icon io-info show-more-details"><div class="triangle-tooltip"><span class="ruta">'+meta.ruta+'</span></div></div>' : '')+ '</div>';
				

			html+='</div>';

			html+='<div class="col-sm-1 flexbox v-align-center delete-container"><span class="icon io-CloseSession btn-delete" title="Quitar" data-index ="'+index+'"></span> </div>'; 

			return { additionalClass : addClass ,html: html };

		}

		function generarHTMLFacturacion(meta, index){
			var html = "";
			var addClass = "";

			var checked = ( typeof meta.checked!= undefined ? meta.checked : false );

			addClass = (checked ? 'checked-element' : '');

		  	html+='<div class="col-sm-1 checkbox-container"> <input type="checkbox" id="i-'+meta.id+'" name="i-'+meta.id+'" value="'+meta.id+'" data-index ="'+index+'" '+(checked ? 'checked' : '')+'> <label for="i-'+meta.id+'"><span class="check-sq"></span></label> </div>';
			html+='<div class="col-sm-10 no-padding">';

				html+='<div class="col-sm-4 flexbox v-align-center"> <p title="'+meta.region+'">'+meta.region+'</p> </div>';
				html+='<div class="col-sm-4 flexbox v-align-center"> <p title="'+meta.cuenta+'">'+meta.cuenta+'</p> </div>';
				html+='<div class="col-sm-4 flexbox v-align-center"> <p title="'+meta.razonsocial+'">'+meta.razonsocial+'</p> </div>';
				

			html+='</div>';

			html+='<div class="col-sm-1 flexbox v-align-center delete-container"><span class="icon io-CloseSession btn-delete" title="Quitar" data-index ="'+index+'"></span> </div>'; 

			return { additionalClass : addClass ,html: html };

		}

		/**R3 con Asignado
		function generarHTMLFacturacionLineas(meta, index){
			var html = "";
			var addClass = "";

			var checked = ( typeof meta.checked!= undefined ? meta.checked : false );

			addClass = (checked ? 'checked-element' : '');

		  	html+='<div class="col-sm-1 checkbox-container"> <input type="checkbox" id="i-'+meta.id+'" name="i-'+meta.id+'" value="'+meta.id+'" data-index ="'+index+'" '+(checked ? 'checked' : '')+'> <label for="i-'+meta.id+'"><span class="check-sq"></span></label> </div>';
			html+='<div class="col-sm-10 no-padding">';

				html+='<div class="col-sm-2 flexbox v-align-center"> <p title="'+meta.region+'">'+meta.region+'</p> </div>';
				html+='<div class="col-sm-2 flexbox v-align-center"> <p title="'+meta.cuenta+'">'+meta.cuenta+'</p> </div>';
				html+='<div class="col-sm-4 flexbox v-align-center"> <p title="'+meta.numero+'">'+meta.numero+'</p> </div>';
				html+='<div class="col-sm-4 flexbox v-align-center"> <p title="'+meta.nombre+'">'+meta.nombre+'</p> </div>';
				

			html+='</div>';

			html+='<div class="col-sm-1 flexbox v-align-center delete-container"><span class="icon io-CloseSession btn-delete" title="Quitar" data-index ="'+index+'"></span> </div>'; 

			return { additionalClass : addClass ,html: html };

		}
		**/

		function generarHTMLFacturacionLineas(meta, index){
			var html = "";
			var addClass = "";

			var checked = ( typeof meta.checked!= undefined ? meta.checked : false );

			addClass = (checked ? 'checked-element' : '');

		  	html+='<div class="col-sm-1 checkbox-container"> <input type="checkbox" id="i-'+meta.id+'" name="i-'+meta.id+'" value="'+meta.id+'" data-index ="'+index+'" '+(checked ? 'checked' : '')+'> <label for="i-'+meta.id+'"><span class="check-sq"></span></label> </div>';
			html+='<div class="col-sm-10 no-padding">';

				html+='<div class="col-sm-3 flexbox v-align-center"> <p title="'+meta.region+'">'+meta.region+'</p> </div>';
				html+='<div class="col-sm-4 flexbox v-align-center"> <p title="'+meta.cuenta+'">'+meta.cuenta+'</p> </div>';
				html+='<div class="col-sm-5 flexbox v-align-center"> <p title="'+meta.numero+'">'+meta.numero+'</p> </div>';
				

			html+='</div>';

			html+='<div class="col-sm-1 flexbox v-align-center delete-container"><span class="icon io-CloseSession btn-delete" title="Quitar" data-index ="'+index+'"></span> </div>'; 

			return { additionalClass : addClass ,html: html };

		}

		function generarHTMLFacturacionFacturas(meta, index){
			var html = "";
			var addClass = "";

			var checked = ( typeof meta.checked!= undefined ? meta.checked : false );

			addClass = (checked ? 'checked-element' : '');

		  	html+='<div class="col-sm-1 checkbox-container"> <input type="checkbox" id="i-'+meta.id+'" name="i-'+meta.id+'" value="'+meta.id+'" data-index ="'+index+'" '+(checked ? 'checked' : '')+'> <label for="i-'+meta.id+'"><span class="check-sq"></span></label> </div>';
			html+='<div class="col-sm-10 no-padding">';

				html+='<div class="col-sm-4 flexbox v-align-center"> <p title="'+meta.region+'">'+meta.region+'</p> </div>';
				html+='<div class="col-sm-4 flexbox v-align-center"> <p title="'+meta.cuenta+'">'+meta.cuenta+'</p> </div>';
				html+='<div class="col-sm-4 flexbox v-align-center"> <p title="'+meta.factura+'">'+meta.factura+'</p> </div>';

			html+='</div>';

			html+='<div class="col-sm-1 flexbox v-align-center delete-container"><span class="icon io-CloseSession btn-delete" title="Quitar" data-index ="'+index+'"></span> </div>'; 

			return { additionalClass : addClass ,html: html };

		}

		//** R3 CON ASIGNADO Quitar comment de función **/

		/**
		function generarHTMLReactivacion(meta, index, first){
			var html = "";
			var addClass = "";

			first = (typeof first != 'undefined' ? first : false );

			var errors = false;

			var isSingle = $mainForm.hasClass('autogestion-single');

			var showErrors = !firstClick || typeof meta.validated!= 'undefined';

			var checked = ( typeof meta.checked!= undefined ? meta.checked : false );

			if(first)
				checked = true;

			addClass = (checked ? 'checked-element' : '');

			if(typeof meta.error != "undefined"){

				errors = {
					chip : false,
					imei : false,
				};

				errors.chip =  (typeof meta.error.chip != "undefined" ? meta.error.chip : false );

				errors.imei =  (typeof meta.error.imei != "undefined" ? meta.error.imei : false );

				errors.has = errors.chip || errors.imei;
			}


			if(!isSingle)
		  		html+='<div class="col-sm-1 checkbox-container"><input type="checkbox" id="i-'+meta.id+'" name="i-'+meta.id+'" value="'+meta.id+'" data-index ="'+index+'" '+(checked ? 'checked' : '')+'/> <label for="i-'+meta.id+'"><span class="check-sq"></span></label></div>';

			html+='<div class="'+( $mainForm.hasClass('autogestion-single') ? 'col-sm-12' : 'col-sm-10')+' no-padding flexbox col-xs-12" id="line-'+meta.id+'">';

				html+=(!isSingle ? '<div class="col-sm-2 col-xs-12 flexbox v-align-center"><p class="mobile-only">Región</p> <p class="col-xs-12 col-sm-12" title="'+meta.region+'">'+meta.region+'</p> </div><div class="col-sm-2 col-xs-12 flexbox v-align-center"><p class="mobile-only">Cuenta</p> <p class="col-xs-12 col-sm-12" title="'+meta.cuenta+'">'+meta.cuenta+'</p> </div>': '')+'<div class="'+(!isSingle ? 'col-sm-2' : 'col-sm-3')+' col-xs-12 flexbox v-align-center h-align-center"> <p class="mobile-only">Número</p> <p class="col-xs-12 col-sm-10" title="'+meta.numero+'">'+meta.numero+'</p> '+ (typeof meta.ruta != 'undefined' ? '<div class="icon io-info show-more-details"><div class="triangle-tooltip"><span class="ruta">'+meta.ruta+'</span></div></div>' : '')+' </div>';
				html+=(isSingle ? '<div class="col-sm-3 col-xs-12 flexbox v-align-center"><p class="mobile-only">Nombre</p> <p class="col-xs-12 col-sm-12" title="'+meta.titular+'">'+meta.titular+'</p> </div>' : '');

				html += '<div class="col-sm-3 col-xs-12 flexbox v-align-center no-padding value-container"><strong class="mobile-only">Chip</strong><div class="show-more-details-container"> <div class="icon io-info show-more-details chip-imei mobile-only"> <div class="triangle-tooltip"> <p class="head-question flexbox v-align-center"><span class="icon io-Sim"></span>Dónde se obtiene el número de la SIM</p> <div class="description"> <p>Se encuentra en la parte posterior de la SIM o chip y se compone de 19 dígitos y una letra, escribe los 19 dígitos únicamente.</p> </div> </div> </div></div><div class="column-line col-xs-10 col-sm-12"><div class="input-container flexbox v-align-center col-xs-12"><input type="text" name="chip['+index+']" data-index ="'+index+'" placeholder="Chip - 19 dígitos" value="'+( meta.chip ? meta.chip : '')+'" title="'+( meta.chip ? meta.chip : '')+'" maxlength="19" '+(onlyRead && meta.chip ? 'readonly' : '') + ( !checked && !isSingle ? ' disabled ' : '') +' class="only-numbers '+(onlyRead && meta.chip ? 'like-text' : '') +' chip ' + (checked ? ' requerido ' : '') + ( showErrors && errors && errors.chip ? 'not-valid-element error' : (showErrors && errors && !errors.chip ? 'valid-element' : '' ) )+'"/><span class="icon icon-validation '+ ( showErrors && errors && !errors.chip ? 'i-check' : '' )  + '"></span></div>' + (showErrors && errors && errors.chip ? '<label class="error show-error">'+errors.chip +'</label>' : '' ) + '</div></div>';

				html += '<div class="col-sm-3 col-xs-12 flexbox v-align-center no-padding value-container"><strong class="mobile-only">IMEI</strong><div class="show-more-details-container"> <div class="icon io-info show-more-details chip-imei mobile-only"> <div class="triangle-tooltip"> <p class="head-question flexbox v-align-center"><span class="icon io-Sim"></span>Dónde se obtiene el IMEI</p> <div class="description"> <p>Para conocer el IMEI de tu equipo marca *#06# y el código de 15 dígitos se mostrará en la pantalla.</p> </div> </div> </div></div><div class="column-line col-xs-10 col-sm-12"><div class="input-container flexbox v-align-center col-xs-12"><input type="text" name="imei['+index+']" data-index ="'+index+'" placeholder="IMEI - 15 dígitos" value="'+(meta.imei ? meta.imei : '')+'" title="'+(meta.imei ? meta.imei : '')+'" maxlength="15" '+(onlyRead && meta.imei ? 'readonly' : '') + ( !checked && !isSingle ? ' disabled ' : '') +' class="only-numbers '+(onlyRead && meta.imei ? 'like-text' : '')+' imei ' + (checked ? ' requerido ' : '') + (showErrors && errors && errors.imei ? 'not-valid-element error' : ( showErrors && errors && !errors.imei ? 'valid-element' : '' ) )+' "/><span class="icon icon-validation '+ ( showErrors && errors && !errors.imei ? 'i-check' : '' ) + '"></span></div>' + ( showErrors && errors && errors.imei ? '<label class="error show-error">'+errors.imei +'</label>' : '' ) + '</div></div>';

			html+='</div>';

			if(!isSingle)
				html+='<div class="col-sm-1 flexbox v-align-center delete-container"><span class="icon io-CloseSession btn-delete" title="Quitar" data-index ="'+index+'"></span> </div>'; 

			//Si estan precargados
			if(meta.chip && meta.imei) datosValidosInit = true;

			return { additionalClass: addClass, html: html };

		}
		**/

		function generarHTMLReactivacion(meta, index, first){
			var html = "";
			var addClass = "";

			first = (typeof first != 'undefined' ? first : false );

			var errors = false;

			var isSingle = $mainForm.hasClass('autogestion-single');

			var showErrors = !firstClick || typeof meta.validated!= 'undefined';

			var checked = ( typeof meta.checked!= undefined ? meta.checked : false );

			if(first)
				checked = true;

			addClass = (checked ? 'checked-element' : '');

			if(typeof meta.error != "undefined"){

				errors = {
					chip : false,
					imei : false,
				};

				errors.chip =  (typeof meta.error.chip != "undefined" ? meta.error.chip : false );

				errors.imei =  (typeof meta.error.imei != "undefined" ? meta.error.imei : false );

				errors.has = errors.chip || errors.imei;
			}


			if(!isSingle)
		  		html+='<div class="col-sm-1 checkbox-container"><input type="checkbox" id="i-'+meta.id+'" name="i-'+meta.id+'" value="'+meta.id+'" data-index ="'+index+'" '+(checked ? 'checked' : '')+'/> <label for="i-'+meta.id+'"><span class="check-sq"></span></label></div>';

			html+='<div class="'+( $mainForm.hasClass('autogestion-single') ? 'col-sm-12' : 'col-sm-10')+' no-padding flexbox col-xs-12" id="line-'+meta.id+'">';

				html+=(!isSingle ? '<div class="col-sm-2 col-xs-12 flexbox v-align-center"><p class="mobile-only">Región</p> <p class="col-xs-12 col-sm-12" title="'+meta.region+'">'+meta.region+'</p> </div><div class="col-sm-2 col-xs-12 flexbox v-align-center"><p class="mobile-only">Cuenta</p> <p class="col-xs-12 col-sm-12" title="'+meta.cuenta+'">'+meta.cuenta+'</p> </div>': '')+'<div class="'+(!isSingle ? 'col-sm-2' : 'col-sm-4')+' col-xs-12 flexbox v-align-center h-align-center"> <p class="mobile-only">Número</p> <p class="col-xs-12 col-sm-10" title="'+meta.numero+'">'+meta.numero+'</p> '+ (typeof meta.ruta != 'undefined' ? '<div class="icon io-info show-more-details"><div class="triangle-tooltip"><span class="ruta">'+meta.ruta+'</span></div></div>' : '')+' </div>';
				

				html += '<div class="'+(!isSingle ? 'col-sm-3' : 'col-sm-4')+' col-xs-12 flexbox v-align-center no-padding value-container"><strong class="mobile-only">Chip</strong><div class="show-more-details-container"> <div class="icon io-info show-more-details chip-imei mobile-only"> <div class="triangle-tooltip"> <p class="head-question flexbox v-align-center"><span class="icon io-Sim"></span>Dónde se obtiene el número de la SIM</p> <div class="description"> <p>Se encuentra en la parte posterior de la SIM o chip y se compone de 19 dígitos y una letra, escribe los 19 dígitos únicamente.</p> </div> </div> </div></div><div class="column-line col-xs-10 col-sm-12"><div class="input-container flexbox v-align-center col-xs-12"><input type="text" name="chip['+index+']" data-index ="'+index+'" placeholder="Chip - 19 dígitos" value="'+( meta.chip ? meta.chip : '')+'" title="'+( meta.chip ? meta.chip : '')+'" maxlength="19" '+(onlyRead && meta.chip ? 'readonly' : '') + ( !checked && !isSingle ? ' disabled ' : '') +' class="only-numbers '+(onlyRead && meta.chip ? 'like-text' : '') +' chip ' + (checked ? ' requerido ' : '') + ( showErrors && errors && errors.chip ? 'not-valid-element error' : (showErrors && errors && !errors.chip ? 'valid-element' : '' ) )+'"/><span class="icon icon-validation '+ ( showErrors && errors && !errors.chip ? 'i-check' : '' )  + '"></span></div>' + (showErrors && errors && errors.chip ? '<label class="error show-error">'+errors.chip +'</label>' : '' ) + '</div></div>';

				html += '<div class="'+(!isSingle ? 'col-sm-3' : 'col-sm-4')+' col-xs-12 flexbox v-align-center no-padding value-container"><strong class="mobile-only">IMEI</strong><div class="show-more-details-container"> <div class="icon io-info show-more-details chip-imei mobile-only"> <div class="triangle-tooltip"> <p class="head-question flexbox v-align-center"><span class="icon io-Sim"></span>Dónde se obtiene el IMEI</p> <div class="description"> <p>Para conocer el IMEI de tu equipo marca *#06# y el código de 15 dígitos se mostrará en la pantalla.</p> </div> </div> </div></div><div class="column-line col-xs-10 col-sm-12"><div class="input-container flexbox v-align-center col-xs-12"><input type="text" name="imei['+index+']" data-index ="'+index+'" placeholder="IMEI - 15 dígitos" value="'+(meta.imei ? meta.imei : '')+'" title="'+(meta.imei ? meta.imei : '')+'" maxlength="15" '+(onlyRead && meta.imei ? 'readonly' : '') + ( !checked && !isSingle ? ' disabled ' : '') +' class="only-numbers '+(onlyRead && meta.imei ? 'like-text' : '')+' imei ' + (checked ? ' requerido ' : '') + (showErrors && errors && errors.imei ? 'not-valid-element error' : ( showErrors && errors && !errors.imei ? 'valid-element' : '' ) )+' "/><span class="icon icon-validation '+ ( showErrors && errors && !errors.imei ? 'i-check' : '' ) + '"></span></div>' + ( showErrors && errors && errors.imei ? '<label class="error show-error">'+errors.imei +'</label>' : '' ) + '</div></div>';

			html+='</div>';

			if(!isSingle)
				html+='<div class="col-sm-1 flexbox v-align-center delete-container"><span class="icon io-CloseSession btn-delete" title="Quitar" data-index ="'+index+'"></span> </div>'; 

			//Si estan precargados
			if(meta.chip && meta.imei) datosValidosInit = true;

			return { additionalClass: addClass, html: html };

		}

		//** R3 CON ASIGNADO Quitar comment de función **/

		/**
		function generarHTMLCambio(meta, index, first){
			var html = "";
			var addClass = "";

			first = (typeof first != 'undefined' ? first : false );

			var errors = false;

			var isSingle = $mainForm.hasClass('autogestion-single');

			var showErrors = !firstClick || typeof meta.validated!= 'undefined';

			var checked = ( typeof meta.checked!= undefined ? meta.checked : false );

			if(first)
				checked = true;

			addClass = (checked ? 'checked-element' : '');

			var onlyCHIP = false;
			var onlyIMEI = false;
			var both = false;

			onlyCHIP = (typeof meta.imei != "undefined" ? false : true );

			onlyIMEI = (typeof meta.chip != "undefined" ? false : true );

			both = !onlyCHIP && !onlyIMEI;

			if(!$mainForm.hasClass('autogestion-single'))
		  		html+='<div class="col-sm-1 checkbox-container"><input type="checkbox" id="i-'+meta.id+'" name="i-'+meta.id+'" value="'+meta.id+'" data-index ="'+index+'" '+(checked ? 'checked' : '')+'/> <label for="i-'+meta.id+'"><span class="check-sq"></span></label></div>';

			html+='<div class="'+( $mainForm.hasClass('autogestion-single') ? 'col-sm-12 col-xs-12' : 'col-sm-10 col-xs-10')+' no-padding flexbox" id="line-'+meta.id+'">';
				
				html+='<div class="mobile-one-line '+(both ? 'col-sm-2' : 'col-sm-2')+ ' col-xs-12 flexbox v-align-center"><p class="mobile-only">Región</p> <p title="'+meta.region+'">'+meta.region+'</p> </div>';

				html+='<div class="mobile-one-line '+(both ? 'col-sm-2' : 'col-sm-2')+ ' col-xs-12 flexbox v-align-center"><p class="mobile-only">Cuenta</p> <p title="'+meta.cuenta+'">'+meta.cuenta+'</p> </div>';

				html+='<div class="mobile-one-line '+(both ? 'col-sm-2' : 'col-sm-2')+ ' col-xs-12 flexbox v-align-center h-align-center"> <p class="mobile-only">Número</p> <p title="'+meta.numero+'">'+meta.numero+'</p> '+ (typeof meta.ruta != 'undefined' ? '<div class="icon io-info show-more-details"><div class="triangle-tooltip"><span class="ruta">'+meta.ruta+'</span></div></div>' : '')+' </div>';

				html+=(!both ? '<div class="mobile-one-line col-sm-3 col-xs-12 flexbox v-align-center"><p class="mobile-only">Nombre</p> <p title="'+meta.titular+'">'+meta.titular+'</p> </div>' : '');

				if(!onlyIMEI)
					html+='<div class="col-sm-3 col-xs-12 flexbox v-align-center no-padding value-container"><strong class="mobile-only">Chip</strong><div class="show-more-details-container"> <div class="icon io-info show-more-details chip-imei mobile-only"> <div class="triangle-tooltip"> <p class="head-question flexbox v-align-center"><span class="icon io-Sim"></span>Dónde se obtiene el número de la SIM</p> <div class="description"> <p>Se encuentra en la parte posterior de la SIM o chip y se compone de 19 dígitos y una letra, escribe los 19 dígitos únicamente.</p> </div> </div> </div></div><div class="column-line col-xs-10 col-sm-12"><div class="input-container flexbox v-align-center col-xs-12"><input type="text" name="chip['+index+']" data-index ="'+index+'" placeholder="Chip - 19 dígitos" value="'+(meta.chip ? meta.chip : '')+'" title="'+(meta.chip ? meta.chip : '')+'" maxlength="19" class="only-numbers chip '+ (checked ? ' requerido ' : '') +'" '+( !checked && !isSingle ? ' disabled ' : '')+'/><span class="icon icon-validation"></span></div></div></div>';

				if(!onlyCHIP)
					html+='<div class="col-sm-3 col-xs-12 flexbox v-align-center no-padding value-container"><strong class="mobile-only">IMEI</strong><div class="show-more-details-container"> <div class="icon io-info show-more-details chip-imei mobile-only"> <div class="triangle-tooltip"> <p class="head-question flexbox v-align-center"><span class="icon io-Sim"></span>Dónde se obtiene el IMEI</p> <div class="description"> <p>Para conocer el IMEI de tu equipo marca *#06# y el código de 15 dígitos se mostrará en la pantalla.</p> </div> </div> </div></div><div class="column-line col-xs-10 col-sm-12"><div class="input-container flexbox v-align-center col-xs-12"> <input type="text" name="imei['+index+']" data-index ="'+index+'" placeholder="IMEI - 15 dígitos" value="'+(meta.imei ? meta.imei : '')+'" title="'+(meta.imei ? meta.imei : '')+'" maxlength="15" class="only-numbers imei '+ (checked ? ' requerido ' : '') +'" '+( !checked && !isSingle ? ' disabled ' : '')+'/><span class="icon icon-validation"></span></div></div></div>';

			html+='</div>';

			if(!$mainForm.hasClass('autogestion-single'))
				html+='<div class="col-sm-1 flexbox v-align-center delete-container"><span class="icon io-CloseSession btn-delete" title="Quitar" data-index ="'+index+'"></span> </div>'; 

			return { additionalClass : addClass, html: html };

		}

		**/

		function generarHTMLCambio(meta, index, first){
			var html = "";
			var addClass = "";

			first = (typeof first != 'undefined' ? first : false );

			var errors = false;

			var isSingle = $mainForm.hasClass('autogestion-single');

			var showErrors = !firstClick || typeof meta.validated!= 'undefined';

			var checked = ( typeof meta.checked!= undefined ? meta.checked : false );

			if(first)
				checked = true;

			addClass = (checked ? 'checked-element' : '');

			var onlyCHIP = false;
			var onlyIMEI = false;
			var both = false;

			onlyCHIP = (typeof meta.imei != "undefined" ? false : true );

			onlyIMEI = (typeof meta.chip != "undefined" ? false : true );

			both = !onlyCHIP && !onlyIMEI;

			if(!$mainForm.hasClass('autogestion-single'))
		  		html+='<div class="col-sm-1 checkbox-container"><input type="checkbox" id="i-'+meta.id+'" name="i-'+meta.id+'" value="'+meta.id+'" data-index ="'+index+'" '+(checked ? 'checked' : '')+'/> <label for="i-'+meta.id+'"><span class="check-sq"></span></label></div>';

			html+='<div class="'+( $mainForm.hasClass('autogestion-single') ? 'col-sm-12 col-xs-12' : 'col-sm-10 col-xs-10')+' no-padding flexbox" id="line-'+meta.id+'">';
				
				html+='<div class="mobile-one-line '+(both ? 'col-sm-2' : 'col-sm-3')+ ' col-xs-12 flexbox v-align-center"><p class="mobile-only">Región</p> <p title="'+meta.region+'">'+meta.region+'</p> </div>';

				html+='<div class="mobile-one-line '+(both ? 'col-sm-2' : 'col-sm-3')+ ' col-xs-12 flexbox v-align-center"><p class="mobile-only">Cuenta</p> <p title="'+meta.cuenta+'">'+meta.cuenta+'</p> </div>';

				html+='<div class="mobile-one-line '+(both ? 'col-sm-2' : 'col-sm-3')+ ' col-xs-12 flexbox v-align-center h-align-center"> <p class="mobile-only">Número</p> <p title="'+meta.numero+'">'+meta.numero+'</p> '+ (typeof meta.ruta != 'undefined' ? '<div class="icon io-info show-more-details"><div class="triangle-tooltip"><span class="ruta">'+meta.ruta+'</span></div></div>' : '')+' </div>';


				if(!onlyIMEI)
					html+='<div class="col-sm-3 col-xs-12 flexbox v-align-center no-padding value-container"><strong class="mobile-only">Chip</strong><div class="show-more-details-container"> <div class="icon io-info show-more-details chip-imei mobile-only"> <div class="triangle-tooltip"> <p class="head-question flexbox v-align-center"><span class="icon io-Sim"></span>Dónde se obtiene el número de la SIM</p> <div class="description"> <p>Se encuentra en la parte posterior de la SIM o chip y se compone de 19 dígitos y una letra, escribe los 19 dígitos únicamente.</p> </div> </div> </div></div><div class="column-line col-xs-10 col-sm-12"><div class="input-container flexbox v-align-center col-xs-12"><input type="text" name="chip['+index+']" data-index ="'+index+'" placeholder="Chip - 19 dígitos" value="'+(meta.chip ? meta.chip : '')+'" title="'+(meta.chip ? meta.chip : '')+'" maxlength="19" class="only-numbers chip '+ (checked ? ' requerido ' : '') +'" '+( !checked && !isSingle ? ' disabled ' : '')+'/><span class="icon icon-validation"></span></div></div></div>';

				if(!onlyCHIP)
					html+='<div class="col-sm-3 col-xs-12 flexbox v-align-center no-padding value-container"><strong class="mobile-only">IMEI</strong><div class="show-more-details-container"> <div class="icon io-info show-more-details chip-imei mobile-only"> <div class="triangle-tooltip"> <p class="head-question flexbox v-align-center"><span class="icon io-Sim"></span>Dónde se obtiene el IMEI</p> <div class="description"> <p>Para conocer el IMEI de tu equipo marca *#06# y el código de 15 dígitos se mostrará en la pantalla.</p> </div> </div> </div></div><div class="column-line col-xs-10 col-sm-12"><div class="input-container flexbox v-align-center col-xs-12"> <input type="text" name="imei['+index+']" data-index ="'+index+'" placeholder="IMEI - 15 dígitos" value="'+(meta.imei ? meta.imei : '')+'" title="'+(meta.imei ? meta.imei : '')+'" maxlength="15" class="only-numbers imei '+ (checked ? ' requerido ' : '') +'" '+( !checked && !isSingle ? ' disabled ' : '')+'/><span class="icon icon-validation"></span></div></div></div>';

			html+='</div>';

			if(!$mainForm.hasClass('autogestion-single'))
				html+='<div class="col-sm-1 flexbox v-align-center delete-container"><span class="icon io-CloseSession btn-delete" title="Quitar" data-index ="'+index+'"></span> </div>'; 

			return { additionalClass : addClass, html: html };

		}

	}

	/** Servicios masivos **/
	function initFormularioServiciosMasivo(){
		var $mainForm = $('#autogestion-form');

		var tipoIngreso = null;

		initActions();
		validateMainForm();

		function initActions(){

			/**
				Cuando se esconda el step 2
			**/

			var fullReset = false;

			$('#componente-ingresar-lineas .btn-al').on('click', function(event) {
				fullReset = true;
			});

			$('#autogestion-paso-2').on('hide', function(event) {
				var target = $(event.target).attr('id');
				if(target==='autogestion-paso-2' && fullReset)
			      resetMainForm();

			  	fullReset = false;

			  	// $('#autogestion-btn').prop('disabled', !validateFormData());
			});

			// $('#autogestion-paso-2').on('show', function(event) {
			//   	$('#autogestion-btn').prop('disabled', !validateFormData());
			// });

			/**
				Setea la info del Motivo
			**/
			$('.motivo-autogestion').change(function() {
				var $checkbox = $(this);
				var buttontext =  (typeof $checkbox.data('btexto')!='undefined' ? $checkbox.data('btexto') : null );

				if(buttontext != null)
					$('#autogestion-btn').html(buttontext);

				$('#autogestion-btn').prop('disabled', !validateFormData());

				/**Quitar una vez en producción solo es para propositos de development y simular**/
				updateFormPostURL($checkbox.val());
			});

			/**
				Checar cuando cambia el checkbox
			**/

			$('#checkbox-autogestion-terminos').change(function() {

				$('#autogestion-btn').prop('disabled', !validateFormData());
			});
		}

		function validateMainForm(){

			disableSumbitButton($mainForm, true);

			elementsForm['validator'] = 
				$mainForm.validate({
				  rules: {
					archivo: {
						extension: "xls",
						filesize: 10000000
					},
					motivoAutogestion: {
						required: true
					},
					checkboxAutogestion: {
						required: true
					}
				  },
				  messages: {
					 archivo: {
					   required: "Ingresa un archivo de 10 MB máximo.",
					   extension: "Ingresa un archivo con extensión: .xls",
					   filesize: "Ingresa un archivo de 10 MB máximo."
					 },
					 motivoAutogestion: {
					   required: "Selecciona un motivo.",
					 },
					 checkboxAutogestion: {
					   required: "Acepta términos y condiciones.",
					 }
				   },
					errorClass : "error-dd error",
					errorElement : 'div',
					errorPlacement: function(error, element) {
						var elementInput = element[0];
						if(element[0]['id']==='archivo' && $(elementInput).val() != ''){
							$('.lineas-archivo .extra-info').hide();
							error.appendTo( $('.lineas-archivo .add-lines-ge-mod' ));
							element.parent().addClass('error');

						}
					},
					success: function ($error) {
						if($error.length>0 && $('#archivo').val() != ''){
							$('.lineas-archivo .extra-info').hide();
							$('.lineas-archivo .file.error' ).removeClass('error');
			   				$error.remove();
						}
		
			        },
			        submitHandler: function(form) {
						if(!elementsForm['sending']){
							sendFormData(form);
				  		}
					}
				});	

			function sendFormData(form){
				elementsForm['sending'] = true;
				$(form).find('button[type="submit"]').prop('disabled', true);

				var self = $(form).serialize();

				var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
				
				/**Quitar una vez en producción y aqui solo checamos si es una línea en development para mandar a otra liga**/
				var sendTo = ( (ingresarLineasComponentTotal == 1 && is_mobile() && typeof $(form).data('actionmobile') != 'undefined') ? $(form).data('actionmobile') : urlPOST);

				urlPOST = checkDevelopmentPostHTML(urlPOST);

				$.post(  urlPOST , self )
				.done(function( data ) {
				  	Services.autogestion.masivoAutogestionServiciosCallSuccess(data, form, sendTo, showInvalidErrorArchivo );
					elementsForm['sending'] = false;

				 })
				.fail(function( jqxhr, textStatus, error ) {
				  	//Mensaje de error del sistema
				  	Services.autogestion.masivoAutogestionServiciosCallFail(error, form);
				  	elementsForm['sending'] = false;
				});
			}
		}

		function validateFormData(){

			
			var dataLineas = [];
			var lineasValid = false;
			//var dataArchivo = ingresarLineasComponent.getDataArchivo();

			var dataType = ingresarLineasComponent.getType();

			if(dataType === '.componente-lineas-block .lineas-autocomplete')
				dataLineas = ingresarLineasComponent.getDataAutocomplete();
			else if(dataType === '.componente-lineas-block .lineas-arbol')
				dataLineas = ingresarLineasComponent.getDataArbol();
			else
				dataLineas.push(null);

			if(dataLineas.length>0 && $mainForm.valid())
				lineasValid = true;

	    	$('#lineas-hidden-input').val(JSON.stringify(dataLineas));

			if($('#checkbox-autogestion-terminos').is(":checked") && $('.motivo-autogestion').is(":checked") && lineasValid)
				return true;


			return false;
		}

		function resetMainForm(){

			$mainForm.find("input[type=text], input[type=email], input[type=password], select").val("");
			$mainForm.find("input[type=checkbox], input[type=radio]").prop("checked", false);
			$mainForm.find('button[type="submit"]').prop('disabled', true);
			
			if(elementsForm['validator']){
				elementsForm['validator'].resetForm();
			}
		}
	}
	/** fin servicios masivos **/

	/** Roaming single **/
	function initFormularioRoamingSingle(){
		var $mainForm = $('#autogestion-form-single');


		initActions();
		validateMainForm();

		function initActions(){

			$(".calendar").on("change",function(e){
				e.stopPropagation();
				$('#autogestion-btn').prop('disabled', false);
				
			});

		}

		function validateMainForm(){

			disableSumbitButton($mainForm, true);

			elementsForm['validator'] = 
				$mainForm.validate({
					ignore: "",
				  rules: {
					"fecha-inicio": {
						required: true
					},
					"fecha-fin": {
						required: true
					}
				  },
				  messages: {
					 "fecha-inicio": {
					   required: "Ingresa una fecha de inicio.",
					 },
					 "fecha-fin": {
					   required: "Ingresa una fecha fin.",
					 }
				   },
					errorClass : "error-dd error",
					errorElement : 'div',
					errorPlacement: function(error, element) {
						var elementInput = element[0];
						if(element[0]['id']==='archivo' && $(elementInput).val() != ''){
							$('.lineas-archivo .extra-info').hide();
							error.appendTo( $('.lineas-archivo .add-lines-ge-mod' ));
							element.parent().addClass('error');

						}
					},
					success: function ($error) {
						if($error.length>0 && $('#archivo').val() != ''){
							$('.lineas-archivo .extra-info').hide();
							$('.lineas-archivo .file.error' ).removeClass('error');
			   				$error.remove();
						}
		
			        },
			        submitHandler: function(form) {
						if(!elementsForm['sending']){
							sendFormData(form);
				  		}
					}
				});	

			function sendFormData(form){
				elementsForm['sending'] = true;
				$(form).find('button[type="submit"]').prop('disabled', true);

				var self = $(form).serialize();

				var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
				
				/**Quitar una vez en producción**/
				var sendTo = urlPOST;

				urlPOST = checkDevelopmentPostHTML(urlPOST);

				$.post(  urlPOST , self )
				.done(function( data ) {
				  	Services.autogestion.singleAutogestionRoamingCallSuccess(data, form, sendTo);
					elementsForm['sending'] = false;

				 })
				.fail(function( jqxhr, textStatus, error ) {
				  	//Mensaje de error del sistema
				  	Services.autogestion.singleAutogestionRoamingCallFail(error, form);
				  	elementsForm['sending'] = false;
				});
			}
		}
	}
	/** fin roaming single **/

	/** Roaming masivo **/
	function initFormularioRoamingMasivo(){
		var $mainForm = $('#autogestion-form');

		var tipoIngreso = null;

		initActions();
		validateMainForm();

		function initActions(){

			/**
				Cuando se esconda el step 2
			**/

			var fullReset = false;

			$('#componente-ingresar-lineas .btn-al').on('click', function(event) {
				fullReset = true;
			});

			$('#autogestion-paso-2').on('show', function(event) {
				fullReset = true;

				$('#autogestion-btn, .btn-continuar').prop('disabled', !validateFormData());
			});

			$('#autogestion-paso-2').on('hide', function(event) {
				var target = $(event.target).attr('id');
				if(target==='autogestion-paso-2' && fullReset)
			      resetMainForm();

			  	fullReset = false;

			  	$('#autogestion-btn, .btn-continuar').prop('disabled', true);
			});

			// $(".calendar").on("change",function(e){
			// 	e.stopPropagation();
			// 	//removeFechaError($('#input-fecha-corte'));
			// 	setTimeout(function(){
			// 		$('#autogestion-btn, .btn-continuar').prop('disabled', !validateFormData());
			// 	}, 800);
				
			// });

		}

		function validateMainForm(){

			disableSumbitButton($mainForm, true);

			elementsForm['validator'] = 
				$mainForm.validate({
					ignore: "",
				  rules: {
					archivo: {
						extension: "xls",
						filesize: 10000000
					},
					"fecha-inicio": {
						required: true
					},
					"fecha-fin": {
						required: true
					}
				  },
				  messages: {
					 archivo: {
					   required: "Ingresa un archivo de 10 MB máximo.",
					   extension: "Ingresa un archivo con extensión: .xls",
					   filesize: "Ingresa un archivo de 10 MB máximo."
					 },
					 "fecha-inicio": {
					   required: "Ingresa una fecha de inicio.",
					 },
					 "fecha-fin": {
					   required: "Ingresa una fecha fin.",
					 }
				   },
					errorClass : "error-dd error",
					errorElement : 'div',
					errorPlacement: function(error, element) {
						var elementInput = element[0];
						if(element[0]['id']==='archivo' && $(elementInput).val() != ''){
							$('.lineas-archivo .extra-info').hide();
							error.appendTo( $('.lineas-archivo .add-lines-ge-mod' ));
							element.parent().addClass('error');

						}
					},
					success: function ($error) {
						if($error.length>0 && $('#archivo').val() != ''){
							$('.lineas-archivo .extra-info').hide();
							$('.lineas-archivo .file.error' ).removeClass('error');
			   				$error.remove();
						}
		
			        },
			        submitHandler: function(form) {
						if(!elementsForm['sending']){
							sendFormData(form);
				  		}
					}
				});	

			function sendFormData(form){
				elementsForm['sending'] = true;
				$(form).find('button[type="submit"]').prop('disabled', true);

				var self = $(form).serialize();

				var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
				
				/**Quitar una vez en producción y aqui solo checamos si es una línea en development para mandar a otra liga**/
				var sendTo = ( (ingresarLineasComponentTotal == 1 && is_mobile() && typeof $(form).data('actionmobile') != 'undefined') ? $(form).data('actionmobile') : urlPOST);

				urlPOST = checkDevelopmentPostHTML(urlPOST);

				$.post(  urlPOST , self )
				.done(function( data ) {
				  	Services.autogestion.masivoAutogestionRoamingCallSuccess(data, form, sendTo, showInvalidErrorArchivo );
					elementsForm['sending'] = false;

				 })
				.fail(function( jqxhr, textStatus, error ) {
				  	//Mensaje de error del sistema
				  	Services.autogestion.masivoAutogestionRoamingCallFail(error, form);
				  	elementsForm['sending'] = false;
				});
			}
		}

		function validateFormData(){

			
			var dataLineas = [];
			var lineasValid = false,
			dateInit = $('#input-fecha-inicio').val(),
			dateFin  =  $('#input-fecha-fin').val();

			var dataType = ingresarLineasComponent.getType();

			if(dataType === '.componente-lineas-block .lineas-autocomplete')
				dataLineas = ingresarLineasComponent.getDataAutocomplete();
			else if(dataType === '.componente-lineas-block .lineas-arbol')
				dataLineas = ingresarLineasComponent.getDataArbol();
			else
				dataLineas.push(null);

			if(dataLineas.length>0 && $mainForm.valid())
				lineasValid = true;

	    	$('#lineas-hidden-input').val(JSON.stringify(dataLineas));

			if(lineasValid)
				return true;


			return false;
		}

		function resetMainForm(){
			$mainForm.find("input[type=text], input[type=email], input[type=password], select").val("");
			$mainForm.find("input[type=checkbox], input[type=radio]").prop("checked", false);
			$mainForm.find('button[type="submit"]').prop('disabled', true);
			$mainForm.find('.date-picker .calendar').datepicker( "setDate" , null );
  			$mainForm.find('.fecha-input').val('');
  			$mainForm.find('.date-picker .fecha.one-field').html('');
  			$mainForm.find('.date-picker .fecha-fin').closest('.date-picker').addClass('disabled');
			if(elementsForm['validator']){
				elementsForm['validator'].resetForm();
			}
		}
	}
	/** fin roaming masivos **/

	function initComponentes(){

		/** componente formulario una línea para suspensión**/
	    if($('.autogestion-suspension-block #autogestion-form-single').length>0)
			initFormularioSuspensionSingle();

		/** componente formulario una línea para autogestión general (cambio y reactivacion)**/
		if($('.autogestion-reactivacion-cambio-block #autogestion-form-single').length>0)
			initFormularioGeneralSingle();

		/** componente formulario varías líneas para suspension**/
	    if($('.autogestion-suspension-block #autogestion-form').length>0)
			initFormularioSuspensionMasivo();

		/** componente formulario para citas**/
	    if($('.citas-block #autogestion-form').length>0 || $('.citas-block #autogestion-form-single').length>0)
			initFormularioCitas();

		/** componente formulario para red privada**/
	    if($('.red-privada-block #autogestion-form').length>0)
			initFormularioRedPrivada();

		/** componente formulario para red privada**/
	    if($('.red-privada-block #autogestion-form-abono').length>0)
			initFormularioAbonoDeSaldo();

		/** componente formulario para roamingSingle**/
		if($('.autogestion-general-block.roaming-block #autogestion-form-single').length>0)
			initFormularioRoamingSingle();

		/** componente formulario para roamingMasivo**/
		if($('.autogestion-general-block.roaming-block #autogestion-form').length>0)
			initFormularioRoamingMasivo();

		/** componente formulario varías líneas para autogestión general (cambio y reactivacion)**/
		if($('.autogestion-reactivacion-cambio-block #autogestion-form').length>0)
			initFormularioGeneralMasivo();

		/** componente para autogestión servicios y formulario varías líneas servicios**/
		if($('.autogestion-servicios-block').length>0){
			serviciosTelcel.inicializar();
			if($('.autogestion-servicios-block #autogestion-form').length>0)
				initFormularioServiciosMasivo();
		}

		/** componente para autogestión confirmación general**/
	    if($('#autogestion-confirmacion').length>0)
	    	initConfirmacionAutogestion();
	    /** componente para autogestión confirmación general**/

	    if($('#listado-sin-autogestion-container').length>0 || $('#listado-post-confirmacion-suspension').length>0)
	    	initConfirmacionListado();

	}

	return{
        inicializar: function(){

            if($('.autogestion-general-block').length>0)
            	initComponentes();

        }
    }

})();