var menuComponent = (function(){

	function initMenu(){
		setActions();
		//initSearchBlock();
	}

	function setPreventEnter(){
		$('.main-search-form').submit(function(e){
			e.preventDefault();
			return false;
		});
	}
	
	function setActions(){
		$('.full-content').on("click", '#m-greeting', function(e) {
			var $button = $(this),
			href = (typeof $button.data('href') != 'undefined' ? $button.data('href') : null);

			if(!$('#jam-icon').is(':visible'))
				e.stopPropagation();

			if(href!=null && !$('#jam-icon').is(':visible')){
				window.location.href = href;
			}
			else{

				$button.parent().siblings().removeClass('active');

				$button.parent().toggleClass('active');

				if($button.parent().hasClass('active'))
					$('body').addClass('settings-open');
				else
					$('body').removeClass('settings-open');
			}
			
		});	


		$('.full-content').on("click", '#m-notificacion', function(e) {

			var $button = $(this);

				e.stopPropagation();

				$('.notify-block').siblings().removeClass('active');

				if($('.notify-block').hasClass('active')){
					$('.notify-block').removeClass('active');
					$('body').removeClass('settings-open');
				}
				else{
					$('.notify-block').addClass('active');
					$('body').addClass('settings-open');
				}

		});
	
		$('body').on("keyup", '#search-terms-menu-input',function(){
			var search_input = $(this).val();
			search_input = accent_fold(search_input.toLowerCase());

			var selector_terms = '#search-terms-menu';

			/* TO DO searchMenuTerms:
				- Solo permitir letras y espacios
				- Reemplazar caracteres especiales en caso que se filtren por espacio
				- Reemplazar acentos por las letras sin el ej. é -> e
			*/
			searchMenuTerms(search_input, selector_terms);

		});

		$('body').on("click", '.ui-search-toggle-element', function() {
			$('#ui-search-block').toggleClass('active');
			$('.black-layer').toggleClass('active');
			var buscador = { input: '#search-terms-menu-input', terms: '#search-terms-menu'}
			cleanTermsSearch(buscador);
			
			setPreventEnter();
		});	

		
		$('body').on("click", '.greeting-block', function() {
			$(this).toggleClass('active');
			$('.greeting-block-m').toggleClass('active');
			$('.full-content').toggleClass('active-greeting');
	  	});

		$('body').on("click", '#jam-icon', function() {
			var $button = $(this);
			$('.main-links li.active').removeClass('active');
			$button.toggleClass('active');
			$('.main-block-m').toggleClass('active');
			$('.full-content').toggleClass('active-menu');
			$('#searchbox').val('');
	  	});

		$('body').on("click", '.ui-mobile-layer', function() {
			$('#jam-icon, #m-greeting .avatar-g').removeClass('active');
			$('.main-block-m, .greeting-block-m').removeClass('active');
			$('#searchbox').val('');
			$('.full-content').removeClass('active-menu').removeClass('active-greeting');
	  	});

	  	$('body').on("click", '.main-block-m .has-submenu', function() {

	  		var active = $(this).hasClass('active');
	  		$('.main-block-m .has-submenu').removeClass('active');
	  		$('.main-block-m .has-submenu').find('ul').slideUp('800');

	  		if(!active){
	  			$(this).find('ul').slideDown('800');
				$(this).addClass('active');
	  		}

			
		});	
	  	

	  	$('.full-content').on("mouseover", '.main-links >li.has-submenu', function(e) {
	  		e.stopPropagation();
			$('.notify-block').removeClass('active');
			$('.greeting-block').removeClass('active');
			$('body').removeClass('settings-open');
	  	});
	  	
	
	}


	function updateNotificacionesCounter(n){
		var $counter = $('#m-notificacion .number-n');
		if($counter.length==0)
			$('#m-notificacion').append('<span class="number-n"></span>');

		$counter = $('#m-notificacion .number-n');
		
		$counter.html(n);
		$counter.addClass('active');
	}

	function removeNotificacionesCounter(){
		var $counter = $('#m-notificacion .number-n');

		if($counter.length>0){
			$counter.removeClass('active');
			setTimeout(function(){
				$counter.remove();
			}, 1000);
		}
	}

	function searchMenuTerms(search, selector_terms){
		var search_input = search.replace(',',' ')
			.replace('.',' ')
			.replace(';',' ')
			.split(' ');

		var $searchTerms = $(selector_terms + ' [data-tag]');

		$searchTerms.removeClass('active');

		for (var i = $searchTerms.length - 1; i >= 0; i--) {
			var $term = $($searchTerms[i]);
			var item_terms = $term.data('tag').split(' ');
			var found = false;

			for (var f = search_input.length - 1; f >= 0; f--) {
				for (var g = item_terms.length - 1; g >= 0; g--) {
					//console.log(item_terms[g], (search_input[f] == item_terms[g]))

					if (search_input[f].search(item_terms[g]) > -1)
						found= true;
				}
			}


			if (found)
				$term.addClass('active');

		}
	}

	function cleanTermsSearch(search){
		var $searchTerms = $(search.terms + ' [data-tag]');
		$(search.input).val('');
		$searchTerms.removeClass('active');
	}

	function initSearchBlock(){
		$('.main-search-form').each(function( index ) {
			var $form = $(this);
			searchBlock($form);
        });

		function searchBlock($form){

			var id = $form.data('id');
			disableSumbitButton($form, true);
			checkRequiredElements(id);

			formSubmit($form);

			function formSubmit($form){
				$form.submit(function( event ) {
					// AQUI IRÍA EL CALL
				  event.preventDefault();
				  var self = $form.serialize();
				  $.when( searchAPICall(self) )
						.done(function() {
								
		
							
						});
				});
			}

			function searchAPICall(data){
				// Aquí iría el servicio para el update
				return $('body').delay( 1000 );
			}
		}
	}


	return{
		fInitMenu : initMenu,
		updateNotificacionesCounter : updateNotificacionesCounter,
		removeNotificacionesCounter : removeNotificacionesCounter
	};

})();