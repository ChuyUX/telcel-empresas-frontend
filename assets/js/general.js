// VARIABLE PARA TESTEAR NUESTROS POST
var postURL = 'http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php';
var postURLUpload = 'http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/upload.php';
var homeURL = '../index.html';
var imgUrl = '../../assets/img/';
var initialWidth = $(window).width(),
initialHeight = $(window).height();
var EnvironmentServices = {'development': EnvironmentServicesDevelopment, 'production': EnvironmentServicesProduction };

var Services  = (isDevelopmentEnvironment()) ? EnvironmentServices.development : EnvironmentServices.production;

checkBrowserCompatibility();
getOsName();

function checkBrowserCompatibility(){

	var browsers = [
		{ 'name': 'Microsoft Edge', 'minVersion': '12' },
		{ 'name': 'Samsung Internet', 'minVersion': '1' },
		{ 'name': 'Opera Mini', 'minVersion': '24'},
		{ 'name': 'Opera', 'minVersion': '24' },
		{ 'name': 'Chrome', 'minVersion': '21'},
		{ 'name': 'Chrome Mobile', 'minVersion': '21' },
		{ 'name': 'Firefox', 'minVersion': '16' },
		{ 'name': 'Firefox for iOS', 'minVersion': '16' },
		{ 'name': 'IE', 'minVersion': '10' },
		{ 'name': 'Safari', 'minVersion': '6.4' }
	];
	var $body = $('body');

	var found = false;
	var compatible = true;

	for (var i = 0; i < browsers.length; i++) {
		if (platform.name == browsers[i].name){
			found = true;
			var min_version = parseFloat(browsers[i].minVersion);
			// console.log('Min version: ' + min_version);
			if(!isNaN(min_version) && min_version > parseFloat(platform.version)){
				compatible = false;
			}
		}
	}

	//console.log('Navegador: '+ platform.name + ' v. '+ platform.version);
	if(compatible){
		//setNoCompatibleScreen();
		var hasSwipers = ( $('body .swiper-mobile').length>0 ? true : false );

		$body.addClass('loaded');

		//15 del fix de los lados
		var initw = $(window).width()+15;

		if(hasSwipers && initw < 768)
			generalFullLoadingIcon($('body'), true);
			
		//console.log('!Navegador compatible¡');
	}else{
		
		setNoCompatibleScreen();
		throw new('Navegados no compatible');
	}

	return compatible;
}

function setNoCompatibleScreen(){
	var template_url = '../../sections/navegador-no-soportado/no-compatible.html';

	var $body = $('body'),
	$container = $body.find('.full-content');

	$.get( template_url , function( template ) {
		$body.addClass('no_heading-footer no-compatible-msg');
		$container.html('');
		$container.append(template);

		var browsers = getOsBrowsers();

		$(browsers).removeClass('hidden');
		$body.addClass('loaded');
		
    });
}

function getOsBrowsers(){
	var os_browsers = false;

	var os_linux = ['CentOS', 'Debian', 'Fedora', 'FreeBSD', 'Gentoo', 'Haiku', 'Kubuntu', 'Linux Mint', 'OpenBSD', 'Red Hat', 'SuSE', 'Ubuntu', 'Xubuntu', 'Cygwin', 'Symbian OS', 'hpwOS', 'webOS ', 'webOS', 'Tablet OS', 'Tizen', 'Linux', "Debian", "Fedora", "Red Hat", "SuSE", "Ubuntu"];
	var os_mac = ["OS X", 'Mac OS X', 'Macintosh', 'Mac'];
	var os_windows = ['Windows 98;','Windows ',"Windows", "Windows Server 2008 R2 / 7", "Windows Server 2008 / Vista", "Windows XP"];
	// console.log(platform.os);
    for (var i = 0; i < os_windows.length; i++) {
    	if(platform.os.family == os_windows[i]){
    		if(parseFloat(platform.os.version)>=10)
    			os_browsers = '.c-edge,.c-firefox,.c-chrome';
    		else
    			os_browsers = '.c-ie,.c-firefox,.c-chrome';
    	}
    }

    if(!os_browsers){
	    for (var i = 0; i < os_mac.length; i++) {
	    	if(platform.os.family == os_mac[i]){
	    		os_browsers = '.c-safari,.c-firefox,.c-chrome';
	    	}
	    }    	
    }

    if(!os_browsers){
	    for (var i = 0; i < os_linux.length; i++) {
	    	if(platform.os.family == os_linux[i]){
	    		os_browsers = '.c-firefox,.c-chrome';
	    	}
	    }    	
    }

// Mac:  Safari, Firefox, Chrome
// Windows 10: Edge Firefox Chrome
// Windows <10: Iexplore Firefox Chrome
// Linux: Firefox Chrome
    if(!os_browsers)
    	os_browsers ='.c-safari,.c-ie,.c-firefox,.c-chrome,.c-edge';

    return os_browsers;
}

function getOsName(){
	var os_name = false;

	var os_linux = ['CentOS', 'Debian', 'Fedora', 'FreeBSD', 'Gentoo', 'Haiku', 'Kubuntu', 'Linux Mint', 'OpenBSD', 'Red Hat', 'SuSE', 'Ubuntu', 'Xubuntu', 'Cygwin', 'Symbian OS', 'hpwOS', 'webOS ', 'webOS', 'Tablet OS', 'Tizen', 'Linux', "Debian", "Fedora", "Red Hat", "SuSE", "Ubuntu"];
	var os_mac = ["OS X", 'Mac OS X', 'Macintosh', 'Mac'];
	var os_windows = ['Windows 98;','Windows ',"Windows", "Windows Server 2008 R2 / 7", "Windows Server 2008 / Vista", "Windows XP"];

    //Mobile: "Android", "iOS" and "Windows Phone"

    for (var i = 0; i < os_windows.length; i++) {
    	if(platform.os.family == os_windows[i]){
    		os_name = 'Windows';
    	}
    }

    if(!os_name){
	    for (var i = 0; i < os_mac.length; i++) {
	    	if(platform.os.family == os_mac[i]){
	    		os_name = 'Macintosh';
	    	}
	    }    	
    }

    if(!os_name){
	    for (var i = 0; i < os_linux.length; i++) {
	    	if(platform.os.family == os_linux[i]){
	    		os_name = 'Linux';
	    	}
	    }    	
    }

    if(!os_name)
    	os_name = platform.os.family;

    //console.log('OS: ' +os_name);

    return os_name;
}


function isDevelopmentEnvironment(){
	var response = false;
	var development_domains = ['localhost:3000','multiplicamx.com','www.multiplicamx.com'];

	for (var i = 0; i < development_domains.length; i++) {
		if (checkEnvironment(development_domains[i]))
			response = true;
	}

	return response;
}

function checkEnvironment(domain){
	var url_array = window.location.href.split("/");

	var found = false;

	for (var i = 0; i < url_array.length; i++) {
		if (url_array[i] == domain)
			found = true;
	}

	return found;
}

