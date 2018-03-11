var w = 0;

$( window ).load( function(){

   w = $( window ).width();

});

(function ($, undefined) {
    "use strict";
    $.jstree.plugins.noclose = function () {
        this.close_node = $.noop;
    };
})(jQuery);


(function ($) {
	  $.each(['show', 'hide'], function (i, ev) {
	    var el = $.fn[ev];
	    $.fn[ev] = function () {
	      this.trigger(ev);
	      return el.apply(this, arguments);
	    };
	  });
	})(jQuery);

// MÉTODOS JQUERY VALIDATOR

// Validar formato de email
$.validator.methods.email = function( value, element ) {
    //console.log(/[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9]+\.[a-z]+/.test( value ));
    // /[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9]+\.[a-z]+(?:\.[a-zA-Z0-9-]+)*$/
    return this.optional( element ) || /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-z]+(?:\.[a-zA-Z0-9-]+)*$/.test( value.toLowerCase() );
};

$.validator.addMethod( "basicName", function( value, element ) {
	return this.optional( element ) || /^[A-Za-zá-úÁ-Úä-üÄ-Ü0-9\'ñ\s]+$/i.test( value );
}, "Ingresa un nombre válido." );

$.validator.addMethod( "grupoNombre", function( value, element ) {
	return this.optional( element ) || /^[A-Za-zÑñ]*[A-Za-zNñ-\s]*[A-Za-zNñ]$/i.test( value );
}, "Ingresa un nombre válido, no puede contener caracteres especiales ni números, no debe terminar ni comenzar con un espacio." );

$.validator.addMethod( "sinEspacioInicioFin", function( value, element ) {
	return this.optional( element ) || value.length == value.toString().trim().length;
}, "Ingresa un nombre válido, no debe terminar ni comenzar con un espacio." );

$.validator.addMethod('filesize', function (value, element, param) {
    return this.optional(element) || (element.files[0].size <= param)
}, 'El tamaño del archivo debe ser menor a {0}');

$.validator.addMethod("exactlength", function(value, element, param) {
 return this.optional(element) || value.length == param;
}, 'Longitud debe ser de {0}');

$.validator.addMethod("notEqual", function(value, element, param) {
  return this.optional(element) || value != $(param).val();
}, "Ingresa un valor diferente");

$.validator.addMethod(
    "multiEmails",
     function(value, element) {
         if (this.optional(element)) 
             return true;
         var emails = value.split(/[;,]+/);
         valid = true;
         for (var i in emails) {
             value = emails[i];
             valid = valid &&
                     $.validator.methods.email.call(this, $.trim(value), element);
         }
         return valid;
     },

   $.validator.messages.multiEmails
);

function setSteps($steps){
	this.steps = $steps;
	this.initSteps();

}

setSteps.prototype.initSteps = function(){
	this.hideAllSteps();

	// Mostrar el primer
	this.showStep(0, false);
	// setActions();
}

setSteps.prototype.hideAllSteps= function(){
	this.steps.hide();
}

setSteps.prototype.hideStep= function(i){
	this.steps.eq(i).hide();
}

setSteps.prototype.showStep= function(i, scroll){
	scroll = (typeof scroll != 'undefined' ? scroll : true);
	this.steps.eq(i).show();
	if(scroll)
		scrollToElement(this.steps.eq(i));

}

setSteps.prototype.justShowStep = function(i){
	this.steps.eq(i).show();
}

if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun /*, thisp*/) {
    var len = this.length >>> 0;
    if (typeof fun != "function")
    throw new TypeError();

    var res = [];
    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in this) {
        var val = this[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, this))
        res.push(val);
      }
    }
    return res;
  };
}

function PaginacionTelcel(items, options){
	this.items = items;
	this.itemsPerPage = options.itemsPerPage;
	this.currentPage = 1;
	this.paginationControlsContainer = options.paginationControlsContainer;

	if(typeof options != undefined){

		if(typeof options.onInit != undefined){
			this.initAction  = options.onInit;
			this.init();
		}

		if(typeof options.onReset != undefined){
			this.resetAction = options.onReset;
		}

		if(typeof options.onPageClick!= undefined){
			this.pageClickAction = options.onPageClick;
			this.pageClick();
		}
	}

	this.renderControls();

}

PaginacionTelcel.prototype.pageClick = function(){
	var self = this;
	if(typeof self.pageClickAction != undefined){

		$(self.paginationControlsContainer).on('click','.page-li .page', function(e){
			e.preventDefault();
			e.stopPropagation();
			self.currentPage = $(this).data('page');
			var itemsP = self.showPage(self.currentPage);
	      	self.pageClickAction(itemsP);   
	  	});
   }
}

PaginacionTelcel.prototype.init = function(){
	var self = this;
	if(typeof self.initAction != undefined){
 		self.currentPage = 1;
		var itemsP = self.showPage(self.currentPage);
	    self.initAction(itemsP); 
	}
}


PaginacionTelcel.prototype.reset = function(){
	var self = this;
	this.currentPage = 1;
	var itemsP = self.showPage(this.currentPage);
	// this.resetAction(itemsP);
	if(typeof self.resetAction != undefined)
		self.resetAction(itemsP);
	
}

PaginacionTelcel.prototype.getNumberPages = function(){

	var numPages = 0;

	if(this.itemsPerPage == 0)
		numPages = 1;
	else if (this.items != null && this.itemsPerPage != null) 
        numPages = Math.ceil(this.items.length / this.itemsPerPage);
    
    return numPages;

}

PaginacionTelcel.prototype.showPage = function(page) {

    this.currentPage = page;

    if(this.itemsPerPage == 0){
    	var currentItems = this.items;
    }
    else{

    	var currentItems = this.items.slice((page-1) * this.itemsPerPage,
        ((page-1)*this.itemsPerPage) + this.itemsPerPage);
    }

    this.renderControls();

    return currentItems;
} 

PaginacionTelcel.prototype.updateItemsPerPage = function(itemsPerPage){
	this.itemsPerPage = itemsPerPage;
}

PaginacionTelcel.prototype.updateItems = function(items){
	this.items = items;
}

PaginacionTelcel.prototype.getCurrentPage = function(){
	return this.currentPage;
}

PaginacionTelcel.prototype.renderControls = function() {
    var paginationControls = '<ul>';
    var numberPages = this.getNumberPages();
    var maxNumberPages = numberPages-2;
    var minNumberPages = 2;

    if(this.currentPage>1)
    	paginationControls += '<li class="page-li page-'+(this.currentPage-1)+'"><span class="page icon io-AccordionLeft" data-page="'+(this.currentPage-1)+'"></span></li>';


    if(numberPages >5 && this.currentPage>minNumberPages && this.currentPage <= maxNumberPages){
    	// PINTAR LOS 2 PRIMEROS
    	for (var i = this.currentPage-2; i < this.currentPage; i++) {
	        paginationControls += '<li class="page-li page-'+i+'"><span class="page" data-page="'+i+'">' + i + '</span></li>';
	    }

	    //Actual
	    paginationControls += '<li class="page-li page-'+this.currentPage+' active"><span class="page" data-page="'+this.currentPage+'">' + this.currentPage + '</span></li>';

	    // PINTAR LOS 2 PRIMEROS
    	for (var i = this.currentPage+1; i <= this.currentPage+2; i++) {
	        paginationControls += '<li class="page-li page-'+i+'"><span class="page" data-page="'+i+'">' + i + '</span></li>';
	    }

    }
    else{
    	var ifrom = 1;
    	var ito = (numberPages >5 ? minNumberPages +3 : numberPages);

    	if(numberPages >5 && this.currentPage>maxNumberPages)
    	{
    		ifrom = maxNumberPages-2;
    		ito = numberPages;
    	}

	    for (var i = ifrom; i <= ito; i++) {
	        paginationControls += '<li class="page-li page-'+i+' '+(i==this.currentPage ? 'active' : '') +'"><span class="page" data-page="'+i+'">' + i + '</span></li>';
	    }

	}

	if(this.currentPage<numberPages)
    	paginationControls += '<li class="page-li page-'+(this.currentPage+1)+'"><span class="page icon io-AccordionRight" data-page="'+(this.currentPage+1)+'"></span></li>';

    paginationControls += '</ul>';

    $(this.paginationControlsContainer).html(paginationControls);
}



function orderItemsHTML(opc, $main, $children, data){

	data = (typeof data != 'undefined' ? data : 'item');

	$children.detach().sort(function(a, b){
		var aData = $(a).data(data);
		var bData = $(b).data(data);

		if(opc.type == 'int')
			return Number(aData[opc.key]) > Number(bData[opc.key]) ? 1 : -1;
		else
			return aData[opc.key] > bData[opc.key] ? 1 : -1;

	});

	if(opc.orderby == 'desc')
		$main.append($children.get().reverse());
	else
		$main.append($children);
	
}

