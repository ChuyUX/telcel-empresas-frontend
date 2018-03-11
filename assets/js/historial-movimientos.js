var historialMovimientos = (function(){

	var formElementsModales = {  
		'descargarFacturas': {id: null, validator: null, sending: false } 
	};

	var modalDescargarFacturas = null;	

	if($('.historial-movimientos-block #modal-descargar').length>0)
		initModalDescargarFacturas();

	var _modalDescargarFacturas = {
		data : [],
		allChecked : false
	};

	function init(){

		setActionsGenerales();
		initConfigurarMovimientos();
		
		if($('#form-alias-movimientos').length>0)
			initFormMovimientos();

			
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
						  	Services.historial.descargarFacturasSuccessCallback(json, form, { element : $titleP, text : titleAfter } );
						  	formElementsModales['descargarFacturas']['sending'] = false;
						  	generalLoadingIcon(form, false);

						  })
						  .fail(function( jqxhr, textStatus, error ) {
						  	Services.historial.descargarFacturasFailCallback(form, error);
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
	function initFormMovimientos(){
		console.log('form movimientos');
		var $generalForm = $('#form-alias-movimientos');
		initActions();
		setPreselectedData();

		function setPreselectedData(){
			//Preselect Alias
			var hash = window.location.hash;
			if(typeof hash != 'undefined'){
				hash = hash.replace('#','');
				if($("#alias option[value='"+hash+"']").length > 0){
					$('#alias').val(hash);
					//$('#btn-bitacora, #btn-cuentas, #btn-descargas').prop('disabled', false);
				}
			}
		}

		

		function initActions(){
			/**
				Cambiar Select
			**/
			$generalForm.on('change', '#alias', function(){
				var $select = $(this);
				if($select.val()!= "")
					$('#btn-bitacora, #btn-cuentas, #btn-descargas').prop('disabled', false);
				else
					$('#btn-bitacora, #btn-cuentas, #btn-descargas').prop('disabled', true);

			});

			validateForm();
		}

		function validateForm(){
			$generalForm.validate({
			  rules: {
				alias: {
					required: true
				}

			  },
			  messages: {
				 alias: {
					required: "Selecciona un alias."
				}

			   },
			   errorClass : "error-dd error",
			   errorPlacement: function(error, $element) {
				   	var $parent = $element.parent('.general-number-container');
				   	$parent.append(error);
				}
			});
		}
	}


	function initConfigurarMovimientos(){

		var $listaMovimientos = $('#movimientos-table .table-main-block'),
		$buscadorBasico = $('#search-basico'),
		$buscadorAvanzado = $('#search-avanzado'),
		$buscadorContainer = $('#search-movimientos-container'),
		$filtrado = $('.filter-movimientos-container'),
		listaSinResponsable = $listaMovimientos.hasClass('sin-responsable'),
		buscadorBasicoValid = false,
		buscadorAvanzadoValid = false,
		filtradoValid = false,
		dataListadoMovimientos = [],
		dataSearchBasico = {'fechaInicial' : '', 'fechaFinal' : '', 'estado' : ''},
		dataSearchAvanzado = {'fechaInicial' : '', 'fechaFinal' : '', 'asignado' : '', 'operacion' : '', 'movimiento' : '', 'estado' : ''},
		dataFiltrado = {'numero' : '', 'nombre' : '', 'estado' : ''};


		setActions();
		simularCasos();
		generarListadoConfirmacionInicial();

		function simularCasos(){
			// SIMULAR ERROR
			var hash = window.location.hash;

			if(hash=='#sin-resultados'){
				$('#sin-resultados').removeClass('hidden');
				var $headerMsg = $('.header-info-movimientos #msg-movimientos');
				$headerMsg.html('No se encontraron movimientos en el rango de fechas seleccionado.');

				var searchData = {
					init : new Date(2015,12,14),
					fin : new Date(2015,12,27),
					estatus : ''
				};

				preSelectDataBuscadorBasico(searchData);

				$('#sin-resultados .inner-nb p').html('No existen movimientos realizados en el rango de fechas seleccionado.');
				$('#gestion-ejecutivos-view').addClass('hidden');
			}

			if(hash=='#sin-resultados-periodo'){
				$('#sin-resultados').removeClass('hidden');
				var $headerMsg = $('.header-info-movimientos #msg-movimientos');
				$headerMsg.html('No se encontraron movimientos en el rango de fechas seleccionado.');

				var searchData = {
					init : new Date(2015,12,14),
					fin : new Date(2015,12,27),
					estatus : ''
				};

				preSelectDataBuscadorBasico(searchData);

				$('#btn-limpiar-busqueda').removeClass('hidden');
				$('#sin-resultados .inner-nb p').html('No se encontraron movimientos para el criterio de búsqueda seleccionado. Modifica tus cristeros de búsqueda.');
				$('#gestion-ejecutivos-view').addClass('hidden');
			}

			if(hash=='#sin-resultados-busqueda'){
				$('#sin-resultados').removeClass('hidden');
				var $headerMsg = $('.header-info-movimientos #msg-movimientos');
				$headerMsg.html('No se encontraron movimientos en el rango de fechas seleccionado.');

				var searchData = {
					init : new Date(2015,12,14),
					fin : new Date(2015,12,27),
					estatus : ''
				};

				preSelectDataBuscadorBasico(searchData);

				$('#btn-periodo-anterior').removeClass('hidden');
				$('#sin-resultados .inner-nb p').html('No se encontraron movimientos para el criterio de búsqueda seleccionado, te sugerimos consultar el periodo anterior o incluir un criterio más general.');
				$('#gestion-ejecutivos-view').addClass('hidden');


			}

			if(hash=='#error-busqueda'){
				$('#error-busqueda').removeClass('hidden');
				var $headerMsg = $('.header-info-movimientos #msg-movimientos');
				$('#gestion-ejecutivos-view').addClass('hidden');

				var searchData = {
					init : new Date(2015,12,14),
					fin : new Date(2015,12,27),
					estatus : ''
				};

				preSelectDataBuscadorBasico(searchData);
				
				$headerMsg.html('No se encontraron movimientos en el rango de fechas seleccionado.');
			}

			if(hash=='#con-busqueda-avanzada'){
				var $headerMsg = $('.header-info-movimientos #msg-movimientos'),
				$limpiar = $('.btn-limpiar-busqueda');

				var searchData = {
					init : new Date(2015,12,14),
					fin : new Date(2015,12,27),
					asignado : '',
					operacion : '01293810923',
					estatus : ['completado', 'rechazado', 'en-proceso'],
					movimiento : ['crear-grupo', 'actualizar-grupo', 'eliminar-grupo']
				};

				$headerMsg.html('Movimientos realizados en el periodo del <strong>20-02-2017</strong> al <strong>28-02-2017</strong>, con estatus <strong>completado, rechazado y en proceso</strong> del tipo de movimiento <strong>crear grupo, actualizar grupo y eliminar grupo</strong>.');

				preSelectDataBuscadorAvanzado(searchData);
			}

			if(hash=='#con-busqueda-basica'){
				var $headerMsg = $('.header-info-movimientos #msg-movimientos'),
				$limpiar = $('.btn-limpiar-busqueda');

				var searchData = {
					init : new Date(2015,12,14),
					fin : new Date(2015,12,27),
					estatus : 'todos'
				};

				$headerMsg.html('Movimientos realizados en el periodo del <strong>20-02-2017</strong> al <strong>28-02-2017</strong>, con estatus <strong>completado, rechazado y en proceso</strong>.');

				preSelectDataBuscadorBasico(searchData);
			}

			if(hash == '#filtrado'){
				$('.filter-movimientos-container').addClass('filtrado');
			}

		}

		function preSelectDataBuscadorAvanzado(data){

			$buscadorContainer.addClass('busqueda-avanzada');
			$buscadorContainer.find('#btn-limpiar-busqueda-avanzada').prop('disabled', false);
			$buscadorAvanzado.find('#btn-search-movimientos-avanzado').prop('disabled', false);
			
			$buscadorAvanzado.find('.date-picker.fin').removeClass('disabled');

			$buscadorAvanzado.find('.fecha-init').html(data.init.getFullYear() + '-' +( (data.init.getMonth() + 1) <10 ? '0'+ (data.init.getMonth() + 1) : (data.init.getMonth() + 1)) + '-' + ( data.init.getDate() <10 ? '0'+ data.init.getDate() : data.init.getDate()));

			$buscadorAvanzado.find('.fecha-fin').html(data.fin.getFullYear() + '-' +( (data.fin.getMonth() + 1) <10 ? '0'+ (data.fin.getMonth() + 1) : (data.fin.getMonth() + 1)) + '-' + ( data.fin.getDate() <10 ? '0'+ data.fin.getDate() : data.fin.getDate()));
			
			$buscadorAvanzado.find('.calendar.init').datepicker("setDate", data.init );
			$buscadorAvanzado.find('.calendar.fin').datepicker("setDate", data.fin );

			if(typeof data.estatus!= 'undefined'){
				$.each(data.estatus, function (index, data) {
					$('#'+data).prop('checked', true);
				});

				var all = $buscadorContainer.find('input.estatus').length == $buscadorContainer.find('input.estatus:checked').length;
				if(all)
					checkAllElementsSelected($buscadorContainer.find('#todos-estatus'));
			}

			if(typeof data.movimiento!= 'undefined'){
				$.each(data.movimiento, function (index, data) {
					$('#'+data).prop('checked', true);
				});

				var all = $buscadorContainer.find('input.movimiento').length == $buscadorContainer.find('input.movimiento:checked').length;
				if(all)
					checkAllElementsSelected($buscadorContainer.find('#todos-movimiento'));
			}

			$buscadorAvanzado.find('.operacion').val( data.operacion );
			
		}

		function preSelectDataBuscadorBasico(data){

			$buscadorContainer.find('.btn-limpiar-busqueda').prop('disabled', false);
			$buscadorBasico.find('#btn-search-movimientos').prop('disabled', false);
			
			$buscadorBasico.find('.date-picker.fin').removeClass('disabled');

			$buscadorBasico.find('.fecha-init').html(data.init.getFullYear() + '-' +( (data.init.getMonth() + 1) <10 ? '0'+ (data.init.getMonth() + 1) : (data.init.getMonth() + 1)) + '-' + ( data.init.getDate() <10 ? '0'+ data.init.getDate() : data.init.getDate()));

			$buscadorBasico.find('.fecha-fin').html(data.fin.getFullYear() + '-' +( (data.fin.getMonth() + 1) <10 ? '0'+ (data.fin.getMonth() + 1) : (data.fin.getMonth() + 1)) + '-' + ( data.fin.getDate() <10 ? '0'+ data.fin.getDate() : data.fin.getDate()));
			
			$buscadorBasico.find('.calendar.init').datepicker("setDate", data.init );
			$buscadorBasico.find('.calendar.fin').datepicker("setDate", data.fin );

			$buscadorBasico.find('.estatus').val(data.estatus);
			
		}

		function updateBuscadorBasico(){
			buscadorBasicoValid = true;

			var	$fechainit = $buscadorBasico.find('.fecha-init'),
				$fechafin = $buscadorBasico.find('.fecha-fin'),
				$estatus = $buscadorBasico.find('.estatus').find(':selected');

			dataSearchBasico = {'fechaInicial' : $fechainit.html(), 'fechaFinal' : $fechafin.html() , 'estado' : $estatus.val()};

			if(dataSearchBasico.fechaInicial == '')
				buscadorBasicoValid = false;

			if(dataSearchBasico.fechaFinal == '')
				buscadorBasicoValid = false;

			$('#btn-search-movimientos').prop('disabled', !buscadorBasicoValid);
		}

		function updateBuscadorAvanzado(){

			buscadorAvanzadoValid = true;

			var	$fechainit = $buscadorAvanzado.find('.fecha-init'),
				$fechafin = $buscadorAvanzado.find('.fecha-fin'),
				$estatus = $buscadorAvanzado.find('.estatus:checked'),
				$movimiento = $buscadorAvanzado.find('.movimiento:checked'),
				$asignado = $buscadorAvanzado.find('.asignado'),
				$operacion = $buscadorAvanzado.find('.operacion');


			var estatusValues = $estatus.map(function() {
			    return this.value;
			}).get();

			var movimientoValues = $movimiento.map(function() {
			    return this.value;
			}).get();

			dataSearchAvanzado = {'fechaInicial' : $fechainit.html(), 'fechaFinal' : $fechafin.html() , 'asignado' : $asignado.val() , 'operacion' : $operacion.val(), 'movimiento' : (movimientoValues.length>0 ? movimientoValues.join(',') : ''), 'estado' : (estatusValues.length>0 ? estatusValues.join(',') : '')};


			if(dataSearchAvanzado.fechaInicial == '')
				buscadorAvanzadoValid = false;

			if(dataSearchAvanzado.fechaFinal == '')
				buscadorAvanzadoValid = false;

			$('#btn-search-movimientos-avanzado').prop('disabled', !buscadorAvanzadoValid);
			$('#btn-limpiar-busqueda-avanzada').prop('disabled', !buscadorAvanzadoValid);
		}


		function updateFiltrado(){
			filtradoValid = false;

			var	$numero = $filtrado.find('.numero'),
				$nombre = $filtrado.find('.nombre'),
				$estatus = $filtrado.find('.estatus').find(':selected');

			dataFiltrado = {'numero' : $numero.val(), 'nombre' : $nombre.val() , 'estado' : $estatus.val()};

			if(dataFiltrado.numero != '' || dataFiltrado.nombre != '' || dataFiltrado.estado != ''){
				$('.filter-movimientos-container').addClass('filtrado');
				filtradoValid = true;
			}
			else
				$('.filter-movimientos-container').removeClass('filtrado');



			$('#btn-filtrar-movimientos').prop('disabled', !filtradoValid);
		}

		function resetBuscadorBasico(){
			buscadorBasicoValid = false;

			var	$fechainit = $buscadorBasico.find('.fecha-init'),
				$fechafin = $buscadorBasico.find('.fecha-fin'),
				$estatus = $buscadorBasico.find('.estatus');

			dataSearchBasico = {'fechaInicial' : '', 'fechaFinal' :'' , 'estado' : ''};

			$fechainit.html('');
			$fechafin.html('');
			$estatus.val('');

			$('#btn-search-movimientos').prop('disabled', !buscadorBasicoValid);
		}

		function resetBuscadorAvanzado(){

			buscadorAvanzadoValid = false;

			var	$fechainit = $buscadorAvanzado.find('.fecha-init'),
				$fechafin = $buscadorAvanzado.find('.fecha-fin'),
				$estatus = $buscadorAvanzado.find('.estatus'),
				$movimiento = $buscadorAvanzado.find('.movimiento'),
				$asignado = $buscadorAvanzado.find('.asignado'),
				$operacion = $buscadorAvanzado.find('.operacion');

			dataSearchAvanzado = {'fechaInicial' : '', 'fechaFinal' : '' , 'asignado' : '' , 'operacion' : '', 'movimiento' : '', 'estado' : ''};


			$fechainit.html('');
			$fechafin.html('');
			$estatus.prop('checked', false);
			$movimiento.prop('checked', false);
			$operacion.val('');
			$asignado.val('');

			$('#btn-search-movimientos-avanzado').prop('disabled', !buscadorAvanzadoValid);
		}

		function checkAllElementsSelected($checkbox){
			var elemento = ($checkbox.hasClass('movimiento') ? 'movimiento' : 'estatus'),
			$select = $('#todos-'+elemento),
			value = false;

			if($select.length>0){
				value = ( $('input[type="checkbox"].'+elemento).length == $('input[type="checkbox"].'+elemento+':checked').length ? true : false );

				$select.data('value', !value);
				$select.html((value==true ? '(Deseleccionar todos)' : '(Seleccionar todos)'));
			}

		}

		function setActions(){

			/**
				Ordenar elementos de listado de líneas 
			**/
			// $('.has-filters .order-by-query').on('click', 'button', function(e){
			// 	var opciones = ( typeof $(this).data('opc') != 'undefined' ? $(this).data('opc') : null );
			// 	var parent_id = $(this).closest('.has-filters').attr('id');

			// 	if(opciones!=null){
			// 		orderItemsQuery(opciones, parent_id);
			// 	}
			// });


			/**Mostrar más información**/
			$('#movimientos-table .linea-batch').on('click', '.btn-ver-mas', function(){
				var $button = $(this);
				var $container = $button.parent().closest('.linea-batch');
				var $span = $button.find('.icon');

				if(is_mobile() && !$span.hasClass('i-angle-up')){
					var $abiertos = $('#listado-movimientos .linea-batch.show-info');
					$abiertos.find('.i-angle-up').removeClass('i-angle-up');
					$abiertos.removeClass('show-info');
				}

				$container.toggleClass('show-info');
				$span.toggleClass('i-angle-up');	
			});

			$("#search-movimientos-container").on('click', '.vista-busqueda', function(e){
				// //resetBuscadorBasico();
				// //resetBuscadorAvanzado();
				// range = { 'init' : null, 'fin' : null };
				// $( '.calendar.fin' ).parents('.date-picker').addClass('disabled');

				$buscadorContainer.toggleClass('busqueda-avanzada');

			});

			/**Buscador básico select estado**/
			$buscadorAvanzado.on('change', '.movimiento', function(){
				var $checkbox = $(this);
				checkAllElementsSelected($checkbox);
			});

			$buscadorAvanzado.on('change', '.estatus', function(e){

				var $checkbox = $(this);
				var $checkboxesChecked = $buscadorAvanzado.find('.estatus:checked');

				checkAllElementsSelected($checkbox);

				if(typeof e.originalEvent != 'undefined'){
					var $select = $buscadorBasico.find('.estatus-basico');

					var checked = ($checkboxesChecked.length==3 ? 'todos' : $checkboxesChecked.val());

					if(($checkboxesChecked.length==1 || $checkboxesChecked.length==3)){
						if($select.find('option[value='+checked+']').length > 0)
							$select.val(checked);
					}
					else{
						$select.find('option:selected').prop('selected', false);
					}
				}
			});

			$buscadorAvanzado.on('click', '#todos-estatus', function(){
				var $select = $(this),
				value = ( typeof $(this).data('value') != 'undefined' ? $(this).data('value') : false );			
				
				$select.data('value', !value);
				$select.html((value==true ? '(Deseleccionar todos)' : '(Seleccionar todos)'));

				$buscadorAvanzado.find('.estatus').prop('checked', value);

				$buscadorAvanzado.find('.estatus').trigger('change');
			});

			$buscadorAvanzado.on('click', '#todos-movimiento', function(){
				var $select = $(this),
				value = ( typeof $(this).data('value') != 'undefined' ? $(this).data('value') : false );			
				
				$select.data('value', !value);
				$select.html((value==true ? '(Deseleccionar todos)' : '(Seleccionar todos)'));

				$buscadorAvanzado.find('.movimiento').prop('checked', value);

				$buscadorAvanzado.find('.movimiento').trigger('change');
			});

			$buscadorBasico.on('change', '.estatus-basico',function(){
				var selected = $(this).val();

				var $checkbox = $('#todos-estatus');

				if(selected === 'todos'){
					$checkbox.data('value', true);
					$checkbox.trigger('click');
				}
				else{
					$checkbox.data('value', false);
					$checkbox.trigger('click');
					$buscadorAvanzado.find('.estatus#'+selected).prop('checked', true);
				}
				
			});

		}

		function generarListadoConfirmacionInicial(){

			var $elements = $listaMovimientos.find('.linea-batch');
			var total = $elements.length;

			$elements.each(function (index, value) { 
			  var meta = ( typeof $(this).data('meta') != 'undefined' ? $(this).data('meta') : null );
			  var $element = $(this);

				if(meta != null){
					var elemento = generarHTMLMovimientos(meta, index);
					$element.html(elemento);
					meta.eliminado = false;
					meta.error = {};
					meta.edit = false;
					dataListadoMovimientos.push(meta);

					// bindElementActions();

				}
			});
		}

		function generarListadoConfirmacion(){

			$listaMovimientos.html('');

			$.each(dataListadoMovimientos, function (index, data) {
				if(!data.eliminado)

					var elemento = '';

					$.when(elemento = ($mainReactivacion.length>0 ? generarHTMLReactivacion(data, index) : ($mainCambio.length>0 ? generarHTMLCambio(data, index) : ($mainFacturacion.length>0 ? ( $mainFacturacion.hasClass('reporte-lineas') ?
						generarHTMLFacturacionLineas(data, index) : ($mainFacturacion.hasClass('reporte-facturas') ? generarHTMLFacturacionFacturas(data, index) :generarHTMLFacturacion(data, index) ) ) : generarHTMLSuspension(data, index))) )).done(function(){
								$listaconfirmar.append('<div class="col-sm-12 center-block flexbox h-align-center linea-batch '+elemento.additionalClass+'">'+elemento.html+'</div>');

								bindElementActions();
					});

			});


		}

		function generarHTMLMovimientos(meta, index){
			var html = '';
			var hasRealizacion = (typeof meta.realizacion != 'undefined' ? true : false);

			html = '<div class="col-sm-pr-100 col-xs-12 content-item-block" data-index="'+index+'"> <div class="col-xs-5 '+((hasRealizacion || !listaSinResponsable) ? 'col-sm-pr-15' : 'col-sm-pr-20')+' hidden-xs"> <p title="'+meta.operacion+'">'+meta.operacion+'</p></div>'; 


			html+='<div class="col-xs-4 '+((hasRealizacion || !listaSinResponsable) ? 'col-sm-pr-20' : 'col-sm-pr-20')+'"> <p class="movimiento-p"><span class="p-value" title="'+meta.movimiento+'">'+meta.movimiento+'</span></p></div><div class="col-xs-3 '+((hasRealizacion || !listaSinResponsable) ? 'col-sm-pr-15' : 'col-sm-pr-20')+'"> <p class="movimiento-p"><span class="p-value" title="'+meta.lineas+'">'+meta.lineas+'</span></p></div><div class="col-xs-3 '+( (hasRealizacion || !listaSinResponsable) ? 'col-sm-pr-10' : 'col-sm-pr-15')+' flexbox estatus-container"><p class="estatus-p" title="'+meta.estatus+'">'+meta.estatus+'</p></div><div class="col-xs-12 '+( (hasRealizacion || !listaSinResponsable) ? 'col-sm-pr-15' : 'col-sm-pr-15')+' hidden-xs"><p title="'+meta.solicitud+'">'+meta.solicitud+'</p></div>' +(hasRealizacion ? '<div class="col-xs-12 '+(listaSinResponsable ? 'col-sm-pr-15' : 'col-sm-2')+' hidden-xs"><p title="'+meta.realizacion+'">'+meta.realizacion+'</p></div>' : '')+(!listaSinResponsable ? '<div class="col-xs-12 col-sm-pr-15 hidden-xs"><p title="'+meta.responsable+'">'+meta.responsable+'</p></div>' : '')+'<div class="col-xs-2 col-sm-pr-10">'+( meta.url != undefined ? '<a class="simple" href="'+meta.url+'" title="Ver detalle"> <span class="icon i-angle-right"></span> </a>' : '' )+'</div> </div><div class="col-sm-12 col-xs-12 content-item-block more-info"> <div class="col-xs-12 flexbox v-align-center h-align-center hidden-sm hidden-md hidden-lg"> <p class="label">No. de operación:</p> <p class="p-value" title="'+meta.operacion+'">'+meta.operacion+'</p></div></div>';

			return html;

		}

	}

	function setActionsGenerales(){

		$('body').on('click', '.btn-general-solicitud-descarga', function(){
			//Aquí hay que tener en la variable el post de las facturas que se quieren
			_modalDescargarFacturas = {data: []};
			if(modalDescargarFacturas!=null)
				modalDescargarFacturas.openModal();
		});

		/**
			Mostrar/Ocultar tablas
		**/
		$('.collapse-table-block').on('click', '.hide-show-table', function(e){
			var table = ( typeof $(this).data('table') != 'undefined' ? $(this).data('table') : null );

			checkGeneralFSOpen();

			if(table!=null){
				var text = $(this).text();
				var newtext = (text == "Mostrar detalle" ? "Ocultar detalle" : "Mostrar detalle");

				if($(this).hasClass('filtros'))
					newtext = (text == "Mostrar filtros" ? "Ocultar filtros" : "Mostrar filtros"); 
    			
    			$(this).text( newtext );
				
				$(table).slideToggle( 500 )
			}
		});

		$('.historial-movimientos-block').on('click', '.btn-periodo-anterior', function(){
			//Simular periodo Anterior
			var $button = $(this),
			periodo = (typeof $button.data('periodo') != 'undefined' ? $button.data('periodo') : null);

			if(periodo!=null){
				//Aquí iría el funcionamiento para pintar el nuevo periodo.
				var urlHref = (typeof $button.data('href') != 'undefined' ? $button.data('href') : null);
				if(urlHref!=null)
					window.location.href = urlHref;
			}
		});

	}

	function checkGeneralFSOpen(){
		var $containerFS = $('.general-fs-container.visible');
		var $container = $containerFS.closest('section');
		var $btn = $container.find('.hide-show-filter');

		if($containerFS.length>0)
			$btn.trigger('click');
	}

	return{
		inicializar: init
	}

})();