/* Checa si se esta haciendo un post a un html */
function checkDevelopmentPostHTML(apiURL){

	if (apiURL.slice(apiURL.length-5,apiURL.length) === '.html')
		apiURL = Services.apiURL.generalTest();

	return apiURL;
}

/* Checa si se esta haciendo un post a un html */

var generalCheckBoxAll = (function(){

	var $main = $('#listado-check-all-container.general-block'),
	isLimited = $('#listado-check-all-container.general-block').hasClass('limit-data') && typeof $main.data('limit') != 'undefined',
	limit = (isLimited ? $main.data('limit') : 0),
	$paginaCheckbox = $main.find('#checkbox-pagina-all'),
	$allCheckbox = $('#check-all-elements'),
	$elementContainer = null,
	$elements = null,
	$mainBtn = null,
	allChecked = false,
	//Aquí hardcodeo en total de checkbox en todas las páginas
	totalcheckbox = 0,
	checkedElements = [],
	texto = '',
	pronombre = 'las';


	function checkElementExists(){
		if($main.length>0)
			initGeneralCheckBoxAll();
	}

	function getCheckedElements(){
		var checkedData = { all: false , data : [], total : 0};

		if(allChecked)
		{
			checkedData.all = true;
			checkedData.total = totalcheckbox;
		}
		else{
			checkedData.data = checkedElements;
			checkedData.total = checkedElements.length;
		}

		return checkedData;
	}

	function initGeneralCheckBoxAll(){
		$elementContainer = ( typeof $main.data('elements') != 'undefined' ? $($main.data('elements')) : null );

		if($elementContainer.length>0){
			setVariables();
			initActions();
		}
	}

	function setVariables(){
		$elements = $elementContainer.find('linea-batch');
		$mainBtn = ( typeof $main.data('btn') != 'undefined' ? $($main.data('btn')) : null );
		texto = ( typeof $main.data('elemento') != 'undefined' ? $main.data('elemento') : '' );
		pronombre = ( typeof $main.data('pronombre') != 'undefined' ? $main.data('pronombre') : 'las' );
	}

	function initActions(){
		setActionsCheckbox();

		//**obtener el total de lineas de todas las páginas o actualizar**/
		totalcheckbox = (typeof $main.data('total') != 'undefined' ? $main.data('total') : 22);
	}


	function checkButtonsActive(){
		if($elementContainer.find('input[type="checkbox"]:checked').length>0)
			$mainBtn.prop('disabled', false);
		else
			$mainBtn.prop('disabled', true);
	}

	function setMessageCheckbox(selectAll){

		var totalpagecheckbox = $elementContainer.find('input[type="checkbox"]:checked').length;

		$('.total-all-pagina-checkbox').html(totalcheckbox);
		if(isLimited && totalcheckbox>limit)
			$allCheckbox.addClass('hidden');

		if(totalpagecheckbox == 0){
			$paginaCheckbox.prop("checked", false);
			$('.listado-select-all-block').removeClass('active');
			$('.listado-select-all-block').trigger('cssClassChanged');
		}
		else if(selectAll){
			$allCheckbox.html('Anular la selección');
			$('#total-pagina-checkbox').html('todo el listado.');
			$('#total-checkbox').html(totalcheckbox);
		}
		else{
			$allCheckbox.html('Seleccionar '+pronombre+' <strong>'+totalcheckbox+'</strong> '+texto+' del listado');
			$('#total-pagina-checkbox').html('esta página'+(isLimited ? ' (puede elegir máximo '+limit+')' : '' )+'.');	
			$('#total-checkbox').html(totalpagecheckbox);		
		}

		if(isLimited && totalpagecheckbox ==0)
			$('.listado-select-all-block').removeClass('active');
		else{
			$('.listado-select-all-block').addClass('active');
		}

		$('.listado-select-all-block').trigger('cssClassChanged');

	}


	function setActionsCheckbox(){

		allChecked = false;

		actionsCheckboxIndividual();

		actionsCheckboxAll();

		actionsCheckboxAllPagina();

	}

	function updateCheckboxElement($checkbox){
		var index = checkedElements.indexOf($checkbox.val());
		 // && index == -1
		if($checkbox.is(':checked'))
			checkedElements.push($checkbox.val());
		//&& index > -1
		else if(!$checkbox.is(':checked'))
			checkedElements.splice(index, 1);
	}

	function actionsCheckboxIndividual(){

		//CHECKBOX INDIVIDUAL
		$elementContainer.on('change', 'input[type="checkbox"]', function(e){
			e.stopPropagation();
			var $checkbox = $(this);
			var totalNew = checkedElements.length + 1;

			if(limit>0 && totalNew>limit && $checkbox.is(':checked')){
				$checkbox.prop('checked', false);
				// $('#modal-limitar-masivo .regular-msg').addClass('hidden');
				// $('#modal-limitar-masivo .limit-data-msg').removeClass('hidden');
				modalLimitarMasivo.openModal();
			}
			else{
				
				var $container = $checkbox.closest('.linea-batch, .row-ls');
				$container.toggleClass('checked-element');

				if($elementContainer.find('input[type="checkbox"]').length == $elementContainer.find('input[type="checkbox"]:checked').length){
					$paginaCheckbox.prop('checked', true);
					setMessageCheckbox(false);
				}
				else if(isLimited){
					setMessageCheckbox(false);
				}
				else{
					allChecked = false;
					$paginaCheckbox.prop('checked', false);
					$allCheckbox.data('value', true);
					$('.listado-select-all-block').removeClass('active');
					$('.listado-select-all-block').trigger('cssClassChanged');
				}

				//Agregar elemento a arreglo
				updateCheckboxElement($checkbox);

				checkButtonsActive();
			}

		});
	}

	function actionsCheckboxAllPagina(){

		$('.listado-select-all-block .elements-name').html(texto);


		$paginaCheckbox.change(function(e) {

			e.stopPropagation();

			var totalNew = $elementContainer.find('input[type="checkbox"]').length;

			if(limit>0 && totalNew>limit && $paginaCheckbox.is(':checked')){
				$paginaCheckbox.prop('checked', false);
				// $('#modal-limitar-masivo .regular-msg').addClass('hidden');
				// $('#modal-limitar-masivo .limit-data-msg').removeClass('hidden');
				modalLimitarMasivo.openModal();
			}
			else{
				// //SE ACTUALIZA CADA UNO DE LOS ELEMENTOS DE LA PÁGINA
				$elementContainer.find('input[type="checkbox"]').each(function( index ) {

					var $checkbox = $(this);
					var $parent = $checkbox.closest('.linea-batch, .row-ls');

					if($paginaCheckbox.is(":checked")){
						$checkbox.prop( "checked", true );
						$parent.addClass('checked-element');
					}
					else {
						$checkbox.prop( "checked", false );
						$parent.removeClass('checked-element');
					}

					updateCheckboxElement($checkbox);

				});

				//MOSTRAR EL MENSAJE PARA PODER SELECCIONAR TODOS
				if($paginaCheckbox.is(":checked")) {
					setMessageCheckbox(false);
				}
				else{
					$allCheckbox.data('value', true);
					$('.listado-select-all-block').removeClass('active');
					$('.listado-select-all-block').trigger('cssClassChanged');
				}

				checkButtonsActive();
			}
			
		});
	}

	function actionsCheckboxAll(){

		$allCheckbox.click(function(e) {

			e.preventDefault();
			e.stopPropagation();

			var flag = $allCheckbox.data('value');

			allChecked = flag;
			
			var totalNew = totalcheckbox;

			if(limit>0 && totalNew>limit && allChecked){
				$allCheckbox.prop('checked', false);
				// $('#modal-limitar-masivo .regular-msg').addClass('hidden');
				// $('#modal-limitar-masivo .limit-data-msg').removeClass('hidden');
				modalLimitarMasivo.openModal();
			}
			else{
				$paginaCheckbox.prop('checked', flag);

				$elementContainer.find('input[type="checkbox"]').each(function( index ) {

					var $checkbox = $(this);
					$checkbox.prop( "checked", flag );

					var $parent = $checkbox.closest('.linea-batch, .row-ls');

					if(flag)
						$parent.addClass('checked-element');
					else
						$parent.removeClass('checked-element');

				});

				$allCheckbox.data('value', !flag);

				if(flag){
					setMessageCheckbox(flag);
				}
				else{
					$('.listado-select-all-block').removeClass('active');
					$('.listado-select-all-block').trigger('cssClassChanged');
					//$('#total-pagina-checkbox').html('esta cuenta.');				
				}

				checkButtonsActive();
			}
		});

	}

	return{
		inicializar: function(){
			checkElementExists();
		},
		getCheckedElements : getCheckedElements
	}

})();