function scrollToElement(element){

	function timeAnimation(element_distance){
		var distance = element_distance - window.pageYOffset;
		var max_time_animation = 500;
		var min_distance_for_max_time = 400;

		var time = Math.floor((distance*max_time_animation)/min_distance_for_max_time);

		return (time <= max_time_animation) ? time : max_time_animation;
	}

	if(element.length>0){
		var headerHeight = $('#main-header').height();
		var element_distance = element.offset().top-headerHeight;

		//Realizamos el posicionamiento del scroll
		$('html, body').animate({
			scrollTop: element_distance
		}, timeAnimation(element_distance));
	}

}

function shuffle(a, all) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }

    var total = Math.floor(Math.random() * 6) + 1;

    if(!all)
    	a = a.slice(0, total);

    return  a;
}

function generalLoadingIcon(container, show){
	var loading = '<div class="loading-block full-width"><div class="loading-wrapper"><div class="sk-circle"> <div class="sk-circle1 sk-child"></div> <div class="sk-circle2 sk-child"></div> <div class="sk-circle3 sk-child"></div> <div class="sk-circle4 sk-child"></div> <div class="sk-circle5 sk-child"></div> <div class="sk-circle6 sk-child"></div> <div class="sk-circle7 sk-child"></div> <div class="sk-circle8 sk-child"></div> <div class="sk-circle9 sk-child"></div> <div class="sk-circle10 sk-child"></div> <div class="sk-circle11 sk-child"></div> <div class="sk-circle12 sk-child"></div> </div></div></div>';

	if(show){
		$(container).addClass('has-loading');
		$(container).append(loading);
	}
	else{
		$(container).removeClass('has-loading');
		$(container).find('.loading-block').remove();
	}
}

function generalFullLoadingIcon(container, show){
	var loading = '<div class="loading-block full-width full-body"><div class="loading-wrapper"><div class="sk-circle"> <div class="sk-circle1 sk-child"></div> <div class="sk-circle2 sk-child"></div> <div class="sk-circle3 sk-child"></div> <div class="sk-circle4 sk-child"></div> <div class="sk-circle5 sk-child"></div> <div class="sk-circle6 sk-child"></div> <div class="sk-circle7 sk-child"></div> <div class="sk-circle8 sk-child"></div> <div class="sk-circle9 sk-child"></div> <div class="sk-circle10 sk-child"></div> <div class="sk-circle11 sk-child"></div> <div class="sk-circle12 sk-child"></div> </div></div></div>';

	if(show){
		$(container).append(loading);
	}
	else{
		$(container).find('.loading-block').remove();
	}
}

function generalErrorButtonAction(show){
	var $infoContent = $('body #info-content');
	var htmlAvisoServicio = '<div id="aviso-serv-msg" class="fixed"> <div class="container"> <div class="row"> <div class="col-sm-12 col-xs-12 center-block flexbox v-align-center main-block system-general-msg-fs"> <div class="success-tooltip back-pink vertical-align col-sm-7 col-xs-12 system-msg"> <div class="center-element"> <span class="icon io-Alert2"></span> <p>Por el momento el servicio solicitado no está disponible. Por favor, intenta más tarde.</p> </div> <span class="close-msg"> <span class="icon io-Close"></span> </span> </div> </div> </div> </div> </div>';

	if(show){
		$infoContent.prepend( htmlAvisoServicio );

		$infoContent.find('.close-msg').on('click', function(e){
			e.stopPropagation();
			generalErrorButtonAction(false);
		});

		$infoContent.find('.system-general-msg-fs').on('click', function(e){
			e.stopPropagation();
			generalErrorButtonAction(false);
		});

		$infoContent.find('.system-msg').on('click', function(e){
			e.stopPropagation();
			generalErrorButtonAction(false);
		});

	}else{
		$('#aviso-serv-msg').remove();
	}
}


function disableSumbitButton($form, flag){
	$form.find('button[type="submit"]').prop( "disabled", flag );
}

function checkRequiredElements(form){
	var empty = true;

	$(form+' '+ '.required').each(function (index) { 
	  var $element = $(this);

	  validateNotEmpty($element);
	});


	function validateNotEmpty($element){
		
		$(document).on( 'input', $element , function(){
			empty = false;
			$(form+' '+ '.required').each(function (index) {

				var $e = $(this);

				if($e.is(':checkbox')){
					if (!$e.is(':checked')) {
						empty = true;
					}
				}
				else{
					var ivalue = $e.val();
					var requiredOpc = $e.data('required');
					var length = ( typeof requiredOpc!= 'undefined' && requiredOpc.minLength ? Number(requiredOpc.minLength) : 1  )

					if (ivalue.length<length) {
						empty = true;
					}
				}
					
			});

			disableSumbitButton($(form), empty);

		});


		$(document).on( 'change', $element , function(){
			empty = false;
			$(form+' '+ '.required').each(function (index) {

				var $e = $(this);

				if($e.is(':checkbox')){
					if (!$e.is(':checked')) {
						empty = true;
					}
				}
				else{
					var ivalue = $e.val();
					var requiredOpc = $e.data('required');
					var length = ( typeof requiredOpc!= 'undefined' && requiredOpc.minLength ? Number(requiredOpc.minLength) : 1  )

					if (ivalue.length<length) {
						empty = true;
					}
				}
					
			});

			disableSumbitButton($(form), empty);

		});

	}
}

function checkRequiredElementsOptional(form){
	// $("input[id*=Hours]").rules("add", "required");
	var validRequired = false;

	$(form+' '+ '.required-optional').each(function (index) { 
	  var $element = $(this);
	  validateNotEmpty($element);
	});


	function validateNotEmpty($element){

		$element.bind('input', function() {

			validRequired = false;

			$(form+' '+ '.required-optional').each(function (index) {
				var ivalue = $(this).val();

				if (ivalue.length>0) {
					validRequired = true;
				}	

			});

			if(validRequired){
				$(form+' '+ '.required-optional').addClass('required');
			}
			else{
				$(form+' '+ '.required-optional').removeClass('required');
			}

		});

	}
}

function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") {
        return;
    }

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=");
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) {
            parms[n] = [];
        }

        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}

function searchItemsQuery(query){
	var url = window.location.href.split('?')[0];
	window.location.href = url+query;
}

function sortByAZ(data, key, boolean){

	var byName = data.slice(0);
	byName.sort(function(a,b) {
		var x = '',
			y= '';
		if(typeof boolean != 'undefined'){
			x = new Boolean(a[key]);
			x = x.toString();
	
			y = new Boolean(b[key]);
			y = y.toString();

		}
		else{
			x = a[key].toLowerCase();
			y = b[key].toLowerCase();
		}
	    return x < y ? -1 : x > y ? 1 : 0;
	});
	return byName;
}

function sortByNumber(data, key){
	var byNumber = data.slice(0);
	byNumber.sort(function(a,b) {
	    var x = a[key];
	    var y = b[key];
	    return x < y ? -1 : x > y ? 1 : 0;
	});

	return byNumber;
}

/*Función general de ordenamiento*/
var ordenando = false;

/**El contenedor que tiene los botones de ordenamiento debe 
tener el id que coincida con el metodo ordenamiento en Services más un data-action que contenga la liga del json POST**/
function orderItemsQuery(opc, parent_id){

	if(typeof parent_id != 'undefined' && typeof Services.ordenamiento[parent_id] != 'undefined'){
		var $parent = $('#'+parent_id);

		var urlOrdenamiento = ( $parent.data('action') == '' ? postURL : $parent.data('action') );
		
		urlOrdenamiento = checkDevelopmentPostHTML(urlOrdenamiento);

		$.post(  urlOrdenamiento , opc)
			.done(function( data ) {
			  	Services.ordenamiento[parent_id](data);
				ordenando = false;
			 })
			.fail(function( jqxhr, textStatus, error ) {
			  	//Mensaje de error del sistema
			  	console.log('Mensaje de error');
			  	ordenando = false;
			});
		
	} else {
		//*Para propositos de simulación el envío de los parámetros vía "get" en la url*//
		ordenando = false;
		var query = '?key='+opc.key+'&order='+opc.orderby;
		var url = window.location.href.split('?')[0];
		window.location.href = url+query;
	}

	
}


function is_mobile(){

	// var w = window.innerWidth
	// || document.documentElement.clientWidth
	// || $(window).width();
	
	w = $( window ).width();
	if(w<768){

	    delete w;

	    return true;
	  }
	else{
		return false;
	}
}

function is_desktop(){
	return !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/);
}

function appendErrorGeneral($e, $i, message){

	if($e.find('.general-error-tooltip').length == 0){
		var errorhtml = '<div class="general-error-tooltip"><p class="txt-300">'+message+'</p></div>';
		$e.append(errorhtml);

		if($i != null)
			$i.addClass('error');
	}
}

function appendErrorGeneralHTML($e, $i, errorhtml){
	if($('.system-error-msg').length==0){
		var errorhtml = '<div class="col-sm-12 center-block system-error-msg">'+errorhtml+'</div>';
		$e.addClass('has-system-error');
		$( errorhtml ).insertAfter( $e );
		if($i != null)
			$i.addClass('error');
	}
}

