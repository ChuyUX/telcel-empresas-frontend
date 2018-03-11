function unbindButtonsAdmin(){

	var $buttons = $('.disabled-admin-mode');
	$buttons.off("click");
	$buttons.prop('type', 'button');
	$buttons.unbind('click');

	$buttons.on('click', function(e){
		e.preventDefault();
		return false;
	});
}


function addModalAdmin(){

	if(is_admin_mode() && is_first_fime()){
		var modal = '<div id="gestion-ejecutivo-ver-admin" class="fixed"> <div class="container"> <div class="row"> <div class="col-sm-pr-100 col-xs-12 center-block flexbox v-align-center main-block"> <div class="col-sm-pr-20 col-xs-2 flexbox h-align-center regresar-container"> <a href="gestion-ejecutivos-1.html" class="btn-like-a"><span class="icon i-angle-left"></span><span class="hidden-xs hidden-sm">Salir de modo Administrador</span></a> </div> <div class="col-sm-pr-80 col-xs-10 msg-container"> <p class="col-xs-12">El ingreso en modo administrador de [Empresa] tiene funciones limitadas de autogestión las cuales están disponibles para el Administrador de la empresa.</p> <span class="close-msg"> <span class="icon io-Close"></span> </span> </div> </div> </div> </div> </div>',
		$container = $('body').find('#info-content');

		$container.prepend( modal );

		initActionAdmin();

	}

}

function initActionAdmin(){
	var $msg = $('#gestion-ejecutivo-ver-admin');
	$msg.on('click', '.close-msg', function(){
		$msg.hide();
	});
}

function sinNotificaciones(){
	$('#m-notificacion .number-n').remove();
	var html = '<div class="notif-bloq sin-notificaciones-block"> <div class="row"> <div class="col-xs-12 col-sm-8 center-block inner-nb no-margin-bottom"> <span class="icon io-Alert2"></span> <p class="only-p">No existen notificaciones hasta el momento.</p> </div> </div> </div>';

	$('#main-header .notify-block').addClass('sin-notificaciones');
	$('#main-header .notify-block .double-triangle-block').html(html);

}
	
addModalAdmin();

window.onload = function () { 
	unbindButtonsAdmin(); 
	var hash = window.location.hash;

	if(hash=='#sin-notificaciones')
		sinNotificaciones();

	else{
		if(typeof menuComponent != 'undefined')
			menuComponent.updateNotificacionesCounter(4);
	}
}