var initializedDate = false;

var generalDatePicker = (function(){
	var $searchMovimientos = $('.general-fs-container#search-movimientos-container');

	var range = { 'init' : null, 'fin' : null },
	maxDate = null,
	maxDateData = null,
	maxDate = null,
	minDate = null,
	minDateData = null,
	minDate = null,
	currentDate = null;

	function initCalendars(){
		initializedDate = true;
		init();
		setActions();
	}

	function initCalendar(){
		var $datepickers = $( '.date-picker' );

		$datepickers.each(function() {

			var $datepicker = $(this),
			$fechaSpan = $datepicker.find('.one-field'),
			$calendar = $datepicker.find('.calendar'),
		  	fields = (typeof $fechaSpan.data('field') != 'undefined' ? $fechaSpan.data('field') : null),
		  	name = (fields != null && typeof fields.name != 'undefined' ? fields.name : null),
		  	currentDate = $fechaSpan.html(),
		  	exclude = (typeof $calendar.data('exclude') != 'undefined' ? $calendar.data('exclude').replace(/ /g, '') : ''),
		  	exclude = exclude.split(',');

		  	$calendar.datepicker({
		        dateFormat: 'dd/mm/yy',
				firstDay: 1,
				beforeShowDay: function(date){
			        var string = jQuery.datepicker.formatDate('dd/mm/yy', date);
			        return [ exclude.indexOf(string) == -1 ]
			    }
			});

		  	if(name!=null){
		  		$( '<input type="hidden" class="fecha-input" name="'+name+'" id="input-'+name+'" value="'+currentDate+'"/>' ).insertAfter( $fechaSpan );
		  	}

		  	$calendar.datepicker( "option", "minDate", range.init );
		  	$calendar.datepicker( "option", "maxDate", range.fin );

		  	if( $('.calendar.fin').length>0)
				$( '.calendar.fin' ).parents('.date-picker').addClass('disabled');

		  	if(currentDate!=''){
		  		$calendar.datepicker( "setDate" , currentDate );
		  		if(!$( '.calendar.fin' ).parents('.date-picker').hasClass('preselected'))
		  			$( '.calendar.fin' ).parents('.date-picker').removeClass('disabled');

		  		if($('.date-pickers-container').length>0 && $calendar.hasClass('init'))
		  			updateDateRange($calendar, currentDate);
		  	}

		});
	}

	function init(){
		$.datepicker.regional['es'] = {
			closeText: 'Cerrar',
			prevText: '',
			nextText: '',
			currentText: 'Hoy',
			monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
			monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
			dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
			dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
			dayNamesMin: ['D','L','M','M','J','V','S'],
			weekHeader: 'Sm',
			dateFormat: 'dd/mm/yy',
			firstDay: 0,
			isRTL: false,
			showMonthAfterYear: false,
			yearSuffix: ''
		 };

		$.datepicker.setDefaults($.datepicker.regional['es']);

		var $calendarFirst = ( $( '.calendar.init' ).length>0 ? $( '.calendar.init' ) : $( '.calendar' ));

		maxDate = (typeof $calendarFirst.data('max') != 'undefined' ? $calendarFirst.data('max') : null );
		maxDateData = (maxDate != null ? maxDate.split('/') : null);
		maxDate = (maxDateData != null ? new Date(maxDateData[2], maxDateData[1]-1, maxDateData[0] ) : new Date()),
		minDate = (typeof $calendarFirst.data('min') != 'undefined' ? $calendarFirst.data('min') : null );
		minDateData = (minDate != null ? minDate.split('/') : null);
		minDate = (minDateData != null ? new Date(minDateData[2], minDateData[1]-1, minDateData[0] ) : new Date()),
		exclude = [];

		range = {'init' : minDate, 'fin' : maxDate };

		initCalendar();


	}

	function closeCalendar(){
		$('.date-picker').removeClass('open');
		$('body').removeClass('settings-open');
	}


	function setActions(){

		$(window).on("resize", closeCalendar);

		/** Mostrar/Esconder Calendario**/
		$('.date-picker').on('click', '.input', function(e){
			e.stopPropagation();

			var $calendar = $(this),
				$parent = $calendar.parents('.date-picker');

			if(!$parent.hasClass('disabled')){
				if($('.date-picker').length>1 && $('.date-picker.open').length>0)
					$('.date-picker').removeClass('open');

				else if(!$parent.hasClass('open')){
					$parent.addClass('open');
					$('body').addClass('settings-open');
					if(is_mobile()){
						scrollToElement($('.general-fs-container'));
					}
				}
				else
					$parent.removeClass('open');
					

				// //$parent.toggleClass('open');
			}

		});

		/**Esconder Calendario en Mobile**/
		$(".date-picker").on('click', '.layer-mobile-aux', function(e){
			closeCalendar();
		});
		
		$(".calendar").on('click','',function(e){
			e.stopPropagation();
		});

		/**Cuando cambia settear el valor de las fechas**/
		$(".calendar").on("change",function(e){

			var $calendar = $(this),
				selected = $calendar.val(),
				selectedA = 
				$parent = $calendar.parents('.date-picker'),
				$child = $parent.find('.result').children('span'),
				$input = $parent.find('input.fecha-input');

				$child.html(selected);
				$input.val(selected);
				$parent.removeClass('open');

			
			if($calendar.hasClass('init')){

				$parent = $parent.parents('.date-pickers-container'),
				$fin = $parent.find('.calendar.fin'),
				$finParent = $fin.parent('.date-picker'),
				$inputFin = $finParent.find('.fecha-input'),
				$spanFin = $finParent.find('span.fecha'),
				selectedDateInit = new Date(selected),
				selectedFin = ($inputFin.val()!='' ? new Date(separateDate($inputFin.val())) : '');
			
				if(selectedFin == '')
					selectedFin = maxDate;

				var selectedDateFin = selectedFin;

				if(selectedDateInit>selectedDateFin){
					$inputFin.val('');
					$spanFin.html('');
					$fin.datepicker( "setDate");
					$fin.find('.ui-state-active').removeClass('ui-state-active');
				}

				if($searchMovimientos.length>0)
				{
					var $inits = $('.calendar.init');
					$inits.each(function() {
						var $this = $(this);
						var $datepicker = $this.parent('.date-picker');
						var $fechaSpan = $datepicker.find('.one-field');

						$fechaSpan.html(selected);
						$inits.datepicker( "setDate", selected );
						updateDateRange($this, selected);
						$('.date-pickers-container').find('.date-picker.disabled').removeClass('disabled');

					});
				}
				else{

					updateDateRange($calendar, selected);
					$parent.find('.date-picker.disabled').removeClass('disabled');
				}

			}
			
			if($calendar.hasClass('fin') && $searchMovimientos.length>0){
				var $fins = $('.calendar.fin');

				$fins.each(function() {
					var $this = $(this);
					var $datepicker = $this.parent('.date-picker');
					var $fechaSpan = $datepicker.find('.one-field');

					$fechaSpan.html(selected);
					$fins.datepicker( "setDate", selected );
				});
			}

			if($('.time-picker').length>0)
				$('.time-picker').trigger('updateDataTiempos');

			generalContainerFS.updateData();

		});
	}

	function separateDate(date){
		var dateS = /(\d+)\/(\d+)\/(\d+)/.exec(date);

		return [dateS[3], dateS[2], dateS[1]];
	}

	function updateDateRange($calendarInit, selectedInit){
		var initialize = (typeof init != 'undefined' ? true : false);
		var $calendarParent = $calendarInit.parents('.date-picker'),
		$parent = $calendarParent.parents('.date-pickers-container'),
		limit = $parent.hasClass('limit-month'),
		limitv2 = $parent,
		initDate = new Date(separateDate(selectedInit)),
		$calendarFin = $parent.find('.calendar.fin'),
		$datepickerFin = $calendarFin.parent('.date-picker'),
		$spanFin = $datepickerFin.find('.one-field'),
		$inputFin = $datepickerFin.find('input.fecha-input'),
		selectedFin = null;
		
		if($inputFin.val() != '')
		{	
			var n = separateDate($inputFin.val());
			selectedFin = new Date(n[0], n[1]-1, n[2]);
		}
		else
			selectedFin = maxDate;


		var finDate = (selectedFin!='' ?  selectedFin : ''),
		preselectedFin = selectedFin;

		if(limit){
			var daysRange = 31,
			/**El rango de fechas a seleccionar de la fecha Init seleccionada + 31**/
			endDate = addDays(selectedInit, daysRange);

			if( endDate > range.fin )
				endDate = range.fin;

			if(preselectedFin>endDate || preselectedFin == '')
				preselectedFin = endDate;


			$calendarFin.datepicker('option', { minDate: selectedInit});
			$calendarFin.datepicker('option', { maxDate : endDate });

			if(preselectedFin!=null){
				$calendarFin.datepicker( "setDate", preselectedFin);
				var dia = preselectedFin.getDate().toString();
				var mes = (preselectedFin.getMonth()+1).toString();
				var f = (dia.length>1 ? dia : '0'+dia ) +'/'+(mes.length>1 ? mes : '0'+mes)+'/'+preselectedFin.getFullYear();
				$spanFin.html(f);
				$inputFin.val(f);
			}
		}		
	}


	function addDays(date, days) {
		var nDate = separateDate(date);
	    var result = new Date(nDate[0], nDate[1], nDate[2]);
	    result.setDate(result.getDate() + days);
	    return result;
	}

	function subtractDays(date, days) {
	    var result = new Date(separateDate(date));
	    result.setDate(result.getDate() - days);
	    return result;
	}

	function updateBothElements(){

	}

	return{
		inicializar: initCalendars
	};

})();

