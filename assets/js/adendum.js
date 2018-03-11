var adendum = (function(){

	var elementsForm = {
		id : null,
		validator : null,
		sending: false
	};

	var formElementsModales = {  
		'descargarFacturas': {id: null, validator: null, sending: false } 
	};

	var _modalDescargarFacturas = {
		data : [],
		allChecked : false
	};

	var modalDescargarFacturas = null;	
	var $listaAdendum = $('#listado-adendum'),
	$singleForm = $('#adendum-form-single'),
	$masivoForm = $('#adendum-form'),
	$allForm = $('#form-all-adendum');

	function init(){
		if($listaAdendum.length>0)
			generarListadoConfirmacionInicial();

		if($singleForm.length>0)
			initSingleForm();

		if($masivoForm.length>0)
			initMasivoForm();

		if($allForm.length>0)
			initAllForm();

		if($('#modal-descargar').length>0)
			initModalDescargarFacturas();

		setActionsGenerales();

	}

	function setActionsGenerales(){
		$('body').on('click', '.btn-general-solicitud-descarga', function(){
			//Aquí hay que tener en la variable el post de las facturas que se quieren
			_modalDescargarFacturas = {data: []};
			if(modalDescargarFacturas!=null)
				modalDescargarFacturas.openModal();
		});
	}

	function initModalDescargarFacturas(){
		var $titleP = $('#modal-descargar .heading-mod .title-mod p'),
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
					
					// handleErrorTooltip(false);
					if(!formElementsModales['descargarFacturas']['sending']){

						formElementsModales['descargarFacturas']['sending'] = true;

						$(form).find('button[type="submit"]').prop('disabled', true);
						
						var self = $(form).serialize();

						generalLoadingIcon(form, true);

						var data = { success: true, data: [] };


						$.post( postURL , { data: self, data: _modalDescargarFacturas })
						  .done(function( json ) {
						  	Services.adendum.descargarFacturasSuccessCallback(json, form, { element : $titleP, text : titleAfter } );
						  	formElementsModales['descargarFacturas']['sending'] = false;
						  	generalLoadingIcon(form, false);

						  })
						  .fail(function( jqxhr, textStatus, error ) {
						  	Services.adendum.descargarFacturasFailCallback(form, error);
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

	//FORMULARIO ADENDUM ALL
	function initAllForm(){

		initActions();
		validateMainForm();

		function validateMainForm(){

			disableSumbitButton($allForm, true);


			$allForm.submit(function(e){
				e.preventDefault();
				if(!elementsForm['sending']){
					sendFormData();
		  		}
			});

			function sendFormData(){
				var form = '#form-all-adendum';
				elementsForm['sending'] = true;
				$allForm.find('button[type="submit"]').prop('disabled', true);

				var self = $allForm.serialize();

				var urlPOST = ( $allForm.prop('action') == '' ? postURL : $allForm.prop('action') ) ;

				/**Quitar una vez en producción y aqui solo checamos si es una línea en development para mandar a otra liga**/
				var sendTo = urlPOST;

				urlPOST = checkDevelopmentPostHTML(urlPOST);

				$.post(  urlPOST , self )
				.done(function( data ) {
				  	Services.adendum.allCallSuccess(data, form, sendTo);
					elementsForm['sending'] = false;
				 })
				.fail(function( jqxhr, textStatus, error ) {
				  	//Mensaje de error del sistema
				  	Services.adendum.allCallFail(error, form);
				  	elementsForm['sending'] = false;
				});
			}	
		}

		function initActions(){
			$('.reset-form-all-adendum').click(function(){
				resetMainForm();
			});
		}

		function resetMainForm(){
			$allForm.find('button[type="submit"]').prop('disabled', false);
		}

	}	
	//FIN FORMULARIO ADENDUM ALL

	//FORMULARIO ADENDUM MASIVO
	function initMasivoForm(){

		var tipoIngreso = null;

		initActions();
		validateMainForm();

		function validateMainForm(){

			disableSumbitButton($masivoForm, true);

			elementsForm['validator'] = 
				$masivoForm.validate({
					  rules: {
						archivo: {
							extension: "xls",
							filesize: 10000000
						}
					  },
					  messages: {
						 archivo: {
						   required: "Ingresa un archivo de 10 MB máximo.",
						   extension: "Ingresa un archivo con extensión: .xls",
						   filesize: "Ingresa un archivo de 10 MB máximo."
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
					  	Services.adendum.masivoAdendumCallSuccess(data, form, sendTo, showInvalidErrorArchivo );
						elementsForm['sending'] = false;
					 })
					.fail(function( jqxhr, textStatus, error ) {
					  	//Mensaje de error del sistema
					  	Services.adendum.masivoAdendumCallFail(error, form);
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

			if(dataLineas.length>0 && $masivoForm.valid())
				lineasValid = true;

	    	$('#lineas-hidden-input').val(JSON.stringify(dataLineas));


			if(lineasValid)
				return true;

			return false;
		}


		//Simular error de que es invalido el archivo
		function showInvalidErrorArchivo(){
			var msg = 'Este archivo está dañado o es ilegible, intenta con un nuevo archivo.';

			$('#archivo-invalido').remove();
			$('.lineas-archivo .extra-info').hide();
			$('.lineas-archivo .add-lines-ge-mod' ).append('<div class="error-dd error" id="archivo-invalido">'+msg+'</div>');
			$('#archivo').parent().addClass('error');

			$masivoForm.find('button[type="submit"]').prop('disabled', true);
		}

		function initActions(){

			/**
				Cuando se esconda el step 2
			**/

			var fullReset = false;

			$('#componente-ingresar-lineas .btn-al').on('click', function(event) {
				fullReset = true;
				resetMainForm();
			});

			$('#autogestion-paso-2').on('hide', function(event) {
				var target = $(event.target).attr('id');
				if(target==='autogestion-paso-2' && fullReset)
			      resetMainForm();

			  	$masivoForm.find('button[type="submit"]').prop('disabled', true);

			  	fullReset = false;
			});

			$('#autogestion-paso-2').on('show', function(event) {
				var target = $(event.target).attr('id');

				if(target==='autogestion-paso-2')	
					$masivoForm.find('button[type="submit"]').prop('disabled', !validateFormData());
			});

			$('.reset-adendum-form').click(function(){
				$('#autogestion-paso-2').hide();
				if(typeof ingresarLineasComponent != 'undefined')
					ingresarLineasComponent.reset();

			});

			
		}

		function resetMainForm(){

			$masivoForm.find("input[type=text], input[type=email], input[type=password], select").val("");
			$masivoForm.find('button[type="submit"]').prop('disabled', true);
			
			if(elementsForm['validator']){
				elementsForm['validator'].resetForm();
			}
		}

	}	
	//FIN FORMULARIO ADENDUM MASIVO

	function initSingleForm(){
		$singleForm.submit(function(e){
			e.preventDefault();
			if(!elementsForm['sending'])
				sendFormData();
		});

		function sendFormData(){
			var form = '#adendum-form-single';
			elementsForm['sending'] = true;
			$singleForm.find('button[type="submit"]').prop('disabled', true);
			var self = $singleForm.serialize();
			var urlPOST = ( $singleForm.prop('action') == '' ? postURL : $singleForm.prop('action') ) ;

			/**Quitar una vez en producción**/
			var sendTo = urlPOST;

			urlPOST = checkDevelopmentPostHTML(urlPOST);

			$.post(  urlPOST , self )
			.done(function( data ) {
			  	Services.adendum.singleAdendumCallSuccess(data, form, sendTo );
				elementsForm['sending'] = false;
				$singleForm.find('button[type="submit"]').prop('disabled', false);

			 })
			.fail(function( jqxhr, textStatus, error ) {
			  	//Mensaje de error del sistema
			  	Services.adendum.singleAdendumCallFail(error, form);
			  	elementsForm['sending'] = false;
			  	$singleForm.find('button[type="submit"]').prop('disabled', false);
			});
		}
	}

	function generarListadoConfirmacionInicial(){

		var $elements = $listaAdendum.find('.linea-batch');
		var total = $elements.length;

		$elements.each(function (index, value) { 
		  var meta = ( typeof $(this).data('meta') != 'undefined' ? $(this).data('meta') : null );
		  var $element = $(this);

			if(meta != null){
				var elemento = generarHTMLAdendum(meta, index);
				$element.html(elemento);
				// bindElementActions();

			}
		});
	}

	function generarHTMLAdendum(meta, index){
		var html = '';

		html = '<div class="col-sm-pr-100 col-xs-12 content-item-block" data-index="'+index+'"> <div class="col-xs-12 col-sm-pr-10"><p class="label">Región:</p> <p class="p-value" title="'+meta.region+'">'+meta.region+'</p></div><div class="col-xs-12 col-sm-pr-15"><p class="label">Cuenta:</p> <p class="p-value" title="'+meta.cuenta+'">'+meta.cuenta+'</p></div><div class="col-xs-12 col-sm-pr-15"><p class="label">Número:</p> <p class="p-value" title="'+meta.numero+'">'+meta.numero+'</p></div><div class="col-xs-12 col-sm-pr-15 flexbox imei-extra-detail"><p class="label">Equipo:</p> <div class="show-more-details-container col-xs-6 col-sm-12"><p class="p-value" title="'+meta.equipo+'">'+meta.equipo+'</p><div class="icon io-info show-more-details"> <div class="triangle-tooltip"> <div class="col-sm-12"> <div class="col-xs-12 col-sm-12 extra-mob-dt-ls flexbox"> <p class="txt-300" title="'+meta.imei+'">IMEI: <span class="txt-100">'+meta.imei+'</span></p> </div> </div> </div> </div></div></div><div class="col-xs-12 col-sm-pr-15"><p class="label">Plan:</p> <p class="p-value" title="'+meta.plan+'">'+meta.plan+'</p></div><div class="col-xs-12 col-sm-pr-15"><p class="label">Plazo:</p> <p class="p-value" title="'+meta.plazo+'">'+meta.plazo+'</p></div><div class="col-xs-12 col-sm-pr-15 flexbox imei-extra-detail"><p class="label">Fecha de término:</p> <div class="show-more-details-container col-xs-6 col-sm-12"><p class="p-value" title="'+meta.termino+'">'+meta.termino+'</p></div></div></div>'; 


		return html;

	}


	return{
		inicializar: init
	}
})();