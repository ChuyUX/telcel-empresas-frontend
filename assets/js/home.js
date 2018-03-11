var home = (function(){

	var modalDescargarFacturas = null,
	currentModalData = {},
	formElementsModales = {
		'descargarFacturas': {id: null, validator: null, sending: false },
		'cambio': {id: 'form-home-cambio', validator: null, sending: false },
		'reactivacion': {id: 'form-home-reactivacion', validator: null, sending: false },
		'cac': {id: 'form-home-cac', validator: null, sending: false },
		'suspension': {id: 'form-home-suspension', validator: null, sending: false }
	};

	var $tabsContainer = $('.tabs-block'),
	$tabsSelector = $tabsContainer.find('.link-secondary-tabs ul li'),
	$tabs = $tabsContainer.find('.info-secondary-tabs .tab-pane'),
	$facturasBlock = $('#facturas-pendientes-block');
	
	function resetForms(){
		$('.form-tab').next('.api-msg-success').addClass('hidden');
		$('.form-tab').parent().find('.api-msg-error').addClass('hidden');
		$('.form-tab').parent().parent().parent().find('.heading-opc-tab').removeClass('hidden');
		$('.form-tab').removeClass('hidden');
		

		$('.terminos-container').each(function (index) { 
		  var $terminosContainer = $(this);

			if($terminosContainer.hasClass('visible')){
				$terminosContainer.removeClass('visible')
				$terminosContainer.hide();
			}
	
		});

		$('.form-tab').find("input[type=text], input[type=email], input[type=password], select").val("");
		$('.form-tab').find("input[type=checkbox], input[type=radio]").prop("checked", false);
		$('.form-tab').find('button[type="submit"]').prop('disabled', true);
		
		if(formElementsModales['cambio']['validator']){
			formElementsModales['cambio']['validator'].resetForm();
		}

		if(formElementsModales['reactivacion']['validator']){
			formElementsModales['reactivacion']['validator'].resetForm();
		}

		if(formElementsModales['cac']['validator']){
			formElementsModales['cac']['validator'].resetForm();
		}

		if(formElementsModales['suspension']['validator']){
			formElementsModales['suspension']['validator'].resetForm();
		}
	}

	function initFormValidations(){
		validateSuspensionForm();
		validateCambioForm();
		validateReactivacionForm();
		validateCACForm();
	}

	function validateCACForm(){
		var $mainForm = $('#'+formElementsModales['cac']['id']);
		disableSumbitButton($mainForm, true);
		formElementsModales['cac']['validator'] = 
			$mainForm.validate({
			  rules: {
				checkboxAutogestion : {
					required : true
				},
				nombre: {
					required: true,
					basicName: true,
					minlength: 3,
					maxlength: 40
				},
				numero : {
					digits: true,
					minlength: 10,
					maxlength: 10,
					required : true
				},
				tramite : {
					required : true
				}
			  },
			  messages: {
			  	numero: {
					required: "Ingresa un número de contacto.",
					digits: "Ingresa un número válido.",
					minlength: "Ingresa un número de 10 dígitos.",
					maxlength: "Ingresa un número de 10 dígitos."
				},
				tramite : {
					required : "Selecciona un trámite a realizar."
				},
				nombre: {
					required : "Ingresa un nombre.",
					basicName: "Este campo solo acepta letras, números, punto y espacios.",
					minlength: "El nombre debe contener al menos 3 caracteres.",
				   	maxlength : "El nombre no debe ser mayor a 40 caracteres."
				}
			   },
				errorPlacement: function(error, element) {
					var $parent = element.parent().parent().parent();
					if(element[0].name=='numero' || element[0].name=='tramite' || element[0].name=='nombre'){				   		
				   		$('<div class="error-aux col-sm-7 col-xs-9 col-xs-offset-3 col-sm-offset-5"></div>').insertAfter( $parent );
				   		$parent.next('.error-aux').append(error);
					}
				},
		        submitHandler: function(form) {
					if(!formElementsModales['cac']['sending']){
						sendFormData(form);
			  		}
				}
		});	

		checkGeneralValidForm($mainForm);

		function sendFormData(form){
			formElementsModales['cac']['sending'] = true;
			$(form).find('button[type="submit"]').prop('disabled', true);

			var self = $(form).serialize();

			var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
			
			/**Quitar una vez en producción**/
			var sendTo = urlPOST;

			urlPOST = checkDevelopmentPostHTML(urlPOST);

			$.post(  urlPOST , self )
			.done(function( data ) {
			  	Services.home.CACFormCallSuccess(data, form );
				formElementsModales['cac']['sending'] = false;

			 })
			.fail(function( jqxhr, textStatus, error ) {
			  	//Mensaje de error del sistema
			  	Services.home.CACFormCallFail(error, form);
			  	formElementsModales['cac']['sending'] = false;
			});
		}
	}

	function validateReactivacionForm(){
		var $mainForm = $('#'+formElementsModales['reactivacion']['id']);
		disableSumbitButton($mainForm, true);
		formElementsModales['reactivacion']['validator'] = 
			$mainForm.validate({
			  rules: {
				checkboxAutogestion : {
					required : true
				},
				numero : {
					digits: true,
					minlength: 10,
					maxlength: 10,
					required : true
				}
			  },
			  messages: {
			  	numero: {
					required: "Ingresa un número de contacto.",
					digits: "Ingresa un número válido.",
					minlength: "Ingresa un número de 10 dígitos.",
					maxlength: "Ingresa un número de 10 dígitos."
				}
			   },
				errorPlacement: function(error, element) {
					var $parent = element.parent().parent().parent();
					if(element[0].name=='numero'){				   		
				   		$('<div class="error-aux col-sm-7 col-xs-9 col-xs-offset-3 col-sm-offset-5"></div>').insertAfter( $parent );
				   		$parent.next('.error-aux').append(error);
					}
				},
		        submitHandler: function(form) {
					if(!formElementsModales['reactivacion']['sending']){
						sendFormData(form);
			  		}
				}
		});	

		checkGeneralValidForm($mainForm);

		function sendFormData(form){
			formElementsModales['reactivacion']['sending'] = true;
			$(form).find('button[type="submit"]').prop('disabled', true);

			var self = $(form).serialize();

			var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
			
			/**Quitar una vez en producción**/
			var sendTo = urlPOST;

			urlPOST = checkDevelopmentPostHTML(urlPOST);

			$.post(  urlPOST , self )
			.done(function( data ) {
			  	Services.home.reactivacionFormCallSuccess(data, form );
				formElementsModales['reactivacion']['sending'] = false;

			 })
			.fail(function( jqxhr, textStatus, error ) {
			  	//Mensaje de error del sistema
			  	Services.home.reactivacionFormCallFail(error, form);
			  	formElementsModales['reactivacion']['sending'] = false;
			});
		}
	}

	function validateCambioForm(){
		var $mainForm = $('#'+formElementsModales['cambio']['id']);
		disableSumbitButton($mainForm, true);
		formElementsModales['cambio']['validator'] = 
			$mainForm.validate({
			  rules: {
			  	chip: {
				  	minlength: 19,
					exactlength: 19,
					required : true,
					digits : true
				},
				checkboxAutogestion : {
					required : true
				},
				numero : {
					digits: true,
					minlength: 10,
					maxlength: 10,
					required : true
				}
			  },
			  messages: {
			  	numero: {
					required: "Ingresa un número de contacto.",
					digits: "Ingresa un número válido.",
					minlength: "Ingresa un número de 10 dígitos.",
					maxlength: "Ingresa un número de 10 dígitos."
				},
				chip :{
					exactlength: "Ingresa los 19 dígitos del chip.",
					minlength: "Ingresa los 19 dígitos del chip.",
					required : "Ingresa los 19 dígitos del chip.",
					digits: "Ingresa los 19 dígitos del chip."
				}
			   },
				errorPlacement: function(error, element) {
					var $parent = element.parent().parent().parent();

					if(element[0].name=='numero' || element[0].name=='chip'){
				   		$('<div class="error-aux col-sm-7 col-xs-9 col-xs-offset-3 col-sm-offset-5"></div>').insertAfter( $parent );
				   		$parent.next('.error-aux').append(error);
					}
				},
		        submitHandler: function(form) {
					if(!formElementsModales['cambio']['sending']){
						sendFormData(form);
			  		}
				}
		});	

		checkGeneralValidForm($mainForm);

		function sendFormData(form){
			formElementsModales['cambio']['sending'] = true;
			$(form).find('button[type="submit"]').prop('disabled', true);

			var self = $(form).serialize();

			var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
			
			/**Quitar una vez en producción**/
			var sendTo = urlPOST;

			urlPOST = checkDevelopmentPostHTML(urlPOST);

			$.post(  urlPOST , self )
			.done(function( data ) {
			  	Services.home.cambioFormCallSuccess(data, form );
				formElementsModales['cambio']['sending'] = false;

			 })
			.fail(function( jqxhr, textStatus, error ) {
			  	//Mensaje de error del sistema
			  	Services.home.cambioFormCallFail(error, form);
			  	formElementsModales['cambio']['sending'] = false;
			});
		}
	}

	function validateSuspensionForm(){
		var $mainForm = $('#'+formElementsModales['suspension']['id']);
		disableSumbitButton($mainForm, true);
		formElementsModales['suspension']['validator'] = 
			$mainForm.validate({
			  rules: {
			  	motivoAutogestion : {
			  		required : true
			  	},
				checkboxAutogestion : {
					required : true
				},
				numero : {
					digits: true,
					minlength: 10,
					maxlength: 10,
					required : true
				}
			  },
			  messages: {
			  	numero: {
					required: "Ingresa un número de contacto.",
					digits: "Ingresa un número válido.",
					minlength: "Ingresa un número de 10 dígitos.",
					maxlength: "Ingresa un número de 10 dígitos."
				}
			   },
				errorPlacement: function(error, element) {
					var $parent = element.parent().parent().parent();
					if(element[0].name=='numero'){				   		
				   		$('<div class="error-aux col-sm-7 col-xs-9 col-xs-offset-3 col-sm-offset-5"></div>').insertAfter( $parent );
				   		$parent.next('.error-aux').append(error);
					}
				},
		        submitHandler: function(form) {
					if(!formElementsModales['suspension']['sending']){
						sendFormData(form);
			  		}
				}
		});	

		checkGeneralValidForm($mainForm);

		function sendFormData(form){
			formElementsModales['suspension']['sending'] = true;
			$(form).find('button[type="submit"]').prop('disabled', true);

			var self = $(form).serialize();

			var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
			
			/**Quitar una vez en producción**/
			var sendTo = urlPOST;

			urlPOST = checkDevelopmentPostHTML(urlPOST);

			$.post(  urlPOST , self )
			.done(function( data ) {
			  	Services.home.suspensionFormCallSuccess(data, form );
				formElementsModales['suspension']['sending'] = false;

			 })
			.fail(function( jqxhr, textStatus, error ) {
			  	//Mensaje de error del sistema
			  	Services.home.suspensionFormCallFail(error, form);
			  	formElementsModales['suspension']['sending'] = false;
			});
		}
	}

	function initHome(){
		loadFacturas();
		initActions();
		if($('#modal-descargar').length>0)
			initModalDescargarFacturas();

		initTabs();
		initFormValidations();
	}

	function loadFacturas(){
		var $facturas = $facturasBlock.find('.general-table-container');
		$facturas.find('.general-table').hide();
		generalLoadingIcon($facturasBlock, true);

		setTimeout(function(){
			var hash = window.location.hash;

			if(hash=="#error-solicitud"){
				setErrorFacturas();
			}
			else{
				generalLoadingIcon($facturasBlock, false);
				$facturas.find('.general-table').show();			
			}
		}, 2000);

		setActionsErrorFacturas();
	}

	function setErrorFacturas(){
		var error = '<div class="col-sm-12 api-msg api-msg-error"> <div class="notif-bloq"> <div class="row"> <div class="col-xs-12 col-sm-12 inner-nb"> <span class="icon io-Alert2"></span> <h2 class="h4">Información no disponible por el momento.</h2> <p class="p-only"><button class="btn-like-a btn-reintentar">Reintentar</button></p></div> </div> </div> </div>';

		$facturasBlock.find('.api-msg-error').remove();
		generalLoadingIcon($facturasBlock, false);
		$facturasBlock.html(error);
	}

	function setActionsErrorFacturas(){
		$facturasBlock.on('click', '.btn-reintentar', function(){
			var $button = $(this),
			$container = $facturasBlock;
			generalLoadingIcon($facturasBlock, true);
			setTimeout(function(){
				setErrorFacturas();
			}, 3000);
			
			$container.find('.api-msg-error').remove();
			
		});
	}

	function initTabs(){
		//setDefault();
		initActions();
		function initActions(){
			$tabsSelector.click(function(e){
				e.preventDefault();
				var $selected = $(this);
				var selector = (typeof $selected.data('tab') != undefined ? $selected.data('tab') : null),
				$selector = (selector !=null ? $(selector) : null );

				if($selector.length>0)
					tabShow($selector , $selected);
			});
		}

		function tabShow($element, $selected){
			resetForms();
			$tabsSelector.removeClass('active');
			$tabs.removeClass('active');
			$element.addClass('active');
			$selected.addClass('active');
		}
	}

	function initActions(){
		$('.facturas-block').on('click', '.btn-descargar', function(e){
			e.preventDefault();
			var $element = $(this);
			setBasicInfoModal($element.data('item'));
			modalDescargarFacturas.openModal();
		});

		$('#btn-facturas-pendientes').click(function(e){
			e.preventDefault();
			getFacturasPendientes('#facturas-pendientes-block');
		});

		$('.btn-trigger-action').click(function(e){
			e.preventDefault();
			var $button = $(this),
			btn = (typeof $button.data('btn') != undefined ? $button.data('btn') : null );

			if(btn!=null){
				$(btn).trigger('click');
			}
			
		});
		
	}

	var sending = false;

	function getFacturasPendientes(form){
		sending = true;
		generalLoadingIcon(form, true);
		var urlPOST = Services.apiURL.getFacturasPendientesHome();
	
		$.post(  urlPOST , {} )
		.done(function( data ) {
			
			generalLoadingIcon(form, false);
			Services.home.getFacturasPendientes(data, form);
			sending = false;
		 })
		.fail(function( jqxhr, textStatus, error ) {
		  	//Mensaje de error del sistema
		  	Services.home.getFacturasPendientesFail(form, error);
		  	sending = false;
		  	generalLoadingIcon(form, false);
		});
	}

	function setBasicInfoModal(item){
		currentModalData = item;
		$('.modal-mte .alias-text, .modal-mte .txt-grupo').html(item.texto);
	}

	/**Inicio modal descargar facturas**/
	function initModalDescargarFacturas(){
		var $titleP = $('#modal-descargar .heading-mod .title-mod p.h2'),
		titleBefore = ( typeof $titleP.data('before') != 'undefined' ? $titleP.data('before') : null ),
		titleAfter = ( typeof $titleP.data('after') != 'undefined' ? $titleP.data('after') : null ),
		emailDefault = '',
		$input = $('#modal-descargar').find('input[name="email"]');

		validateForm();

		modalDescargarFacturas = new modalesTelcel($('#modal-descargar'),{
			onInit : function(){
				$('#descargar-facturas-confirmacion').hide();
				emailDefault = $input.val();
			},
			onReset : function(){
				removeGeneralError();
				$('#form-confirmar-descargar-facturas').show();
			  	$('#descargar-facturas-confirmacion').hide();
			  	resetMainForm();
			},
			onOpen : function(){
				if(titleBefore!=null)
					$titleP.html(titleBefore);
				$('#descargar-facturas-confirmacion').hide();

				var $form = $('#form-confirmar-descargar-facturas');
				disableSumbitButton($form, false);
			}
		});

		function validateForm(){
			var $form = $('#form-confirmar-descargar-facturas');

			disableSumbitButton($form, true);

			formElementsModales['descargarFacturas']['validator'] = $form.validate({
				rules: {
					email: {
					  required: false,
					  email: true
					}
				},
				messages: {
				 email: {
				   required: "Ingresa un correo electrónico.",
				   email: "Ingresa un correo electrónico válido."
				 }
				},
				errorClass : "error-dd error",
				submitHandler: function(form) {
					if(!formElementsModales['descargarFacturas']['sending']){

						formElementsModales['descargarFacturas']['sending'] = true;

						$(form).find('button[type="submit"]').prop('disabled', true);
						
						var self = $(form).serialize();

						generalLoadingIcon(form, true);


						var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;

						$.post( urlPOST , { data: self, data: currentModalData })
						  .done(function( json ) {
						  	Services.facturacion.descargarFacturasSuccessCallback(json, form, { element : $titleP, text : titleAfter });
						  	formElementsModales['descargarFacturas']['sending'] = false;
						  	generalLoadingIcon(form, false);

						  })
						  .fail(function( jqxhr, textStatus, error ) {
						  	Services.facturacion.descargarFacturasFailCallback(error, form);
						  	formElementsModales['descargarFacturas']['sending'] = false;
						  	generalLoadingIcon(form, false);
						});

					}

				}
			});
			
			checkGeneralValidForm($form);
		}

		function removeGeneralError(){
			$('#modal-descargar .system-error-msg').remove();
			$('#modal-descargar .has-system-error').removeClass('has-system-error');
		}

		$('#modal-descargar').on('click', '#btn-r-descargar-facturas', function(){
			removeGeneralError();
			$('#form-confirmar-descargar-facturas').submit();
		});

		function resetMainForm(){
			$input.removeClass('error error-dd');
			$input.val(emailDefault);

			if(formElementsModales['descargarFacturas']['validator']){
				formElementsModales['descargarFacturas']['validator'].resetForm();
			}		
		}
	}
	/**Fin modal descargar facturas**/

	function init(){
		var $home = $('.home-block');
		if($home.length>0)
			initHome();
	}

	return{
		inicializar : init,
		facturasSwiperMobile : function($element){
			setBasicInfoModal($element.data('item'));
			modalDescargarFacturas.openModal();
		}
	}
})();