var generalContainerFS = (function(){

	var $container = $('.general-fs-container'),
	$btnBuscar = $container.find('.main-btn'),
	$btnLimpiarFiltro = $container.find('.btn-limpiar-filtro'),
	$btnLimpiar = $('.btn-limpiar-busqueda'),
	containerData = {},
	$wrapper = $container.parent('form'),
	hasBusqueda = $wrapper.hasClass('con-busqueda-filtrado'),
	query = '';

	function init(){

		if($container.length>0){
			//*Simular filtrado botón "limpiar filtros"**//
			var hash = window.location.hash;
			//END//
			initFields();
			initActions();

			if($('.date-picker').length>0)
				generalDatePicker.inicializar();

			if(hasBusqueda)
				mostrarBusquedaMobile();
		}
	}

	function mostrarBusquedaMobile(){
		var $btnshow = $wrapper.closest('section').find('.hide-show-filter');
		$btnshow.trigger('click');
	}

	function initFields(){
		$container.find('.one-field').each(function (index, value) { 
			var $field = $(this);
			var fieldOptions = ( typeof $field.data('field') != 'undefined' ? $field.data('field') : null );
			if(fieldOptions != null)
				if(fieldOptions.name != 'undefined')
					initData(fieldOptions);
				//if(fieldOptions.minLength != 'undefined')
					//initFieldMin(fieldOptions.minLength);
		});
		
	}

	function initData(fieldOptions){
		containerData[fieldOptions.name] = { value : '', min : (typeof fieldOptions.min != 'undefined' ? fieldOptions.min : 1 ) };
	}

	function initFieldMin(min){
		var length = Number(min);

	}

	function initActions(){
		var sendingForm = false;

		$container.on('change', '.one-field', function(e){
			var $field = $(this);
			updateData($field);
		});

		$container.find('input.one-field').bind('input', function(e){
			var $field = $(this);
			updateData($field);
		});

		$btnBuscar.on('click',function(e){

			e.preventDefault();

			if(!sendingForm){

				var $button = $(this),
					$parent = $button.closest('form'),
					form_data = $parent.serialize(),
					parent_id = $parent.attr('id'),
					urlPOST = ( $parent.prop('action') == '' ? postURL : $parent.prop('action') ),
					/**Quitar una vez en producción**/
					sendTo = urlPOST,
					urlPOST = checkDevelopmentPostHTML(urlPOST);
					
					sendingForm = true;

				if(typeof parent_id != 'undefined' && typeof Services.buscador[parent_id].searchForm != 'undefined'){
					$.post(  urlPOST , form_data )
						.done(function( data ) {
						  	Services.buscador[parent_id].searchForm(form_data, sendTo);
							sendingForm = false;

						 })
						.fail(function( jqxhr, textStatus, error ) {
						  	//Mensaje de error del sistema
						  	console.log('Mensaje de error');
						  	sendingForm = false;
						});
					
				} else {
					if(urlPOST){
						limpiarFiltros(urlPOST);
						sendingForm = false;
					} else {
						searchItemsQuery(query);
						sendingForm = false;
					}
				}
			}

		});

		$btnLimpiarFiltro.on('click', function(e){
			var $button = $(this),
			parent_id = $button.closest('form').attr('id'),
			url = (typeof $button.data('href') !='undefined' ? $button.data('href') : null );

			limpiarForm($('#'+parent_id));

			if(typeof parent_id != 'undefined' && typeof Services.buscador[parent_id].cleanForm != 'undefined'){
				Services.buscador[parent_id].cleanForm();
			} else {
				if(url!=null)
					limpiarFiltros(url);
			}

		});

		$btnLimpiar.on('click', function(e){
			var $button = $(this),
			parent_id = $button.closest('form').attr('id'),
			url = (typeof $button.data('href') !='undefined' ? $button.data('href') : null );
			
			limpiarForm($('#'+parent_id));

			// Si se desea agregar un comportamiento se debe agregar el id del formulario como Método en el Services correspondiente, con el submétodo cleanForm
			if(typeof parent_id != 'undefined' && typeof Services.buscador[parent_id].cleanForm != 'undefined'){
				Services.buscador[parent_id].cleanForm();
			} else {
				if(url!=null)
					limpiarFiltros(url);
			}
		});

		/**
			Mostrar/Ocultar tablas
		**/
		$('body').on('click', '.hide-show-filter', function(e){

			var filter = ( typeof $(this).data('filter') != 'undefined' ? $(this).data('filter') : null ),
			nombre = ( typeof $(this).data('name') != 'undefined' ? $(this).data('name') : 'filtrado' );

			checkDetalleOpen();

			if(filter!=null){
				var text = $(this).text();
				var newtext = (text == "Mostrar "+nombre ? "Ocultar "+nombre : "Mostrar "+nombre);
    			
    			$(this).text( newtext );
				
    			$(filter).toggleClass( 'visible' );
    			$(filter).trigger('cssClassChanged');
			}
		});
	}

	function checkDetalleOpen(){
		var $containerDetalle = $('.collapse-table-block');
		var $detalle = $containerDetalle.find('#mobile-info');
		var $btn = $containerDetalle.find('.hide-show-table');

		if($detalle.is(':visible'))
			$btn.trigger('click');
	}

	function limpiarForm($form){
		$form.find('input').val('');
		$form.find('select').val('');
		$form.find("input[type=checkbox], input[type=radio]").prop("checked", false);
		$form.find('span.fecha').html('');
		$form.find('.date-picker.fin').addClass('disabled');
		$form.find('.main-btn').prop('disabled',true);
		$form.find('.btn-limpiar-filtro, .btn-limpiar-busqueda').prop('disabled',true);
	}

	function limpiarFiltros(url){
		window.location.href = url;
	}

	function updateData($field){
		var disabled = true,
		count = 0;
		query = '';

		$.each( containerData, function( key , v ) {
			var $element = $container.find('.'+key);
			var value = ($element.hasClass('fecha') ? $element.html() : ( $element.is(':checkbox') && !$element.is(':checked') ? '' : $element.val()) );
			
			var min = containerData[key].min;

			if(value != '' && value.length>=min){
				containerData[key].value = value;
				disabled = false;
			}
			else
				containerData[key].value = '';

			query+= ( count == 0 ? '?' : '&' )+key+'='+containerData[key].value;
			count++;

		});

		$container.find('.main-btn').prop('disabled', disabled);
		$container.find('.btn-limpiar-busqueda, .btn-limpiar-filtro').prop('disabled', disabled);
	}

	return{
		inicializar : init,
		updateData : updateData
	};

})();

