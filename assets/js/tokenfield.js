var tokenFieldComponent = (function(){
	var total = 0,
	initialLimit = 0,
	initialGroups = false,
	isIMEI = false,
	isCitas = false,
	isCuentas = false,
	hasGroups = false;
	
	function getDataAutocomplete(term, groups, cuentas, isCitas, isIMEI){

		var queryresults = Services.general.getAutocompleteData(term, groups, cuentas, isCitas, isIMEI);
		var autocompleteData = [];

		$.each( queryresults, function( i, v ) {

			if(v.tipo == 'cuenta')
				v.html = '<span class="icon i-users"></span> <span><strong> ' + v.nombre + ' </strong>'+ v.cuenta +'</span>';
		 	else if(v.tipo=='group')
			    v.html = '<span class="icon i-users"></span> <span><strong> ' + v.nombre + ' <small>('+ v.total + ' ' +  ( v.total == 1 ? 'línea' : 'líneas' ) +')</small></strong></span>';
			else if(v.tipo =='imei')
				v.html = '<span class="icon io-celular"></span> <span><strong> ' + v.telefono + ' </strong> IMEI :'+ v.imei +' <span class="modelo">'+v.nombre+'</span></span>';
			else
				v.html = '<span class="icon i-user"></span> <span><strong> ' + v.nombre + ' </strong> '+ v.telefono + '</span>';

		 	autocompleteData.push(v);

		});

		return autocompleteData;

	}

	function initAllTokenField(){

		if($('.token-field-input').length>0)
			$('.token-field-input').each(function (index) { 
				var $element = $(this);
			 	initTokenField($element);
			});
	}

	function setTokenFieldDisabled($element){
		$element.addClass('disable');
		$element.tokenfield('disabled');
	}

	function disabledInput($element){
		var elementid = $element.attr('id');
		if(elementid){
			var $e = $('#'+elementid+'-tokenfield');
			$e.prop('disabled', true);
			$e.prop('placeholder', '');
		}
	}

	function enableInput($element, placeholder){
		var elementid = $element.attr('id');
		if(elementid){
			var $e = $('#'+elementid+'-tokenfield');
			$e.prop('disabled', false);
			//$e.prop('placeholder', placeholder);
		}
	}	

	function cleanObject(tokens) {
		
		var cleaned = [];

		$.each( tokens, function( key, token ) {
		  	if(typeof token.tipo != 'undefined')
		  	{
		  		cleaned.push({ tipo : token.tipo, id : token.id, value : token.value });
		  	}
		});

		return cleaned;

	}

	// filtrados es [12, 130, 44]
	function initTokenField($element){

		var options = $element.data('options');
		var maxTotal = 50;


		initialLimit = options.limit;
		initialGroups = (typeof options.groups != 'undefined' ? options.groups : false);
		isIMEI = (typeof options.isIMEI != 'undefined' ? options.isIMEI : false );
		isCitas = (typeof options.isCitas != 'undefined' ? options.isCitas : false );
		isCuentas = (typeof options.cuentas != 'undefined' ? options.cuentas : false );
		hasGroups = (typeof options.groups != 'undefined' ? options.groups : false );

		maxTotal = (initialLimit == 0 ? 50 : initialLimit);

		$element.tokenfield({
		  autocomplete: {
		    source: function( request, response ) {

		    	//Regreso la Data AQUI HARDCODEO PARA QUE ME REGRESE LA INFORMACION QUE NECESITO
		    	var data = { success: false, data: getDataAutocomplete(request.term, hasGroups, isCuentas , isCitas, isIMEI ) };

		    	//utils.general.autocomplete
		    	var existingTokens = $element.tokenfield('getTokens');
	

				var filtrados = cleanObject(existingTokens);
				response(data.data);

	        },
		    delay: 100,
		    minLength: 4,
		    classes : "autocomplete-numeros-grupos"		
		    //ui-autocomplete ui-front ui-menu ui-widget ui-widget-content    
		  },
		  showAutocompleteOnFocus: true,
		  delimiter : [',', ';'],
		  limit : options.limit,
		  createTokensOnBlur : true
		})
		.on('tokenfield:edittoken', function (e) {
			return false;
	  	})
	  	.on('tokenfield:createdtoken', function (e) {

			var data = e.attrs;
		
			$(e.relatedTarget).addClass('valid');

			if(typeof data.tipo == 'undefined'){

				if((isIMEI && data.value.length!=15)  || (isCuentas && (data.value.length>12)) || (!isIMEI && !isCuentas && !validatePhoneNumber(data.value))){
					$(e.relatedTarget).removeClass('valid');
					$(e.relatedTarget).addClass('invalid');
				}

				data.tipo = 'general';
			}
			else
			{	
				if(data.tipo == 'single')
					e.attrs.value = data.telefono;

				$(e.relatedTarget).addClass(data.tipo);
			}


			if(typeof options.activate != undefined){
				activateElement($(options.activate), false);
			}

			if(typeof options.show != undefined){
				showElement($(options.show), true);
			}

			if($element.data('bs.tokenfield').options.limit==1 || ( total>0 && $element.data('bs.tokenfield').options.limit == total )){
				disabledInput($element);
			}


	  	})
	  	.on('tokenfield:createtoken', function (e) {

	  		var data = e.attrs;

			if(typeof data.tipo != 'undefined' && data.tipo == 'group'){
				temp = data.total;
				total+= data.total
			}
			else{
				temp = 1;
				total+= 1;
			}


			if(total>maxTotal){
				modalLimitarMasivo.openModal();
				$('#tokenfield-agregar-lineas-tokenfield').val('');
				total-=temp;
				return false;
			}

			$('.total-autocomplete .total').html(total);

			if(total>0){
				/**Esconder placeholder**/
				$('#tokenfield-agregar-lineas-tokenfield').prop('placeholder', '');
				//**Esconder placeholder fin**/
				$('.total-autocomplete').removeClass('hidden');
			}
			else{
				var nplaceholder = ( is_mobile() ? options.placeholderM : options.placeholder );
				/**Esconder placeholder**/
				$('#tokenfield-agregar-lineas-tokenfield').prop('placeholder', nplaceholder);
				//**Esconder placeholder fin**/
				$('.total-autocomplete').addClass('hidden');
			}
			
			ingresarLineasComponentTotal = total;
			
			validateAdminMode($element);
			
	  	})
	  	.on('tokenfield:removedtoken', function (e) {
			var data = e.attrs;


			if(typeof data.tipo != 'undefined' && data.tipo == 'group')
				total-= data.total
			else
				total-= 1;

			$('.total-autocomplete .total').html(total);
			if(total>0){
				/**Esconder placeholder**/
				$('#tokenfield-agregar-lineas-tokenfield').prop('placeholder', '');
				//**Esconder placeholder fin**/
				$('.total-autocomplete').removeClass('hidden');
				console.log('remove');

			}
			else{
				var nplaceholder = ( is_mobile() ? options.placeholderM : options.placeholder );
				/**Esconder placeholder**/
				$('#tokenfield-agregar-lineas-tokenfield').prop('placeholder', nplaceholder);
				//**Esconder placeholder fin**/
				$('.total-autocomplete').addClass('hidden');
			}

			validateAdminMode($element);

			var nplaceholder = ( is_mobile() ? options.placeholderM : options.placeholder );
			enableInput($element, nplaceholder);

			var existingTokens = $element.tokenfield('getTokens');

			if(typeof options.activate != undefined && existingTokens.length==0){
				activateElement($(options.activate), true);

				if(typeof options.inSteps != undefined){
					var $step = $element.closest(options.inSteps);
					var stepIndex = $( options.inSteps ).index( $step );
					hideSteps($(options.inSteps), stepIndex+1);
				}
			}


	  	})
	  	.data('bs.tokenfield')
		.$input
		.on('paste', function (e) {
			
			var $target = $(e.target);
			var $textArea = $('<textarea class="txtarea-aux-tokenfield"></textarea>');


			var text = null;
			if (window.clipboardData) 
			  text = window.clipboardData.getData("Text");
			else if (e.originalEvent && e.originalEvent.clipboardData)
			  text = e.originalEvent.clipboardData.getData("Text");

			
			text = text.replace(/\r?\n/g, ',');

			$textArea.bind('blur', function (e) {
				$target.val(text);
				$textArea.remove();
			});


			$('body').append($textArea);
			$textArea.focus();

			setTimeout(function () {
				$target.focus();
				$target.blur();
				$target.focus();
			}, 10);
		});

	  	$('.ui-autocomplete').addClass('autocomplete-numeros-grupos');

	  	checkInputMobile();
	  	checkMobileLimit();

	  	var $body = $(this.ie6 ? document.body : document),
	  	windowWidth = $(window).width(),
	  	initialWidth = $(window).width();
	  	
	  	var rtime;
		var timeout = false;
		var delta = 200,
		mobileField = (is_mobile() ? true : false);


		function resizeend() {
		    if (new Date() - rtime < delta) {
		        setTimeout(resizeend, delta);
		    } else {
		        timeout = false;
		        windowWidth = $(window).width();

		        if( (initialWidth>767 && windowWidth<768) || (initialWidth<768 && windowWidth>767) ){
		        	checkMobileLimit();
		        }		        
		    }               
		}

	  	$( window ).resize(function() {

	  		if( windowWidth != $(window).width() ){
				rtime = new Date();
				//windowWidth = $body.innerWidth();
			    if (timeout === false) {
			        timeout = true;
			        initialWidth = $(window).width();
			        setTimeout(resizeend, delta);
			    }

			    //Do something

			    windowWidth = $(window).width();

			    delete windowWidth;

			}
	  		
		});

		

	  	function validateAdminMode($element){
	  		if(is_admin_mode() && !is_mobile()){
	  			var $form = $element.closest('form'),
	  			valid = $form.validate().checkForm(),
	  			$motivo = $('input[name="motivoAutogestion"]:checked').val(),
	  			totalValid = (typeof  $motivo!= 'undefined' && $motivo == 'nuevo-chip-equipo' ? 0 : 1); 
				
				if (valid && total>totalValid) {                  
		            $form.find('.first-submit, button[type="submit"]').prop('disabled', false);    
		        } else {
		           $form.find('.first-submit, button[type="submit"]').prop('disabled', true); 
		        }

			}
	  	}

		function checkInputMobile(){

			$('#tokenfield-agregar-lineas-tokenfield').bind('input', function(e) {	
				if(is_mobile()){

					var $input = $(this),
					value = $input.val();

					if(isIMEI &&value.length==15 && /^\d+$/.test(value)){
						$input.val('');
						$element.tokenfield('createToken', value);
						if((document.activeElement != document.body))
							document.activeElement.blur()
					}
					else if(!isIMEI && !isCuentas && value.length==10 && /^\d+$/.test(value)){
						$input.val('');
						$element.tokenfield('createToken', value);

						if((document.activeElement != document.body))
							document.activeElement.blur()
					}
				}
			});
		}

	  	function checkMobileLimit(){
	  		total = 0;
		  	$element.tokenfield('setTokens', []);
		  	$('#tokenfield-agregar-lineas-tokenfield').val('');
			$('.total-autocomplete .total').html(total);

			var nplaceholder = ( is_mobile() ? options.placeholderM : options.placeholder );

	  		if(is_mobile()){

	  			modalLimitarMasivo.closeModal();
		  		$element.data('bs.tokenfield').options.limit = 1;
		  		options.groups = false;
		  		existingTokens = $element.tokenfield('getTokens');
		  		if(existingTokens.length==0)
		  			enableInput($element, nplaceholder);

		  	}
		  	else{
		  		$element.data('bs.tokenfield').options.limit = initialLimit;
		  		options.groups = initialGroups;
		  		enableInput($element, nplaceholder);
		  	}

		  	$('#tokenfield-agregar-lineas-tokenfield').prop('placeholder', nplaceholder);

		  	if($('.btn-lineas-autocomplete').length>0)
		  		$('.btn-lineas-autocomplete').trigger('click');
		  	else
		  		showElement($(options.show), false);

	  		
	  	}

	  	function validatePhoneNumber(value){

	  		if(value.length!=10 || !/^[0-9]+$/.test(value))
	  			return false;

	  		return true;
	  	}

	  	function hideSteps($steps, start){
	  		
	  		for( var i=start; i < $steps.length ; i++ ){
	  			var $step = $steps.eq(i);

	  			$step.hide();
	  			$step.find('input[type="checkbox"]').prop('checked', false);
	  			$step.find('input[type="radio"]').prop('checked', false);
	  			$step.find('button[type="submit"]').prop('disabled', true);
	  		}
	  		
	  	}
	  	function activateElement($activate, value){
	  		$activate.prop('disabled', value);
	  	}

	  	function showElement($show, value){
	  		if(value)
	  			$show.show();
	  		else
	  			$show.hide();
	  	}


		 $.ui.autocomplete.prototype._renderItem = function (ul, item) { 
	        var t = String(item.html).replace(
	                new RegExp(this.term, "gi"),
	                "<span class='ui-state-highlight-tokenfield'>$&</span>"),
	        container = ul;

	        if($element.attr('id') == 'tokenfield-agregar-lineas'){
	        	container = $($element.closest('.tokenfield-block'));
	        	container.append(ul);
	        	container = container.find('ul');
	        }

	        
	        return $("<li></li>")
	            .data("item.autocomplete", item)
	            .append("<a>" + t + "</a>")
	            .appendTo(container);
	            //.appendTo(ul);
	    };

	    $.ui.autocomplete.prototype._resizeMenu = function( ) {
		    var outerwidth = $element.parent().closest('.tokenfield').outerWidth();
		    this.menu.element.width( outerwidth );
	    };
	}

	return{
		inicializar : function(){
			initAllTokenField();
		},
		resetTotal : function(){
			total = 0;
		},
		getTotal : function(){
			return total;
		}
	};

})();