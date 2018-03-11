window.onload = function () {
	var modalCambioEmpresa = null;
	function initmodalCambioEmpresa(){
		modalCambioEmpresa = new modalesTelcel($('#modal-cambio-empresa'),{
			onInit : function(){
			}
		});
	}

	if($('.js-openmodal-cambioempresa').length>0)
			initmodalCambioEmpresa();

	$('#main-header').on('click', '.js-openmodal-cambioempresa', function(e){
		e.preventDefault();
		var $element = $(this);
		modalCambioEmpresa.openModal();
	});
}