var confirmacionEnvioCorreo = function(){

	var formValidator = null;
	var sending = false;

	function setActions(){

		$('#enviar-a-mas').click(function(){
			$('.op-resend-id').addClass('send-emails');
		});

		$('#enviar-nuevo').click(function(){
			resetForm();
		});
	}

	function resetForm(){
		$('.enviar-set-info').find("input[type=text], input[type=email], input[type=password], select").val("");
		$('.op-resend-id').removeClass('email-sent');
		$('.enviar-set-info').find('button[type="submit"]').prop('disabled', true);

		if(formValidator)
			formValidator.resetForm();
	}
	/***VALIDAR FORM DE ENVIO DE CORREO***/

	function initForm(){
		setActions();
		validateForm();
	}

	function validateForm(){
		var $form = $('.enviar-set-info');

		disableSumbitButton($form, true);
		//checkRequiredElements('.enviar-set-info');

		formValidator = $form.validate({
			  rules: {
				email: {
				  required: true,
				  email : true
				  // multiEmails: true
				}
			  },
			  messages: {
				 email: {
					required: "Ingresa un correo electrónico.",
			   		email: "Ingresa un correo electrónico válido."
				   // multiEmails: "Ingresa correos electrónicos válidos."
				 }
			   },
			   errorPlacement: function(error, $element) {
			   	var $parent = $element.closest('.op-resend-form');
			   	$parent.append(error);
			    
			  },
				submitHandler: function(form) {
					if(!sending)
						sendFormData(form);
				}
			});

		checkGeneralValidForm($form);

		function loadingIcon(form, show){
			var loading = '<div class="loading-block full-width"><div class="loading-wrapper"><div class="sk-circle"> <div class="sk-circle1 sk-child"></div> <div class="sk-circle2 sk-child"></div> <div class="sk-circle3 sk-child"></div> <div class="sk-circle4 sk-child"></div> <div class="sk-circle5 sk-child"></div> <div class="sk-circle6 sk-child"></div> <div class="sk-circle7 sk-child"></div> <div class="sk-circle8 sk-child"></div> <div class="sk-circle9 sk-child"></div> <div class="sk-circle10 sk-child"></div> <div class="sk-circle11 sk-child"></div> <div class="sk-circle12 sk-child"></div> </div></div></div>';

			if(show){
				$('.op-resend-id').append(loading);
			}
			else{
				$('.loading-block').remove();
			}
		}

		function sendFormData(form){
			sending = true;
			$(form).find('button[type="submit"]').prop('disabled', true);
			loadingIcon(form, true);

			var self = $(form).serialize();
			var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
			
			$.post(  urlPOST , self )
			.done(function( data ) {
			  	Services.autogestion.enviarCorreoConfirmacionCallSuccess(data, form);
			  	loadingIcon(form, false);
				sending = false;
				$(form).find('button[type="submit"]').prop('disabled', false);

			 })
			.fail(function( jqxhr, textStatus, error ) {
			  	//Mensaje de error del SISTEMA
			  	Services.autogestion.enviarCorreoConfirmacionCallFail(error, form);
			  	loadingIcon(form, false);
			  	sending = false;
			});						
								
		}
	}



	return{
		inicializar : function(){
			if($('.enviar-set-info').length>0)
				initForm();
		}
	}

}();