function cerrarConfiguracionAfuera(){

	$('html').on('click', 'body.settings-open',function(e){
		e.stopPropagation();
		$('.main-links li').removeClass('active');
		$('.date-picker').removeClass('open');
		$('.group-block, .block-eli-admin .settings-ri, .listado-header-autogestion .settings-ri').removeClass('active');
		$('.row-ls, .linea-batch').removeClass('active-settings');
		$('.general-group-options-container, .rol-element').removeClass('active');
		$('body').removeClass('settings-open');

	});
}

var modalLimitarMasivo = null;
function initmodalLimitarMasivo(){
	modalLimitarMasivo = new modalesTelcel($('#modal-limitar-masivo'),{
		onInit : function(){
			
		},
		onReset : function(){
			// if($('#modal-limitar-masivo .limit-data-msg').length>0){
			// 	$('#modal-limitar-masivo .limit-data-msg').addClass('hidden');
			// 	$('#modal-limitar-masivo .regular-msg').removeClass('hidden');
			// }
		},
		onOpen : function(){
			
			
		}
	});
};

var homeAdminComponent = (function(){

	function initComponent(){
		initGestionarLineas();
	}


	function initGestionarLineas(){

		var dataGestionarFavoritos = {
			data: [],
			success: false
		};

		setActions();
		getData();


		function loadingIcon(show, $element, $extra){

			var loading = '<div class="loading-block"><div class="sk-circle"> <div class="sk-circle1 sk-child"></div> <div class="sk-circle2 sk-child"></div> <div class="sk-circle3 sk-child"></div> <div class="sk-circle4 sk-child"></div> <div class="sk-circle5 sk-child"></div> <div class="sk-circle6 sk-child"></div> <div class="sk-circle7 sk-child"></div> <div class="sk-circle8 sk-child"></div> <div class="sk-circle9 sk-child"></div> <div class="sk-circle10 sk-child"></div> <div class="sk-circle11 sk-child"></div> <div class="sk-circle12 sk-child"></div> </div></div>';

			if(show){
				$element.prepend(loading);

				if (typeof $extra !== 'undefined')
					$extra.addClass('hidden');
			}
			else{
				$('.loading-block').remove();
			}
		}

		function getData(){

			$('#btn-gestionar').one('click', function() {

			var $main =  $('#edit-group-block');

			loadingIcon(true, $main);

			$.when( callData() )
				.done(function() {
	
					if(dataGestionarFavoritos.success){
						// LLENAR INFO

						$.each(dataGestionarFavoritos.data, function( index, grupo ) {

							var html = '<form class="group-edit vertical-align col-sm-12" id="grupo-'+grupo.id+'" data-id="'+grupo.id+'">';
							html+= '<div class="col-sm-1 text-center">';
							html+= '<span class="icon '+(grupo.tipo == 1 ? 'i-user' : 'i-users')+'"></span>';
							html+= '</div>';

							html+= '<div class="col-sm-4" >';
							html+= '<input type="text" name="nombre" value="'+grupo.nombre+'" class="input-nombre" readonly/>';
							html+= '</div>';

							html+= '<div class="col-sm-4" >';
							html+= '<input type="text" name="telefono" value="'+grupo.telefono+'" readonly/>';
							html+= '</div>';

							html+= '<div class="col-sm-2">';
							html+= '<button type="button" class="icon io-Pen edit-btn btn-icon"></button>';
							html+= '<button type="submit" class="icon io-TickNeg hidden btn-icon"></button>';
							html+= '</div>';

							html+= '<div class="col-sm-2">';
							html+= '<button type="button" data-id="'+grupo.id+'" class="icon io-Bin delete-btn btn-icon"></button>';
							html+= '</div>';

							html+= '</form>';
						  	
						  	$main.append(html);

						  	var $form = $( '#grupo-'+grupo.id );
							validateForm($form);

						});
						
					}
					else{

						var msgHTML = 'Ocurrio un error, <strong>no pudimos obtener la información.</strong>';
						$('#edit-group-block .general-error .text').html(msgHTML);
						$('#edit-group-block .general-error').removeClass('hidden');
						scrollToElement($main);
					}

					loadingIcon(false);

				});

			});

			function callData(){

				/**HASH PARA SIMULAR ERROR**/
				var hash = window.location.hash;

				if(hash=='#errorData'){
					dataGestionarFavoritos = {
						data: [],
						success: false
					};
				}
				else{
					dataGestionarFavoritos = {
						data: [
							{id: 1, 'tipo': 1, 'nombre': 'Iván Rodríguez', 'telefono' : '5512345678'},
							{id: 2, 'tipo': 1, 'nombre': 'Multiplica México', 'telefono' : '5512345678'},
							{id: 3, 'tipo': 2, 'nombre': 'Glúo', 'telefono' : '5512345678'},
							{id: 4, 'tipo': 3, 'nombre': 'Metriplica', 'telefono' : '5512345678'}
						],
						success: true
					};
				}	

				return $('body').delay( 3000 );
			}

			function updateCall(data, id){
				// Aquí iría el servicio para el update
				return $('body').delay( 3000 );
			}

			function validateForm($form){

				$form.validate({
				  rules: {
				  	nombre: {
				      required: true
				    },
				    telefono: {
				      required: true,
				      digits: true,
				      minlength: 10,
				      maxlength: 10
				    }
				  },
				  messages: {
				  	nombre: {
				       required: "Ingresa un nombre."
				    },

				    telefono: {
				       required: "Ingresa tu número de teléfono.",
				       digits: "Ingresa un número válido.",
				       minlength: "Ingresa un número de 10 dígitos.",
				       maxlength: "Ingresa un número de 10 dígitos."
				     }
				   },
				   	submitHandler: function(form) {
						var self = $(form).serialize();
						var id =$(this).data('id');


					var $editbtn = $(form).find('button[type="submit"]');

					loadingIcon( true, $editbtn.parent(), $editbtn );

					$.when( updateCall(self, id) )
						.done(function() {
			
							var hash = window.location.hash;

							if(hash=='#errorEdit'){
								$( form ).after( '<p class="error-text">Ha ocurrido un error.</p>' );
								$( form ).find('.edit-btn').removeClass('hidden');
								setTimeout(function(){ $('.error-text').remove() }, 1600);
							}
							else{
								// Success

								$(form).find('input').prop('readonly', true);
								$(form).find('button[type="submit"]').addClass('hidden');
								$(form).find('.edit-btn').removeClass('hidden');
							}

							loadingIcon( false );

						});

					}
				});
			}
		}

		function setActions(){


			// Botón mostrar popup gestionar
			$('#btn-gestionar').click(function() {
				$('#gestionar-favoritos').toggleClass('active');
			});		

			// Botón mostrar Agregar
			$('#group-add-show').click(function() {
				$(this).addClass('hide');
				$('#form-add-group').toggleClass('active');
			});	

			// Botón para editar
			$( '#edit-group-block' ).on( "click", ".group-edit .edit-btn", function() {
				var $parent = $(this).parent().parent();
				$parent.find('input').prop('readonly', false);
				$(this).addClass('hidden');
				$parent.find('button[type="submit"]').removeClass('hidden');
			});

			// Botón para borrar
			$( '#edit-group-block' ).on( "click", ".group-edit .delete-btn", function() {
				var id = $(this).data('id');
				var $btn = $(this);
				deleteGroup(id, $btn);
			});

		}

		function deleteGroup(id, $deletebtn){

			loadingIcon( true, $deletebtn.parent(), $deletebtn );

			$.when( callDeleteData(id) )
				.done(function() {
	
					var hash = window.location.hash;

					if(hash=='#errorDelete'){
						var $form = $('#grupo-'+id);
						$form.after( '<p class="error-text">Ha ocurrido un error.</p>' );
						$form.find('.delete-btn').removeClass('hidden');
						setTimeout(function(){ $('.error-text').remove() }, 1600);
					}

					else{
						$('#grupo-'+id).remove();
					}

					loadingIcon( false );

				});

			

			function callDeleteData(id){
				// Aquí iría el servicio
				return $('body').delay( 3000 );
			}

		}
	}

	return{
		fInitComponent : initComponent
	};

})();


var swipersM = [];

