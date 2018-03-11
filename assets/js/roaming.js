var roamingGeneral = (function(){

	var $coberturaForm = $('#cobertura-form'),
	$contactoContainer = $('.faq-contacto-block'),
	$roamingTabs = $('#tabs-extranjero'),
	$destinoSearch = $('#destinos-search-block'),
	$paquetesUsuario = $('#paquetes-seleccionados-user'),
	dataDisponibles = [],
	dataAnadidos = [],
	destinosSeleccionados = [],
	paqueteDestinoSeleccionado = [],
	dataPreselected = false,
	formElement = {id : null, validator : null, sending: false },
	$mainTableAct = $('#modal-servicios .general-table #servicios-activados'),
	$mainRoaming = $('.roaming-block'),
	isMasivo = false,
	modalServicios = null, modalAgregarPaquetes = null,
	_modalAgregarPaquetes = { element : null , data : null };

	function init(){

		if($mainRoaming.hasClass('bloquear-acciones-masivas')|| $('.autogestion-roaming-block').hasClass('bloquear-acciones-masivas') )
			isMasivo = true;

		if($('.date-picker').length>0 && !initializedDate)
			generalDatePicker.inicializar();

		if($coberturaForm.length>0)
			initCobertura();

		if($contactoContainer.length>0)
			initContacto();

		if($roamingTabs.length>0)
			initTabs();

		if($destinoSearch.length>0)
			initDestinosSearch();

		setActions();

		initLegales();
		initPaquetes();
		setGeneralErrores()
	}

	function setGeneralErrores(){

		var hash = window.location.hash,
		$before = $('#modal-servicios .terminos-container-modal');

		if(hash=='#mismaFecha'){
			var msg = 'Has elegido las mismas fechas para 2 paquetes diferentes al mismo destino.';
			var html = '<div class="col-sm-12 col-xs-12 center-block"><div class="error-general" id="roaming-servicios-error"><label class="error error-dd">'+msg+'</label></div></div>';
			$( html ).insertBefore( $before );
		}

	}

	var sending = false;

	/**Inicio modal cancelar cita**/
	function initModalAgregarPaquetes(){
		var processCompleted = false,
		$modal = $('#modal-agregar-paquete');


		modalAgregarPaquetes = new modalesTelcel($('#modal-agregar-paquete'),{
			onInit : function(){
				setResize();
				setModalActions();
			},
			onReset : function(){
				processCompleted = false;
			  	$('#btn-agregar-paquete').prop('disabled', true);
			},
			onOpen : function(){
				processCompleted = false;
				$('#modal-agregar-paquete .date-picker').removeClass('open');
			},
			onClose : function(){
				$('.linea-batch.active-settings').removeClass('active-settings');
				removeHoraError($('#modal-agregar-paquete').find('.time-picker .time-select'));

				
				if(!processCompleted)
					_modalAgregarPaquetes.element.find('.btn-quitar-paquete').trigger('click');
				else
					$('#btn-contratar-servicios').prop('disabled', true);

				if(_modalAgregarPaquetes.element.length>0)
					scrollToElement(_modalAgregarPaquetes.element);
				
				//Cuando cierre el modal si quieren hacer refresh hay que descomentar esto
				// if(processCompleted)
				// 	location.reload();
			}
		});

		function setResize(){
			var size = null,
			initialSize = $( window ).width();

			$( window ).resize(function() {
				size = $( window ).width();
				onResize()
			});

			function onResize(){
				if(!is_mobile()){
					$('body.fixed-body').removeClass('fixed-body');
				}
			}
		}


		function removeHoraError($select){
			var $container = $select.closest('.time-picker'),
			$block = $container.closest('.time-picker-container');
			
			$block.removeClass('has-error');
			$select.removeClass('error');
			$container.find('.error-hora').remove();

		}

		function setModalActions(){
			$('#btn-agregar-paquete').click(function(){
				updateAgregarPaquetesData();
			});

			$('#modal-agregar-paquete .calendar').on("change",function(e){
				e.stopPropagation();
				$('#btn-agregar-paquete').prop('disabled', false);
			});
		}

		function updateAgregarPaquetesData(){
			var form = '#modal-agregar-paquete .in-cont-mod';

			if(!sending){

				sending = true;

				generalLoadingIcon(form, true);

				var $dateStep = _modalAgregarPaquetes.element.find('.roaming-fecha-step'),
				$init = $dateStep.find('.date-picker.inicio .calendar'),
				$fin = $dateStep.find('.date-picker.fin .calendar'),
				$spanInit = $dateStep.find('.date-picker.inicio span.fecha'),
				$spanFin = $dateStep.find('.date-picker.fin span.fecha'),
				$inputInit = $dateStep.find('.date-picker.inicio input.fecha-input'),
				$inputFin = $dateStep.find('.date-picker.fin input.fecha-input'),
				$minit = $modal.find('.date-picker.inicio .calendar'),
				$mfin = $modal.find('.date-picker.fin .calendar'),
				minit = $minit.datepicker('getDate'),
				mfin = $mfin.datepicker('getDate');

				$init.datepicker( 'setDate' , minit );
				$fin.datepicker( 'setDate' , mfin );

				var htmlInit = separateDate(minit),
				htmlFin = separateDate(mfin);

				$spanInit.html(htmlInit);
				$spanFin.html(htmlFin);

				$inputInit.val(htmlInit);
				$inputFin.val(htmlFin);

				$dateStep.find('.date-picker.fin').removeClass('disabled');

				generalLoadingIcon(form, false);
				sending = false;
				processCompleted = true;

				modalAgregarPaquetes.closeModal();

			}
		}
	}
	/**Fin modal agregar fecha**/


	function separateDate(date){
		var formattedDate = new Date(date);
		var d = formattedDate.getDate();
		var m =  formattedDate.getMonth();
		m += 1;  // JavaScript months are 0-11
		var y = formattedDate.getFullYear();

		d = ((d.toString()).length== 1 ? '0' + d : d);
		m = ((m.toString()).length== 1 ? '0' + m : m);

		return d+'/'+m+'/'+y;
	}

	function initModalPaquetes(){

		var $total = $('#total-carrito');
		var total = 0;

		function checkFixedHeader(){
			var $lista = $('#roaming-result-block');
			var $starte = $lista;
			var start = $starte.offset();

			
			$(window).scroll(function(){
				$starte = $lista;

				start = $starte.offset();
				var end = $starte.height()-50;
				var beg = -1;

			    if ($(this).scrollTop() > beg && $(this).scrollTop() < end )
			        $('.to-fixed-block').addClass('fixed');
			    else 
			        $('.to-fixed-block').removeClass('fixed');
			});
		}

		checkFixedHeader();

		modalServicios = new modalesTelcel($('#modal-servicios'),{
			onInit : function(){
				initActionsModalAuxiliar();
				
			},
			onOpen : function(){
				total = 0;

				checkError();

				var $terminosContainer = $('#terminos-container');
				$terminosContainer.hide();
				setTimeout(function(){
					$('#modal-servicios .window-modal').addClass('visible');
				}, 1);
				
				updateModalData();
			},
			onReset : function(){
				$('#modal-servicios .window-modal').removeClass('visible');
				$('#terminos-container').removeClass('visible');
			}
		});

		function checkError(){

			var valid = true;

			if($('#checkbox-autogestion-terminos').length>0 && !$('#checkbox-autogestion-terminos').is(':checked')){
				addCheckError();
				valid = false;

			}
			else if($('.error-terminos').length>0 && $('#checkbox-autogestion-terminos').is(':checked'))
				removeCheckError();


			if($('#listado-confirmacion-autogestion').length>0){
				if($('#listado-confirmacion-autogestion input[type="checkbox"]:checked').length==0){
					addLineasError();
					valid = false;
				}
				else
					removeLineasError();
			}

			if($('#autogestion-form').length>0){
				if($('#autogestion-btn').prop('disabled'))
				{
					addLineasError();
					valid = false;
				}
				else
					removeLineasError();
			}
			

			$('#btn-contratar-servicios').prop('disabled', !valid);				
		}


		function updateModalData(){
			$mainTableAct.html('');

			$.each(dataAnadidos, function( index, servicio ) {
				updateTableAdd(dataDisponibles[servicio]);
			});

			updateTotalCarrito();
		}

		function updateTotalCarrito(){
			$total.html(parseFloat(total).toFixed(2));
		}

		function updateTableAdd(servicio){
			var totalLineas = 0,
				totalCosto = 0;
			servicio.costo = (typeof servicio.costo != 'undefined') ? servicio.costo : '0.00',
			fechatxt = '';
			
			if(isMasivo){
				totalLineas = 6;
				if($('#listado-confirmacion-autogestion').length>0)
					totalLineas = $('#listado-confirmacion-autogestion input[type="checkbox"]:checked').length;
				totalCosto = parseFloat(Number(servicio.costo)*totalLineas).toFixed(2);
			}

			if(dataPreselected)
				fechatxt = (typeof servicio.fecha!= 'undefined' ? ' (de '+ servicio.fecha.init + ' a ' + servicio.fecha.fin + ')' : '');
			else
				fechatxt = checkFechaData(servicio.id);



			var html = '';

			html = '<div class="col-sm-12 col-xs-12 center-block flexbox" id="c-servicio-'+servicio.id+'"> <div class="'+(isMasivo ? 'col-sm-4 col-xs-3' : 'col-xs-7 col-sm-7')+' flexbox"> <p title="'+servicio.nombre+'">'+servicio.nombre+' <span class="fecha-data">'+fechatxt+'</span> <a href="" class="btn-terminos-servicios" data-name="'+servicio.nombre+'" data-tyc="'+servicio.tyc+'">Términos y condiciones</a> </p></div> '+(isMasivo ? '<div class="col-sm-2 col-xs-3 h-align-center flexbox"><p class="p-align-center"><small class="txt-100 description">'+totalLineas+'</small></p></div><div class="col-sm-3 col-xs-3 h-align-center flexbox"><p class="p-align-center"><strong>'+ ( servicio.costo>0 ? '$'+Number(servicio.costo).toFixed(2) : 'Sin costo' )+'</strong></p></div>' : '')+'<div class="'+(isMasivo ? 'col-sm-3 col-xs-3' : 'col-sm-5 col-xs-5')+' flexbox h-align-center"> <p class="p-align-center"><strong> '+( isMasivo ? ( totalCosto >0 ? '$'+totalCosto : 'Sin costo') : (servicio.costo>0 ? Number(servicio.costo).toFixed(2) : 'Sin costo'))+'</strong></p> </div> </div>';

			$mainTableAct.append(html);

			if(isMasivo)
				total+=totalCosto;
			else
				total+=Number(servicio.costo);
		}

		function checkFechaData(id){
			var $current = $('#paquete-'+id),
			$inputInit = $current.find('.date-picker.inicio input.fecha-input'),
			$inputFin = $current.find('.date-picker.fin input.fecha-input'),
			inputInit = null,
			inputFin = null,
			hasFecha = false,
			fechatxt = '';

			if($inputInit.length>0 && $inputFin.length>0){
				hasFecha = true;
				inputInit = $inputInit.val(),
				inputFin = $inputFin.val();
				fechatxt = ' (de '+ inputInit + ' a ' + inputFin + ')';
			}

			return fechatxt;
		}


		function initActionsModalAuxiliar(){

			$('#checkbox-autogestion-terminos').change(function() {
				validateFormData();
			});

			$('#btn-contratar-servicios').click(function(){
				if(!formElement['sending']){
					var urlPost = ( typeof $(this).data('post') != 'undefined' ? $(this).data('post') : null );
					sendData('.servicios-block', urlPost);
				}
			});

			$('#modal-servicios').on('click', '.btn-terminos-servicios', function(e){

				e.preventDefault();

				var $button = $(this),
				$container = $('.terminos-container-modal'),
				$terminosContainer = $container.find('#terminos-container, .terminos-container'),
				speed = 300;

				$terminosContainer.toggleClass('visible');

				if($terminosContainer.hasClass('visible')){

					var tyc = ( typeof $button.data('tyc')!='undefined' ? $button.data('tyc') : ''),
					nombre = ( typeof $button.data('name')!='undefined' ? $button.data('name') : '');

					$('#tyc-servicio').html(tyc);
					$('#tyc-name').html(nombre);

					if(!is_mobile())
						$terminosContainer.fadeIn(300);
					else
						$terminosContainer.show();
				}
				else{
					if(!is_mobile())
						$terminosContainer.fadeOut(300);
					else
						$terminosContainer.hide();
				}
			});

			$('.terminos-container-modal #terminos-container .close-container .icon').click(function(e){
				e.preventDefault();

				var $button = $(this),
					$container = $('.terminos-container-modal'),
					$terminosContainer = $container.find('#terminos-container, .terminos-container');
			
				if(!is_mobile())
					$terminosContainer.fadeOut(300);
				else
					$terminosContainer.hide();
					
				$terminosContainer.removeClass('visible');

			});

			$(".servicios-tooltip-container").on('click', '.btn-resumen', function(e){
				e.preventDefault();
				checkModalToOpen();
			});

			$(".button-container").on('click', '.mostrar-servicios-btn', function(e){
				e.preventDefault();
				checkModalToOpen();
			});

		}

		function sendData(form, urlPOST){
			formElement['sending'] = true; 
			$(form).find('button[type="submit"]').prop('disabled', true);

			var self = $(form).serialize();
			var redirect = urlPOST;
			//loadingIcon(form, true);

			urlPOST = checkDevelopmentPostHTML(urlPOST);

			$.post(  urlPOST , self )
			.done(function( data ) {

			  	//loadingIcon(form, false);
			  	Services.roaming.contratarServiciosSuccessCallback(data, form, redirect);
				formElement['sending'] = false;

			 })
			.fail(function( jqxhr, textStatus, error ) {
				//loadingIcon(form, false);
			  	Services.roaming.contratarServiciosFailCallback(error, form);
			  	formElement['sending'] = false;
			});
		}

		function validateFormData(){
			

			var valid = true;

			if($('#checkbox-autogestion-terminos').length>0 && !$('#checkbox-autogestion-terminos').is(':checked')){
				addCheckError();
				valid = false;

			}
			else if($('.error-terminos').length>0 && $('#checkbox-autogestion-terminos').is(':checked'))
				removeCheckError();

			$('#btn-contratar-servicios').prop('disabled', !valid);

		}

		function checkLineasSelected(){
			var valid = true;

			if($('#listado-confirmacion-autogestion').length>0){
				var totalLineas = $('#listado-confirmacion-autogestion input[type="checkbox"]:checked').length;
				valid = totalLineas>0 ? true : false;

				if(!valid)
					addLineasError();
				else
					removeLineasError();
			}

			return valid;
		}

	}

	function checkPaquetesFecha(){
		var $seleccionadosFecha = $('.roaming-oferta-block.paquete-seleccionado .fecha-input'),
		valid = true,
		first = true;

		$seleccionadosFecha.each(function () {
			var $input = $(this),
			$dateStep = $input.closest('.roaming-fecha-step');

			if($input.val()==""){
				valid = false;
				addFechaError($input);

				if(first)
					scrollToElement($dateStep);

				first = false;
			}

			
		});

		return valid;
	}

	function addFechaError($input){
		var $container = $input.closest('.date-picker'),
		$block = $container.closest('.date-picker-container'),
		$inputContainer = $input.closest('.input'),
		error = '<label class="error error-fecha">Elige una fecha.</label>';

		if($container.find('.error-fecha').length<1){
			$block.addClass('has-error');
			$inputContainer.addClass('error');
			$container.append(error);
		}

	}

	function removeFechaError($input){
		var $container = $input.closest('.date-picker'),
		$block = $container.closest('.date-picker-container'),
		$inputContainer = $input.closest('.input');
		
		$block.removeClass('has-error');
		$inputContainer.removeClass('error');
		$container.find('.error-fecha').remove();

	}

	function updateSearchButton(disabled){
		$('#btn-search-destinos').prop('disabled', disabled);
	}

	function updateSelectData($btn, selected){
		var $oferta = $btn.closest('.roaming-oferta-block');

		if(selected)
			agregarCarrito($oferta);
		else
			eliminarCarrito($oferta);

		updateTooltipVisibility();

	}

	function updateTooltipVisibility(){

		var tMod = getTotalModificados();

		$('.total-servicios').html(tMod);

		if(tMod>0){
			$('.servicios-tooltip-container').addClass('active');
			$('.mostrar-servicios-btn').prop('disabled', false);
		}
		else{
			$('.servicios-tooltip-container').removeClass('active');
			$('.mostrar-servicios-btn').prop('disabled', true);
		}

	}

	function getTotalModificados(){

		var totalModificados = dataAnadidos.length;
		return totalModificados;
	}

	function agregarCarrito($oferta){

		var id = $oferta.attr('id');
		$oferta.addClass('paquete-seleccionado');
		dataAnadidos.push(id);
	}

	function eliminarCarrito($oferta){
		var id = $oferta.attr('id'),
		index = dataAnadidos.indexOf(id);

		if (index > -1) {
			$oferta.removeClass('paquete-seleccionado');
		    dataAnadidos.splice(index, 1);
		}

	}

	function checkModalToOpen(){
		if(checkPaquetesFecha())
			modalServicios.openModal();
	}


	function initPaquetes(){

		if($paquetesUsuario.length>0){
			dataPreselected = true;
			getPaquetesUsuario();
			setPaquetesUsuario();
			updateTooltipVisibility();
		}
		

		setActions();

		if($('#modal-servicios').length>0)
			initModalPaquetes();

		if($('#modal-agregar-paquete').length>0)
			initModalAgregarPaquetes();

		function setPaquetesUsuario(){
			var paquetes = $paquetesUsuario.data('paquetes');

			dataAnadidos = paquetes.split(',');

		}

		function getPaquetesUsuario(){

			var urlPOST = Services.apiURL.getPaquetesUsuario();

			$.post( urlPOST , { data: dataAnadidos })
			  .done(function( json ) {
			  	
				Services.roaming.getPaquetesRoamingUsuarioSuccessCallback(json, setServicios);

			  })
			  .fail(function( jqxhr, textStatus, error ) {
			  	Services.roaming.getPaquetesRoamingUsuarioFailCallback(error );
			});
		}

		function setServicios(result){
			dataDisponibles = result;
			scrollToElement($('#roaming-result-block'));
			
		}

		function setActions(){

			$('.roaming-block, .autogestion-roaming-block').on('click', '.btn-autogestion-simular', function(e){
					e.preventDefault();

					var $btn = $(this);

					if(validateFormCarritoData())
						$('#btn-contratar-servicios').trigger('click');
					else
						modalServicios.openModal();
					
			});

			$('.autogestion-roaming-block #checkbox-autogestion-terminos').change(function(){

				var $check = $(this);
				if($check.is(':checked'))
					removeCheckError();
				else
					addCheckError();

			});

			$('.roaming-ofertas').on('click', '.btn-agregar-paquete', function(){
				var $btn = $(this);
				checkDestinoOnlyPaquete($btn);
			});


			$('.roaming-ofertas').on('click', '.btn-quitar-paquete', function(){
				var $btn = $(this);
				updateSelectData($btn, false);
			});

			$(".calendar").on("change",function(e){
				var $calendar = $(this),
				$input = $calendar.closest('.date-picker').find('.fecha-input'),
				id = $input.attr('id'),
				idfin = id.replace("inicio", "fin"),
				$inputfin = $('#'+idfin);

				removeFechaError($input);
				removeFechaError($inputfin);
				
				
			});
		}

		function checkDestinoOnlyPaquete($btn){

			var $paquete = $btn.closest('.roaming-oferta-block'),
			dataItem = $paquete.data('item'),
			hasFecha = true;
			//( typeof dataItem.fecha != undefined ? dataItem.fecha : false );

			if(typeof dataItem.destino!='undefined'){

				var $paqueteSelected = $('.destino-'+dataItem.destino+'.paquete-seleccionado');

				if($paqueteSelected.length>0){
					setPreviousDate($paqueteSelected, $paquete);
					$paqueteSelected.find('.btn-quitar-paquete').trigger('click');
				}
					
			}

			updateSelectData($btn, true);
			
			if(is_mobile() && modalAgregarPaquetes!=null && hasFecha){
				_modalAgregarPaquetes = { element : $paquete , data : dataItem };
				modalAgregarPaquetes.openModal();
			}
			else
				$('#btn-contratar-servicios').prop('disabled', false);
		}

		function setPreviousDate($previous, $new){

			var $minit = $previous.find('.date-picker.inicio .calendar'),
				$mfin = $previous.find('.date-picker.fin .calendar'),
				$spanMinit = $previous.find('.date-picker.inicio span.fecha'),
				$spanMfin = $previous.find('.date-picker.fin span.fecha');
				
				if($spanMinit.html() !='' || $spanMfin.html() != ''){
					var minit = $minit.datepicker('getDate'),
					mfin = $mfin.datepicker('getDate'),
					$dateStep = $new.find('.roaming-fecha-step'),
					$init = $dateStep.find('.date-picker.inicio .calendar'),
					$fin = $dateStep.find('.date-picker.fin .calendar'),
					$spanInit = $dateStep.find('.date-picker.inicio span.fecha'),
					$spanFin = $dateStep.find('.date-picker.fin span.fecha'),
					$inputInit = $dateStep.find('.date-picker.inicio input.fecha-input'),
					$inputFin = $dateStep.find('.date-picker.fin input.fecha-input');


					$init.datepicker( 'setDate' , minit );
					$fin.datepicker( 'setDate' , mfin );

					var htmlInit = separateDate(minit),
					htmlFin = separateDate(mfin);

					$spanInit.html(htmlInit);
					$spanFin.html(htmlFin);

					$inputInit.val(htmlInit);
					$inputFin.val(htmlFin);

					$dateStep.find('.date-picker.fin').removeClass('disabled');
				}

			

		}


		function validateFormCarritoData(){
			

			if($('#checkbox-autogestion-terminos').is(":checked"))
				return true;

			return false;

		}
		
	}


	function initLegales(){
		setActions();

		function setActions(){
			$('.btn-legales').click(function(e){
				e.preventDefault();
				var $btn = $(this),
				$legales = $btn.closest('.roaming-oferta-block');

				$legales.toggleClass('legales-visible');
			});
		}
	}

	function addCheckError(){

		var $input = $('#checkbox-autogestion-terminos'),
		$container = $('.terminos-container-modal >div'),
		error = '<label class="error error-terminos error-general">Acepte términos y condiciones para continuar.</label>';

		if($container.find('.error-terminos').length<1){
			$container.addClass('has-error');
			$container.append(error);
		}

	}

	function removeCheckError(){
		var $input = $('#checkbox-autogestion-terminos'),
		$container = $('.terminos-container-modal >div'),
		$error = $container.find('.error-general');
		
		$container.find('.error-terminos').remove();

		if($error.length==0)
			$container.removeClass('has-error');

	}

	function addLineasError(){

		var $container = $('.terminos-container-modal >div'),
		error = '<label class="error error-lineas error-general">Debes elegir al menos una línea para poder continuar.</label>';

		if($container.find('.error-lineas').length==0){
			$container.addClass('has-error');
			$container.append(error);
		}

	}

	function removeLineasError(){

		var $container = $('.terminos-container-modal >div'),
		$error = $container.find('.error-general');
		
		$container.find('.error-lineas').remove();
		
		if($error.length==0)
			$container.removeClass('has-error');

	}

	//Search de paquetes
	function initDestinosSearch(){

		initActions();
		getSearchResults(false);

		function initActions(){

			destinosModulo.inicializar();

			$('#show-destinos-block').click(function(){
				$('.destinos-confirm-block').toggleClass('hidden');
			});

			$('#destinos-search-block').submit(function(e){
				e.preventDefault();
				
				if(!formElement['sending']){
					sendSearchForm(true);
				}

			});

			$('#destinos-search-block .btn-limpiar-busqueda').click(function(){

				destinosModulo.destroy();

				$('#destinos-search-block').find('.dynamic-element').remove();
				$('#destinos-search-block').find('#destino-1 option').prop('selected',false);
				$('#destinos-search-block').find('#destino-1').parent().find('input').val('');

				$('#destinos-search-block .btn-limpiar-busqueda').addClass('hidden');
				$('#btn-search-destinos, .btn-agregar-destino').removeClass('hidden');

				$('.destino-input-container .destino, .destino-input-container input, .destino-input-container button').prop('disabled', false);

				$('#destinos-search-block .btn-change').prop('disabled', false);

				destinosModulo.reset();
			});
		}

		var sentSearch = false;

		function sendSearchForm(){
			$('.paquete-seleccionado .btn-quitar-paquete').trigger('click');
			onSearch();
			getSearchResults(true);
		}

		function getSearchResults(searching){
			var form = '#destinos-search-block',
			loadingContainer = '#roaming-result-block';

			formElement['sending'] = true;
			$(form).find('button[type="submit"]').prop('disabled', true);

			generalLoadingIcon(loadingContainer, true);

			var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;

			$.post( urlPOST , { data: destinosSeleccionados })
			  .done(function( json ) {
			  	
				Services.roaming.getSearchRoamingSuccessCallback(json, form, setServicios, destinosSeleccionados);
				formElement['sending'] = false;

				if(searching){
					$(form).find('button[type="submit"]').prop('disabled', false);

					//Esto solo es para simular la búsqueda
					window.location.href="roaming-masivo-1-con-busqueda.html";
				}

			  })
			  .fail(function( jqxhr, textStatus, error ) {
			  	Services.roaming.getSearchRoamingFailCallback(error, form );
			  	formElement['sending'] = false;
			  	generalLoadingIcon(loadingContainer, false);
			});
		}

		function onSearch(){


			$('#roaming-result-block .roaming-ofertas').addClass('hidden');

			$('.destino-input-container .destino, .destino-input-container input, .destino-input-container button, .btn-delete').prop('disabled', true);

			$('#destinos-search-block .btn-limpiar-busqueda').removeClass('hidden').prop('disabled', true);

			$('#btn-search-destinos, .btn-agregar-destino').addClass('hidden');

			$('#destinos-search-block .btn-change').prop('disabled', true);
		}

		function setServicios(result){
			dataDisponibles = result;

			setTimeout(function(){
				generalLoadingIcon('#roaming-result-block', false);
				$('#roaming-result-block .roaming-ofertas').removeClass('hidden');

				$('#destinos-search-block .btn-limpiar-busqueda').prop('disabled', false);
				
				if($('.roaming-otras-ofertas').length>0)
					checkIsotope();
			}, 2000);
			

			//Aquí se debería de generar el html e los paquetes/tarifas que se obtuvieron en la búsqueda, esto es para simularlo nadamás
		}

		function checkIsotope(){
			var initialSize = 0,
			size = null;

			setResize();
			onResize();

			function setResize(){
				
				initialSize = $( window ).width();

				$( window ).resize(function() {
					size = $( window ).width();
					onResize();
				});
			}

			function onResize(){
				if( initialSize>size && is_mobile()){
					initIsotope();
					//reset en mobile por q no puedes ver la fecha
					unselectPaquetes();
				}
				else if(initialSize<size && !is_mobile()){
					destroyIsotope();
				}

				initialSize = $( window ).width();
			}
			
		}

		function initIsotope(){

			$('.roaming-otras-ofertas').addClass('.isotope-i');

			$('.roaming-otras-ofertas').isotope({
			  itemSelector: '.isotope-element',
			  percentPosition: true
			});
		}

		function unselectPaquetes(){
			$('.btn-quitar-paquete').trigger('click');
		}

		function destroyIsotope(){
			if($('.roaming-otras-ofertas').hasClass('.isotope-i')){
				$('.roaming-otras-ofertas').isotope('destroy');
				$('.roaming-otras-ofertas').removeClass('.isotope-i');
			}
		}
	}
	//Fin search de paquetes

	function initTabs(){
		var $tabsSelector = $roamingTabs.find('.link-secondary-tabs ul li'),
		$tabs = $roamingTabs.find('.info-secondary-tabs .tab-pane');
		initActions();
		
		function initActions(){
			$('#pais-marcacion').change(function(){
				var marcacion = $(this).val();
				$('.marcacion-value').html(marcacion);
			});

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
			// resetForms();
			$tabsSelector.removeClass('active');
			$tabs.removeClass('active');
			$element.addClass('active');
			$selected.addClass('active');
		}	
	}

	function initContacto(){
		initActions();

		function initActions(){

			$('.faq-element .question-container').click(function (argument) {
				var $btn = $(this),
				$faq = $btn.closest('.faq-element'),
				wasOpen = $faq.hasClass('open');

				$('.faq-element').removeClass('open');

				if(wasOpen){
					$faq.removeClass('open');
					$btn.trigger('closeFAQ');
				}
				else{
					$faq.addClass('open');
					$btn.trigger('openFAQ');
				}

			});
		}
	}

	function initCobertura(){

		var $submit = $coberturaForm.find('button[type="submit"]'),
		$limpiar = $coberturaForm.find('.btn-limpiar-busqueda'),
		$result = $('#cobertura-result-container'),
		formElement = {id : null, validator : null, sending: false }; 

		initActions();
		validateMainForm();

		function validateMainForm(){

			disableSumbitButton($coberturaForm, true);

			formElement['validator'] = 
				$coberturaForm.validate({
					  rules: {
						marca: {
							required: true
						},
						modelo: {
							required: true
						}
					  },
					  messages: {
						 marca: {
						   required: "Selecciona una marca.",
						 },
						 modelo: {
						   required: "Selecciona una modelo.",
						 }
					   },
						errorClass : "error-dd error",
						errorElement : 'div',
						errorPlacement: function(error, $element) {
							var $parent = $element.closest('.general-number-container');
						   	$parent.append( error );
						   	$parent.addClass('has-error');
						   	
						},
					  	success: function(label) {
					  		var $parent = $(label).closest('.general-number-container');

						  		$(label).remove();
						  		$parent.removeClass('has-error');

					  	},
				        submitHandler: function(form) {
							if(!formElement['sending']){
								getCoberturaResult();
							}
						}
				});

				checkGeneralValidForm($coberturaForm, destinosModulo.isValid);	
		}

		function initActions(){

			destinosModulo.inicializar();

			$coberturaForm.submit(function(e){
				e.preventDefault();
				if(!formElement['sending']){
					getCoberturaResult();
				}
			})

			$coberturaForm.find('.btn-limpiar-busqueda').click(function(e){
				resetForm();
			});
			
		}

		function resetForm(){

			destinosModulo.destroy();

			$coberturaForm.find('.dynamic-element').remove();
			$coberturaForm.find('#destino-1 option').prop('selected',false);
			$coberturaForm.find('#destino-1').parent().find('input').val('');

			$coberturaForm.find('.select-change').val('');
			$coberturaForm.find('button[type="submit"]').prop('disabled', true);
			$coberturaForm.removeClass('searching result');
			$coberturaForm.find('select, input, .ui-combobox button, .btn-agregar-destino-general').prop('disabled', false);

			$('.icons-container .btn-delete').prop('disabled', false);
			
			destinosModulo.reset();

			scrollToElement($coberturaForm);
		}

		function isValid(){
			var $marca = $('#marca'),
			$modelo = $('#modelo');

			if($marca.val()=='' || $modelo.val()=='')
				return false;

			return true;
		}

		function getCoberturaResult(){
				
			var container = '#cobertura-result-container';
			formElement['sending'] = true;

			$coberturaForm.find('button[type="submit"]').prop('disabled', true);
			
			var self = $coberturaForm.serialize();

			generalLoadingIcon(container , true);
			$coberturaForm.addClass('searching');
			scrollToElement($result);

			var urlPOST = ( $coberturaForm.prop('action') == '' ? postURL : $coberturaForm.prop('action') ) ;

			$.post( urlPOST , { data: self })
			  .done(function( json ) {
			  	
			  	Services.roaming.getCoberturaSuccessCallback(json, container );
			  	formElement = false;
			  	generalLoadingIcon(container, false);
			  	$coberturaForm.addClass('result');
			  	$coberturaForm.find('select, input, .ui-combobox button, .btn-agregar-destino-general').prop('disabled', true);
			  	$('.icons-container .btn-delete').prop('disabled', true);
			  	processCompleted = true;

			  })
			  .fail(function( jqxhr, textStatus, error ) {
			  	//Mensaje de error del SISTEMA
			  	Services.roaming.getCoberturaFailCallback(error, container );
			  	formElement = false;
			  	generalLoadingIcon(container , false);
			  	$coberturaForm.removeClass('searching result');
			  	$coberturaForm.find('select').prop('disabled', false);
			  	processCompleted = true;
			});
		}
	}

	function setActions(){
		$('.btn-enable-edit').click(function(){
			enableEditingMode();
		});

		$('.btn-actualizar-fecha').click(function(){
			updateDate();
		});

		$( '.more-options-block >a' ).mouseenter( function(){
			var $a = $(this),
			$container = $a.parent();
			$a.addClass('hover');
			$container.addClass('on-a');

		} ).mouseleave(function(e){
			var $a = $(this),
			$container = $a.parent();

			setTimeout(function(){
				if(!$container.hasClass('on-triangle')){
					$a.removeClass('hover');
					$container.removeClass('on-a');
				}
			}, 1000);
		} );

		$( '.more-options-block .triangle-tooltip' ).mouseenter( function(){
			var $t = $(this),
			$container = $t.parent();
			$container.addClass('on-triangle');
		} ).mouseleave(function(e){
			var $t = $(this),
			$container = $t.parent(),
			$a = $container.find('>a');

			$container.removeClass('on-triangle');
			$a.removeClass('hover');
		} );
	}

	function enableEditingMode(){
		$('.roaming-fecha-step').addClass('enable-editing-mode');
		$('.roaming-fecha-step .date-picker').removeClass('disabled');
	}

	function updateDate(){
		$('.roaming-fecha-step').removeClass('enable-editing-mode');
		$('.roaming-fecha-step .date-picker').addClass('disabled');
	}

	return{
		inicializar : init
	}

})();

