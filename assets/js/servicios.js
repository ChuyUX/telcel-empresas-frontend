// SERVICIOS ANADIDOS //
var serviciosTelcel = (function(){

	var $mainTableContent = $('#modal-servicios .general-table .table-main-block');
	var sendingData = false;
	var $mainTableAct = $('#modal-servicios .general-table #servicios-activados');
	var $mainTableDes = $('#modal-servicios .general-table #servicios-desactivados');
	
	var dataServicios = [],
		dataServiciosLineas = [];
	var $listaServicios = $('.servicios-li .servicio-item');
	var $mainServicios = $('.autogestion-servicios-block');
	var _modalServicios = {};
	var modalServicios = null;
	//Estas variables posteriormente manejarlas como variables que asignen el valor de una API POST  no de una clase //
	var accion = $('.servicios-block-container').hasClass('activar') ? 'Activar' : 'Desactivar';
	var sinCosto = !$('.servicios-block-container').hasClass('activar');

	initmodalServicios();

	var isMasivo = false;
	var showDesactivado = false;

	var hash = window.location.hash;

	if(hash=='#infoSinServicios'){
		isMasivo = false;
		$('#header-con-servicios').addClass('hidden');
		$('#header-sin-servicios').removeClass('hidden');
		showDesactivado = true;
	}
	else if($mainServicios.hasClass('bloquear-acciones-masivas')){
		isMasivo = true;

		// Arreglo de los servicios
		dataServiciosLineas = [
			{
				id : 1, 
				numero : '5512345678',
				servicios : [1, 5, 6]
			},
			{
				id : 2, 
				numero : '5523456781',
				servicios : [2]
			},
			{
				id : 3, 
				numero : '5534567812',
				servicios : [1, 3, 4]
			},
			{
				id : 4, 
				numero : '5545678123',
				servicios : [1,4]
			},
			{
				id : 5, 
				numero : '55567891234',
				servicios : [1, 2, 3, 5, 6]
			},
			{
				id : 6, 
				numero : '55678912345',
				servicios : []
			},
			{
				id : 7, 
				numero : '5578123456',
				servicios : [5]
			},
			{
				id : 8, 
				numero : '5581234567',
				servicios : [1,6]
			}
		];
	}

	function checkFixedHeader(){
		var $lista = $('#servicios-listado-block .servicios-block-container');
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

	function getTotalLineasServicio(id){

		var total = 0;

		$.each(dataServiciosLineas, function( index, linea ) {

			if($.inArray(Number(id), linea.servicios)<0)
			{
				total+=1;
			}

		});

		return total;
	}

	function initmodalServicios(){

		var $total = $('#total-carrito');
		var total = 0;

		modalServicios = new modalesTelcel($('#modal-servicios'),{
			onInit : function(){
				initActionsModalAuxiliar();
				
			},
			onOpen : function(){
				total = 0;

				var $terminosContainer = $('#terminos-container');
				$terminosContainer.hide();
				setTimeout(function(){
					$('#modal-servicios .window-modal').addClass('visible');
				}, 1);
				
				updateModalData();
			},
			onReset : function(){
				$('#modal-servicios .window-modal').removeClass('visible');
			}
		});


		function updateModalData(){
			$mainTableAct.html('');
			$mainTableDes.html('');

			$.each(dataServicios, function( index, servicio ) {
				if(servicio.activoInicial != servicio.activoFinal || showDesactivado){
					if(servicio.activoFinal)
						updateTableAdd(servicio);
					else
						updateTableRemove(servicio);
					
				}
				else if(isMasivo){
					updateTableRemove(servicio);
				}

			});

			if($mainTableDes.find('>div').length>0)
				$('#servicios-desactivados-head').removeClass('hidden');
			else
				$('#servicios-desactivados-head').addClass('hidden');

			updateTotalCarrito();
		}

		function updateTotalCarrito(){
			$total.html((!sinCosto ? parseFloat(total).toFixed(2) : '0.00'));
		}

		function updateTableAdd(servicio){
			var totalLineas = 0,
				totalCosto = 0;

			servicio.costo = (typeof servicio.costo != 'undefined') ? servicio.costo : '0.00'

			if(isMasivo){
				totalLineas = getTotalLineasServicio(servicio.id);
				totalCosto = parseFloat(Number(servicio.costo)*totalLineas).toFixed(2);
			}

			var html = '';
			if(isMasivo && sinCosto)
				html = '<div class="col-sm-12 col-xs-12 center-block flexbox" id="c-servicio-'+servicio.id+'"> <div class="col-sm-6 col-xs-6 flexbox"> <p title="'+servicio.nombre+'">'+servicio.nombre+' <a href="" class="btn-terminos-servicios" data-name="'+servicio.nombre+'" data-tyc="'+servicio.tyc+'">Términos y condiciones</a> </p> </div> <div class="col-sm-6 col-xs-6 h-align-center flexbox"><p class="p-align-center"><small class="txt-100 description">'+totalLineas+'</small></p></div></div>';
			else
				html = '<div class="col-sm-12 col-xs-12 center-block flexbox" id="c-servicio-'+servicio.id+'"> <div class="'+(isMasivo ? 'col-sm-4 col-xs-3' : 'col-xs-7 col-sm-7')+' flexbox"> <p title="'+servicio.nombre+'">'+servicio.nombre+' <a href="" class="btn-terminos-servicios" data-name="'+servicio.nombre+'" data-tyc="'+servicio.tyc+'">Términos y condiciones</a> </p></div> '+(isMasivo ? '<div class="col-sm-2 col-xs-3 h-align-center flexbox"><p class="p-align-center"><small class="txt-100 description">'+totalLineas+'</small></p></div><div class="col-sm-3 col-xs-3 h-align-center flexbox"><p class="p-align-center"><strong>'+ ( servicio.costo>0 && !sinCosto ? '$'+Number(servicio.costo).toFixed(2) : 'Sin costo' )+'</strong></p></div>' : '')+'<div class="'+(isMasivo ? 'col-sm-3 col-xs-3' : 'col-sm-5 col-xs-5')+' flexbox h-align-center"> <p class="p-align-center"><strong> '+( isMasivo ? ( totalCosto >0 && !sinCosto ? '$'+totalCosto : 'Sin costo') : (servicio.costo>0 && !sinCosto ? Number(servicio.costo).toFixed(2) : 'Sin costo'))+'</strong></p> </div> </div>';

			$mainTableAct.append(html);

			if(isMasivo)
				total+=totalCosto;
			else
				total+=Number(servicio.costo);
		}

		function updateTableRemove(servicio){

			var totalLineas = 0;
			var html = '';

			if(isMasivo){
				totalLineas = dataServicios.length-getTotalLineasServicio(servicio.id);
			}

			if(isMasivo && totalLineas<1)
				html = '';
			else
				html = '<div class="col-sm-12 col-xs-12 center-block flexbox  v-align-center" id="c-servicio-'+servicio.id+'"> <div class="'+(isMasivo ? 'col-sm-4 col-xs-3' : 'col-xs-7 col-sm-7')+' flexbox"> <p title="'+servicio.nombre+'">'+servicio.nombre+'</p> </div> '+(isMasivo ? '<div class="col-sm-2 col-xs-3 h-align-center flexbox"><p><small class="txt-100 description">'+totalLineas+'</small></p></div><div class="col-sm-3 col-xs-3 h-align-center flexbox"><p><strong> - </strong></p></div>' : '')+'<div class="'+(isMasivo ? 'col-sm-3 col-xs-3' : 'col-sm-5 col-xs-5')+' flexbox h-align-center"> <p><strong> - </strong></p> </div> </div>';

			$mainTableDes.append(html);

		}
		function initActionsModalAuxiliar(){

			// $('#modal-confirmar-autogestion').on('click', '#btn-confirmar-autogestion', function(){
				
			// 	$(_modalServicios.element+' #listado-confirmacion-autogestion').submit();

			// });

		}

	}

	function updateSelectData($switch){
		var $parent = $switch.closest('.servicio-item');
		var index = ( typeof $switch.data('index') != 'undefined' ? $switch.data('index') : null );

		var $select = $parent.find('.extra-select');

		if($select.length>0)
			if($switch.is(":checked")){
				var $container = $parent.find('.servicios-dropdown-select');
				$container.removeClass('hidden');
				$select.addClass('required');
				var preselected = ( typeof $select.data('preselected') != 'undefined' ? $select.data('preselected') : null );
				if(preselected!=null){
					$select.val(preselected);
					$select.trigger('change');
				}
			}
			else{
				var $parent2 = $switch.closest('.servicios-li-content');
				var $priceUpdate = $parent2.find('.info-servicio .txt-container small strong');
				$priceUpdate.html('$0.00');
				var $container = $parent.find('.servicios-dropdown-select');
				$container.addClass('hidden');
				$select.removeClass('required');
				$select.val('');
			}

	}

	function setActions(){
		$(".cmn-toggle.switch-input").change(function() {
			var $element = $(this);
			changeSwitch($element);
			updateSelectData($element);
		});

		$(".servicios-tooltip-container").on('click', '.btn-resumen', function(e){
			e.preventDefault();
			checkModalToOpen();
		});

		$(".button-container").on('click', '.mostrar-servicios-btn', function(e){
			e.preventDefault();
			checkModalToOpen();
		});

		$(".servicios-li").on('change', '.extra-select', function(){

			var $select = $(this);
			var index = ( typeof $select.data('index') != 'undefined' ? $select.data('index') : null );
			
			cleanExtraErrors();

			$('.extra-select').val($select.val());

			var $parent = $select.closest('.servicios-li-content');
			var $priceUpdate = $parent.find('.info-servicio .txt-container small strong');

			if(index!=null){

				var $element = $('#cmn-toggle-'+dataServicios[index].id);
				var $selected = $select.find(':selected');
				var costo = (typeof $selected.data('costo') ? $selected.data('costo') : '');
				var name = (typeof $selected.data('name') ? 'Más Megas '+$selected.data('name') : 'Internet');
				var single = (typeof $selected.data('single') ? $selected.data('single') : '');

				if(costo != ''){
					$element.prop('checked', true);
					dataServicios[index].costo = costo;
					$priceUpdate.html('$'+Number(costo).toFixed(2));
				}
				else{
					$element.prop('checked', false);
					$priceUpdate.html('$0.00');
					costo = '0.00';
				}

				dataServicios[index].nombre = name;

				/**Actualizar el dropdown**/
				var $dropdowncontainer = $parent.find('.dropdown-selected-option');
				$dropdowncontainer.find('.main .valor').html(single);
				$dropdowncontainer.find('.value .valor').html('$'+costo);
				/**Fin actualizar el dropdown**/

				changeSwitch($element);
				
			}

		});

		$('#checkbox-autogestion-terminos').change(function() {
			$('#btn-contratar-servicios').prop('disabled', !validateFormData());
		});

		$('#btn-contratar-servicios').click(function(){
			if(!sendingData){
				var urlPost = ( typeof $(this).data('post') != 'undefined' ? $(this).data('post') : null );
				sendData('.servicios-block', urlPost);
			}
		});
		/**
			Ordenar elementos de listado de líneas 
		**/
		$('.has-filters .order-by-html').on('click', 'button', function(e){
			var opciones = ( typeof $(this).data('opc') != 'undefined' ? $(this).data('opc') : null );

			var main = ( typeof $(this).closest('.has-filters').data('order') != 'undefined' ? $(this).closest('.has-filters').data('order') : null );
			
			if(opciones!=null && main!=null){
				var $main= $(main);
				var $children = $main.children('.linea-batch');
				sorted = orderItemsHTML(opciones, $main, $children);
			}


		});

		/**
			Mostrar/Ocultar tablas
		**/
		$('.collapse-table-block').on('click', '.hide-show-table', function(e){
			var table = ( typeof $(this).data('table') != 'undefined' ? $(this).data('table') : null );
			if(table!=null){
				var text = $(this).text();
    			$(this).text(
        		text == "Mostrar detalle" ? "Ocultar detalle" : "Mostrar detalle");
				$(table).slideToggle( 500 )
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
	}

	function sendData(form, urlPOST){
		sendingData = true; 
		$(form).find('button[type="submit"]').prop('disabled', true);

		var self = $(form).serialize();
		var redirect = urlPOST;
		//loadingIcon(form, true);

		urlPOST = checkDevelopmentPostHTML(urlPOST);

		$.post(  urlPOST , self )
		.done(function( data ) {

		  	//loadingIcon(form, false);
		  	Services.servicios.contratarServiciosSuccessCallback(data, form, redirect);
			sendingData = false;

		 })
		.fail(function( jqxhr, textStatus, error ) {
			//loadingIcon(form, false);
		  	Services.servicios.contratarServiciosFailCallback(error, form);
		  	sendingData = false;
		});
	}

	function cleanExtraErrors(){
		var $select = $('.extra-select');
		$select.removeClass('error').removeClass('error-dd');
		$('.extra-select-block').removeClass('error').removeClass('error-dd');
		$('.label-error').remove();
	}

	function validateFormData(){
		var $select = $('#servicios-listado-block .extra-select.required');

		var selectValid = true;

		if($select.length>0)
			selectValid= validateSelect($select);

		if($('#checkbox-autogestion-terminos').is(":checked") && selectValid)
			return true;

		return false;

	}
	
	
	function extraSelectDesktop(){
		$('.dropdown-select .ds-selected').on('click', function(e) {
			e.stopPropagation();
			var $select = $(this).parent('.dropdown-select');
		  	$select.find('.dd').slideToggle('fast');
		});

		$('.dropdown-select .dd ul li').on('click', function() {
			var $selected = $(this);
			var $drowpdown = $selected.closest('.dropdown-select');
		  	$drowpdown.find('.dd').hide();

		  	updateSelectedDropdown($selected, $drowpdown);
		});

		function getSelectedValue(id) {
		  return $("#" + id).find(".ds-selected a span.value").html();
		}

		$(document).bind('click', function(e) {
		  var $clicked = $(e.target);
		  if (!$clicked.parents().hasClass("dropdown")) $(".dropdown-select .dd").hide();
		});

	}

	function updateSelectedDropdown($selected, $dropdown){
		var value = $selected.data('value'),
		single = $selected.data('single'),
		costo = $selected.data('costo');

		var $parent = $dropdown.closest('.servicios-li-content');
		var $select = $parent.find('div.extra-select-block select');
		var $dropdowncontainer = $dropdown.find('.dropdown-selected-option');

		$dropdowncontainer.find('.main .valor').html(single);
		$dropdowncontainer.find('.value .valor').html('$'+costo);

		$select.val(value);
		$select.trigger('change');

	}

	function checkModalToOpen(){

		var $select = $('#servicios-listado-block .extra-select.required');
		var valid = true;

		if($select.length>0)
			valid = validateSelect($select);
		
		if(valid == true)
			modalServicios.openModal();


	}
	
	function validateSelect($selects){
		var valid = true;
		var $first = null;

		$selects.each(function (index, select) { 
			var $select = $(this);

			if($select.val() === ''){
				if($first == null)
					$first = $select;

				valid = false;

				var $parent = $select.parent('');

				$select.addClass('error').addClass('error-dd');
				$('.extra-select-block').addClass('error').addClass('error-dd');

				if($parent.parent().find('.label-error').length==0)
					$( '<label class="error error-dd label-error">Elige una opción para continuar.</label>' ).insertAfter( $parent );

				return;
			}
		});

		if($first!=null)
			scrollToElement($first);

		return valid;
	}




	function changeSwitch($switch){

		var $parent = $switch.closest('.servicio-item');
		var index = ( typeof $switch.data('index') != 'undefined' ? $switch.data('index') : null );

		var $select = $parent.find('.extra-select');

		if($switch.is(":checked")){
			if(index!=null)
				agregarCarrito(index, $parent);
		}
		else{
			if(index!=null)
				eliminarCarrito(index, $parent);
		}

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

		var totalModificados = 0;

		$.each(dataServicios, function( index, servicio ) {

			if(servicio.activoInicial != servicio.activoFinal){
				totalModificados+=1;
			}

		});

		return totalModificados;
	}

	function agregarCarrito(index, $parent){


		$parent.find('.status').html(accion);
		$parent.addClass('checked');

		dataServicios[index].activoFinal = true;

	}

	function eliminarCarrito(index, $parent){
		$parent.find('.status').html('');
		$parent.removeClass('checked');

		dataServicios[index].activoFinal = false;

	}

	function initServicios(){

		$listaServicios.each(function (index, value) { 

			var $element = $(this);
			var meta = ( typeof $element.data('item') != 'undefined' ? $element.data('item') : null );


			if(meta != null){
				meta.activoInicial = (typeof meta.activoInicial != "undefined" && meta.activoInicial=="true" ? true : false);

				var elemento = generarHTMLServicios(meta, index);
				$element.html(elemento);

				if(meta.activoInicial && !isMasivo)
					$element.addClass('checked');

				meta.activoFinal = meta.activoInicial;

				dataServicios.push(meta);
			}
		});

		extraSelectDesktop();
	}

	function addOpcionesSelect(opciones, preselected, id, i){
		var html = {
			dropdown: '',
			select : ''
		};

		html.select = '<div class="servicios-dropdown-select hidden"><div class="data-write slt extra-select-block hidden-sm hidden-md hidden-lg"><select name="costo-extra-'+id+'" class="extra-select" data-index="'+i+'" data-preselected ="'+preselected+'">';
		html.select += '<option value="">Elige una opción</option>';

		html.dropdown ='<div class="servicios-dropdown-select hidden"><p class="dropdown-txt"><strong>Elige una opción:</strong></p><div class="inner-servicios-dropdown flexbox v-align-center"><div class="dropdown-select hidden-xs" id="costo-extra-'+id+'"> <div class="ds-selected"> <div class="dropdown-selected-option option flexbox"> <div class="ds-element main"> <span class="valor robusta">800</span> <span class="nombre">MB</span> </div> <div class="ds-element value"> <span class="valor robusta">$99</span> <span class="nombre">Costo</span> </div> <div class="col-sm-2 arrow"> <span class="icon i-angle-down"></span> </div> </div> </div> <div class="dd"> <div class="dropdown-select-options"> <ul>';

		$.each(opciones, function( index, opcion ) {
			html.select +='<option value="'+opcion.id+'" data-name="'+opcion.texto+'" data-costo="'+opcion.costo+'" data-single="'+opcion.single+'">'+opcion.single+'MB - $'+opcion.costo+' mensual</option>';

			html.dropdown += '<li data-name="'+opcion.texto+'" data-single="'+opcion.single+'" data-costo="'+opcion.costo+'" data-value="'+opcion.id+'"> <div class="option flexbox"> <div class="ds-element"> <span class="valor robusta">'+opcion.single+'</span> <span class="nombre">MB</span> </div> <div class="ds-element"> <span class="valor robusta">$'+opcion.costo+'</span> <span class="nombre">Costo</span> </div> </div> </li>';
		});

		html.select += '</select></div></div>';

		html.dropdown += '</ul> </div> </div> </div> <div class="vigencia-container hidden-xs"> <span class="valor robusta">Mensual</span> <span class="nombre">Vigencia</span> </div></div> </div>';

		return html;
		
	}

	function generarHTMLServicios(meta, index){

		var opciones = ( typeof meta.opciones != 'undefined' ? meta.opciones : null );
		var preselected = ( typeof meta.preselected != 'undefined' ? meta.preselected : null );

		var htmlOpciones = {
			dropdown: '',
			select : ''
		};

		if(opciones!=null && !sinCosto)
			htmlOpciones = addOpcionesSelect(opciones, preselected, meta.id, index);

		var html = '<div class="servicios-li-content has-inner-tc col-sm-12 col-xs-12"> <div class="col-sm-12 col-xs-12"><div class="col-sm-8 col-xs-8 flexbox"> <span class="icon '+( meta.icono ? meta.icono : 'io-Phone' )+'"></span> <div class="info-servicio col-sm-10 col-xs-12"> <label class="txt-container"> <strong class="txt-underline">'+meta.nombre+'</strong> ';
			html += (typeof meta.costo != 'undefined' && !sinCosto) ?'<small>Cargo mensual por servicio <strong>$'+meta.costo+'</strong></small>' : '<small><strong></strong></small>';
			html += ' </label> <p>'+meta.descripcion+'</p>'+htmlOpciones.dropdown+' <a href="" class="btn-terminos-general hidden-xs">Ver Términos y condiciones</a></div> </div> <div class="col-sm-4 col-xs-4 flexbox"> <div class="switch-container"> <div class="switch"> <input id="cmn-toggle-'+meta.id+'" class="cmn-toggle switch-input" type="checkbox" '+(meta.activoInicial ? 'checked' : '')+' value="'+meta.id+'" data-index="'+index+'"> <label for="cmn-toggle-'+meta.id+'"></label> </div> <p class="status">'+(meta.activoInicial ? accion : '')+'</p> </div> </div></div><div class="mobile-description"><p>'+meta.descripcion+'</p>'+htmlOpciones.select+'</div><a href="" class="btn-terminos-general mobile-btn hidden-sm hidden-md hidden-lg">Ver Términos y condiciones</a><div class="terminos-container-general-block"><div class="triangle-tooltip fadein terminos-container col-sm-12 col-xs-12"> <div class="head-content col-sm-12"> <div class="close-container col-sm-12 col-xs-12"><span class="icon io-CloseSession" data-hide=".terminos-container"></span></div> </div> <div class="terminos-y-condiciones-block"> <div class="head-content col-sm-12"> <p class="col-sm-10 col-xs-10"><strong>Términos y condiciones</strong></p> </div> <p>'+meta.tyc+'</p> </div> </div></div> </div>';



		return html;
	}



	return{
		inicializar: function(){
			initServicios();
			setActions();
			checkFixedHeader();
		}
	}
})();