var swipersMTelcel = (function(){
	

	var rtime;
	var timeout = false;
	var delta = 200;


	function resizeend() {
	    if (new Date() - rtime < delta) {
	        setTimeout(resizeend, delta);
	    } else {
	        timeout = false;
	        initSwiperMobile();
	        setTimeout(function(){
	        	triggerChartResize();
	        	generalFullLoadingIcon('.swiper-mobile .s-slider', false);
	        }, 500);
	        
	        
	    }               
	}

	function addActionsSliderHome(){
		
		$('.tab-pane').bind('openTerminos', '.btn-terminos', function(){ 
			var $button = $(this),
			$swiper = $button.closest('.swiper-container'),
			$slide = $swiper.find('.swiper-slide-active'),
			iheight = $slide.find('.slide-container').outerHeight(),
			newHeight = iheight+894;
			$swiper.data('iheight', iheight);
			resizeSlidesActive($swiper, newHeight);
		});

		$('.tab-pane').bind('closeTerminos', '.btn-terminos', function(){ 
			var $button = $(this),
			$swiper = $button.closest('.swiper-container'),
			newHeight = $swiper.data('iheight');
			resizeSlidesActive($swiper, newHeight);
		});

		$('.tab-pane').bind('closeTerminos', '.terminos-container .close-container .icon', function(){ 
			var $button = $(this),
			$swiper = $button.closest('.swiper-container'),
			newHeight = $swiper.data('iheight');
			resizeSlidesActive($swiper, newHeight);
		});

	}

	function addActions(){

		$('.swiper-slide select').on('mousedown touchstart MSPointerDown', function(e){
		       e.stopPropagation();
		});
		
		$('.tab-pane').bind('openFAQ', '.faq-element .question-container', function(){ 
			var $faq = $(this),
			$swiper = $faq.closest('.swiper-container'),
			$slide = $swiper.find('.swiper-slide-active'),
			iheight = $slide.find('.slide-container').outerHeight(),
			newHeight = iheight;
			$swiper.data('iheight', iheight);
			resizeSlidesActive($swiper, newHeight);
		});

		$('.tab-pane').bind('closeFAQ', '.faq-element .question-container', function(){ 
			var $faq = $(this),
			$swiper = $faq.closest('.swiper-container'),
			newHeight = $swiper.data('iheight');
			resizeSlidesActive($swiper, newHeight);
		});
	}

	function triggerChartResize(){
		if($('.pie-chart-container').length>0){
			$('.pie-chart-container').trigger('resizeChart');
		}
	}

	var totalSliders = 0;
	function initSwiperMobile(){

		$('.swiper-mobile').each(function( index ) {
			var $swiper = $(this);
			createSwiper(index, $swiper);
			totalSliders++;

			if($('.swiper-mobile').length==totalSliders)
				generalFullLoadingIcon($('body'), false);
        });

		//Un timeout para esperar a que termine de cargar la librería
		if(typeof chartsMTE != 'undefined')
			setTimeout(function(){
				chartsMTE.reinitDuplicates();
	      	}, 1500);

	}


	function initSwiperResize(){
		var $body = $(this.ie6 ? document.body : document);

		$(window).resize(function(){
			if( ww != $(window).width()+fixPaddingRow ){
				rtime = new Date();
				//ww = $body.innerWidth();
			    if (timeout === false) {

			    	generalLoadingIcon('.swiper-mobile .s-slider', true);
			        timeout = true;
			        setTimeout(resizeend, delta);
			    }

			    //Do something

			    ww = $(window).width()+fixPaddingRow;

			    delete ww;

			}
			
		});
	}
	function resizeSlidesActive($swiper, height){
		if($swiper){
		    $swiper.find('.swiper-slide').css('height', height+100);
		}
	}

	function resizeSlides($swiper, auto){
		// var swiperHeight = typeof auto != 'undefined' ? auto : $swiper.height();

		// if($swiper){
		//     $swiper.find('.s-slider').height(swiperHeight);
		// }
	}

	var $body = $(this.ie6 ? document.body : document);
	var ww = 0;

	var fixPaddingRow = (platform.name == 'Safari' ? 0 : 15);
	$( window ).load( function(){

	   ww = $(window).width()+fixPaddingRow;

	});

	function createSwiper(i, $swiper){
		//ww = $body.innerWidth();
		ww = $(window).width()+fixPaddingRow;
		if (ww < 768) {
		  if (swipersM[i]) return;

		  else {
		  		addClasses($swiper);
		  		var isFormsHome = $swiper.hasClass('inn-sec-tabs');

			  	swipersM[i] = new Swiper($swiper, {
			  		speed: 200,
	               	loop: !isFormsHome,
	                nextButton: '.swiper-button-next',
       				prevButton: '.swiper-button-prev',
	                autoHeight: true,
	                effect: 'coverflow',
	                grabCursor: true,
	                centeredSlides: true,
	                slidesPerView: 1.5,
	                watchSlidesVisibility : true,
	                spaceBetween: 5,
	                //touchMoveStopPropagation : false,
	                shortSwipes	: false,
	                coverflow: {
	                    rotate: 0,
	                    stretch: 0,
	                    depth: 0,
	                    modifier: 1.1,
	                    slideShadows: false
	                },
	                resizeReInit: true,

	                breakpoints: {
	                    500: {
	                        slidesPerView: 1,
	                        loop: !isFormsHome,
	                    }
	                },
	                onInit : function(){
	                	$('.facturas-block').on('click', '.btn-descargar', function(e){
							e.preventDefault();
							var $element = $(this);
							home.facturasSwiperMobile($element);
						});
	                },
				    onSlideChangeStart: function (swiper) {
				    	var index = swiper.activeIndex,
				    	$slide = $swiper.find('.swiper-slide').eq(index),
				    	innerHeight = $slide.find('.slide-container').outerHeight();
				    	resizeSlidesActive($swiper, innerHeight);
	                },
	                onSlideChangeEnd: function (swiper) {
				    	var $terminosInSwiper = $swiper.find('.tab-pane').find('.terminos-container');
	                    if($terminosInSwiper.length>0){
	                    	$terminosInSwiper.hide();
	                    	$terminosInSwiper.removeClass('visible');
	                    }
	                }
	            });

			  
			  	$swiper.data('index', i);
			  	var index = swipersM[i].activeIndex,
			  	$slide = $swiper.find('.swiper-slide').eq(index),
				innerHeight = $slide.find('.slide-container').outerHeight();
			  	resizeSlidesActive($swiper, innerHeight);
			  	swipersM[i].slideTo(0);
			  }
		}
		else {
		  if (swipersM[i]) {
		  	
		     swipersM[i].destroy(false, true);
		     swipersM[i] = undefined;
		     removeClasses($swiper);
		     resizeSlides($swiper, 'auto');
		  }
		}

		function setHeightAttr($swiper){
			var height = $swiper.outerHeight();
			$swiper.data('iheight', height);
		}

		function addClasses($swiper){
			$swiper.addClass('swiper-container');
			$swiper.find('.s-wrapper').addClass('swiper-wrapper');
			$swiper.append('<div class="swiper-button-next io-slider-right swiper-button"></div><div class="swiper-button-prev io-slider-left swiper-button"></div>');
			$swiper.find('.s-slider').addClass('swiper-slide');

			var swiperHeight = $swiper.height();
            $swiper.find('.s-slider').css('height',swiperHeight);
            // setHeightAttr($swiper);
		}

		function removeClasses($swiper){
			$swiper.removeClass('swiper-container');
			$swiper.find('.s-wrapper').removeClass('swiper-wrapper');
			$swiper.find('.swiper-button').remove();
			$swiper.find('.s-slider').removeClass('swiper-slide');
		}

	}

    return{
        inicializar: function(){
        	if($('.swiper-mobile').length>0){
        		setTimeout(function(){
        			initSwiperMobile();
        			initSwiperResize();
        			addActionsSliderHome();
        			addActions();
        		}, 1000);
        		
            	
        	}
        },
        resizeSlidesActive : resizeSlidesActive
    }

})();

/*Slider*/
var sliderCreate = (function(){
    return{
        inicializar: function(){

            var swiper = new Swiper('.slider-type-one', {
                pagination: '.pag-type-one',
                paginationClickable: true,
                loop: true,
                autoplay: 1500,
                autoHeight: true
            });
        }
    }

})();


var firstChartLoaded = false;