function preventPaste(){
	$(".prevent-paste").bind('paste', function(event) {
		return false;
    });
}

function orderItemsQueryURL(){
	/**
		Ordenar elementos de listado de líneas 
	**/
	$('.general-block.has-filters .order-by-query').on('click', 'button', function(e){
		var opciones = ( typeof $(this).data('opc') != 'undefined' ? $(this).data('opc') : null );
		var parent_id = $(this).closest('.has-filters').attr('id');
		
		if(opciones!=null){
			orderItemsQuery(opciones, parent_id);
		}


	});
}

function itemsByPagina(query){
	var url = window.location.href.split('?')[0];
	window.location.href = url+query;
}

function verPorPagina(){

	var $container = $('.ver-por-pagina-block');

	initActions();
	
	function initActions(){
		$container.on('change', '#ver-por', function(e){
			var val = $(this).val();
			itemsByPagina('?ver-por='+val);
		});
	}
	
}

function checkTelefonoLength($form){
	var $lada = $form.find('.lada'),
	$telefono = $form.find('.telefono'),
	$numero = $form.find('.numero');

	/**init**/
	if($lada.length>0 && $telefono.length>0){
		var iLada = $lada.val(),
		iLadaL = iLada.length;

		
		$lada.data('maxlength', iLadaL > 2 ? 3 : 2);
		$telefono.data('maxlength', iLadaL>2 ? 7 : 8);
	}
	/**init**/

	$lada.bind('keyup', function(e){
		var lada = $lada.val(),
		telefono = $telefono.val(),
		maxlength = (lada.length==3 ? 7 : 8);

		$telefono.data('maxlength', maxlength);
		$telefono.val(telefono.substring(0, maxlength));
		$numero.val(lada+telefono);
		if( typeof $numero.valid() != "undefined" )
			$numero.valid();
		
	});

	$telefono.bind('keyup', function(e){
		var lada = $lada.val(),
		telefono = $telefono.val(),
		maxlength = (telefono.length==8 ? 2 : 3);

		$lada.data('maxlength', maxlength);
		$lada.val(lada.substring(0, maxlength));
		$numero.val(lada+telefono);
		if( typeof $numero.valid() != "undefined" )
			$numero.valid();
	});
	
}

function initCheckFixedHeader($tofix){

	var $elemento = ( typeof $tofix.data('after') != 'undefined' ? $($tofix.data('after')) : null ),
	height = $tofix.outerHeight(),
	$aux = null,
	$generalfs = $('.general-fs-container');
	var $starte, $ende, start;

	addInvisibleElement($tofix);

	$tofix.bind('cssClassChanged', '.listado-select-all-block', function(){ 
		setTimeout(function(){updateInvisibleElement();}, 100); 
	});
		
	$generalfs.bind('cssClassChanged', '', function(){ 
		setTimeout(function(){updateTopFixedElement();}, 100); 
	});


	if($elemento!=null){
		checkFixedHeaderAfterGeneral($elemento, $tofix);
	}

	function updateTopFixedElement(){
		start = $starte.offset();
	}

	function addInvisibleElement($tofix){

		$( '<div class="header-fixed-auxiliar"></div>').insertAfter( $tofix );
		$aux = $tofix.next('.header-fixed-auxiliar');
		$aux.css('height',height);

	}

	function updateInvisibleElement(){
		if($tofix.hasClass('fixed')){
			var $extra = $tofix.find('.listado-select-all-block');
			if($extra.hasClass('active')){
				$aux.css('margin-bottom',$extra.outerHeight());
				height+=$extra.outerHeight();
			}
			else{
				$aux.css('margin-bottom',0);
				height-=$extra.outerHeight();
			}
		}
	}
	
	function checkFixedHeaderAfterGeneral($elemento, $tofix){
		$starte = $tofix,
		$ende = $elemento;
		start = $starte.offset();

		$(window).scroll(function(){
			$starte = $tofix;
			$ende = $elemento;
			
			var end = $ende.offset().top+$ende.outerHeight()-height;
			var beg = start.top+height-6;
		    // if ($(this).scrollTop() >= beg && $(this).scrollTop() < end && !$('body').hasClass('settings-open') )
		    if ((start.top+20 < $(this).scrollTop() && $(this).scrollTop() < end-$tofix.height()+20 ) && !$('body').hasClass('settings-open') )
		       	$tofix.addClass('fixed');
		    else if($tofix.hasClass('fixed')){
		    	if($(this).scrollTop() > start.top+20){
		       		$tofix.addClass('fade-out');
			       		setTimeout(function(){
			   			$tofix.removeClass('fixed fade-out');
			   		}, 200);
		    	}
		    	else{
		    		$tofix.removeClass('fixed fade-out');
		    	}

		   		
		   	}

		});
	}
}


