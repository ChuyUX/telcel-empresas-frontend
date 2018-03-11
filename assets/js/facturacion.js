var facturacionTelcel = (function(){
	var formularioId = '#form-facturas',
	$facturacionTable = $('#facturacion-table'),
	$listaFacturacion = $('#listado-facturas'),
	$facturasSelect = $('select#factura'),
	$periodoSelect = $('select#periodo'),
	$titleP = $('#modal-descargar .heading-mod .title-mod p'),
	titleBefore = ( typeof $titleP.data('before') != 'undefined' ? $titleP.data('before') : null ),
	titleAfter = ( typeof $titleP.data('after') != 'undefined' ? $titleP.data('after') : null ),
	CFDI = $listaFacturacion.hasClass('cfdi'),
	formElementsModales = { validator : null, sending: false },
	checkedElements = [];

	var modalDescargarFacturas = null;	

	function initModalDescargarFacturas(){
		var emailDefault = '',
		$input = $('#modal-descargar').find('input[name="email"]'),
		formData = {};

		validateForm();
		
		modalDescargarFacturas = new modalesTelcel($('#modal-descargar'),{
			onInit : function(){
				initActions();
				emailDefault = $input.val();
				$('#confirmacion-autogestion').hide();
				$('#descargar-facturas-confirmacion').hide();
			},
			onReset : function(){
				removeGeneralError();
				$('#form-confirmar-descargar-facturas').show();
			  	$('#descargar-facturas-confirmacion').hide();
			  	resetMainForm();
			  	$('#btn-facturas-servicio').prop('disabled', false);
			},
			onOpen : function(){
				$('#modal-descargar').removeClass('no-close-out');
				
				//Simular el error en descargas con el hash//
				$('#modal-descargar .info-error').addClass('hidden');
				var hash = window.location.hash;

				if(hash=='#error-en-archivo')
					$('#modal-descargar .info-error').removeClass('hidden');
				//fin simulación//

				setPreviousData();

				if(titleBefore!=null)
					$titleP.html(titleBefore);

				//checkedElements = generalCheckBoxAll.getCheckedElements();
				var total = $('#listado-confirmacion-autogestion .checkbox-container input[type="checkbox"]').length;
				var checked = $('#listado-confirmacion-autogestion .checkbox-container input[type="checkbox"]:checked').length;

				checkedElements = { all : total == checked , elements:[]};
				$('#form-confirmar-descargar-facturas').find('button[type="submit"]').prop('disabled', false);

				if(!checkedElements.all){
					$('#form-confirmar-descargar-facturas').hide();
					$('#confirmacion-autogestion .c-lines').html(checked);
					$('#confirmacion-autogestion .t-lines').html(total);
					$('#confirmacion-autogestion').show();
				}
				else
					$('#descargar-facturas-confirmacion').hide();
			}
		});

		function setPreviousData(){

			if($facturasSelect.length>0)
				formData.factura = $facturasSelect.val();

			if($periodoSelect.length>0)
				formData.periodo = $periodoSelect.val();
			
		}

		function initActions(){
			$('#btn-confirmar-autogestion').click(function(){
				$('#descargar-facturas-confirmacion').hide();
				$('#confirmacion-autogestion').hide();
				$('#form-confirmar-descargar-facturas').show();
			});

			$('#modal-descargar').on('click', '#btn-r-descargar-facturas', function(){
				removeGeneralError();
				$('#form-confirmar-descargar-facturas').submit();
			});
		}

		function validateForm(){
			var $form = $('#form-confirmar-descargar-facturas');

			disableSumbitButton($form, true);

			formElementsModales['validator'] = $form.validate({
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

					if(!formElementsModales['sending']){

						formElementsModales['sending'] = true;

						$(form).find('button[type="submit"]').prop('disabled', true);

						generalLoadingIcon(form, true);

						formData.email = $(form).find('#email').val();

						$.post( postURL , { data: formData, facturas : checkedElements })
						  .done(function( json ) {
						  	
						  	Services.facturacion.descargarFacturasSuccessCallback(json, form, { element : $titleP, text : titleAfter }, uncheckAfterSend);
						  	formElementsModales['sending'] = false;
						  	generalLoadingIcon(form, false);

						  })
						  .fail(function( jqxhr, textStatus, error ) {
						  	Services.facturacion.descargarFacturasFailCallback(form, error);
						  	formElementsModales['sending'] = false;
						  	generalLoadingIcon(form, false);
						});

					}

				}
			});

			checkGeneralValidForm($form);
		}

		function uncheckAfterSend(){
			//Limpiar y y resetear cada acción
		  	$('.configuracion-descarga-facturas').find("input[type=checkbox]").prop("checked", false);
		  	$('.configuracion-descarga-facturas').find("input[type=checkbox]").trigger('change');
		  	$('#check-all-elements').data('value', false);
		  	$('#check-all-elements').trigger('click');
		}

		function removeGeneralError(){
			$('#modal-descargar .system-error-msg').remove();
			$('#modal-descargar .has-system-error').removeClass('has-system-error');
		}

		function resetMainForm(){
			$input.removeClass('error error-dd');
			$input.val(emailDefault);

			if(formElementsModales['validator']){
				formElementsModales['validator'].resetForm();
			}		
		}
	}

	function initFormGeneral(){
		var $form = $(formularioId),
		onlyAlias = $(formularioId).hasClass('only-alias'),
		facturasServicios = $form.hasClass('form-facturas-servicio'),
		facturasEquipos = $form.hasClass('form-facturas-equipo'),
		//facturasAlias = $form.find('#'),
		$btn = $('#btn-facturas-servicio, #btn-descargas, #btn-bitacora'),
		formAction = null,
		showPeriodoMeta = true,
		elementsForm = false,
		formMeta = {},
		// Liga a la que hace el POST!
		formActionPost= 'reportes-2.html',
		currentType = null;
		
		function updateBtn(){
			currentType = ingresarLineasComponent.getType();
			formAction = (currentType === '.componente-lineas-block .lineas-archivo' ? 'descarga' : formMeta.action );
			$btn.text( ( (is_mobile() || currentType === '.componente-lineas-block .lineas-archivo') && typeof formMeta.ctaMobile != 'undefined' ? formMeta.ctaMobile : formMeta.cta));
			$form.prop('action', (currentType === '.componente-lineas-block .lineas-archivo' ? 'null' : formMeta.post) );
			$btn.addClass(formAction);

			var blockAdmin = ($form.hasClass('reportes-block') ? (formAction=='descarga' ? true : false ) : ( facturasServicios ? ((formAction=='factura' && (typeof formMeta.periodo != 'undefined' && !formMeta.periodo)) ? true : false) : false) );

			if(is_admin_mode() && blockAdmin )
				$btn.addClass('disabled-admin-mode');
			else
				$btn.removeClass('disabled-admin-mode');

		}

		initActions();
		if($('#modal-descargar').length>0)
			initModalDescargarFacturas();
		setPreselectedData();

		function setPreselectedData(){
			//Preselect Alias
			var hash = window.location.hash;
			if(typeof hash != 'undefined'){
				hash = hash.replace('#','');
				if($("#alias option[value='"+hash+"']").length > 0){
					$('#alias').val(hash);

					$('#alias').trigger('change'); 
					//$('#btn-bitacora').prop('disabled', false);
				}
			}
		}

		function updateFormData(){
			formAction = formMeta.action;

			$btn.text( ( (is_mobile() || currentType === '.componente-lineas-block .lineas-archivo') && typeof formMeta.ctaMobile != 'undefined' ? formMeta.ctaMobile : formMeta.cta));
			$form.prop('action', formMeta.post);
			$btn.addClass(formAction);

			if(formAction == 'cuenta-hija' && !is_mobile())
				mostrarComponenteLineas(true);
			else
				mostrarComponenteLineas(false);

			var blockAdmin = ($form.hasClass('reportes-block') ? (formAction=='descarga' ? true : false ) : ( facturasServicios ? ((formAction=='factura' && (typeof formMeta.periodo != 'undefined' && !formMeta.periodo)) ? true : false) : false) );

			if(is_admin_mode() && blockAdmin )
				$btn.addClass('disabled-admin-mode');
			else
				$btn.removeClass('disabled-admin-mode');
			

		}

		function validateMainForm(){

			disableSumbitButton($form, true);

			elementsForm['validator'] = 
				$form.validate({
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
						
						if(elementInput['id']==='archivo' && $(elementInput).val() != ''){
							$('.lineas-archivo .extra-info').hide();
							error.appendTo( $('.lineas-archivo .add-lines-ge-mod' ));
							element.parent().addClass('error');
						}
					},
			   		onclick: false,
					success: function ($error) {
						if($error.length>0 && $(formularioId+' #archivo').val() != ''){
							$('.lineas-archivo .extra-info').hide();
							$('.lineas-archivo .file.error' ).removeClass('error');
			   				$error.remove();
						}

			        },
			        submitHandler: function(form) {

			        	var adminBlock = $btn.hasClass('disabled-admin-mode');

						if(!elementsForm['sending'] && !adminBlock){
							var form = formularioId;
							sendFormData(form);
				  		}
					}
						
				});	
		}

		function sendFormData(form){
			elementsForm = true;
			$(form).find('button[type="submit"]').prop('disabled', true);

			var self = $(form).serialize();
			
			var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
			
			/**Quitar una vez en producción**/
			var sendTo = urlPOST;

			urlPOST = checkDevelopmentPostHTML(urlPOST);

			$.post(  urlPOST , self )
			.done(function( data ) {
			  	Services.facturacion.facturacionFormCallSuccess(data, form, sendTo );
				elementsForm = false;

			 })
			.fail(function( jqxhr, textStatus, error ) {
			  	//Mensaje de error del sistema
			  	Services.facturacion.facturacionFormCallFail(error, form);
			  	elementsForm = false;
			});
		}

		function initActions(){

			if($form.hasClass('reportes-block'))
				$( window ).resize(function() {
					var changed = $form.find('.factura').val();
				  	if(changed)
				  		$form.find('.factura').trigger('change');
				});

			$('.select-change').change(function(){
				var $alias = $form.find('select.alias');
				var aliasValid = ($alias.length>0 ? validAlias() : true);


				if(onlyAlias)
					$btn.prop('disabled', !(aliasValid));
				else if(facturasEquipos)
					$btn.prop('disabled', !(validFormEquipo() && aliasValid));
				else
					$btn.prop('disabled', !(validForm() && aliasValid));

			});

			$form.find('.factura').change(function(){
				var $tipo = $(this);
				
				$btn.removeClass(formAction);

				formMeta = (typeof $tipo.find(':selected').data('meta') != 'undefined' ? $tipo.find(':selected').data('meta') : null );

				if(formMeta!=null){
					updateFormData();
				}
			});

			$form.on('click', 'button.descarga', function(e){
				e.preventDefault();
				if($(this).hasClass('disabled-admin-mode')){
					e.preventDefault();
					return false;
				}
				else{
					modalDescargarFacturas.openModal();
				}
				
			});

			$form.on('click', 'button.cuenta-hija', function(e){
				e.preventDefault();
				if(is_mobile())
					modalDescargarFacturas.openModal();
				else if(validateFormData() && validForm())
					$form.submit();
			});

			$form.on('click', 'button.factura', function(e){
				e.preventDefault();
				if(is_mobile())
					modalDescargarFacturas.openModal();
				else
					$form.submit();
			});

			$('#componente-ingresar-lineas .componente-btn-block').on('click', '.btn-al', function(){
				updateBtn();
			});

			$('#componente-ingresar-lineas .file').on('change', 'input[type="file"]', function(e){
				e.stopPropagation();
				//Simulador de loading
				generalFullLoadingIcon($('body'), true);

				setTimeout(function(){
					generalFullLoadingIcon($('body'), false);
				}, 2000);

				//fin simulador loading
			});

			validateMainForm();
		}


		function validFormEquipo(){

			var valid = false,
			$periodo = $form.find('.periodo');

			if($periodo.val() != '')
				valid = true;

			return valid;
		}

		function validAlias(){

			var valid = false,
			$alias = $form.find('.alias');
			
			if($alias.val()!= '')
				valid = true;

			return valid;
		}

		function validForm(){

			var valid = false,
			$periodo = $form.find('.periodo'),
			$tipo = $form.find('.factura'),
			$periodoContainer = $form.find('.periodo-input-block'),
			formMeta = (typeof $tipo.find(':selected').data('meta') != 'undefined' ? $tipo.find(':selected').data('meta') : null ),
			showPeriodoMeta = (formMeta != null && typeof formMeta.periodo != 'undefined' ? formMeta.periodo : true );
			showPeriodo = $tipo.val() != '' && showPeriodoMeta;
			
			//Aquí el valor de la opción de facturas pendientes es 3
			if(showPeriodo)
				$periodoContainer.removeClass('hidden');
			else
				$periodoContainer.addClass('hidden');

			if((showPeriodo && $periodo.val() != '') || (!showPeriodo) && $tipo.val()!='')
				valid = true;

			return valid;
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

			if(lineasValid)
				return true;

			
			return false;
		}

		function mostrarComponenteLineas(flag){

			if(flag){
				$('#componente-ingresar-lineas').parent().removeClass('hidden');
				$btn.hide();
			}
			else{
				$('#componente-ingresar-lineas').parent().addClass('hidden');
				$btn.show();
			}

			ingresarLineasComponent.reset();
			
		}
	}

	function initListadoDescargaFacturas(){

		var $listaFacturas =  $('#listado-facturas');
		generarListadoConfirmacionInicial();
		initActions();

		initModalDescargarFacturas();

		// SIMULAR ERROR
		var hash = window.location.hash;

		if(hash=='#sin-resultados'){
			$('#sin-resultados').removeClass('hidden');
			$('#listado-check-all-container').addClass('hidden');
			$('#gestion-ejecutivos-view').addClass('hidden');
		}
		//FIN SIMULAR ERROR

		var modalGenerarReferencia = null;
		var _modalGenerarReferencia = {id : null, referencia : null};
		initModalGenerarReferencia();

		function initModalGenerarReferencia(){
			var formModal = { sendind: false };

			modalGenerarReferencia = new modalesTelcel($('#modal-generar-referencia'),{
				onInit : function(){
				},
				onReset : function(){
					//resetModal()
				},
				onOpen : function(){
					$('#modal-generar-referencia .heading-mod .title-mod p').html('Referencia única generada');
					generarReferencia();
				}
			});

			function generarReferencia(){

				var data = { success: false, data: [] };

				var container = '#modal-generar-referencia .in-cont-mod';

				if(!formModal['sending']){

					formModal['sending'] = true;
					generalLoadingIcon(container, true);

					var urlPOST = Services.apiURL.generarReferenciaUnica();
				
					$.post( urlPOST , { data: JSON.stringify(_modalGenerarReferencia) })
					  .done(function( json ) {

					  	Services.facturacion.generarReferenciaUnicaSuccessCallback(json, container, _modalGenerarReferencia, updateDom);
					  	formModal['sending'] = false;
					  	generalLoadingIcon(container, false);

					  })
					  .fail(function( jqxhr, textStatus, error ) {
					  	Services.facturacion.generarReferenciaUnicaFailResponse(error, form);
					  	formModal['sending'] = false;
					  	generalLoadingIcon(container, false);
					});
				}
			}

			function updateDom(){
				$('#modal-generar-referencia .form-ge-mod.error-ge').addClass('hidden');
				$('#modal-generar-referencia #form-generar-referencia').removeClass('hidden');
				$('.referencia-unica-block.ru-'+_modalGenerarReferencia.id+' p').html(_modalGenerarReferencia.referencia).removeClass('generar');
			}

		}

		function initActions(){

			generalCheckBoxAll.inicializar();

			$('.configuracion-descarga-facturas').on('click', '.btn-open-general-config', function(e){
				e.stopPropagation();
				var $settings = $(this).parent().parent().find('.settings-ri');
				$settings.addClass('active');
				$('body').addClass('settings-open');
			});

			$('.configuracion-descarga-facturas').on('click', '.btn-close-general-config', function(e){
				e.stopPropagation();
				var $settings = $(this).parent().parent().parent('.settings-ri');
				$settings.removeClass('active');
				$('body').removeClass('settings-open');
			});

			$('.configuracion-descarga-facturas').on('click', '.btn-send-estados', function(){
				modalDescargarFacturas.openModal();
			});

			$('.configuracion-descarga-facturas .settings-ri').on('change', 'input[type=checkbox]', function(){
				checkSettingsDownload();
			});

			$('#btn-download-facturas').click(function(){
				checkedElements = generalCheckBoxAll.getCheckedElements();
				$('.configuracion-descarga-facturas .btn-close-general-config').trigger("click");
				modalDescargarFacturas.openModal();
			});

			$('.linea-batch').on('click','.btn-mobile button', function(){
				var $button = $(this),
				$parent = $button.parent().parent('.linea-batch'),
				hasClass = $parent.hasClass('ver-mas');

				$('.linea-batch').removeClass('ver-mas');
				$('.linea-batch .btn-mobile button').html('Ver más');

				if(hasClass){
					$button.html('Ver más');
					$parent.removeClass('ver-mas');
				}
				else{
					$button.html('Ver menos');
					$parent.addClass('ver-mas');
				}
			});

			/**
				Mostrar/Ocultar tablas
			**/
			// $('.facturacion-block').on('click', '.hide-show-filter', function(e){
			// 	var filter = ( typeof $(this).data('filter') != 'undefined' ? $(this).data('filter') : null );

			// 	if(filter!=null){
			// 		var text = $(this).text();
			// 		var newtext = (text == "Mostrar filtrado" ? "Ocultar filtrado" : "Mostrar filtrado");
	    			
	  //   			$(this).text( newtext );
					
	  //   			$(filter).toggleClass( 'visible' );
			// 	}
			// });

			$('.facturacion-block').on('click', '.btn-generar-referencia', function(e){
				var id = ( typeof $(this).data('id') != 'undefined' ? $(this).data('id') : null );

				if(id!=null){
					_modalGenerarReferencia.id = id;
					modalGenerarReferencia.openModal();
				}
			});

			$('body').on('click', '.settings-ri', function(e){			
				if(is_mobile()){
					e.stopPropagation();
					$('.general-group-options-container').removeClass('active');
					$('.group-block').removeClass('active');
					$('.row-ls').removeClass('active-settings');
					$('.settings-ri').removeClass('active');
				}
			});

			$('body').on('click', '.settings-ri .cont-set-ri', function(e){
				e.stopPropagation();
			});

			
		}

		function checkSettingsDownload(){
			var $zip = $('#check-zip').is(":checked"),
			$xls = $('#check-xls').is(":checked"),
			disabled = true;

			if($zip || $xls)
				disabled = false;

			$('#btn-download-facturas').prop('disabled', disabled);
		}

		function generarListadoConfirmacionInicial(){

			var $elements = $listaFacturas.find('.linea-batch');
			var total = $elements.length;

			$elements.each(function (index, value) { 
			  var meta = ( typeof $(this).data('meta') != 'undefined' ? $(this).data('meta') : null );
			  var $element = $(this);

				if(meta != null){
					var elemento = ($listaFacturas.hasClass('facturas-equipos') ?  generarHTMLFacturacionEquipos(meta, index) : ($listaFacturas.hasClass('referencia-unica') ? generarHTMLReferenciaUnica(meta, index) : ($listaFacturas.hasClass('pendientes-pago') ? generarHTMLPendientesPago(meta, index) : ($listaFacturas.hasClass('solicitud-descargas') ? generarHTMLSolicitudDescargas(meta, index) :generarHTMLFacturacion(meta, index) ) ) ) );
					$element.html(elemento);
					// dataListadoCuentasAsociadas.push(meta);

					// bindElementActions();

				}
			});
		}

		function generarHTMLFacturacion(meta, index){
			var html = '';

			html = '<div class="col-sm-pr-100 col-xs-12 content-item-block"> <div class="col-sm-pr-5 col-xs-2 checkbox-container flexbox h-align-center"> <input type="checkbox" id="i-'+meta.id+'" name="i-'+meta.id+'" value="'+meta.id+'" data-index="0"> <label for="i-'+meta.id+'"><span class="check-sq"></span> </label> </div> <div class="col-sm-pr-95 col-xs-12 flexbox h-align-center main-content-block"> <div class="col-sm-pr-10 col-xs-12"> <p class="mobile-only hidden-sm hidden-md hidden-lg">Región:</p> <p title="'+meta.region+'">'+meta.region+'</p> </div> <div class="col-sm-pr-20 col-xs-12 flexbox cuenta-container"> <p class="mobile-only hidden-sm hidden-md hidden-lg">Cuenta:</p> <p class="flexbox v-align-center"><span class="icon '+(meta.tipo == 1 ? 'io-City' : 'io-simple-avatar')+'" title="'+(meta.tipo == 1 ? 'Cuenta padre' : 'Cuenta hija')+'"></span><span title="'+meta.cuenta+'">'+meta.cuenta+'</span> </p> </div> <div class="'+(CFDI ? 'col-sm-pr-20' : 'col-sm-pr-25')+' col-xs-12"> <p class="mobile-only hidden-sm hidden-md hidden-lg">RFC:</p> <p title="'+meta.rfc+'">'+meta.rfc+'</p> </div> <div class="'+(CFDI ? 'col-sm-pr-15' : 'col-sm-pr-30')+' col-xs-12 hidden-data"> <p class="mobile-only hidden-sm hidden-md hidden-lg">Razón social:</p> <p title="'+meta.razonsocial+'">'+meta.razonsocial+'</p> </div> <div class="col-sm-pr-15 col-xs-12 hidden-data"> <p class="mobile-only hidden-sm hidden-md hidden-lg">Fecha de corte:</p> <p title="'+meta.fecha+'">'+meta.fecha+'</p> </div>'+(CFDI ? '<div class="col-sm-pr-20 col-xs-12 hidden-data"> <p class="mobile-only hidden-sm hidden-md hidden-lg">Factura:</p> <p title="'+meta.factura+'">'+meta.factura+'</p> </div>' : '' )+'</div> </div> <div class="btn-mobile col-xs-12 hidden-sm hidden-md hidden-lg"> <button class="bton full-width" title="Ver más">Ver más</button> </div>';

			return html;

		}

		function generarHTMLPendientesPago(meta, index){

			var html = '';

			html = '<div class="col-sm-12 col-xs-12 content-item-block"> <div class="col-sm-pr-5 col-xs-2 checkbox-container flexbox h-align-center"> <input type="checkbox" id="i-'+meta.id+'" name="i-'+meta.id+'" value="'+meta.id+'" data-index="0"> <label for="i-'+meta.id+'"><span class="check-sq"></span> </label> </div> <div class="col-sm-pr-95 col-xs-10 flexbox h-align-center main-content-block"> <div class="col-sm-pr-10 col-xs-12"> <p class="mobile-only hidden-sm hidden-md hidden-lg">Region:</p> <p title="'+meta.region+'">'+meta.region+'</p> </div> <div class="col-sm-pr-20 col-xs-12 flexbox cuenta-container"> <p class="mobile-only hidden-sm hidden-md hidden-lg">Cuenta:</p> <p class="flexbox v-align-center"><span class="icon '+(meta.tipo == 1 ? 'io-City' : 'io-simple-avatar')+'" title="'+(meta.tipo == 1 ? 'Cuenta padre' : 'Cuenta hija')+'"></span><span title="'+meta.cuenta+'">'+meta.cuenta+'</span> </p> </div> <div class="col-sm-pr-10 col-xs-12"> <p class="mobile-only hidden-sm hidden-md hidden-lg">RFC:</p> <p title="'+meta.rfc+'">'+meta.rfc+'</p> </div> <div class="col-sm-pr-15 col-xs-12 hidden-data"> <p class="mobile-only hidden-sm hidden-md hidden-lg">Razón social:</p> <p title="'+meta.razonsocial+'">'+meta.razonsocial+'</p> </div> <div class="col-sm-pr-15 col-xs-12 hidden-data"> <p class="mobile-only hidden-sm hidden-md hidden-lg">Fecha de corte:</p> <p title="'+meta.fecha+'">'+meta.fecha+'</p> </div> <div class="col-sm-pr-15 col-xs-12 hidden-data"> <p class="mobile-only hidden-sm hidden-md hidden-lg">Factura:</p> <p title "'+meta.factura+'">'+meta.factura+'</p> </div> <div class="col-sm-pr-15 col-xs-12 hidden-data"> <p class="mobile-only hidden-sm hidden-md hidden-lg">Total:</p> <p title="$'+Number(meta.total).toFixed(2)+'">$'+Number(meta.total).toFixed(2)+'</p> </div> </div> </div> <div class="btn-mobile col-xs-12 hidden-sm hidden-md hidden-lg"> <button class="bton full-width" title="Ver más">Ver más</button> </div>';

			return html;

		}

		function generarHTMLFacturacionEquipos(meta, index){

			var html = '';

			html = '<div class="col-sm-pr-100 col-xs-12 content-item-block"> <div class="col-sm-pr-5 col-xs-2 checkbox-container flexbox h-align-center"> <input type="checkbox" id="i-'+meta.id+'" name="i-'+meta.id+'" value="'+meta.id+'" data-index="0"> <label for="i-'+meta.id+'"><span class="check-sq"></span> </label> </div> <div class="col-sm-pr-95 col-xs-10 flexbox h-align-center main-content-block"> <div class="col-sm-pr-20 col-xs-12 order-flexbox order-flexbox-1"> <p class="mobile-only hidden-sm hidden-md hidden-lg">RFC:</p> <p title="'+meta.rfc+'">'+meta.rfc+'</p> </div> <div class="col-sm-pr-25 col-xs-12 order-flexbox order-flexbox-2"> <p class="mobile-only hidden-sm hidden-md hidden-lg">Razón social:</p> <p title="'+meta.razonsocial+'">'+meta.razonsocial+'</p> </div> <div class="col-sm-pr-15 col-xs-12 order-flexbox order-flexbox-3"> <p class="mobile-only hidden-sm hidden-md hidden-lg">Fecha de emisión:</p> <p title="'+meta.fecha+'">'+meta.fecha+'</p> </div> <div class="col-sm-pr-20 col-xs-12 hidden-data order-flexbox order-flexbox-4"> <p class="mobile-only hidden-sm hidden-md hidden-lg">No. de documento:</p> <p title="'+meta.documento+'">'+meta.documento+'</p> </div> <div class="col-sm-pr-20 col-xs-12 hidden-data order-flexbox order-flexbox-5"> <p class="mobile-only hidden-sm hidden-md hidden-lg">Tipo de documento:</p> <p title="'+meta.tipo+'">'+meta.tipo+'</p> </div> </div> </div> <div class="btn-mobile col-xs-12 hidden-sm hidden-md hidden-lg"> <button class="bton full-width" title="Ver más">Ver más</button> </div>';

			return html;

		}

		function generarHTMLReferenciaUnica(meta, index){

			var html = '';

			html = '<div class="col-sm-12 col-xs-12 content-item-block"> <div class="col-sm-pr-100 col-xs-12 flexbox h-align-center main-content-block"> <div class="col-sm-pr-20 col-xs-12 flexbox order-flexbox order-flexbox-1"> <p class="mobile-only hidden-sm hidden-md hidden-lg">RFC:</p> <p title="'+meta.rfc+'">'+meta.rfc+'</p> </div> <div class="col-sm-pr-25 col-xs-12 order-flexbox order-flexbox-2"> <p class="mobile-only hidden-sm hidden-md hidden-lg">Razón social:</p> <p title="'+meta.razonsocial+'">'+meta.razonsocial+'</p> </div> <div class="col-sm-pr-20 col-xs-12 order-flexbox order-flexbox-3"> <p class="mobile-only hidden-sm hidden-md hidden-lg">Documento:</p> <p title="'+meta.documento+'">'+meta.documento+'</p> </div> <div class="col-sm-pr-15 col-xs-12 order-flexbox order-flexbox-4"> <p class="mobile-only hidden-sm hidden-md hidden-lg">Total:</p> <p title="$'+Number(meta.total).toFixed(2)+'">$'+Number(meta.total).toFixed(2)+'</p> </div> <div class="col-sm-pr-30 col-xs-12 referencia-unica-block ru-'+meta.id+' order-flexbox order-flexbox-5"> <p class="col-xs-12 '+(meta.referencia === 'Cancelada' ? 'cancelado' :'' )+'">'+(meta.referencia==='Generar' ? '<span class="btn-generar-referencia'+(is_admin_mode() ? ' disabled-admin-mode' : '')+'" data-id="'+meta.id+'">'+meta.referencia+'</span>' : meta.referencia)+'</p> </div> </div> </div>';
			return html;

		}

		function generarHTMLSolicitudDescargas(meta, index){
			var html = '';
			html = '<div class="col-sm-12 col-xs-12 content-item-block padding-0" data-index="'+index+'"><div class="col-sm-pr-100 col-xs-12 flexbox h-align-center main-content-block"><div class="col-sm-pr-35 col-xs-12 flexbox h-align-center"><p class="mobile-only hidden-sm hidden-md hidden-lg">Tipo:</p><p title="'+meta.tipo+'">'+meta.tipo+'</p></div>'; 

			html+='<div class="col-sm-pr-20 col-xs-12 flexbox h-align-center"><p class="mobile-only hidden-sm hidden-md hidden-lg">Solicitud:</p><p title="'+meta.solicitud+'">'+meta.solicitud+'</p></div><div class="col-sm-pr-20 col-xs-12"><p class="mobile-only hidden-sm hidden-md hidden-lg">Expiración:</p><p title="'+meta.expiracion+'">'+meta.expiracion+'</p></div><div class="col-sm-pr-15 col-xs-12 flexbox"><p class="mobile-only hidden-sm hidden-md hidden-lg">Estatus:</p><p title="'+meta.estatus+'">'+meta.estatus+'</p></div><div class="col-sm-pr-10 col-xs-12 estatus-block">'+(!meta.descarga ? ( meta.formato != null ? '<p><span class="cancelado">'+meta.formato+'</span></p>' : '<div class="en-proceso flexbox h-align-center"><div class="sk-circle"> <div class="sk-circle1 sk-child"></div> <div class="sk-circle2 sk-child"></div> <div class="sk-circle3 sk-child"></div> <div class="sk-circle4 sk-child"></div> <div class="sk-circle5 sk-child"></div> <div class="sk-circle6 sk-child"></div> <div class="sk-circle7 sk-child"></div> <div class="sk-circle8 sk-child"></div> <div class="sk-circle9 sk-child"></div> <div class="sk-circle10 sk-child"></div> <div class="sk-circle11 sk-child"></div> <div class="sk-circle12 sk-child"></div> </div></div>' ) : '<p><a href="'+meta.descarga_l+'">'+meta.formato+'</a></p>' ) +'</div></div></div>';

			return html;

		}
	}

	function initConfirmarAutogestion() {
		initActions();
		initModalDescargarFacturas();

		function initActions(){
			$('#generar-btn').on('click', function(e){
				modalDescargarFacturas.openModal();
			});
		}
	}

	function initHomeFacturacion(){
		initActions();

		function initActions(){
			$('#accesos-rapidos').change(function(){
				if($('#accesos-rapidos').val()!='')
					$('#btn-mobile-accesos').prop('disabled', false);
				else
					$('#btn-mobile-accesos').prop('disabled', true);

			});

			$('#btn-mobile-accesos').click(function(){
				var url = $('#accesos-rapidos').val();

				if(url!='')
					window.location.href=url;
			});
		}
	}

	return{
		inicializar : function(){
			//generarListadoConfirmacionInicial();
			formularioId = $('#form-alias-movimientos').length>0  ? '#form-alias-movimientos' : '#form-facturas';

			if($(formularioId).length>0)
				initFormGeneral();

			if($('#listado-facturas').length>0)
				initListadoDescargaFacturas();

			if($('.autogestion-facturacion-block #listado-confirmacion-autogestion').length>0)
				initConfirmarAutogestion();

			if($('.facturacion-home-container').length>0)
				initHomeFacturacion();
		}
	}
})();