/*Gráficas circulares de Pastel*/
var chartsTelcel = (function(){

    function calculateChartDonut($chart, perc){
        var deg = [];

        deg[0] = (perc/100*360)-180;
        deg[1] = 270; //90
        deg[2] = deg[0];
            
        // If percentage is less than 50%

        if(perc<50){

            $chart.addClass('flip-colors');
            deg[1] = (perc/100*360+90-180);
            deg[2] = 180;
        }

        return deg;

    }

    function setPropertiesDonut($chart, deg,text, percentage){

        $chart.find('.chart-center').html("<span class='robusta'>"+text+"</span>");

        $chart.find('.slice.one').css({
            "-webkit-transform": "rotate("+deg[1]+"deg)",
            transform: "rotate("+deg[1]+"deg)"
        });

        $chart.find('.slice.two').css({
            "-webkit-transform": "rotate("+deg[2]+"deg)",
            transform: "rotate("+deg[2]+"deg)"
        });

        $chart.find('.rest-block strong').html(100-percentage+'%');
    }

    function setPropertiesBar($chart, percentage, text){
    	var ilimitado = false;

    	if(percentage == 'Ilimitado'){
    		ilimitado = true;
    		percentage = 100;
    	}

    	if($chart.hasClass('v2')){
    		$chart.parent().append("<p>"+text+"</p>");

    		var style = "left:'+percentage+'%";

    		if(percentage == 100)
    			style = "right:0";

    		$chart.append('<span class="percentage robusta" style="'+style+'">'+( ilimitado ? 'Ilimitado' : percentage+'%' )+'</span>');
    	}
    	else
        	$chart.find('.bar-chart').html("<p>"+text+"</p>");

        $chart.find('.bar-chart').css({
            "width": percentage+"%"
        });


        $chart.show();

    }

    function setPropertiesBattery($chart, percentage, text){

        $chart.find('.chart-center').html("<p>"+text+"</p>");

        var base = 20;

        var coloreditems = (percentage*base)/100;

        if((percentage%5) != 0){
            coloreditems = 5*(Math.round(coloreditems/5));
        }

        for (var i=0; i<coloreditems; i++){
            $chart.find('.battery-chart').append("<span class='slice colored'></span>");
        }

        for (var i=0; i<base-coloreditems; i++){
            $chart.find('.battery-chart').append("<span class='slice'></span>");
        }


    }

    function drawChartsDonut(){
        $('.chart-block').each(function( index ) {

            var percentage = $(this).data('percentage');
            var text = $(this).data('description');
            var deg = [];

            if(percentage) {
                var $chart = $(this);
                deg = calculateChartDonut($chart,percentage);
                setPropertiesDonut($chart, deg, text, percentage);
            }


        });
        
    }

    function setChartError($chart){
		var $chartContainer = $chart;
		var html = '<div class="col-sm-12 api-msg api-msg-error"> <div class="notif-bloq"> <div class="row"> <div class="col-xs-12 col-sm-12 inner-nb"> <span class="icon io-Alert2"></span> <h2 class="h4">Información no disponible por el momento.</h2> <p class="p-only"><button class="btn-like-a btn-reintentar">Reintentar</button></p></div> </div> </div> </div>';

		$chartContainer.append(html);

		loadingChart($chartContainer, false);

	}

    function drawChartsBar(){

       $('.bar-chart-container').each(function( index ) {
        	var hash = window.location.hash;
        	var $chart = $(this);
		    loadingChart($chart, true);

		   	loadDataChartsBar($chart);

        });
        
    }

    function loadDataChartsBar($chartContainer){

    	/*Get data*/
		var loaded = typeof $chartContainer.data('loaded') != 'undefined' ? Number($chartContainer.data('loaded')) : 0;
		$chartContainer.find('.first-chart').hide();

		if(loaded){

			$chartContainer.find('.bar-block-container').each(function( index ) {
            	var $chart = $(this).find('.bar-block');
            	drawData($chart);
            });

			setTimeout(function(){
	            loadingChart($chartContainer, false);
	            $chartContainer.find('.first-chart').show();
	        }, 1000);


	        if($chartContainer.hasClass('swiper-slide') && !firstChartLoaded){
				firstChartLoaded = true;
				$chartContainer.addClass('firstLoaded');

				$swiper = $chartContainer.closest('.swiper-mobile');
				swipersM[$swiper.data('index')].slideTo(i);
			}

		}
		else{
			setChartError($chartContainer);
		}	
    }

    function drawData($chart){
    	var percentage = typeof $chart.data('percentage') != 'undefined' ? $chart.data('percentage') : 0;
        var text = $chart.data('description');

        setPropertiesBar($chart, percentage, text);

    }

    function setErrorCharts(){

		var html = '<div class="col-sm-12 api-msg api-msg-error"> <div class="notif-bloq"> <div class="row"> <div class="col-xs-12 col-sm-12 inner-nb"> <span class="icon io-Alert2"></span> <h2 class="h4">Información no disponible por el momento.</h2> <p class="p-only"><button class="btn-like-a btn-reintentar">Reintentar</button></p></div> </div> </div> </div>';

		$('.bar-chart-container').each(function(){
			var $chartContainer = $(this);
			$chartContainer.append(html);

			loadingChart($chartContainer, false);
		});

	}

	function setActionsErrorBar(){
		$('.bar-chart-container').on('click', '.btn-reintentar', function(){
			var $button = $(this),
			$container = $button.closest('.bar-chart-container');
			loadingChart($container, true);
			setTimeout(function(){
				loadDataChartsBar($container);
			}, 3000);
			
			$container.find('.api-msg-error').remove();
			
		});
	}

	function setActionsErrorBattery(){
		$('.battery-chart-container').on('click', '.btn-reintentar', function(){
			var $button = $(this),
			$container = $button.closest('.battery-chart-container');
			loadingChart($container, true);
			setTimeout(function(){
				loadDataChartsBattery($container);
			}, 3000);
			
			$container.find('.api-msg-error').remove();
			
		});
	}

    function drawChartBattery(){
    	$('.battery-chart-container').each(function( index ) {
        	var hash = window.location.hash;
        	var $chartContainer = $(this);
		    loadingChart($chartContainer, true);

		    loadDataChartsBattery($chartContainer);

        });

        // $('.battery-block').each(function( index ) {

        //     var percentage = $(this).data('percentage');
        //     var text = $(this).data('description');

        //     if(percentage) {
        //         var $chart = $(this);
        //         setPropertiesBattery($chart, percentage, text);
        //     }

        // });
        
    }

    function loadDataChartsBattery($chartContainer){
    	var $chart = $chartContainer.find('.battery-block');

    	/*Get data*/
		var loaded = typeof $chart.data('loaded') != 'undefined' ? Number($chart.data('loaded')) : 0;

		$chartContainer.find('.first-chart').hide();

		if(loaded){

			var percentage = $chart.data('percentage');
			var text = $chart.data('description');
			setPropertiesBattery($chart, percentage, text);

			setTimeout(function(){
	            loadingChart($chartContainer, false);
	            $chartContainer.find('.first-chart').show();
	        }, 1000);

	        if($chartContainer.hasClass('swiper-slide') && !firstChartLoaded){
				firstChartLoaded = true;
				$chartContainer.addClass('firstLoaded');

				$swiper = $chartContainer.closest('.swiper-mobile');
				swipersM[$swiper.data('index')].slideTo(i);
			}

		}
		else{
			setChartError($chartContainer);
		}	
    }

    return{
        inicializar: function(){
            drawChartsDonut();
            drawChartsBar();
            drawChartBattery();
            setActionsErrorBar();
            setActionsErrorBattery();
        }
    }

})();


function loadingChart($container, show){
	var loading = '<div class="loading-block full-width"><div class="loading-wrapper"><div class="sk-circle"> <div class="sk-circle1 sk-child"></div> <div class="sk-circle2 sk-child"></div> <div class="sk-circle3 sk-child"></div> <div class="sk-circle4 sk-child"></div> <div class="sk-circle5 sk-child"></div> <div class="sk-circle6 sk-child"></div> <div class="sk-circle7 sk-child"></div> <div class="sk-circle8 sk-child"></div> <div class="sk-circle9 sk-child"></div> <div class="sk-circle10 sk-child"></div> <div class="sk-circle11 sk-child"></div> <div class="sk-circle12 sk-child"></div> </div></div></div>';

	if(show){
		$container.append(loading);
	}
	else{
		$container.find('.loading-block').remove();
	}
}

/**Variable auxiliar en devx para saber a que url mandar el post FAKE**/
var ingresarLineasComponentTotal = 0;

