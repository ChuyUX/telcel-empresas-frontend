// MODALES TELCEL
var $body = $('body');

function modalesTelcel($element, options){
	this.element = $element;

	if(typeof options != undefined){

		if(typeof options.onInit != undefined){
			this.initAction = options.onInit;
			this.init();
		}

		if(typeof options.onReset != undefined)
			this.resetAction = options.onReset;

		if(typeof options.onOpen !=undefined)
			this.openAction = options.onOpen;

		if(typeof options.onClose !=undefined)
			this.closeAction= options.onClose;
	}

	this.generalActionCloseModal();
}

modalesTelcel.prototype.openModal = function(){

	if(typeof this.openAction == 'function')
		this.openAction();

	(this.element).addClass('active');
	document.body.className += " fixed-body";

	if(typeof window.event != 'undefined' && window.event != null)
		window.event.cancelBubble = true;

	if($('.gestion-cuentas-block').length>0 || $('.gestion-ejecutivos-block').length>0){
		$('.group-block').removeClass('active');
		$('.row-ls').removeClass('active-settings');
		$('.general-group-options-container').removeClass('active');
	}

	if($('.roles-block #main-view-block').length>0){
		$('.rol-element').removeClass('active');
		// $('.row-ls').removeClass('active-settings');
		// $('.general-group-options-container').removeClass('active');
	}
}

modalesTelcel.prototype.closeModal = function(){

	if(typeof this.closeAction == 'function')
		this.closeAction();

	this.element.removeClass('active');
	this.element.removeClass('active-up-black');
	$body.removeClass('fixed-body');
	$body.removeClass('settings-open');
	//document.body.className = "MTE loaded";
	this.reset();

}

modalesTelcel.prototype.generalActionCloseModal = function(){

	var self = this;

	(self.element).on('click', '.m-btn-close-modal', function(){
		self.closeModal();
		var $toelement = null;
		// Acciones generales a realizar en Gestion de grupos
		if(!$('body').hasClass('settings-open') && $('.gestion-cuentas-block').length>0 || $('.gestion-ejecutivos-block').length>0)
			$toelement = ($('#main-view-block').length>0 ? $('#main-view-block') : $('.container-fluid.gestion-ejecutivos'));
		else if($('.autogestion-general-block').length>0)
			$toelement = ($('#listado-autogestion-container').length>0 ? $('#listado-autogestion-container') : null );
		
		if($toelement!=null){
			$('html, body').animate({
		        scrollTop: $toelement.offset().top
		    }, 400);
		}
	});

	(self.element).on('click', '.window-modal', function(e){
		e.stopPropagation();

		if($('body').hasClass('settings-open'))
		{
			$('body').removeClass('settings-open');
			$('.date-picker').removeClass('open');
		}
		
		
	});


	(self.element).click(function(e){
		e.stopPropagation();
		if(!$(this).hasClass('no-close-out'))
			self.closeModal();
	});

}

modalesTelcel.prototype.reset = function(){
	var self = this;
	if(typeof this.resetAction != undefined)
		this.resetAction();
}

modalesTelcel.prototype.init = function(){
	var self = this;
	if(typeof this.initAction != undefined)
		this.initAction();
}