var destinosModulo = (function(){
	var $destinosContainer = $('.destinos-multiple'),
	$destinoSearch = $('.form-destinos-multiple'),
	destinocount = 1,
	totalDestinos = { 'general' : 1, 'ferrie' : 1, 'pais' : 0 },
	maxTotalDestinos = { 'general' : 12, 'ferrie' : 5, 'pais' : 7 },
	totalErrores = [],
	destinosArr = [],
	sending = false;

	function init(){
		setActions();
		initGeneralComboBox();
		var $firstDestino = $('#destino-1');
		getDestinosData(true);
	}

	function initGeneralComboBox(){
	    $.widget("ui.combobox", {
	        _create: function() {
	            var input, self = this,
	                select = this.element.hide(),
	                selected = select.children(":selected"),
	                value = selected.val() ? selected.text() : "",
	                wrapper = $("<span>").addClass("ui-combobox").insertAfter(select);
	                
	            	input = $("<input>").appendTo(wrapper).val(value).addClass("ui-state-default").attr('name', 'destino[]').autocomplete(
	            	{
	                	delay: 0,
	                	minLength: 0,
	                	source: function(request, response) {
		                    var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
		                    response(select.children("option").map(function() {
		                        var text = $(this).text();
		                        if (this.value && (!request.term || matcher.test(text))) return {
		                            label: text.replace(
		                            new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(request.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>"),
		                            value: text,
		                            option: this
		                        };
		                    }));
		                },
		                select: function(event, ui) {
		                    ui.item.option.selected = true;
		                    self._trigger("selected", event, {
		                        item: ui.item.option
		                    });

		                },
		                change: function(event, ui) {

		                	 var $container = $(this).closest('.destino-input-container'),
		                	 $error = $container.find('.error-destino'),
		                	 id = $container.find('.destino').attr('id');

		                    if (!ui.item) {
		                        var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i"),
		                            valid = false;
		                        select.children("option").each(function() {
		                            if ($(this).text().match(matcher)) {
		                                this.selected = valid = true;
		                                return false;
		                            }
		                        });
		                        if (!valid) {
		                            // remove invalid value, as it didn't match anything
		                            $(this).val("");
		                            select.val("");

		                            $(this).data('ui-autocomplete').term = "";

		                            $(this).addClass('error error-dd');
		                            
		                            if($error.length==0)
		                            	$container.append('<label class="error error-dd error-destino">Selecciona un destino de la lista.</label>');


		                    		totalErrores.push(id);

		                    		checkSearchButton();

		                            return false;
		                        }
		                        else{
		                        	var 
					            	 $input = $container.find('input');

					                $input.removeClass('error error-dd');
					                $error.remove();

					                totalErrores.splice($.inArray(id ,totalErrores),1);

					                checkSearchButton();
		                        }
		                        

		                        
		                    }
		                },
		                create : function(){
					      	$(this).data('ui-autocomplete')._renderItem = function (ul, item) {
					      		 var container = ul;
						        	container = select.closest('.general-number-container');
						        	container.append(ul);
						        	container = container.find('ul');


						        return $("<li></li>")
						            .data("item.autocomplete", item)
						            .append("<a>" + item.label + "</a>")
						            .appendTo(container);
							}
					      }



	            }).addClass("ui-widget ui-widget-content ui-corner-left");

	            // input.data("autocomplete")._renderItem = function(ul, item) {
	            //     return $("<li></li>").data("item.autocomplete", item).append("<a>" + item.label + "</a>").appendTo(ul);
	            // };

	            $("<button>").prop("type", "button").attr("tabIndex", -1).attr("title", "Mostrar destinos").appendTo(wrapper).button({
	                icons: {
	                    primary: "ui-icon-triangle-1-s"
	                },
	                text: false
	            }).removeClass("ui-corner-all").addClass("ui-corner-right ui-button-icon ui-combobox-button").click(function() {

	                if (input.autocomplete("widget").is(":visible")) {
	                    input.autocomplete("close");
	                    return;
	                }

	                
	                $(this).blur();

	                
	                input.autocomplete("search", "");
	                input.focus();
	            });

	        },

	        destroy: function() {
	        	this.element.next("input").remove();
				this.element.next("span").remove();
				this.element.show();
				$.Widget.prototype.destroy.call(this);
	        }
	    });
	}


	function setActions(){
		$destinoSearch.on('click', '.btn-agregar-destino-general', function(){
			addGeneralDestino();
		});

		$destinoSearch.on('click', '.btn-change', function(){
			var $btn = $(this);
			changeDestino($btn);
		});

		$destinoSearch.on('click', '.btn-delete', function(){
			var $btn = $(this);
			deleteDestino($btn);
			checkSearchButton();

		});

		$destinoSearch.on('click', '.btn-agregar-destino', function(){
			var isvalidmaxferrie = checkDestinosMaxFerrie(),
			isvalidmaxpais = checkDestinosMaxPais();

			if(isvalidmaxferrie)
				addFerrie();
			else if(isvalidmaxpais)
				addPais();
		});
	}

	function addGeneralDestino(){
		updateSearchButton(true);
		destinocount++;
		var id ="destino-"+destinocount;
		totalDestinos.general++;

		var html = '<div class="col-sm-12 col-xs-12 line-field-mod element-input-block dynamic-element"> <div class="col-xs-11 col-sm-12 general-number-container destino-input-container"> <select name="destinos[]" class="destino pais" id="'+id+'"></select> </div> <div class="col-xs-1 col-sm-3 icons-container"> <button type="button" class="icon io-Less btn-delete"></button> </div> </div>';

		$destinosContainer.append(html);
		
		appendOptions($('#'+id));

		checkAddDestinoButtonGeneral();
	}

	function checkAddDestinoButtonGeneral(){
		var isvalidgeneral = checkDestinosMaxGeneral();

		if(!isvalidgeneral)
			$('.btn-agregar-destino-general').prop('disabled', true);
		else
			$('.btn-agregar-destino-general').prop('disabled', false);
	}

	function deleteDestino($btn){

		var $destino = $btn.parent().parent().find('.destino'),
		isFerrie = $destino.hasClass('ferrie'),
		$container = $btn.closest('.element-input-block');

		if(isFerrie)
			totalDestinos.ferrie--;
		else
			totalDestinos.pais--;

		$container.remove();

		checkAddDestinoButton();

	}

	function changeDestino($btn){
		var isvalidmaxferrie = checkDestinosMaxFerrie(),
			isvalidmaxpais = checkDestinosMaxPais(),
			$icons = $btn.parent().parent(),
			$destino = $icons.parent().find('.destino-input-container').find('.destino'),
			isFerrie = $destino.hasClass('ferrie'),
			$icon = $icons.find('.icon-current');

		if(isFerrie && isvalidmaxpais){
			$destino.removeClass('ferrie');
			$destino.addClass('pais');
			$icon.addClass('io-marker');
			$icon.attr('title', 'País');
			$icon.removeClass('io-barco');
			$icons.find('.show-more-details .description p').html('Cambiar destino a ferrie.');
			totalDestinos.ferrie--;
			totalDestinos.pais++;

		}
		else if(isvalidmaxferrie){
			$destino.removeClass('pais');
			$destino.addClass('ferrie');
			$icon.addClass('io-barco');
			$icon.attr('title', 'Ferrie');
			$icon.removeClass('io-marker');
			$icons.find('.show-more-details .description p').html('Cambiar destino a país.');
			totalDestinos.pais--;
			totalDestinos.ferrie++;
		}

		checkAddDestinoButton();
		
	}

	function addPais(){
		updateSearchButton(true);
		destinocount++;
		var id ="destino-"+destinocount;
		totalDestinos.pais++;

		var html = '<div class="col-sm-12 col-xs-12 line-field-mod element-input-block dynamic-element"> <div class="col-xs-9 col-sm-12 general-number-container destino-input-container"> <select name="destinos[]" class="destino pais" id="'+id+'"></select> </div> <div class="col-xs-3 col-sm-3 icons-container"> <div class="show-more-details icon"> <button class="icon io-cambiar btn-change" type="button"></button> <div class="triangle-tooltip"> <div class="description"> <p>Cambiar destino a ferrie.</p> </div> </div> </div> <span class="icon io-marker icon-current" title="País"></span> <button type="button" class="icon io-Less btn-delete"></button> </div> </div>';
		$(html).insertBefore($destinoSearch.find('.btn-container'));
		
		appendOptions($('#'+id));

		checkAddDestinoButton();
		// initAutocomplete($('#'+id), destinocount);
	}

	function addFerrie(){
		updateSearchButton(true);
		destinocount++;
		var id ="destino-"+destinocount;
		totalDestinos.ferrie++;

		var html = '<div class="col-sm-12 col-xs-12 line-field-mod element-input-block dynamic-element"> <div class="col-xs-9 col-sm-12 general-number-container destino-input-container"> <select name="destinos[]" class="destino ferrie" id="'+id+'"></select> </div> <div class="col-xs-3 col-sm-3 icons-container"> <div class="show-more-details icon"> <button class="icon io-cambiar btn-change" type="button"></button> <div class="triangle-tooltip"> <div class="description"> <p>Cambiar destino a país.</p> </div> </div> </div> <span class="icon io-barco icon-current" title="Ferrie"></span> <button type="button" class="icon io-Less btn-delete"></button> </div> </div>';
		$(html).insertBefore($destinoSearch.find('.btn-container'));
		
		appendOptions($('#'+id));

		checkAddDestinoButton();
		//initAutocomplete($('#'+id), destinocount);
	}

	function checkAddDestinoButton(){
		var isvalidmaxferrie = checkDestinosMaxFerrie(),
			isvalidmaxpais = checkDestinosMaxPais(),
		$ferrie = $('.destino.ferrie').parent().next().find('.btn-change'),
		$pais = $('.destino.pais').parent().next().find('.btn-change'),
		disabledferrie = false,
		disabledpais = false;

		if(!isvalidmaxpais)
			disabledferrie = true;

		if(!isvalidmaxferrie)
			disabledpais = true;

		if(!isvalidmaxferrie && !isvalidmaxpais)
			$('.btn-agregar-destino').prop('disabled', true);
		else
			$('.btn-agregar-destino').prop('disabled', false);

		$ferrie.each(function(){
			var $e = $(this);

			$e.prop('disabled', disabledferrie);
		});

		$pais.each(function(){
			var $e = $(this);

			$e.prop('disabled', disabledpais);
		});
	}

	function checkDestinosMaxFerrie(){
		var valid = false;

		if(totalDestinos.ferrie < maxTotalDestinos.ferrie)
			valid = true;

		return valid;
	}

	function checkDestinosMaxPais(){
		var valid = false;

		if(totalDestinos.pais < maxTotalDestinos.pais)
			valid = true;

		return valid;
	}


	function checkDestinosMaxGeneral(){
		var valid = false;

		if(totalDestinos.general < maxTotalDestinos.general)
			valid = true;

		return valid;
	}

	function getDestinosData(first){

		$.getJSON( Services.apiURL.getRoamingDestinosJSON() , function( data ) {	 
			destinosArr = data;

			if(first){
				var $firstDestino = $('#destino-1');
				appendOptions($firstDestino);

				//Esta función es solo para simular que hay una busqueda ya hecha
				checkHasBusqueda();
			}
		});
	}

	function checkHasBusqueda(){

		if($destinoSearch.hasClass('has-busqueda-filtrado')){

			$('#destino-1 option[value="US"]').prop('selected',true);
			$('#destino-1').parent().find('input').val('United States');

			var $agregar = $destinoSearch.find('.btn-agregar-destino');

			$agregar.trigger('click');

			$('#destino-2 option[value="CA"]').prop('selected',true);

			$('#destino-2').parent().find('input').val('Canada');

			$agregar.trigger('click');

			$('#destino-3 option[value="JP"]').prop('selected',true);

			$('#destino-3').parent().find('input').val('Japan');

			$agregar.trigger('click');

			$('#destino-4 option[value="KR"]').prop('selected',true);

			$('#destino-4').parent().find('input').val('Korea');

			$agregar.trigger('click');
			
			$('#destino-5 option[value="AU"]').prop('selected',true);

			$('#destino-5').parent().find('input').val('Australia');



			$agregar.trigger('click');
			
			$('#destino-6 option[value="BR"]').prop('selected',true);

			$('#destino-6').parent().find('input').val('Brazil');



		}
		
	}

	function appendOptions($destino){
		var items = [];

		$.each( destinosArr , function( key, item ) {
		    items.push( "<option value='" + item.code + "'>" + item.name + "</option>" );
		});
		
		var html = items.join( "" );
		$destino.append(html);

		$destino.combobox({
			selected: function(event, ui) {
	           var $container = $destino.closest('.destino-input-container'),
            	 $error = $container.find('.error-destino'),
            	 id = $destino.attr('id'),
            	 $input = $container.find('input');

                $input.removeClass('error error-dd');
                $error.remove();

                totalErrores.splice($.inArray(id ,totalErrores),1);

                checkSearchButton();
	        }
		});			
	}

	function checkSearchButton(){
		
		var valid = checkDestinosValid();

		updateSearchButton(!valid);
	}

	function checkDestinosValid(){
		var $select = $('.form-destinos-multiple select.destino'),
		valid = true;

		destinosSeleccionados = [];


		$select.each(function(){
			var $el = $(this);

			if($el.val()=='')
				valid = false;
			else
				destinosSeleccionados.push($el.val());
		});

		return valid;
	}

	function updateSearchButton(disabled){
		var isCobertura = $destinoSearch.attr('id') == 'cobertura-form';

		if(isCobertura){
			var valid = $destinoSearch.validate().checkForm();
			disabled = !valid ? true : disabled;
		}

		$destinoSearch.find('button[type="submit"]').prop('disabled', disabled);
	}

	function resetElements(){
		destinocount = 1,
		totalDestinos = { 'general' : 1, 'ferrie' : $('select.destino.ferrie').length , 'pais' : $('select.destino.pais').length },
		totalErrores = [];
	}

	function destroyCombobox(){
		$destinoSearch.find('.dynamic-element select.destino').each(function (){
			var $destino = $(this);
			$destino.combobox('destroy');
		});

	}

	return{
		inicializar : init,
		isValid : checkDestinosValid,
		reset : resetElements,
		destroy : destroyCombobox,
		initGeneralComboBox : initGeneralComboBox
	}

})();


if($('.roaming-block').length > 0 || $('.autogestion-roaming-block').length>0  )
	roamingGeneral.inicializar();