var ingresarLineasComponent = (function(){

	var $component = $('#componente-ingresar-lineas');
	var $formArchivo = $('#componente-ingresar-lineas form.lineas-archivo');
	var currentBtn = null;
	
	var elementsForm = {
		'agregarLineasArchivo' : {
			id : null,
			validator : null,
			sending: false
		},
		'agregarLineasArbol' : {
			id : null,
			validator : null,
			sending: false
		},
		'buscarArbolLineas' : {
			id : null,
			validator : null,
			sending: false
		},
		'agregarLineasAutocomplete' : {
			id : null,
			validator : null,
			sending: false
		}
	};

	// GUARDAR ELEMENTOS DEPENDIENDO DEL TIPO DE SUBIDA
	var elementsPost = [];

	function init(){

		if($component.length>0){
			initGeneralActions();
			initArchivo();
			initAutocomplete();
			initArbol();
			checkPreSelectedData();
		}
	}

	// Acciones generales
	function initGeneralActions(){

		// ACCIONES PARA MOSTRAR CADA COMPONENTE DIFERENTE
		$('#componente-ingresar-lineas .componente-btn-block').on('click', '.btn-al', function(){

			var $button = $(this);

			$('#componente-ingresar-lineas .btn-al').removeClass('active');
			$button.addClass('active');
			
			var elementToShow = ( typeof $button.data('show') != 'undefined' ? $button.data('show') : null);

			if(elementToShow != null ){

				currentBtn =  elementToShow;
				showElement(elementToShow); 
				showSecondaryEvent(elementToShow);

			}

			resetArchivo();
			resetAutocomplete();
			//resetTree();
		});
	}


	function showSecondaryEvent(element){

		var $element = $('#componente-ingresar-lineas '+element);
		var elementToShowOptions = ( typeof $element.data('options') != 'undefined' ? $element.data('options') : null);

		if(elementToShowOptions!=null){
			triggerElementEvent(elementToShowOptions, false);
		}
	}

  	function checkPreSelectedData(){
  		var $element = $('#tokenfield-agregar-lineas');

  		var preSelectedData = $element.data('preseleccionada');

  		if(typeof preSelectedData!='undefined'){
  			if($('#componente-ingresar-lineas .btn-al.btn-lineas-autocomplete').length>0)
  				$('#componente-ingresar-lineas .btn-al.btn-lineas-autocomplete').trigger('click');
  			$element.tokenfield('setTokens', preSelectedData );
  			/**Esconder placeholder**/
			$('#tokenfield-agregar-lineas-tokenfield').prop('placeholder', '');
			//**Esconder placeholder fin**/
  			
  		}

  	}

  	function getType(){
  		return currentBtn;
  	}
	// Mostrar esconder elementos
	function showElement(element){

		$('#componente-ingresar-lineas .componente-lb').hide();
		
		// LLAMAR RESETS
		$('#componente-ingresar-lineas '+element).show();

		if($('.modal-mte #componente-ingresar-lineas').length<1)
			scrollToElement($('#componente-ingresar-lineas'));
	}

	function initArchivo(){

		var $element = $('#componente-ingresar-lineas .componente-lb.lineas-archivo');
		var elementOptions = ( typeof $element.data('options') != 'undefined' ? $element.data('options') : null);

		initActions();

		if($formArchivo.length>0)
			validateFormArchivo();

		// Validar formulario del archivo : tipo y tamaño del archivo
		function validateFormArchivo(){

			disableSumbitButton($formArchivo, true);

			elementsForm['agregarLineasArchivo']['validator'] = 
				$formArchivo.validate({
					  rules: {
						archivo: {
							required: true,
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
							$('.lineas-archivo .extra-info').hide();
							error.appendTo( $('.lineas-archivo .add-lines-ge-mod' ));
							element.parent().addClass('error');
						},
				   		onclick: true,
						success: function (error) {
							$('.lineas-archivo .extra-info').hide();
						 	$('.lineas-archivo .file.error' ).removeClass('error');
				            error.remove();
				        }
				});	

		}


		function initActions(){

			// CAMBIAR EL NOMBRE DEL ARCHIVO 
			$('#componente-ingresar-lineas .file').on('change', 'input[type="file"]', function(e){
				e.stopPropagation();
				var $parent = $('#componente-ingresar-lineas .file');
				var title =  $(this).val().replace(/^.*[\\/]/, '');
				$parent.prop('title', title);

				if(title!='')
					$('.lineas-archivo .extra-info').hide();
				else{
					$('#archivo').parent('.file').removeClass('error');
					$('.lineas-archivo .extra-info').show();
				}
				
				if(elementOptions!=null){

					if(title!='')
						triggerElementEvent(elementOptions, true);
					else
						triggerElementEvent(elementOptions, false);
					
				}
				else{
					if(title!='' && $formArchivo.valid())
						disableSumbitButton($formArchivo, false);
					else
						disableSumbitButton($formArchivo, true);
				}
			});

		}

	}


	function triggerElementEvent(options, value){
		var show = true;

		if(options.event=='show'){

			var dependantShow = ( typeof options.showDependant != 'undefined' ? options.showDependant : null);
			
			if(dependantShow != null)
				show = ( typeof $(dependantShow).valid() != 'undefined' ? $(dependantShow).valid() : true);
			
			if(value && show)
				$(options.element).show();
			else
				$(options.element).hide();
		}
	}

	function formatDataAutocomplete(data){

		var dataT = null;

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

	}

	function getArchivo(){

		var fileData = $('#componente-ingresar-lineas #archivo').prop('files')[0];
	   	var formData = new FormData();                  
	    formData.append('archivo', fileData);

	    return formData;

	}

	function getDataAutocomplete(){
		var tokens = $('#tokenfield-agregar-lineas').tokenfield('getTokens');
		formatDataAutocomplete(tokens);

		return elementsPost;
	}

	function initAutocomplete(){

		function sendAutocompleteData(){
			var container = '#componente-ingresar-lineas';
			var $form = $('.form-agregar-grupo #form-agregar-grupo');

			$('#btn-add-lineas-autocomplete').prop('disabled', true);

			//
			if(!elementsForm['agregarLineasAutocomplete']['sending']){

				elementsForm['agregarLineasAutocomplete']['sending'] = true;

				$('#btn-add-lineas-autocomplete').prop('disabled', true);

				generalLoadingIcon(container, true);

				var data = { success: true, data: [] };

				$.post( postURL , { data: self })
				  .done(function( json ) {
				  	
				  	if(data.success){
				  		//EXITO
				  		//Simular el id que se agrego en la DB
						var idAdded = $('#main-view-block .item-mv').length;

						//Envío el Id y el nombre del nuevo elemento
						addCreatedElementToHTML(idAdded, selfArray[0].value);

						$('#btn-agregar-lineas-grupo-modal').attr('data-item', '{"id": "'+idAdded+'" ,"texto": "'+selfArray[0].value+'"}');

						$(form).hide();
						$(form).addClass('success');

						$('.form-agregar-grupo .api-msg .grupo-txt').html(selfArray[0].value);

						elementsForm['agregarLineasAutocomplete']['sending'] = false;
						$(form).find('button[type="submit"]').prop('disabled', false);

				  	}
				  	else{

				  		//JSON SUCCESS FALSE
				  		if(data.error){
				  			appendErrorGeneral($('.form-agregar-grupo .element-input-block'), null , data.error.message);
				  		}

				  	}

				  	elementsForm['agregarLineasAutocomplete']['sending'] = false;
				  	generalLoadingIcon(form, false);

				  })
				  .fail(function( jqxhr, textStatus, error ) {
				  	//Mensaje de error del SISTEMA
				  	elementsForm['agregarLineasAutocomplete']['sending'] = false;
				  	generalLoadingIcon(form, false);
				});

			}

		}
	}	



	function resetArchivo(){

		//FORM FILE
		$('.lineas-archivo .extra-info').show();
		$('#componente-ingresar-lineas .lineas-archivo').find("input[type=text], input[type=file]").val("");
		$('#componente-ingresar-lineas .lineas-archivo').find('button[type="submit"]').prop('disabled', true);
		$('#componente-ingresar-lineas .lineas-archivo').find('.error-dd, .error').removeClass('error-dd').removeClass('error');
		$('#componente-ingresar-lineas .lineas-archivo').find('.file').attr('title', '');
		$('#componente-ingresar-lineas .lineas-archivo').find('#archivo-error').remove();
		
		if(elementsForm['agregarLineasArchivo']['validator']){
			elementsForm['agregarLineasArchivo']['validator'].resetForm();
		}

	}

	function resetAutocomplete(){
		// AUTOCOMPLETE
		$('#btn-add-lineas-autocomplete').prop('disabled', true);
		$('#tokenfield-agregar-lineas').tokenfield('setTokens', []);
		$('#tokenfield-agregar-lineas').val('');
		$('.total-autocomplete').addClass('hidden');
		$('.total-autocomplete .total').html('0');
		tokenFieldComponent.resetTotal();
	}

	function resetSearchTree(){
		$('#tree-lineas-search').jstree("deselect_all");
	    $('#componente-ingresar-lineas .lineas-arbol .search-input').val('');
	    $('#componente-ingresar-lineas .lineas-arbol .btn-remover-busqueda').removeClass('active');
	    $('#componente-ingresar-lineas .lineas-arbol .btn-search').prop('disabled', true);
	    $('#tree-lineas-search').hide();
	    $('#tree-lineas').show();
	   	if($('#tree-lineas .jstree-clicked').length>0){
			$("#componente-ingresar-lineas .lineas-arbol .block-content-arbol-btn").removeClass('hidden');
			$("#componente-ingresar-lineas .lineas-arbol .block-content-arbol-btn .btn-remover-seleccion").addClass('active');
		}
		else{
			$("#componente-ingresar-lineas .lineas-arbol .block-content-arbol-btn").addClass('hidden');
			$("#componente-ingresar-lineas .lineas-arbol .block-content-arbol-btn .btn-remover-seleccion").removeClass('active');
		}
	}

	function resetTree(){
		$('#tree-lineas').jstree("deselect_all");
		$('#tree-lineas-search').jstree("deselect_all");

		$('#tree-lineas').jstree("destroy").empty();
		$('#tree-lineas-search').jstree("destroy").empty();

		//selectedGroup = { id: null , nombre: null, actual : null };
		$('#btn-mover-lineas').prop('disabled', true);
		$('#tree-lineas').jstree("close_all");
		$('#tree-lineas .detail-group').remove();
		$("#componente-ingresar-lineas .lineas-arbol .block-content-arbol-btn").addClass('hidden');
		$("#componente-ingresar-lineas .lineas-arbol .btn-like-a").removeClass('active');
	}

	function getDataArbol(){
		//Obtener los elementos seleccionados
		var result = $('#tree-lineas').jstree('get_selected'); 

		formatDataArbol(result);

		return elementsPost;
		//postAgregarLineas(phoneChecked, total);
	}

	// UNIFICAR LA INFORMACIÓN AL MISMO FORMATO
	function formatDataArbol(data){

		var dataT = null;

		elementsPost = [];

		data.forEach(function(item, index){

			if($('#'+item+' >.jstree-anchor .io-Phone').length>0){
				
				dataT = {
			 		id : ( typeof item != 'undefined' ? item : null ),
			 		tipo : 'single',
			 		selected : 'single'
			 	};
			}
			else{
				dataT = {
			 		id : ( typeof item != 'undefined' ? item : null ),
			 		tipo : 'group',
			 		selected : 'all'
			 	};
			}

			elementsPost.push(dataT);

		});

	}

	function initArbol(){

		var $element = $('#componente-ingresar-lineas .componente-lb.lineas-arbol'),
		elementOptions = ( typeof $element.data('options') != 'undefined' ? $element.data('options') : null),
		treeCuentas = false;

		initActions();
		initTree();

		function initActions(){

			// ACCIONES PARA MOSTRAR CADA COMPONENTE DIFERENTE
			$('#componente-ingresar-lineas .componente-btn-block').on('click', '.btn-lineas-arbol', function(){
				resetSearchTree();
				resetTree();
				initTree();
				
			});


			//EJECUTAR BUSQUEDA
			$("#componente-ingresar-lineas .lineas-arbol .btn-search").click(function() {
		        	
		        var searchString = $('#componente-ingresar-lineas .lineas-arbol .search-input').val();

		        if(searchString!=''){
		       		searchTree(searchString);
		        }

		    });

			//CAMBIAR ESTADO DEL BOTÓN Y DEL ARBOL DEPENDIENDO DEL SEARCH INGRESADO
		    $("#componente-ingresar-lineas .lineas-arbol .search-input").keyup(function() {

		        var searchString = $('#componente-ingresar-lineas .lineas-arbol .search-input').val();
		        var $input = $(this);
		        var min = (typeof $input.data('min') != 'undefined' ? $input.data('min') : 1);
		        if(searchString.length>=min){
		        	$('#componente-ingresar-lineas .lineas-arbol .btn-search').prop('disabled', false);
		       		//$('#componente-ingresar-lineas .lineas-arbol .btn-remover-busqueda').addClass('active');	
		        }
		       	else{
		       		$('#componente-ingresar-lineas .lineas-arbol .btn-search').prop('disabled', true);
		       		//resetSearchTree();
		       	}

		    });

		    //BORRAR BUSQUEDA
		    $("#componente-ingresar-lineas .lineas-arbol").on('click', '.btn-remover-busqueda', function() {
		       	resetSearchTree();
		    });

		    //BORRAR SELECCION
		    $("#componente-ingresar-lineas .lineas-arbol .btn-remover-seleccion").click(function() {
		       	resetTree();
		       	initTree();
		    });
		}

		function mostrarNodos(node){
			
			$('#tree-lineas').jstree('open_node', node.id, function(e, data) {
				drawText(node);
				// var children = node.children;

				// children.forEach(function(child) {
				// 	if(!(/phone_root/i.test(child))){
				// 		var realNode = $("#tree-lineas").jstree().get_node(child);
				// 		drawText(realNode);
				// 	}
				// });
			}, true);			 
		}

		function esconderNodos(node){

			$('#tree-lineas').jstree('close_node', node.id);
			drawText(node);
		}

		function drawText(node){
			if(node && typeof node.children != 'undefined' && node.children.length>0){

				var nSelectedLines =  $('#tree-lineas #'+node.id+' .jstree-clicked .io-Phone').length;
				var nSelectedGroups =  $('#tree-lineas #'+node.id+' >ul >li >.jstree-clicked .io-Maletin').length;
				
				var $append = $('#tree-lineas #'+node.id+' >.jstree-anchor');

				var text = '';

				if(!treeCuentas){

					if(node.state.selected)
						nSelectedLines = node.original.total;
					else if(nSelectedLines == 0 && nSelectedGroups>0){

						$('#tree-lineas #'+node.id+' >ul >li >.jstree-clicked .io-Maletin').each(function( index ){
							var $nodo = $(this).parent().parent();
							var nodoId = $nodo.attr('id');
							var realNode = $("#tree-lineas").jstree().get_node(nodoId);

							nSelectedLines += realNode.original.total;
						});
						
					}

				}

				if($('#tree-lineas .jstree-clicked').length>0 || nSelectedLines>0){
					$("#componente-ingresar-lineas .lineas-arbol .block-content-arbol-btn").removeClass('hidden');
					$("#componente-ingresar-lineas .lineas-arbol .block-content-arbol-btn .btn-remover-seleccion").addClass('active');
				}
				else{
					$("#componente-ingresar-lineas .lineas-arbol .block-content-arbol-btn").addClass('hidden');
					$("#componente-ingresar-lineas .lineas-arbol .block-content-arbol-btn .btn-remover-seleccion").removeClass('active');
				}
			}

			if($('#tree-lineas .jstree-node .jstree-clicked').length>0)
				$('#btn-add-lineas-arbol').prop('disabled', false);
			else
				$('#btn-add-lineas-arbol').prop('disabled', true);
		}

		

		function updateTotal(node){
			var total = 0;
			var last = 0;
			var result = $('#tree-lineas').jstree('get_selected'); 

			$.each(result, function( index, value ) {
			  var n = $('#tree-lineas').jstree(true).get_node(value);
			  var exists = result.indexOf(n.parent);
			  if(exists<0)
			  	total+=n.original.total;
			});

			if(total>50){
				modalLimitarMasivo.openModal();
				$('#tree-lineas').jstree(true).deselect_node(node);
				total-=node.original.total;
			}

			$('.total-arbol .total').html(total);
			if(total>0)
				$('.total-arbol').removeClass('hidden');
			else
				$('.total-arbol').addClass('hidden');

			ingresarLineasComponentTotal = total;

			if(total>0){
				$("#componente-ingresar-lineas .lineas-arbol .block-content-arbol-btn").removeClass('hidden');
				$("#componente-ingresar-lineas .lineas-arbol .block-content-arbol-btn .btn-remover-seleccion").addClass('active');
			}
			else{
				$("#componente-ingresar-lineas .lineas-arbol .block-content-arbol-btn").addClass('hidden');
				$("#componente-ingresar-lineas .lineas-arbol .block-content-arbol-btn .btn-remover-seleccion").removeClass('active');
			}
		}

		function initTree(){

			treeCuentas = ($('#tree-lineas').hasClass('tree-cuentas') ? '-cuentas' : '');

			$('#tree-lineas')
			.on("changed.jstree", function (e, data) {

				
				if(data.action == "select_node"){
					
					mostrarNodos(data.node);
					
					if(elementOptions!=null){
						var results = getDataArbol();
						if(results.length>0)
							triggerElementEvent(elementOptions, true);
						else
							triggerElementEvent(elementOptions, false);
					
					}

					updateTotal(data.node);

					
					//$('#tree-lineas').jstree('open_node', data.node.id); 
				}
				else if(data.action == "deselect_node"){
					esconderNodos(data.node);

					if(elementOptions!=null){
						var results = getDataArbol();
						if(results.length>0)
							triggerElementEvent(elementOptions, true);
						else
							triggerElementEvent(elementOptions, false);
					
					}

					updateTotal(data.node);
				}
				
			})
			.bind("open_node.jstree", function (event, data) { 
			  mostrarNodos(data.node); 
			})
			.jstree({
				'core' : {
					'check_callback' : true,
					'data' : {
						'dataType' : 'json',
						'url' : function (node) {
					      return node.id === '#' ?
					        'http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/root'+treeCuentas+'.php' :
					        'http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/children'+treeCuentas+'.php';
					    },
						'data' : function (node) {
						
							return { 'id' : node.id };
						}
					},
					'multiple' : true
				},
				'plugins' : [ 'checkbox' ]
			});


			// ARBOL DEL BUSCADOR
			$('#tree-lineas-search').hide();

			$('#tree-lineas-search')
			.on("changed.jstree", function (e, data) {

				if(data.action == "select_node"){
					
					var $result = $('#tree-lineas-search .jstree-children .jstree-search.jstree-clicked');

					$result.each(function(item, i){
						var instance = $('#tree-lineas').jstree(true);
						var id = $(this).parent('li').attr('id');
						instance.check_node(id);
						instance._open_to(id);
					});

					updateTotal(data.node);
				}
				else if(data.action == "deselect_node"){
					var treeData = $('#tree-lineas').jstree(true).get_json('#', {flat:false})
					var result = data.selected;

					treeData.forEach(function(item, i){
						var instance = $('#tree-lineas').jstree(true);
						if(result.indexOf(item.id) < 0)
							instance.uncheck_node(data.instance.get_node(item.id).id);
					});

					var auxtotal = Number($('.total-arbol .total').html());
					
					$('.total-arbol .total').html((auxtotal-data.node.original.total<0 ? 0 : auxtotal-data.node.original.total));
				}
			})
			.bind("refresh.jstree", function (event, data) {
		        
		        var search = $('#componente-ingresar-lineas .lineas-arbol .search-input').val();

		        $('#tree-lineas-search').jstree("open_all");
		        $('#tree-lineas-search').jstree('search', search);

		        $('#tree-lineas-search .jstree-search').each(function( index ) {
		        	var texto = $( this ).text();
		        	var textoT = texto.replace(search, '<span class="exact-search">'+search+'</span>');
		        	var $innerHTML = $( this ).find('.jstree-icon');
		        	var $html = $(this);
		        	$html.html('');

		        	$innerHTML.each(function( index ) {
					  $html.append($(this));
					});
		        	
					$html.append(textoT);				  
				});

				var treeData = $('#tree-lineas').jstree('get_selected');
				treeData.forEach(function(item, i){
					var instance = $('#tree-lineas-search').jstree(true);
					if($('#'+item).length > 0)
						instance.check_node(item);
				});
		    })
			.jstree({
				'core' : {
					'expand_selected_onload': true,
					'dblclick_toggle' : false,
					'data' : {
						"dataType" : "json",
						"url" : function (node) {
					      return false;
					    },
						"data" : function (node) {
			
							return { "id" : node.id };
						}
					},
					"multiple" : true
				},
				'plugins' : ["noclose", "search", "checkbox"],
				'search': {
					"case_insensitive": true,
            		"show_only_matches" : true
				}
			});

		}


		function searchTree(search){

			if(!elementsForm['buscarArbolLineas']['sending']){

				var form = '.tree-groups-asoc';
				generalLoadingIcon(form, true);
				elementsForm['buscarArbolLineas']['sending'] = true;

				var postURL = Services.apiURL.arbolBusqueda(treeCuentas);

				$.post( postURL , { search: search })
				  .done(function( json ) {

				  	Services.general.getArbolBusquedaGeneralCallSuccess(json , form);
				  	elementsForm['buscarArbolLineas']['sending'] = false;
				  	generalLoadingIcon(form, false);

				  })
				  .fail(function( jqxhr, textStatus, error ) {
				  	Services.general.getArbolBusquedaGeneralCallFail(error, form);
				  	elementsForm['buscarArbolLineas']['sending'] = false;
				  	generalLoadingIcon(form, false);
				});

			}
		}
	}

	function resetComponente(){
		$('#componente-ingresar-lineas .btn-al').removeClass('active');
		$('#componente-ingresar-lineas .componente-lb').hide();
		resetAutocomplete();
		resetArchivo();
	}

	return{
		inicializar: init,
		getDataArbol : getDataArbol,
		getDataAutocomplete : getDataAutocomplete,
		getDataArchivo : getArchivo,
		reset : resetComponente,
		getType : getType
	}


})();

var FAQComponente = (function(){

	var $searchForm = $('#form-search-faq');
	var $searchInput = $('#input-search-faq');
	var $autocomplete = $('#autocomplete-ul');

	function init(){
		checkRequiredElements('#form-search-faq');
		initActions();
	}

	function initActions(){ 
		initSearchForm();
		initSearchAutocomplete();
	}

	function initSearchForm(){

		$searchForm.submit(function( event ) {

			var searchTerm = $searchInput.val();
			
			if(searchTerm.length>0)
				return true;

			return false;

		});

	}

	function initSearchAutocomplete(){

		$searchInput.bind('input', function() {
			
			var searchTerm = $searchInput.val();
			
			if(searchTerm.length>3)
				searchAutocomplete(searchTerm);
			else
				$autocomplete.html('');

		});

		function searchAutocomplete(searchTerm){
			var meta = [];

			$.get( postURL , { term: searchTerm } )
			  .done(function( data ) {
			  	//simular información data
			  	 meta = [
			  	 	{ id: 1, title: "¿Qué es la factura Telcel?", excerpt :  "La factura Telcel es el Estado de Cuenta de tu Plan de Renta.", url : "../faq/categorias" },
			  	 	{ id: 2, title: "¿Qué es la factura Telcel?", excerpt :  "La factura Telcel es el Estado de Cuenta de tu Plan de Renta.", url : "../faq/categorias" },
			  	 	{ id: 3, title: "¿Qué es la factura Telcel?", excerpt :  "La factura Telcel es el Estado de Cuenta de tu Plan de Renta.", url : "../faq/categorias" }
			  	];

			    setAutocompleteHTML(meta);

			  });
		}

		function setAutocompleteHTML(metaAutocomplete){

			$autocomplete.html('');

			$.each(metaAutocomplete, function( index, faq ) {
			  	var liHTML ="<li><a href='"+faq.url+"'><span class='faq-title'>"+faq.title+"</span><span class='faq-excerpt'>"+faq.excerpt+"</span></li>";
			  	$autocomplete.append(liHTML);
			});

		}
	}



	return{
		inicializar: init
	}

})();

function initActionsTerminosGenerales(){
	/** 
		Abrir Términos y Condiciones
	**/

	var $terminosContainer = $('#terminos-container, .terminos-container');
	var fadein = false;

	if($terminosContainer.hasClass('fadein'))
		fadein = true;


	$('body').on('click', '.has-inner-tc .btn-terminos-general', function(e){
		e.preventDefault();
		var $button = $(this),
		fadein = false,
		$parent = $button.closest('.has-inner-tc'),
		$terminosBlock = $parent.find('.terminos-container-general-block'),
		$terminosContainer = $terminosBlock.find('.terminos-container');
		
		if($terminosContainer.hasClass('fadein'))
			fadein = true;

		$terminosContainer.toggleClass('visible');

		if($terminosContainer.hasClass('visible')){

			$('.terminos-container-general-block .terminos-container').removeClass('visible');
			$('.terminos-container-general-block .terminos-container').hide();

			$terminosContainer.addClass('visible');

			if(fadein){
				if(!is_mobile())
					$terminosContainer.fadeIn(300);
				else
					$terminosContainer.show();
			}
			else
				$terminosContainer.slideDown(300);
		}
		else{

			if(fadein){
				if(!is_mobile())
					$terminosContainer.fadeOut(300);
				else
					$terminosContainer.hide();
			}
			else
				$terminosContainer.slideUp(300);


		}

		scrollToElement($parent);
	});
}

function terminosActions(){
	/** 
		Abrir Términos y Condiciones
	**/

	$('body').on('click', '#btn-terminos, .btn-terminos', function(e){
		e.preventDefault();
		var $button = $(this),
		fadein = false,
		$container = $button.closest('.data-write'),
		$terminosContainer = $container.next('#terminos-container, .terminos-container'),
		$swiper = $button.closest('.swiper-mobile'),
		$terminosContainerSwiper = $button.closest('.tab-pane').find('.terminos-container'),
		speed = 300;

		if($terminosContainer.hasClass('fadein'))
			fadein = true;

		if($terminosContainerSwiper.length>0){
			$terminosContainer = $terminosContainerSwiper;
			speed = 100;
		}

		$terminosContainer.toggleClass('visible');

		if($terminosContainer.hasClass('visible')){

			if(fadein){
				if(!is_mobile())
					$terminosContainer.fadeIn(300);
				else
					$terminosContainer.show();
			}
			else
				$terminosContainer.slideDown(300);

			if(!fadein)
				scrollToElement($terminosContainer);


			$button.trigger('openTerminos');
		}
		else{
			if(!fadein)
				scrollToElement($('#btn-terminos, .btn-terminos').parent());

			if(fadein){
				if(!is_mobile())
					$terminosContainer.fadeOut(300);
				else
					$terminosContainer.hide();
			}
			else
				$terminosContainer.slideUp(300);

			$button.trigger('closeTerminos');
		}
	});

	$('body').on('click', '#terminos-container .close-container .icon, .terminos-container .close-container .icon', function(e){
		e.preventDefault();

		var $button = $(this),
			fadein = false,
			$terminosContainer = $button.closest('#terminos-container, .terminos-container'),
			$swiper = $button.closest('.swiper-mobile'),
			$terminosContainerSwiper = $button.closest('.tab-pane').find('.terminos-container');
	
		if($terminosContainer.hasClass('fadein'))
			fadein = true;

		if($terminosContainerSwiper.length>0)
			$terminosContainer = $terminosContainerSwiper;
		
		var $scrollTo = ($button.closest('.has-inner-tc').length>0 ? $button.closest('.has-inner-tc') : $('#btn-terminos, .btn-terminos').parent() );

		scrollToElement($scrollTo);

		if(fadein){

			if(!is_mobile())
					$terminosContainer.fadeOut(300);
				else
					$terminosContainer.hide();
			}
			
		else
			$terminosContainer.slideUp(400);

		$terminosContainer.removeClass('visible');

		$('.terminos-container .close-container .icon').trigger('closeTerminos');

	});
}


function initHeaderOptions(){
	var $options = $('.options-header-block .element-option');

	$options.change(function(){
		var $option = $(this),
		value = $option.val(),
		$element = $('#'+value);

		$('.element-option-container').addClass('hidden');
		if($element.length>0)
			$element.removeClass('hidden');
	});
}

var modalErrorMantenimiento = null;
function initModalErrorMantenimiento(){
	modalErrorMantenimiento = new modalesTelcel($('#modal-error-mantenimiento'),{
		onInit : function(){
			$('#modal-error-mantenimiento #btn-aceptar').click(function(){
				modalErrorMantenimiento.closeModal();
			});
		}
	});
}