var sertec = (function(){

	var elementsForm = {
		id : null,
		validator : null,
		sending: false
	};

	var formElementsModales = {  
		'descargarFacturas': {id: null, validator: null, sending: false } 
	};

	var modalDescargarFacturas = null;	

	var _modalDescargarFacturas = {
		data : [],
		allChecked : false
	};

	var $listaSertec = $('#listado-sertec'),
	$allForm = $('#form-all-imei'),
	$specificForm = $('#form-specific-imei'),
	$singleForm = $('#sertec-form-single'),
	$tableOrder = $('#extra-detail-sertec #movimientos-table');

	function init(){
		if($listaSertec.length>0)
			generarListadoConfirmacionInicial();

		if($allForm.length>0)
			initAllForm();

		if($specificForm.length>0)
			initMasivoForm();

		if($singleForm.length>0)
			initFormularioSingle();

		if($tableOrder.length>0)
			initOrdenamientoDetalle();

		if($('.sertec-block #modal-descargar').length>0)
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

		$('body').on('click', '#btn-show-extra-detail', function(){
			var $info = $('#info-content');
			$info.toggleClass('show-details');

			if($info.hasClass('show-details'))
				scrollToElement($('#extra-detail-sertec'));
				
		});
	}

	var ordenado = [];


	function initOrdenamientoDetalle(){

		getData();

		$tableOrder.find('.order-by-block button').click(function(e){
			e.stopPropagation();
			var opciones = ( typeof $(this).data('opc') != 'undefined' ? $(this).data('opc') : null );
			orderElements(opciones);
		});

		function getData(){
			$tableOrder.find('.data-detalle').each(function (index, value) { 
				var data = ( typeof $(this).data('detalle') != 'undefined' ? $(this).data('detalle') : null );
				ordenado.push(data);
			});
		}

		function orderElements(opciones){
			var sorted = [];

			if(opciones!=null)
				sorted = sortByAZ(ordenado, opciones.key);

			if(opciones.orderby == 'desc')
				sorted.reverse();

			ordenado = sorted;
			
			generarListado();
		}

		function generarListado(){
			var $mainContent = $tableOrder.find('.table-main-block');
			$mainContent.html('');

			$.each( ordenado, function( key , meta ) {
				var html = '<div class="col-sm-pr-100 col-xs-12 center-block flexbox h-align-center v-align-center data-detalle"> <div class="col-sm-pr-30 flexbox h-align-center"> <p title="'+meta.fecha+'">'+meta.fecha+'</p> </div> <div class="col-sm-pr-30 flexbox h-align-center estatus-container"> <div class="circle-container"><span class="circle"></span></div> <p class="name">Estatus:</p> <p title="'+meta.estatus+'">'+meta.estatus+'</p> </div> <div class="col-sm-pr-40 col-xs-4 flexbox h-align-center border-right-none comment-container"> <div class="circle-container"><span class="circle"></span></div> <p class="name">Comentario:</p> <p title="'+meta.comentario+'">'+meta.comentario+'</p> </div> </div>';

				$mainContent.append(html);

			});
		}
	}

	//Modal para descargar
	function initModalDescargarFacturas(){
		var $titleP = $('#modal-descargar .heading-mod .title-mod p'),
		titleBefore = ( typeof $titleP.data('before') != 'undefined' ? $titleP.data('before') : 'Solicitud de descarga' ),
		titleAfter = ( typeof $titleP.data('after') != 'undefined' ? $titleP.data('after') : titleBefore ),
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
						  	Services.sertec.descargarFacturasSuccessCallback(json, form, { element : $titleP, text : titleAfter } );
						  	formElementsModales['descargarFacturas']['sending'] = false;
						  	generalLoadingIcon(form, false);

						  })
						  .fail(function( jqxhr, textStatus, error ) {
						  	Services.sertec.descargarFacturasFailCallback(form, error);
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
	//Fin Modal para descargar

	/**sertec single**/
	function initFormularioSingle(){
		validateMainForm();

		function validateMainForm(){

			disableSumbitButton($singleForm, true);

			elementsForm['validator'] = 
				$singleForm.validate({
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

			checkGeneralValidForm($singleForm);

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
				  	Services.sertec.singleCallSuccess(data, form, sendTo );
					elementsForm['sending'] = false;

				 })
				.fail(function( jqxhr, textStatus, error ) {
				  	//Mensaje de error del sistema
				  	Services.sertec.singleCallFail(error, form);
				  	elementsForm['sending'] = false;
				});
			}
		}
	}
	/**fin sertec single**/

	//FORMULARIO SERTEC SPECIFIC
	function initMasivoForm(){

		var tipoIngreso = null;

		initActions();
		validateMainForm();

		function validateMainForm(){

			disableSumbitButton($specificForm, true);

			elementsForm['validator'] = 
				$specificForm.validate({
					  rules: {
						archivo: {
							extension: "xls",
							filesize: 10000000
						},
						checkboxAutogestion : {
							required : true
						}
					  },
					  messages: {
						archivo: {
						   required: "Ingresa un archivo de 10 MB máximo.",
						   extension: "Ingresa un archivo con extensión: .xls",
						   filesize: "Ingresa un archivo de 10 MB máximo."
						},
						checkboxAutogestion : {
							required : "Acepta los términos y condiciones para continuar"
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
					  	Services.sertec.specificIMEICallSuccess(data, form, sendTo, showInvalidErrorArchivo );
						elementsForm['sending'] = false;
					 })
					.fail(function( jqxhr, textStatus, error ) {
					  	//Mensaje de error del sistema
					  	Services.sertec.specificIMEICallFail(error, form);
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

			if(dataLineas.length>0 && $specificForm.valid())
				lineasValid = true;

	    	$('#lineas-hidden-input').val(JSON.stringify(dataLineas));

			if(lineasValid && $('#checkbox-autogestion-terminos-all').is(':checked'))
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
				resetMainForm();
			});

			$('#autogestion-paso-2').on('hide', function(event) {
				var target = $(event.target).attr('id');
				if(target==='autogestion-paso-2' && fullReset)
			      resetMainForm();

			  	$specificForm.find('button[type="submit"]').prop('disabled', true);

			  	fullReset = false;
			});

			$('#autogestion-paso-2').on('show', function(event) {
				var target = $(event.target).attr('id');

				if(target==='autogestion-paso-2')	
					$specificForm.find('button[type="submit"]').prop('disabled', !validateFormData());
			});

			/**
				Setea la info del Motivo
			**/
			$('#checkbox-autogestion-terminos-all').change(function() {
				$specificForm.find('button[type="submit"]').prop('disabled', !validateFormData());
			});

			$('.reset-form-specific-imei').click(function(){
				$('#autogestion-paso-2').hide();
				if(typeof ingresarLineasComponent != 'undefined')
					ingresarLineasComponent.reset();

			});

			
		}

		function resetMainForm(){
			$specificForm.find("input[type=checkbox], input[type=radio]").prop("checked", false);
			$specificForm.find('button[type="submit"]').prop('disabled', true);
			
			if(elementsForm['validator']){
				elementsForm['validator'].resetForm();
			}
		}

	}	
	//FIN FORMULARIO SERTEC SPECIFIC

	//Simular error de que es invalido el archivo
	function showInvalidErrorArchivo(){
		var msg = 'Este archivo está dañado o es ilegible, intenta con un nuevo archivo.';

		$('#archivo-invalido').remove();
		$('.lineas-archivo .extra-info').hide();
		$('.lineas-archivo .add-lines-ge-mod' ).append('<div class="error-dd error" id="archivo-invalido">'+msg+'</div>');
		$('#archivo').parent().addClass('error');

		$specificForm.find('button[type="submit"]').prop('disabled', true);
	}

	//FORMULARIO SERTEC ALL
	function initAllForm(){

		//initActions();
		validateMainForm();

		function validateMainForm(){

			//disableSumbitButton($allForm, true);

			$allForm.submit(function(e){
				e.preventDefault();
				if(!elementsForm['sending']){
					sendFormData();
		  		}
			});


			function sendFormData(){
				var form = '#form-all-imei';
				elementsForm['sending'] = true;
				$(form).find('button[type="submit"]').prop('disabled', true);

				var self = $(form).serialize();

				var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;

				/**Quitar una vez en producción y aqui solo checamos si es una línea en development para mandar a otra liga**/
				var sendTo = urlPOST;

				urlPOST = checkDevelopmentPostHTML(urlPOST);

				$.post(  urlPOST , self )
				.done(function( data ) {
				  	Services.sertec.allIMEICallSuccess(data, form, sendTo);
					elementsForm['sending'] = false;
				 })
				.fail(function( jqxhr, textStatus, error ) {
				  	//Mensaje de error del sistema
				  	Services.sertec.allIMEICallFail(error, form);
				  	elementsForm['sending'] = false;
				});
			}	
		}

		checkGeneralValidForm($allForm);

		function initActions(){
			$('.reset-form-all-imei').click(function(){
				resetMainForm();
			});
		}

		function resetMainForm(){
			$allForm.find("input[type=checkbox], input[type=radio]").prop("checked", false);
			$allForm.find('button[type="submit"]').prop('disabled', true);
			
			if(elementsForm['validator']){
				elementsForm['validator'].resetForm();
			}
		}

	}	
	//FIN FORMULARIO SERTEC ALL

	function generarListadoConfirmacionInicial(){

		var $elements = $listaSertec.find('.linea-batch');
		var total = $elements.length;

		$elements.each(function (index, value) { 
		  var meta = ( typeof $(this).data('meta') != 'undefined' ? $(this).data('meta') : null );
		  var $element = $(this);

			if(meta != null){
				var elemento = generarHTMLSertec(meta, index);
				$element.html(elemento);
				// bindElementActions();

			}
		});
	}

	function generarHTMLSertec(meta, index){
		var html = '';

		html = '<div class="col-sm-pr-100 col-xs-12 content-item-block" data-index="'+index+'"> <div class="col-xs-12 col-sm-pr-10"><p class="label">Región:</p> <p class="p-value" title="'+meta.region+'">'+meta.region+'</p></div><div class="col-xs-12 col-sm-pr-15"><p class="label">Cuenta:</p> <p class="p-value" title="'+meta.cuenta+'">'+meta.cuenta+'</p></div><div class="col-xs-12 col-sm-pr-15"><p class="label">Número:</p> <p class="p-value" title="'+meta.numero+'">'+meta.numero+'</p></div><div class="col-xs-12 col-sm-pr-20 flexbox"><p class="label">IMEI:</p><p class="p-value" title="'+meta.imei+'">'+meta.imei+'</p></div><div class="col-xs-12 col-sm-pr-15"><p class="label">Plan:</p> <p class="p-value" title="'+meta.estatus+'">'+meta.estatus+'</p></div><div class="col-xs-12 col-sm-pr-15"><p class="label">Plazo:</p> <p class="p-value" title="'+meta.folio+'">'+meta.folio+'</p></div><div class="col-xs-12 col-sm-pr-10 flexbox ver-detalle-block"><a class="simple" href="sertec-detalle.html" title="Ver detalle"> <span class="icon i-angle-right"></span> </a></div></div>'; 


		return html;

	}


	return{
		inicializar: init
	}
})();