function checkOnlyNumberElements(){
	var userAgent = navigator.userAgent,
	mobile = (/iPad|iPhone|iPod/.test(userAgent) || /android/i.test(userAgent) )&& !window.MSStream;
	
	if(mobile)
		checkMobile();
	else
		checkDesktop();


	$(".only-numbers").bind('input', function() {	
		var $input = $(this);
		leaveOnlyNumbers($input);
		checkLength($input);
	});

	function leaveOnlyNumbers($input){
		var data = $input.val().replace(/\D/g,'');
	    $input.val(data);
	}

    function checkMobile(){
		$(document).on('change', '.only-numbers', function (event) {
			var value = this.value;
		    this.value = this.value.replace(/[^0-9]+/g, '');
		    
		    if (this.value.length>0 && this.value < 1) this.value = 0;
		});

		// Block non-numeric chars.
		$(document).on('keypress', '.only-numbers', function (event) {
		    return (((event.which > 47) && (event.which < 58)) || (event.which == 13));
		});

		$(".only-numbers").keydown(function (e) {
		    // Allow: backspace, delete, tab, escape, enter and .
		    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
		         // Allow: Ctrl+A
		        (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true) ) ||
		         // Allow: Ctrl+C
		        (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true) ) ||
		         // Allow: Ctrl+V
		        (e.keyCode == 86 && (e.ctrlKey === true || e.metaKey === true) ) ||
		         // Allow: Ctrl+X
		        (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true) ) ||
		         // Allow: home, end, left, right
		        (e.keyCode >= 35 && e.keyCode <= 39)) {
		             // let it happen, don't do anything
		             return;
		    }

		});

    }

    function checkDesktop(){
		$(".only-numbers").keydown(function (e) {
		    // Allow: backspace, delete, tab, escape, enter and .
		    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
		         // Allow: Ctrl+A
		        (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true) ) ||
		         // Allow: Ctrl+C
		        (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true) ) ||
		         // Allow: Ctrl+V
		        (e.keyCode == 86 && (e.ctrlKey === true || e.metaKey === true) ) ||
		         // Allow: Ctrl+X
		        (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true) ) ||
		         // Allow: home, end, left, right
		        (e.keyCode >= 35 && e.keyCode <= 39)) {
		             // let it happen, don't do anything
		             return;
		    }

		    // Ensure that it is a number and stop the keypress
		    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
		        e.preventDefault();
		    }
		});

		$(".only-numbers").bind('paste', function(event) {
			var data = event.originalEvent.clipboardData.getData('Text');

			var _this = this;
	        // Short pause to wait for paste to complete
	        setTimeout( function() {
	            data = data.replace(/\D/g,'');
	            $(_this).val(data);
	        }, 50);

	    });

    }

    function checkLength($input){
    	var fieldVal = $input.val(),
    	fieldLength = fieldVal.length,
    	maxlength = (typeof $input.data('maxlength') != "undefined" ? $input.data('maxlength') : 9999999999);


	    if(fieldLength <= maxlength){
	        return true;
	    }
	    else
	    {
	        fieldVal = fieldVal.substring(0, fieldLength - 1);
	        $input.val(fieldVal);
	    }
    }

}


function checkOnlyEmailElements(){
	var userAgent = navigator.userAgent,
	mobile = (/iPad|iPhone|iPod/.test(userAgent) || /android/i.test(userAgent) )&& !window.MSStream,
	multiple =/[A-Za-z0-9_@.,-]/g,
	single = /[A-Za-z0-9_@.-]/g, 
	multipleN = /[^A-Za-z0-9_@.,-]/g,
	singleN = /[^A-Za-z0-9_@.-]/g;

	init();

    function init(){
    	var $inputs = $(".only-email, input[name='email']");

    	$inputs.each(function (index) { 
    		var $input = $(this);
    		checkValidInputs($input);
		});
    }

    function checkValidInputs($input){
		var isMultiple = $input.hasClass('multiple'),
		emailRegex = (isMultiple ? multiple : single),
		emailRegexN = (isMultiple ? multipleN : singleN);

		if(mobile)
			checkMobile();
		else
			checkDesktop();


	$(".only-email, input[name='email']").bind('input', function() {	
		var $input = $(this);
		leaveOnlyEmail($input);
	});

	function leaveOnlyEmail($input){
		var data = $input.val().replace(/[^A-Za-z0-9_@.-]/g,'');
	    $input.val(data);
	}

	function checkMobile(){
		$(document).on('change', ".only-email, input[name='email']", function (event) {
		    this.value = this.value.replace(/[^A-Za-z0-9_@.-]+/g, '');
		    if (this.value < 1) this.value = 0;
		});

		// Block non-numeric chars.
		// $(document).on('keypress', '.only-email, input[name='email']', function (event) {
		//     return (((event.which > 47) && (event.which < 58)) || (event.which == 13));
		// });

		$(".only-email, input[name='email']").keydown(function (e) {
		    // Allow: backspace, delete, tab, escape, enter and .
		    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
		         // Allow: Ctrl+A
		        (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true) ) ||
		         // Allow: Ctrl+C
		        (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true) ) ||
		         // Allow: Ctrl+V
		        (e.keyCode == 86 && (e.ctrlKey === true || e.metaKey === true) ) ||
		         // Allow: Ctrl+X
		        (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true) ) ||
		         // Allow: home, end, left, right
		        (e.keyCode >= 35 && e.keyCode <= 39)) {
		             // let it happen, don't do anything
		             return;
		    }
		});

    }

    function checkDesktop(){

    	$(".only-email, input[name='email']").on("keypress", function(e) {
		    var emailRegex = /[A-Za-z0-9_@.-]/g;

		    var key = String.fromCharCode(e.which);
		    if (e.keyCode == 8 ||  emailRegex.test(key))
		        return true;
		    
		    return false;
		   
		});

		$(".only-email, input[name='email']").on("keydown", function(e) {
			if(e.keyCode == 229)
		    	return false; 

			if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
		         // Allow: Ctrl+A
		        (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true) ) ||
		         // Allow: Ctrl+C
		        (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true) ) ||
		         // Allow: Ctrl+V
		        (e.keyCode == 86 && (e.ctrlKey === true || e.metaKey === true) ) ||
		         // Allow: Ctrl+X
		        (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true) ) ||
		         // Allow: home, end, left, right
		        (e.keyCode >= 35 && e.keyCode <= 39))
		        	return;
			
		});

		// $('.only-email, input[name='email']').on("paste",function(e)
		// {
		//     e.preventDefault();
		// });

    }


    }
}

function initCheckInputRegex(){

	$('.meet-regex').each(function (index) { 
	  var $element = $(this);
	  var regex = $element.data('regex');

	  if(typeof regex != 'undefined'){
	  	regex = new RegExp(regex, "g");
	  	checkRegex($element, regex);
	  }
	});

	function checkRegex($element, regex){

		$element.bind('input', function(e) {	
			var $input = $(this),
			value = $input.val();
			var classAcute = $input.hasClass('acute');
			var acute = value.substr(value.length - 1).localeCompare('´') ===0 ;
			var dieresis = value.substr(value.length - 1).localeCompare('¨') ===0 ;

			if(!acute && classAcute)
				leaveCharacters($input);
			else if(!classAcute)
				leaveCharacters($input);
		});

		function leaveCharacters($input){
			var data = $input.val().replace(regex,'');
		    $input.val(data);
		}

		// $element.on("paste",function(e)
		// {
		//     e.preventDefault();
		// });

	}

}

function checkOnlyAlphanumericElements(){

	$(".only-alphanumeric" ).keyup(function(){
	    var firstspace = $(this).val();

	    if ( firstspace.charAt( 0 ) === ' ' ){
			firstspace = firstspace.substring(1);
			$(this).val(firstspace);
	    }


	    return;
	});

	$(".only-alphanumeric").on("paste",function(e)
	{
	 	var value = $(this).val();

	 	if ( value.charAt( 0 ) === ' ' ){
	 		value = value.substring(1);
	 		$(this).val(value);
	 	}

	});
}

