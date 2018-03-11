var notificaciones = (function(){
	var $centroNotificaciones = $('.notificaciones-table'),
	postSending = false;

	function init(){
		if($centroNotificaciones.length>0)
			initNotificaciones();
	}

	function initNotificaciones(){
		initActions();
	}


	function initActions(){
		$centroNotificaciones.on('click', '.notificacion .action-btn', function(){
			var $button = $(this),
			metaAction = (typeof $button.data('action') != 'undefined' ? $button.data('action') : null),
			$parent = $button.closest('.notificacion');

			if(metaAction != null){
				postSendUpdate(metaAction, $parent);
			}
		});
	}

	function updateNotificacionDom(action, meta, $parent){

		var toAppend = $parent.find('.ct-in-right');

		$parent.find('.action-btn').remove();

		var msg = '',
		icon = '';

		if(action=='accept'){
			msg= meta.msg.accept;
			icon = meta.icon.accept;
		}
		else{
			msg= meta.msg.cancel;
			icon = meta.icon.cancel;
		}

		$parent.find('.li-cont').removeClass('aprobacion').removeClass('ajeno');
		$parent.find('.li-cont').addClass('propio');
		$parent.find('.type').html(msg);
		$parent.find('.ti-date').html('<i>'+ meta.fecha + '</i>' + ' | ID : '+ meta.id);
		toAppend.append('<p>Estatus: '+meta.estatus+'</p><p>Folio: '+meta.folio+'</p>');

		
	}

	function postSendUpdate(metaAction, $parent){
		var data = { success: false, data: [] },
		container = '#notificacion-'+metaAction.id;

		if(!postSending){

			postSending = true;

			generalLoadingIcon(container , true);

			$.post( postURL , { id: metaAction.id, action : metaAction.action })
			  .done(function( json ) {

			    //SETEO SUCCESS TRUE HARDCODEADO Y el folio que regresa
			  	//aqui iría el data que regrese el json
			  	data.success = true;
			  	data.data = {
			  		folio : 'F012399',
			  		msg : {
			  			accept: "Aceptaste la solicitud de <strong>Juan Carlos Santana</strong> para suspender temporalmente <strong>[30] líneas</strong>.",
			  			cancel : "Rechazaste la solicitud de <strong>Juan Carlos Santana</strong> para suspender temporalmente <strong>[30] líneas</strong>."
			  		},
			  		icon : {
			  			accept : "io-TickNeg",
			  			cancel : "io-Alert2"
			  		},
			  		estatus : 'Completado',
			  		clase : 'propio',
			  		fecha : new Date(),
			  		id : '00111'
			  	};
			  	
			  	if(data.success){
			  		//EXITO
			  		updateNotificacionDom(metaAction.action, data.data , $parent);
			  	}
			  	else{
			  		//JSON SUCCESS FALSE
			  	}

			  	postSending = false;
			  	generalLoadingIcon(container, false);

			  })
			  .fail(function( jqxhr, textStatus, error ) {
			  	//Mensaje de error del SISTEMA
			  	postSending = false;
			  	generalLoadingIcon(container, false);
			});
		}
	}

	return{
		inicializar: init
	}
})();