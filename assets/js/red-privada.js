var redPrivada = (function(){
	var $listaPrincipal = $('.listado-principal'),
	$formDirectorio = $('#form-directorio'),
	$formGeneral_v2 = $('#form-general-v2'),
	$formDesvio = $('#form-desvio'),
	$formMarcacion = $('#form-marcacion'),
	$tableServicios = $('.red-privada-block .table-servicios');

	var redSection = null,
	getListadoSection = null;

	function getUsuariosSection(){
		return ($('#listado-directorio').length>0 ? 'directorio' : ($('#listado-desvio-llamadas').length>0 ? 'desvio' : ($('#listado-abono-saldo').length>0 ? 'abono' :'marcacion') ) );
	}

	redSection = getUsuariosSection();

	var generarHTMLListado = {
		directorio : generarHTMLDirectorio,
		marcacion : generarHTMLMarcacion,
		desvio : generarHTMLDesvio,
		abono : generarHTMLAbono
	};

	getListadoSection = typeof generarHTMLListado[redSection] != 'undefined' ? generarHTMLListado[redSection] : null ;


	function init(){

		if($listaPrincipal.length>0)
			generarListadoConfirmacionInicial();

		if($formDirectorio.length>0)
			initFormValidationDirectorio();

		if($formGeneral_v2.length>0)
			initFormValidationDirectorio_v2();

		if($formMarcacion.length>0)
			initFormValidationMarcacion();

		if($formDesvio.length>0)
			initFormValidationDesvio();

		if($tableServicios.length>0)
			initSwitches();

		modalesRedPrivada.inicializar();

		initActions();
	}

	function initActions(){
		$('#listado-abono-saldo').on('click', '.linea-batch .btn-ver-detalle', function(){
			var $button = $(this),
			$container = $button.closest('.linea-batch'),
			toOpen = false;

			if(!$container.hasClass('open-element'))
				toOpen = true;

			var $abiertos = $('.linea-batch.open-element');
			$abiertos.removeClass('open-element');

			if(toOpen)
				$container.addClass('open-element');
		});
	}

	function initSwitches(){
		var $btn = $('#btn-continuar'),
		elementsForm = {id : null, validator : null, sending: false };

		initSwitchesActions();

		function initSwitchesActions(){
			$('.table-servicios .switch-input').on('change', function(){
				var $switch = $(this),
				$container = $switch.closest('.switch-container'),
				$lock = $container.find('.io-lock-closed'),
				$unlocked = $container.find('.io-lock-open');

				if($switch.is(':checked')){
					$lock.addClass('disabled');
					$unlocked.removeClass('disabled').addClass('unlocked');
				}
				else{
					$unlocked.addClass('disabled');
					$lock.removeClass('disabled').addClass('locked');
				}

				var valid = $('.table-servicios .switch-input:checked').length > 0;
				$btn.prop('disabled', !valid);


			});

			$('#control-servicios-form').submit(function(e){
				e.preventDefault();

				if(!elementsForm['sending']){
					sendFormData();
		  		}
			});
		}

		function sendFormData(){
			var form = '#control-servicios-form';
			elementsForm['sending'] = true;
			$(form).find('button[type="submit"]').prop('disabled', true);

			var self = $(form).serialize();

			var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
			
			/**Quitar una vez en producción**/
			var sendTo = urlPOST;

			urlPOST = checkDevelopmentPostHTML(urlPOST);

			$.post(  urlPOST , self )
			.done(function( data ) {
			  	Services.redPrivada.controlCostosServiciosSuccessCallback(data, form, sendTo );
				elementsForm['sending'] = false;

			 })
			.fail(function( jqxhr, textStatus, error ) {
			  	//Mensaje de error del sistema
			  	Services.redPrivada.controlCostosServiciosFailCallback(error, form);
			  	elementsForm['sending'] = false;
			});
		}

	}

	//FORMULARIO DIRECTORIO V2
	function initFormValidationDirectorio_v2(){

		var tipoIngreso = null,
		elementsForm = {id : null, validator : null, sending: false };

		initActions();
		validateMainForm();
		onResize();
		setResize();


		function setResize(){
			var size = null,
			initialSize = $( window ).width();

			$( window ).resize(function() {
				size = $( window ).width();
				onResize()
			});
		}

		function onResize(){
			if(is_mobile()){
				$('#motivo-autogestion1').prop('checked', true);
				$('.motivo-autogestion').trigger('change');	
			}
		}

		function validateMainForm(){

			disableSumbitButton($formGeneral_v2, true);

			elementsForm['validator'] = 
				$formGeneral_v2.validate({
					  rules: {
						archivo: {
							extension: "xls",
							filesize: 10000000
						},
						motivoAutogestion: {
							required: true
						}
					  },
					  messages: {
						 archivo: {
						   extension: "Ingresa un archivo con extensión: .xls",
						   filesize: "Ingresa un archivo de 10 MB máximo."
						 },
						 motivoAutogestion: {
						   required: "Selecciona un motivo.",
						 }
					   },
						errorClass : "error-dd error",
						errorElement : 'div',
						errorPlacement: function(error, element) {
							var elementInput = element[0];
							if(element[0]['id']==='archivo'){
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
				        highlight : function(element, errorClass){
				        	var $element = $(element);
				        	if($element.attr('id')==='archivo' && $element.val() == ''){
				        		$('.lineas-archivo .extra-info').hide();
								$element.parent().addClass('error');
				        	}
				        },
				        submitHandler: function(form) {
							if(!elementsForm['sending']){
								sendFormData(form);
					  		}
						}
				});

				checkGeneralValidForm($formGeneral_v2);

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
					  	Services.redPrivada.cargaDirectorioGeneralCallSuccess(data, form, sendTo, showInvalidErrorArchivo );
						elementsForm['sending'] = false;
					 })
					.fail(function( jqxhr, textStatus, error ) {
					  	//Mensaje de error del sistema
					  	Services.redPrivada.cargaDirectorioGeneralCallFail(error, form);
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

			if(dataLineas.length>0)
				lineasValid = true;

	    	$('#lineas-hidden-input').val(JSON.stringify(dataLineas));

			if($('.motivo-autogestion').is(':checked') && lineasValid)
				return true;

			return false;
		}


		function initActions(){


			/**
				Cuando se esconda el step 2
			**/
			var fullReset = false;

			// $('#autogestion-paso-2').on('show', function(event) {
			// 	var target = $(event.target).attr('id');
			// 	if(target==='autogestion-paso-2')
			// 		$('#autogestion-btn').prop('disabled', !validateFormData());
			// });

			var $lastStep = $('.carga-masiva-last-step');

			/**
				Setea la info del Motivo
			**/
			$('.motivo-autogestion').change(function() {
				var $checkbox = $(this);

				if(typeof ingresarLineasComponent != 'undefined')
					ingresarLineasComponent.reset();

				if($('.motivo-autogestion:checked').length>0){
					var current = $checkbox.val(),
					btntext = (typeof $checkbox.data('btn') != 'undefined' ? $checkbox.data('btn') : 'Subir archivo');

					if(current=='cargar-directorio'){
						$lastStep.addClass('only-upload-file');
						$('.btn-lineas-archivo').trigger('click');
					}
					else
						$lastStep.removeClass('only-upload-file');

					$('#autogestion-btn').html(btntext);
					$lastStep.addClass('active');
				}
				else
					$lastStep.removeClass('active');
			});

			/**
				Setea la info del Motivo
			**/
			
			// $('.motivo-autogestion').change(function() {
			// 	var $checkbox = $(this);
				

			// 	/**Quitar una vez en producción solo es para propositos de development y simular**/
			// 	updateFormPostURL($checkbox.val());

			// 	if($('.motivo-autogestion:checked').length>0){
			// 		var current = $checkbox.val(),
			// 		btntext = (typeof $checkbox.data('btn') != 'undefined' ? $checkbox.data('btn') : 'Subir archivo');

			// 		if(current=='cargar-directorio'){
			// 			$lastStep.addClass('only-upload-file');
			// 			$('.btn-lineas-archivo').trigger('click');
			// 		}
			// 		else
			// 			$lastStep.removeClass('only-upload-file');

			// 		$('#autogestion-btn').html(btntext);
			// 		$lastStep.addClass('active');
			// 	}
			// 	else
			// 		$lastStep.removeClass('active');
			// });

		}

		function resetMainForm(){
			$formGeneral_v2.find("input[type=text], input[type=email], input[type=password], select").val("");
			$formGeneral_v2.find("input[type=checkbox], input[type=radio]").prop("checked", false);
			$formGeneral_v2.find('button[type="submit"]').prop('disabled', true);
			
			if(elementsForm['validator']){
				elementsForm['validator'].resetForm();
			}
		}

	}	

	function updateFormPostURL(value){

		var $masivo = $('#autogestion-form');

		var masivoPosts = {
			'cargar-directorio' : 'carga-masiva-2-a.html',
			'modificar-contactos' : 'carga-masiva-2-b.html',
		};

		$masivo.prop('action', masivoPosts[value]);
	}

	//Simular error de que es invalido el archivo
	function showInvalidErrorArchivo(){
		var msg = 'Este archivo está dañado o es ilegible, intenta con un nuevo archivo.';

		$('#archivo-invalido').remove();
		$('.lineas-archivo .extra-info').hide();
		$('.lineas-archivo .add-lines-ge-mod' ).append('<div class="error-dd error" id="archivo-invalido">'+msg+'</div>');
		$('#archivo').parent().addClass('error');

		$('#autogestion-form').find('button[type="submit"]').prop('disabled', true);
	}
	//FIN FORMULARIO DIRECTORIO V2

	function initFormValidationDirectorio(){

		$('.select-change').change(function(){
			var disabled = true;
			
			if($('#grupo').val() != '' && $('#empresa').val() != '')
				disabled = false;

			$formDirectorio.find('button[type="submit"]').prop('disabled', disabled);

		});
	}

	function initFormValidationDesvio(){

		$('.select-change').change(function(){
			var disabled = true;
			
			if($('#empresa').val() != '' && $('#grupo').val() != '')
				disabled = false;

			$formDesvio.find('button[type="submit"]').prop('disabled', disabled);

		});
	}

	function initFormValidationMarcacion(){

		$('.select-change').change(function(){
			var disabled = true;
			
			if($('#empresa').val() != '')
				disabled = false;

			$formMarcacion.find('button[type="submit"]').prop('disabled', disabled);

		});
	}


	function generarListadoConfirmacionInicial(){

		var $elements = $listaPrincipal.find('.linea-batch');
		var total = $elements.length;

		$elements.each(function (index, value) { 
		  var meta = ( typeof $(this).data('meta') != 'undefined' ? $(this).data('meta') : null );
		  var $element = $(this);

			if(meta != null){
				var elemento = getListadoSection(meta, index);
				$element.html(elemento);
				// bindElementActions();

			}
		});
	}

	function generarHTMLDirectorio(meta, index){
		var html = '';

		html = '<div class="col-sm-pr-100 col-xs-12 content-item-block" data-index="'+index+'"> <div class="col-xs-12 col-sm-pr-10"><p class="label">Número:</p> <p class="p-value" title="'+meta.numero+'">'+meta.numero+'</p></div><div class="col-xs-12 col-sm-pr-15"><p class="label">Asignado a:</p> <p class="p-value" title="'+meta.asignado+'">'+meta.asignado+'</p></div><div class="col-xs-12 col-sm-pr-15"><p class="label">Puesto:</p> <p class="p-value" title="'+meta.puesto+'">'+meta.puesto+'</p></div><div class="col-xs-12 col-sm-pr-10 flexbox"><p class="label">Área:</p> <p class="p-value" title="'+meta.area+'">'+meta.area+'</p></div><div class="col-xs-12 col-sm-pr-20"><p class="label">Correo:</p> <p class="p-value" title="'+meta.correoelectronico+'">'+meta.correoelectronico+'</p></div><div class="col-xs-12 col-sm-pr-10"><p class="label">Ext.:</p> <p class="p-value" title="'+meta.extension+'">'+meta.extension+'</p></div><div class="col-xs-12 col-sm-pr-10 flexbox"><p class="label">Marcación:</p><p class="p-value" title="'+meta.marcacion+'">'+meta.marcacion+'</p></div><div class="col-xs-12 col-sm-pr-10 flexbox"><button type="button" class="btn-modificar-contacto" title="Modificar"><span class="hidden-sm hidden-md hidden-lg">Modificar contacto</span><span class="icon io-Admin hidden-xs"></span></button></div></div>'; 


		return html;

	}

	function generarHTMLMarcacion(meta, index){
		var html = '';

		html = '<div class="col-sm-pr-100 col-xs-12 content-item-block" data-index="'+index+'"><div class="col-xs-12 col-sm-pr-10 flexbox"><p class="label">Región:</p> <p class="p-value" title="'+meta.region+'">'+meta.region+'</p></div><div class="col-xs-12 col-sm-pr-15"><p class="label">Cuenta:</p> <p class="p-value" title="'+meta.cuenta+'">'+meta.cuenta+'</p></div><div class="col-xs-12 col-sm-pr-10"><p class="label">Número:</p> <p class="p-value" title="'+meta.numero+'">'+meta.numero+'</p></div><div class="col-xs-12 col-sm-pr-15"><p class="label">Asignado a:</p> <p class="p-value" title="'+meta.asignado+'">'+meta.asignado+'</p></div><div class="col-xs-12 col-sm-pr-20"><p class="label">Correo:</p> <p class="p-value" title="'+meta.correoelectronico+'">'+meta.correoelectronico+'</p></div><div class="col-xs-12 col-sm-pr-10"><p class="label">Ext.:</p> <p class="p-value" title="'+meta.extension+'">'+meta.extension+'</p></div><div class="col-xs-12 col-sm-pr-10 flexbox"><p class="label">Marcación:</p><p class="p-value" title="'+meta.marcacion+'">'+meta.marcacion+'</p></div><div class="col-xs-12 col-sm-pr-10 flexbox"><button type="button" class="btn-marcacion-corta" title="Modificar"><span class="hidden-sm hidden-md hidden-lg">Modificar contacto</span><span class="icon io-Admin hidden-xs"></span></button></div></div>'; 


		return html;

	}

	function generarHTMLDesvio(meta, index){
		var html = '';

		html = '<div class="col-sm-pr-100 col-xs-12 content-item-block" data-index="'+index+'"><div class="col-xs-12 col-sm-pr-10 flexbox"><p class="label">Región:</p> <p class="p-value" title="'+meta.region+'">'+meta.region+'</p></div><div class="col-xs-12 col-sm-pr-15"><p class="label">Cuenta:</p> <p class="p-value" title="'+meta.cuenta+'">'+meta.cuenta+'</p></div><div class="col-xs-12 col-sm-pr-15"><p class="label">Número:</p> <p class="p-value" title="'+meta.numero+'">'+meta.numero+'</p></div><div class="col-xs-12 col-sm-pr-20"><p class="label">Asignado a:</p> <p class="p-value" title="'+meta.asignado+'">'+meta.asignado+'</p></div><div class="col-xs-12 col-sm-pr-15"><p class="label">Desvío 1:</p> <p class="p-value" title="'+meta.desvio1+'">'+meta.desvio1+'</p></div><div class="col-xs-12 col-sm-pr-15 flexbox"><p class="label">Desvío 2:</p><p class="p-value" title="'+meta.desvio2+'">'+meta.desvio2+'</p></div><div class="col-xs-12 col-sm-pr-10 flexbox"><button type="button" class="btn-modificar-desvio" title="Modificar"><span class="hidden-sm hidden-md hidden-lg">Modificar contacto</span><span class="icon io-Admin hidden-xs"></button></div></div>'; 


		return html;

	}

	function generarHTMLAbono(meta, index){
		var html = '',
		multipleLines = (typeof meta.lineas != 'undefined' ? (meta.lineas.length >1 ? true : false) : null),
		lineatxt = (multipleLines ? meta.lineas.length+' línea(s)' : meta.lineas[0]),
		lineas = '',
		size = ['col-sm-pr-20', 'col-sm-pr-15', 'col-sm-pr-20', 'col-sm-pr-20', 'col-sm-pr-15'];

		if(multipleLines){
			lineas = '<div class="col-sm-12 col-xs-12 content-item-block more-info">';


			$.each( meta.lineas, function( i, v ) {
				if(i<=5)
			 		lineas+= '<div class="'+size[i]+'"><p class="p-value" title="'+v+'">'+v+'</p></div>';
			});

			lineas+= '</div>';
		}



		html = '<div class="col-sm-pr-100 col-xs-12 content-item-block" data-index="'+index+'"> <div class="col-xs-12 col-sm-pr-20"> <p class="label">Operación:</p> <p class="p-value" title="'+meta.operacion+'">'+meta.operacion+'</p></div><div class="col-xs-12 col-sm-pr-15"> <p class="label">Líneas:</p> <p class="p-value" title="'+lineatxt+'">'+lineatxt+'</p></div><div class="col-xs-12 col-sm-pr-20"> <p class="label">Asignado a:</p> <p class="p-value" title="'+meta.asignado+'">'+meta.asignado+'</p></div><div class="col-xs-12 col-sm-pr-20 flexbox"><p class="label">Fecha:</p> <p class="p-value" title="'+meta.fecha+'">'+meta.fecha+'</p></div><div class="col-xs-12 col-sm-pr-15"><p class="label">Monto:</p> <p class="p-value" title="$'+meta.monto+'">$'+meta.monto+'</p></div><div class="col-xs-12 col-sm-pr-10 hidden-xs">'+( multipleLines ? '<button type="button" class="simple btn-ver-detalle" title="Ver detalle"> <span class="icon i-angle-down"></span> <span class="icon i-angle-up"></span> </button>' : '')+'</div> </div>'+lineas;

		return html;

	}

	return{
		inicializar: init
	}
})();

var modalesRedPrivada = (function(){
	var formElementsModales = { 
		'agregarContacto' : {id : null, validator : null, sending: false },
		'editarContacto' : {id : null, validator : null, sending: false },
		'modificarContacto' : {id : null, validator : null, sending: false },
		'marcacionCorta' : {id : null, validator : null, sending: false },
		'modificarDesvio' : {id : null, validator : null, sending: false },
		'eliminarContacto' : {id : null, validator : null, sending: false },
		'subirArchivo' : {id : null, validator : null, sending: false }
	},
	currentModalData = null, _modalEditarContacto = null, _modalConfirmarEliminar = null;

	var modalAgregarContacto = null, modalEditarContacto = null, modalModificarContacto = null, modalMarcacionCorta = null, modalModificarDesvio = null, modalConfirmarEliminar = null, modalSubirArchivo = null;

	function init(){
		setActions();

		if($('.red-contactos-table-block').length>0)
			initListadoContactosLimit();

		if($('#modal-agregar-contacto').length>0)
			initModalAgregarContacto();

		if($('#modal-editar-contacto').length>0)
			initModalEditarContacto();

		if($('#modal-modificar-contacto').length>0)
			initModalModificarContacto();

		if($('#modal-marcacion-corta').length>0)
			initModalMarcacionCorta();

		if($('#modal-modificar-desvio').length>0)
			initModalModificarDesvio();

		if($('#modal-confirmar-eliminar').length>0)
			initmodalConfirmarEliminar();

		if($('#modal-subir-archivo').length>0)
			initmodalSubirArchivo();
	}

	function setActions(){
		$('body').on('click', '.btn-modificar-contacto', function(){
			var $element = $(this).closest('.linea-batch');
			setBasicInfoModal($element.data('meta'));
			modalModificarContacto.openModal();
		});

		$('body').on('click', '.btn-marcacion-corta', function(){
			var $element = $(this).closest('.linea-batch');
			setBasicInfoModal($element.data('meta'));
			modalMarcacionCorta.openModal();
		});

		$('body').on('click', '.btn-modificar-desvio', function(){
			var $element = $(this).closest('.linea-batch');
			setBasicInfoModal($element.data('meta'));
			modalModificarDesvio.openModal();
		});

		$('body').on('click', '#btn-agregar-contacto', function(){
			var $element = $(this);

			if(checkContactosLimit())
				modalAgregarContacto.openModal();
		});

		$('.red-contactos-table-block').on('click', '.btn-edit', function(){
			var $element = $(this),
			$container = $element.closest('.linea-batch');
			_modalEditarContacto = $container.data('meta');
			modalEditarContacto.openModal();
		});

		$('.red-contactos-table-block').on('click', '.btn-delete', function(){
			var $element = $(this),
			$container = $element.closest('.linea-batch');
			_modalConfirmarEliminar = $container.data('meta');
			modalConfirmarEliminar.openModal();
		});

		$('body').on('click', '.btn-general-carga-masiva', function(){
			modalSubirArchivo.openModal();
		});
		
	}

	/**Inicio modal subir archivo**/
	function initmodalSubirArchivo(){

		modalSubirArchivo = new modalesTelcel($('#modal-subir-archivo'),{
			onInit : function(){
				validateArchivoForm();

			},
			onReset : function(){

			},
			onOpen : function(){
			
			}
		});

		function validateArchivoForm(){

			var $form = $('#modal-subir-archivo #form-subir-archivo'),
			form = '#modal-subir-archivo #form-subir-archivo';

			disableSumbitButton($form, true);

			formElementsModales['subirArchivo']['validator'] = 
				$form.validate({
					  rules: {
						archivo: {
							required : true,
							extension: "xls",
							filesize: 10000000
						},
						motivoAutogestion: {
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
						 }
					   },
						errorClass : "error-dd error",
						errorElement : 'div',
						errorPlacement: function(error, element) {
							var elementInput = element[0];
							if(element[0]['id']==='archivo'){
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
				        highlight : function(element, errorClass){
				        	var $element = $(element);
				        	if($element.attr('id')==='archivo' && $element.val() == ''){
				        		$('.lineas-archivo .extra-info').hide();
								$element.parent().addClass('error');
				        	}
				        },
				        submitHandler: function(form) {
							if(!formElementsModales['subirArchivo']['sending']){
								sendFormData(form);
					  		}
						}
				});

				checkGeneralValidForm($form);

				function sendFormData(form){
					formElementsModales['subirArchivo']['sending'] = true;
					$(form).find('button[type="submit"]').prop('disabled', true);

					var self = $(form).serialize();

					var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
					
					/**Quitar una vez en producción y aqui solo checamos si es una línea en development para mandar a otra liga**/
					var sendTo = urlPOST;
					urlPOST = checkDevelopmentPostHTML(urlPOST);

					$.post(  urlPOST , self )
					.done(function( data ) {
					  	Services.redPrivada.cargaMasivaCallSuccess(data, form, sendTo, showInvalidErrorArchivo );
						formElementsModales['subirArchivo']['sending'] = false;
					 })
					.fail(function( jqxhr, textStatus, error ) {
					  	//Mensaje de error del sistema
					  	Services.redPrivada.cargaMasivaCallFail(error, form);
					  	formElementsModales['subirArchivo']['sending'] = false;
					});
				}

				//Simular error de que es invalido el archivo
				function showInvalidErrorArchivo(){
					var msg = 'Este archivo está dañado o es ilegible, intenta con un nuevo archivo.';

					$('#archivo-invalido').remove();
					$('.lineas-archivo .extra-info').hide();
					$('.lineas-archivo .add-lines-ge-mod' ).append('<div class="error-dd error" id="archivo-invalido">'+msg+'</div>');
					$('#archivo').parent().addClass('error');

					$('#autogestion-form').find('button[type="submit"]').prop('disabled', true);
				}	
		}


	}
	/**Inicio modal subir archivo**/

	/**Inicio modal confirmar eliminar**/
	function initmodalConfirmarEliminar(){

		modalConfirmarEliminar = new modalesTelcel($('#modal-confirmar-eliminar'),{
			onInit : function(){
				initActionsModalAuxiliar();
			},
			onReset : function(){

			},
			onOpen : function(){
				setModalData();

				var $form = $('#modal-confirmar-eliminar .form-ge-mod');

				$form.removeClass('success');
				$form.show();
			}
		});

		function setModalData(){

			$('#modal-confirmar-eliminar .txt-nombre').html(_modalConfirmarEliminar.nombre);
			$('#modal-confirmar-eliminar .txt-numero').html(_modalConfirmarEliminar.numero);
		}


		function initActionsModalAuxiliar(){

			$('#modal-confirmar-eliminar').on('click', '#btn-confirmar-eliminar', function(){
				postEliminarContacto();
			});

		}

		function postEliminarContacto(){
			var form = '#modal-confirmar-eliminar .form-ge-mod';

			if(!formElementsModales['eliminarContacto']['sending']){

				formElementsModales['eliminarContacto']['sending'] = true;

				generalLoadingIcon(form, true);

				var postURL = Services.apiURL.eliminarContacto();

				$.post( postURL , { delete: _modalConfirmarEliminar })
				  .done(function( json ) {
				  	Services.redPrivada.eliminarContactoSuccessCallback(json, form, _modalConfirmarEliminar, updateOnSuccess );
				  	formElementsModales['eliminarContacto']['sending'] = false;
				  	generalLoadingIcon(form, false);

				  })
				  .fail(function( jqxhr, textStatus, error ) {
				  	Services.redPrivada.eliminarContactoFailCallback(error, form);
				  	formElementsModales['eliminarContacto']['sending'] = false;
				  	generalLoadingIcon(form, false);
				});
			}
		}

		function updateOnSuccess(id, msg){
			$('#modal-confirmar-eliminar .api-msg-success').html('<p>'+msg+'</p>');

			var $element = $('#lt-'+id);

			if($element.length>0)
				$element.remove();

			currentTotal-=1;

			$('#current-lista-block .contactos-total').html(currentTotal);

			$('#btn-agregar-contacto').prop('disabled', !checkContactosLimit());
		}
	}
	/**Inicio modal confirmar eliminar**/

	/**Inicio modal editar contacto**/
	function initModalEditarContacto(){
		var $form = $('#modal-editar-contacto #form-editar-contacto');
		var $input = $form.find('input[name="email"]');
		var $lastElement = null;

		$input.bind('input', function(e){
			var $errori = $form.find('.general-error-tooltip');
			if($errori.length>0){
				$input.removeClass('error').removeClass('error-dd');
				$errori.remove();
			}
		});

		modalEditarContacto = new modalesTelcel($('#modal-editar-contacto'),{
			onInit : function(){
				validateFormEditarContacto();
			},
			onOpen : function(){
				setCurrentData();
			},
			onReset : function(){
				_modalEditarContacto = null;
				resetFormModal($('.form-editar-contacto #form-editar-contacto'), 'agregarContacto');
				$('#modal-editar-contacto .main-modal-header').show();
				$('#modal-editar-contacto .secondary-modal-header').hide();
			},
			onClose : function(){
				if($lastElement!=null && $lastElement.length>0){
					scrollToElement($lastElement);
					$lastElement = null;
				}
				
			}
		});

		function setCurrentData(){
			$('#modal-editar-contacto input[name="numero"]').val(_modalEditarContacto.numero);
			$('#modal-editar-contacto input[name="nombre"]').val(_modalEditarContacto.nombre);
		}

		function validateFormEditarContacto(){
			var $form = $('.form-editar-contacto #form-editar-contacto');

			disableSumbitButton($form, true);
			
			formElementsModales['editarContacto']['validator'] = $form.validate({
			ignore: "",
				onkeyup:  function(element) { $(element).valid(); },
				rules: {
					numero : {
						digits: true,
						minlength: 2,
						maxlength: 10,
						required : true
					}
				},
				messages: {
					numero: {
						required: "Ingresa un número de 2 a 10 dígitos",
						digits: "Ingresa un número de 2 a 10 dígitos",
						minlength: "Ingresa un número de 2 a 10 dígitos",
						maxlength: "Ingresa un número de 2 a 10 dígitos"
					}
				},
				errorClass : "error-dd error",
				submitHandler: function(form) {
					if(!formElementsModales['editarContacto']['sending']){
						formElementsModales['editarContacto']['sending'] = true;
						$(form).find('button[type="submit"]').prop('disabled', true);
						
						var self = $(form).serialize();
						var selfArray = $(form).serializeArray();

						generalLoadingIcon(form, true);

						var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;

						$.post( urlPOST , { data: self })
						  .done(function( json ) {
						  	
							var elementData = {
								id : _modalEditarContacto.id,
								numero: selfArray[0].value
							};

							Services.redPrivada.editarContactoSuccessCallback(json, form, elementData, updateOnSuccess);
							formElementsModales['editarContacto']['sending'] = false;
							$(form).find('button[type="submit"]').prop('disabled', false);
						  	generalLoadingIcon(form, false);

						  })
						  .fail(function( jqxhr, textStatus, error ) {
						  	Services.redPrivada.editarContactoFailCallback(error, form );
						  	formElementsModales['editarContacto']['sending'] = false;
						  	generalLoadingIcon(form, false);
						});
					}
				}
			});

			checkGeneralValidForm($form);
		}

		function updateOnSuccess(newdata, msg){
			$('#modal-editar-contacto .api-msg-success').html('<p>'+msg+'</p>');

			var $element = $('#lt-'+newdata.id);

			if($element.length>0){
				$element.find('input[name = "numero"]').val(newdata.numero);
				$element.find('input[name = "nombre"]').val(newdata.nombre);

				$element.data('meta', newdata);

				$lastElement = $element;
			}
		}

	}
	/**Fin modal editar contacto**/
	var listadoLimit = 10,
	currentTotal = 0;

	function initListadoContactosLimit(){

		var $main = $('#current-lista-block'),
		$table = $('.red-contactos-table-block .linea-batch');

		currentTotal = $table.length;

		if($main.length>0)
			listadoLimit = (typeof $main.data('limit') != undefined ? $main.data('limit') : 10 );

		$main.find('.contactos-limit').html(listadoLimit);

		$('#btn-agregar-contacto').prop('disabled', !checkContactosLimit());
	}

	function checkContactosLimit()
	{	
		var valid = true;

		if(currentTotal == listadoLimit)
			valid = false;

		checkContactosLength(valid);

		return valid;
	}

	function checkContactosLength(){
		if(currentTotal==0){
			$('.red-contactos-table-block .general-table').addClass('hidden');
			$('#error-sin-contactos').removeClass('hidden');
		}
		else{
			$('#error-sin-contactos').addClass('hidden');
			$('.red-contactos-table-block .general-table').removeClass('hidden');
		}
	}

	/**Inicio modal agregar contacto**/
	function initModalAgregarContacto(){
		var $form = $('#modal-agregar-contacto #form-agregar-contacto');
		var $input = $form.find('input[name="email"]');

		$input.bind('input', function(e){
			var $errori = $form.find('.general-error-tooltip');
			if($errori.length>0){
				$input.removeClass('error').removeClass('error-dd');
				$errori.remove();
			}
		});

		modalAgregarContacto = new modalesTelcel($('#modal-agregar-contacto'),{
			onInit : function(){
				validateFormAgregarContacto();
			},
			onOpen : function(){


			},
			onReset : function(){
				resetFormModal($('.form-agregar-contacto #form-agregar-contacto'), 'agregarContacto');
				$('#modal-agregar-contacto .main-modal-header').show();
				$('#modal-agregar-contacto .secondary-modal-header').hide();
			}
		});


		function validateFormAgregarContacto(){
			var $form = $('.form-agregar-contacto #form-agregar-contacto');

			disableSumbitButton($form, true);
			
			formElementsModales['agregarContacto']['validator'] = $form.validate({
			ignore: "",
				onkeyup:  function(element) { $(element).valid(); },
				rules: {
					numero : {
						digits: true,
						minlength: 2,
						maxlength: 10,
						required : true
					}
				},
				messages: {
					numero: {
						required: "Ingresa un número de 2 a 10 dígitos",
						digits: "Ingresa un número de 2 a 10 dígitos",
						minlength: "Ingresa un número de 2 a 10 dígitos",
						maxlength: "Ingresa un número de 2 a 10 dígitos"
					}
				},
				errorClass : "error-dd error",
				submitHandler: function(form) {
					if(!formElementsModales['agregarContacto']['sending']){
						formElementsModales['agregarContacto']['sending'] = true;
						$(form).find('button[type="submit"]').prop('disabled', true);
						
						var self = $(form).serialize();
						var selfArray = $(form).serializeArray();

						generalLoadingIcon(form, true);

						var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;

						$.post( urlPOST , { data: self })
						  .done(function( json ) {
						  	
							var elementData = {
								numero: selfArray[0].value
							};

							Services.redPrivada.agregarContactoSuccessCallback(json, form, elementData, updateOnSuccess);
							formElementsModales['agregarContacto']['sending'] = false;
							$(form).find('button[type="submit"]').prop('disabled', false);
						  	generalLoadingIcon(form, false);

						  })
						  .fail(function( jqxhr, textStatus, error ) {
						  	Services.redPrivada.agregarContactoFailCallback(error, form );
						  	formElementsModales['agregarContacto']['sending'] = false;
						  	generalLoadingIcon(form, false);
						});
					}
				}
			});

			checkGeneralValidForm($form);
		}

		function updateOnSuccess(elementData, msg){
			$('#modal-agregar-contacto .api-msg-success').html('<p>'+msg+'</p>');

			var html = '<div class="col-sm-12 col-xs-12 center-block flexbox h-align-center linea-batch" id="lt-'+elementData.id+'" data-meta="{&quot;id&quot; : &quot;'+elementData.id+'&quot;, &quot;numero&quot; : &quot;'+elementData.numero+'&quot;}"> <div class="col-sm-12 col-xs-12 content-item-block padding-0"> <div class="col-sm-pr-85 col-xs-12 flexbox h-align-center v-align-center"> <label for="numero" class="input-label hidden-sm hidden-md hidden-lg">Número: </label> <div class="data-write"> <input type="text" name="numero" placeholder="10 dígitos" maxlength="10" value="'+elementData.numero+'"  disabled="/"> </div> </div> </div> <div class="btn-container"> <div class="edit-container col-sm-6 col-xs-6"> <span class="icon io-Admin btn-edit hidden-xs" title="Editar"></span> <span class="col-xs-12 btn-mobile btn-edit hidden-sm hidden-md hidden-lg">Editar</span> </div> <div class="delete-container col-sm-6 col-xs-6"> <span class="icon io-CloseSession btn-delete hidden-xs" title="Quitar"></span> <span class="col-xs-12 btn-mobile btn-delete hidden-sm hidden-md hidden-lg">Quitar</span> </div> </div> </div>';

				//Aquí se appendea el html y se hacen los cambios necesarios para correr las validaciones

				$('.red-contactos-table-block .table-main-block').append(html);

				currentTotal+=1;

				$('#current-lista-block .contactos-total').html(currentTotal);

				$('#btn-agregar-contacto').prop('disabled', !checkContactosLimit());
		}

	}
	/**Fin modal agregar contacto**/

	/**Inicio modal modificar contacto**/
	function initModalModificarContacto(){
		var $form = $('.form-modificar-contacto #form-modificar-contacto');
		var $input = $form.find('input[name="nombre"]');

		$input.bind('input', function(e){
			var $errori = $form.find('.general-error-tooltip');
			if($errori.length>0){
				$input.removeClass('error').removeClass('error-dd');
				$errori.remove();
			}
		});

		modalModificarContacto = new modalesTelcel($('#modal-modificar-contacto'),{
			onInit : function(){
				validateForm();
				resendFormError($('#modal-modificar-contacto'), $('#form-modificar-contacto'));
			},
			onReset : function(){
				removeGeneralError($('#modal-modificar-contacto'));
				//resetModalDesasociarCuentas();
			},
			onOpen : function(){
				resetFormModal($('.form-modificar-contacto #form-modificar-contacto'), 'modificarContacto');
				setModalData();
			},
			onClose : function(){

				//Cuando cierre el modal si quieren hacer refresh hay que descomentar esto
				// if(processCompleted)
				// 	location.reload();
			}
		});

		function setModalData(){
			var meta = currentModalData,
			$modal = $('#modal-modificar-contacto');


	  		
	  		$modal.find('input[name="email"]').val(meta.correoelectronico);
	  		$modal.find('input[name="nombre"]').val(meta.nombre);
	  		$modal.find('input[name="apellidos"]').val(meta.apellido);
	  		$modal.find('input[name="area"]').val(meta.area);
	  		$modal.find('input[name="puesto"]').val(meta.puesto);

	  		$modal.find('.lada-value').html(meta.lada);
	  		$modal.find('.telefono-value').html(meta.numero);
	  		$modal.find('.extension-value').html(meta.extension);
	  		$modal.find('.marcacion-value').html(meta.marcacion);


		}

		function validateForm(){

			var $form = $('.form-modificar-contacto #form-modificar-contacto');

			disableSumbitButton($form, true);
			//checkRequiredElements('#form-modificar-contacto');
		
			formElementsModales['modificarContacto']['validator'] = $form.validate({
			  rules: {
				nombre: {
					required: true,
					minlength: 3,
					grupoNombre : true,
			  		maxlength: 45
				},
				apellidos: {
					required: true,
					minlength: 3,
					grupoNombre : true,
			  		maxlength: 45
				},
				area: {
					required: true,
					minlength: 5,
					grupoNombre : true,
			  		maxlength: 45
				},
				puesto: {
					required: true,
					minlength: 5,
					grupoNombre : true,
			  		maxlength: 45
				},
				email : {
					required: true,
			  		email: true
				}
			  },
			  messages: {
				 nombre: {
				   required: "Es necesario ingresar un nombre para el contacto.",
				   minlength : " El nombre debe tener al menos 3 caracteres.",
				   grupoNombre : "El nombre no debe tener caracteres especiales, números y espacio al inicio o final.",
				   maxlength : "El nombre debe tener un máximo de 45 caracteres."
				 },
				 apellidos: {
				   required: "Es necesario ingresar un apellido para el contacto.",
				   minlength : " El apellido debe tener al menos 3 caracteres.",
				   grupoNombre : "El apellido no debe tener caracteres especiales, números y espacio al inicio o final.",
				   maxlength : "El apellido debe tener un máximo de 45 caracteres."
				 },
				 area: {
				   required: "Es necesario ingresar un área para el contacto.",
				   minlength : " El área debe tener al menos 5 caracteres.",
				   grupoNombre : "El área no debe tener caracteres especiales, números y espacio al inicio o final.",
				   maxlength : "El área debe tener un máximo de 45 caracteres."
				 },
				 puesto: {
				   required: "Es necesario ingresar un puesto para el contacto.",
				   minlength : " El puesto debe tener al menos 5 caracteres.",
				   grupoNombre : "El puesto no debe tener caracteres especiales, números y espacio al inicio o final.",
				   maxlength : "El puesto debe tener un máximo de 45 caracteres."
				 },
				 email: {
				 	required: "Ingresa tu correo electrónico.",
			   		email: "Ingresa un correo electrónico válido."
				 }
			   },
			   errorClass : "error-dd error",
				submitHandler: function(form) {
					if(!formElementsModales['modificarContacto']['sending']){

						formElementsModales['modificarContacto']['sending'] = true;

						$(form).find('button[type="submit"]').prop('disabled', true);
						
						var self = $(form).serialize();
						var selfArray = $(form).serializeArray();

						generalLoadingIcon(form, true);

						var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;

						$.post( urlPOST , { data: self, id: currentModalData.id })
						  .done(function( json ) {
						  	
						  	Services.redPrivada.modificarContactoSuccessCallback(json, form, updateOnSuccess);
						  	$(form).find('button[type="submit"]').prop('disabled', false);
						  	formElementsModales['modificarContacto']['sending'] = false;
						  	generalLoadingIcon(form, false);

						  })
						  .fail(function( jqxhr, textStatus, error ) {
						  	//Mensaje de error del SISTEMA

						  	Services.redPrivada.modificarContactoFailCallback(error, form );

						  	formElementsModales['modificarContacto']['sending'] = false;
						  	generalLoadingIcon(form, false);
						});

					}

				}
			});

			checkGeneralValidForm($form);
			

		}


		function updateOnSuccess(msg){
			$('#modal-modificar-contacto .api-msg-success').html('<p>'+msg+'</p>');

		}

	}
	/**Fin modal modificar contacto**/

	/**Inicio modal marcación corta**/
	function initModalMarcacionCorta(){
		var processCompleted = false;
		var $form = $('.form-marcacion-corta #form-marcacion-corta');

		modalMarcacionCorta = new modalesTelcel($('#modal-marcacion-corta'),{
			onInit : function(){
				validateForm();
				resendFormError($('#modal-marcacion-corta'), $('#form-marcacion-corta'));
			},
			onReset : function(){
				removeGeneralError($('#modal-marcacion-corta'));
				//resetModalDesasociarCuentas();
			},
			onOpen : function(){
				processCompleted = false;
				resetFormModal($('.form-marcacion-corta #form-marcacion-corta'), 'marcacionCorta');
				setModalData();
			},
			onClose : function(){

				//Cuando cierre el modal si quieren hacer refresh hay que descomentar esto
				// if(processCompleted)
				// 	location.reload();
			}
		});

		function setModalData(){
			var meta = currentModalData,
			$modal = $('#modal-marcacion-corta');

	  		$modal.find('input[name="marcacion"]').val(meta.marcacion);

	  		$modal.find('.nombre-value').html(meta.asignado);
	  		$modal.find('.telefono-value').html(meta.numero);
	  		$modal.find('.extension-value').html(meta.extension);


		}



		function validateForm(){

			var $form = $('.form-marcacion-corta #form-marcacion-corta');

			disableSumbitButton($form, true);
			//checkRequiredElements('#form-marcacion-corta');
		
			formElementsModales['marcacionCorta']['validator'] = $form.validate({
			  rules: {
				marcacion: {
					required: true,
					minlength: 4,
					digits : true,
			  		maxlength: 4
				}
			  },
			  messages: {
				 nombre: {
				   required: "Es necesario ingresar un valor para la marcación corta.",
				   minlength : " La marcación debe tener al menos 4 caracteres.",
				   grupoNombre : "La marcación solo acepta números.",
				   maxlength : "La marcación debe tener un máximo de 4 caracteres."
				 }
			   },
			   errorClass : "error-dd error",
				submitHandler: function(form) {
					if(!formElementsModales['marcacionCorta']['sending']){

						formElementsModales['marcacionCorta']['sending'] = true;

						$(form).find('button[type="submit"]').prop('disabled', true);
						
						var self = $(form).serialize();
						var selfArray = $(form).serializeArray();

						generalLoadingIcon(form, true);

						var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;

						$.post( urlPOST , { data: self, id: currentModalData.id })
						  .done(function( json ) {

						  	Services.redPrivada.marcacionCortaSuccessCallback(json, form, updateOnSuccess);
						  	//$(form).find('button[type="submit"]').prop('disabled', false);
						  	formElementsModales['marcacionCorta']['sending'] = false;
						  	generalLoadingIcon(form, false);
						  	processCompleted = true;

						  })
						  .fail(function( jqxhr, textStatus, error ) {
						  	//Mensaje de error del SISTEMA

						  	Services.redPrivada.marcacionCortaFailCallback(error, form );
						  	formElementsModales['marcacionCorta']['sending'] = false;
						  	generalLoadingIcon(form, false);
						  	processCompleted = true;
						});

					}

				}
			});

			checkGeneralValidForm($form);
			

		}


		function updateOnSuccess(msg){
			$('#modal-marcacion-corta .api-msg-success').html('<p>'+msg+'</p>');

		}

	}
	/**Fin modal marcación corta**/

	/**Inicio modal modificar desvio**/
	function initModalModificarDesvio(){
		var processCompleted = false;
		var $form = $('.form-modificar-desvio #form-modificar-desvio');

		modalModificarDesvio = new modalesTelcel($('#modal-modificar-desvio'),{
			onInit : function(){
				validateForm();
				resendFormError($('#modal-modificar-desvio'), $('#form-modificar-desvio'));
			},
			onReset : function(){
				removeGeneralError($('#modal-modificar-desvio'));
				//resetModalDesasociarCuentas();
			},
			onOpen : function(){
				processCompleted = false;
				resetFormModal($('.form-modificar-desvio #form-modificar-desvio'), 'modificarDesvio');
				setModalData();
			},
			onClose : function(){

				//Cuando cierre el modal si quieren hacer refresh hay que descomentar esto
				// if(processCompleted)
				// 	location.reload();
			}
		});

		function setModalData(){
			var meta = currentModalData,
			$modal = $('#modal-modificar-desvio');

	  		$modal.find('input[name="desvio1"]').val(meta.desvio1);
	  		$modal.find('input[name="desvio2"]').val(meta.desvio2);

	  		$modal.find('.telefono-value').html(meta.numero);
	  		$modal.find('.nombre-value').html(meta.asignado);

		}

		function validateForm(){

			var $form = $('.form-modificar-desvio #form-modificar-desvio');

			disableSumbitButton($form, true);

			formElementsModales['modificarDesvio']['validator'] = $form.validate({
			  rules: {
				desvio1: {
					required: true,
					minlength: 10,
					digits : true,
			  		maxlength: 10
				},
				desvio2: {
					required: true,
					minlength: 10,
					digits : true,
			  		maxlength: 10
				}
			  },
			  messages: {
				 desvio1: {
				   required: "Ingresa un desvío de llamada.",
					digits: "Ingresa un desvío de llamada válido.",
					minlength: "Ingresa un desvío de llamada de 10 dígitos.",
					maxlength: "Ingresa un desvío de llamada de 10 dígitos."
				 },
				 desvio2: {
				   required: "Ingresa un desvío de llamada.",
					digits: "Ingresa un desvío de llamada válido.",
					minlength: "Ingresa un desvío de llamada de 10 dígitos.",
					maxlength: "Ingresa un desvío de llamada de 10 dígitos."
				 }
			   },
			   errorClass : "error-dd error",
				submitHandler: function(form) {
					if(!formElementsModales['modificarDesvio']['sending']){

						formElementsModales['modificarDesvio']['sending'] = true;

						$(form).find('button[type="submit"]').prop('disabled', true);
						
						var self = $(form).serialize();
						var selfArray = $(form).serializeArray();

						generalLoadingIcon(form, true);

						var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;

						$.post( urlPOST , { data: self, id: currentModalData.id })
						  .done(function( json ) {
						  	
						  	Services.redPrivada.modificarDesvioSuccessCallback(json, form, updateOnSuccess );
						  	formElementsModales['modificarDesvio']['sending'] = false;
						  	generalLoadingIcon(form, false);
						  	processCompleted = true;

						  })
						  .fail(function( jqxhr, textStatus, error ) {
						  	Services.redPrivada.modificarDesvioFailCallback(error, form );

						  	formElementsModales['modificarDesvio']['sending'] = false;
						  	generalLoadingIcon(form, false);
						  	processCompleted = true;
						});

					}

				}
			});

			checkGeneralValidForm($form);
			

		}


		function updateOnSuccess(msg){
			$('#modal-modificar-desvio .api-msg-success').html('<p>'+msg+'</p>');

		}
	}
	/**Fin modal modificar desvio**/

	function setBasicInfoModal(item){
		currentModalData = item;
		$('.modal-mte .alias-text, .modal-mte .txt-grupo').html(item.asignado);
	}

	function resetFormModal($form, form){
		$form.find('.general-error-tooltip').remove();
		$form.find("input[type=text], input[type=email], input[type=password], select").val("");
		$form.find("input[type=text], input[type=email], input[type=password], select").removeClass("error").removeClass("error-dd");
		$form.find('button[type="submit"]').prop('disabled', true);
		$form.removeClass('success').removeClass('error').show();

		if(formElementsModales[form]['validator']){
			formElementsModales[form]['validator'].resetForm();
		}
	}

	function removeGeneralError($modal){
		$modal.find('.system-error-msg').remove();
		$modal.find('.has-system-error').removeClass('has-system-error');
	}

	function resendFormError($modal, $form){
		$modal.on('click', '.btn-rsend-general', function(){
			removeGeneralError($modal);
			$form.submit();
		});
	}

	return{
		inicializar : init
	}

})();

if($('.red-privada-block').length>0 )
	redPrivada.inicializar();