function initRefreshSite(){
	$('.refresh-site').click( function(e){
		location.reload();
	});
}

function initSendTo(){
	$('.send-to-url').on('click', function(e){
		var $button = $(this),
		url = (typeof $button.data('href') !='undefined' ? $button.data('href') : null );
		
		if(url!=null)
			window.location.href = url;
	});
}

function validateOneField(){
	var $container = $('.general-validator-one-field'),
	containerData = {};

	initFields();
	initActions();

	function initFields(){
		
		$container.find('.one-field').each(function (index, value) { 
			var $field = $(this);
			var fieldOptions = ( typeof $field.data('field') != 'undefined' ? $field.data('field') : null );
			if(fieldOptions != null)
				initData(fieldOptions);
		});
		
	}

	function initData(fieldOptions){
		if(fieldOptions.name != 'undefined')
			containerData[fieldOptions.name] = { value : '', min : (fieldOptions.min != 'undefined' ? fieldOptions.min : 0 ) };
	}

	function initActions(){
		$container.on('change', '.one-field', function(e){
			var $field = $(this);
			updateButton();
		});

		$container.find('input.one-field').bind('input', function(e){
			var $field = $(this);
			updateButton();
		});
	}

	function updateButton(){
		var disabled = true;

		$.each( containerData, function( key , v ) {
			var $element = $container.find('.'+key);
			var value = ($element.hasClass('fecha') ? $element.html() : $element.val());
			
			if(value != '')
				disabled = false
		});

		$container.find('.main-btn').prop('disabled', disabled);
		
	}
}

function checkGeneralValidForm($form, extraCheck){

	var hasExtra = ( typeof extraCheck!= 'undefined' ? true : false);

	$form.find('input').on('keyup change input keydown', function () { 
        validateForm();
    });

    $form.find('input[type="checkbox"], input[type="radio"], select').on('change', function () { 
        validateForm();
    });

    function validateForm(){
    	var extraValidation = true;

    	if(hasExtra)
    		extraValidation = extraCheck();

    	if ($form.validate().checkForm() && extraValidation)                  
            $form.find('.first-submit, button[type="submit"]').prop('disabled', false);    
        else
           $form.find('.first-submit, button[type="submit"]').prop('disabled', true); 
    }

}

var currentHeight = $(window).height(),
currentWidth = $(window).width();
var currentOrientation = function() {

	currentWidth = $(window).width();
	currentHeight = $(window).height();
	// && initialWidth - currentWidth >20
	
	var keyboardMaxHeight = (currentHeight*100)/initialHeight;

	if(is_mobile() && currentHeight <=380 && ( (initialHeight > currentHeight && keyboardMaxHeight < 25) || (initialWidth != currentWidth && Math.abs(initialWidth - currentWidth) > 0))){
		$('body').addClass('landscape');
		if((document.activeElement != document.body))
			document.activeElement.blur();

		initialWidth = currentWidth;
		initialHeight = currentHeight;
	}
	else{
		$('body').removeClass('landscape');
	}

}

function initSendToGestion(){
	$('body').on('click', '.m-btn-close-admin-view', function(e){
		e.preventDefault();
		window.location.href = 'gestion-ejecutivos-1.html';
	});
}

function chatWindow(){
	
	$('body').on('click','.open-chat-window',function(e) {
		e.preventDefault();
		e.stopPropagation();

		var $parent = $(this),
		href = $parent.find('.open-chat').prop('href');

		window.open(href, 'Mi Telcel', 'left=20,top=20,width=675,height=460,toolbar=1,resizable=0');
	});
}

function goToTop(){
	$('body').on('click','.go-to-top',function(e) {
		e.preventDefault();
		$('html, body').animate({scrollTop : 0}, 800);
	});

	 $(window).scroll(function () {
	 	checkGoToTop();
	 });

	 function checkGoToTop(){
	 	var heightHalf = window.innerHeight/3;

		if ($(this).scrollTop() > heightHalf ) {
	        $('.go-to-top').addClass('visible');
	    } else {
	        $('.go-to-top').removeClass('visible');

	    }
	}
}

var accent_map = {á: "a", é: "e", í: "i", ó: "o", ú: "u"};
function accent_fold(t){if(!t)return"";for(var e="",i=0;i<t.length;i++)e+=accent_map[t.charAt(i)]||t.charAt(i);return e}

var jqueryAutocompleteRemote = function() {

	$('.js-autocomplete-remote').each(function () {
	    var inputAutocomplete = $(this);
	        //appendTo = $(this).data('append-to');

	    $.getJSON($(this).data('source'), function (data) {

	        $.widget("custom.catcomplete", $.ui.autocomplete, {
	            _create: function () {
	                this._super();
	                this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
	                this.widget().addClass('autocomplete-search-menu')
	            },
	            _renderItem: function( ul, item ) {
	                return $( "<li>" ).append( $( "<a href='"+item.url+"'>" ).text( item.label ) ).appendTo( ul );
	            },
	            _renderMenu: function (ul, items) {
	                var that = this,
	                    currentCategory = "";

	                $.each(items, function (index, item) {
	                    var li;
	                    if (item.category != currentCategory) {
	                        ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
	                        currentCategory = item.category;
	                    }
	                    li = that._renderItemData(ul, item);
	                    if (item.category) {
	                        li.attr("aria-label", item.category + " : " + item.label);
	                    }
	                });
	            },

	        });

	        inputAutocomplete.catcomplete({
	            source: function (request, response) {
	                var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
	                response($.grep(data, function (value) {
	                    value = value.label || value.value || value;
	                    return matcher.test(value) || matcher.test(accent_fold(value));
	                }));
	            },
	            search: '',
	            open: function() {
			        $('.ui-autocomplete-category').next('.ui-menu-item').addClass('ui-first');
			    } 
	        });

	    });

	});

};

/** es admin mode **/
function is_admin_mode(){

	if($('body').hasClass('admin-mode'))
		return true;

	return false;
}

/** ingreso por primera vez **/
function is_first_fime(){

	if($('body').hasClass('first-time'))
		return true;

	return false;
}

/**Acciones masivas en modal bloqueo masivo**/
function initAccionesMasivasModal(){

	var $body = $('body');
	var size = null;

	//obtenerHTML();
	checkMobileMasivo();

	$( window ).resize(function() {
		size = $( window ).width();
		$('#modal-bloquear-masivo .newsize').html(size);
  		checkMobileMasivo();
	});

	function obtenerHTML(){
		 $.get( '../../sections/header-footer/modal-masivo.html' , function( template_modal ) {
            $('#info-content').prepend(template_modal);
        });
	}

	function checkMobileMasivo(){
		if(is_mobile()){
			$body.addClass('acciones-masivas-bloqueadas');
	  	}
	  	else{
	  		$body.removeClass('acciones-masivas-bloqueadas');
	  	}
	}
}