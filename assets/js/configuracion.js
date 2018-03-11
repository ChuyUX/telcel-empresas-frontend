var configuracionRoles = (function(){

	var $mainBlock = $('.roles-block #main-view-block'),
	currentModalData = null,
	editandoNombre = false,
	$closestGuardarElement = null,
	$closestEditarBtn = null,
	editandoNombreValor = null,
	beforeEditando = null;

	function init(){
		setActions();
	}

	function setActions(){
		$mainBlock.on('click', '.mosaico-view .item-mv', function(e){
			if(is_mobile()){
				e.stopPropagation();
				var $element = $(this).find('.see-more-gt');
				var url = $element.prop('href');
				console.log(url);
				if(url!=undefined)
					window.location.href = url;
			}
		});

		$mainBlock.on('click', '.btn-gear', function(e){
			e.stopPropagation();
			cancelEditName();
			var $element = $(this).closest('.rol-element');

			$('.rol-element').removeClass('active');
			$('body').addClass('settings-open');

			$element.addClass('active');
			if(is_mobile())
				$('body').addClass('fixed-body');

		});

		$mainBlock.on('click', '.btn-close-config', function(e){
			e.stopPropagation();
			cancelEditName();
			var $element = $(this).closest('.rol-element');
			$element.removeClass('active');
		});

		$('body').on('click', '#vista-mosaico', function(){
			cancelEditName();
			$('#vista-mosaico').removeClass('active');
			$('#vista-lista').addClass('active');
			$('#main-view-block').removeClass('group-row-block').addClass('group-list-block');
		});

		$('body').on('click', '#vista-lista', function(){
			cancelEditName();
			$('#vista-lista').removeClass('active');
			$('#vista-mosaico').addClass('active');
			$('#main-view-block').removeClass('group-list-block').addClass('group-row-block');
		});

		$('body').on('click', '.btn-add-rol', function(){
			cancelEditName();
			modalesConfiguracion.openModalAgregarRol();
		});

		$('body').on('click', '.btn-add-rol-admin', function(){
			cancelEditName();
			modalesConfiguracion.openModalAgregarRolAdmin();
		});

		$mainBlock.on('click', '.btn-editar-nombre', function(e){
			e.stopPropagation();
			var $element = $(this).closest('.rol-element');
			$('.rol-element').removeClass('active');
			if(!editandoNombre){
				$element.find('.name-container').addClass('active-edit');
				editandoNombre = true;
				$closestGuardarElement = $element.closest('.rol-element').find('.btn-guardar-nombre');
				$closestEditarBtn = null;
				editandoNombreValor = $element.find('input.editar-alias').val();
				beforeEditando = $element.find('input.editar-alias').val();
			}
			else{
				$closestGuardarElement.prop('disabled', false);
				$closestGuardarElement.trigger('click');
				$closestEditarBtn = $element;
			}
		});

		$mainBlock.on('click', '.btn-guardar-nombre', function(e){
			e.stopPropagation();
			var $element = $(this).closest('.rol-element');
			verifyRolName($element);	
		});

		$('.group-list-block .editar-alias').bind('keyup', function (e) {
			var $input = $(this);
			validateNameOnInput($input);
		});

		$('.group-list-block').on('keydown','.editar-alias', function (e) {
			var $input = $(this);

			var $errori = $('.error-tooltip.nombre-error');

			if($errori.length>0){
				$input.removeClass('error').removeClass('error-dd');
				$errori.remove();
			}

		    if (e.keyCode === 13) { //Si es enter
		        var $element = $(this).closest('.rol-element');
		        $closestGuardarElement = null;
				verifyRolName($element);
		    }
		});

		$mainBlock.on('click', '.settings-ri', function(e){			
			if(is_mobile()){
				e.stopPropagation();
				$('.rol-element').removeClass('active');
				$('.settings-ri').removeClass('active');
				$('body').removeClass('fixed-body');
				$('body').removeClass('settings-open');
			}
		});


		$('#btn-perfil-admin').click(function(){
			$('.options-header-block p').removeClass('active');
			$(this).addClass('active');
			$('#perfiles-usuarios').addClass('hidden');
			$('.header-perfil-usuarios').addClass('hidden');
			$('#perfiles-administrador').removeClass('hidden');
			$('.header-perfil-administrador').removeClass('hidden');
		});

		$('#btn-perfil-usuario').click(function(){
			$('.options-header-block p').removeClass('active');
			$(this).addClass('active');
			$('#perfiles-administrador').addClass('hidden');
			$('.header-perfil-administrador').addClass('hidden');
			$('#perfiles-usuarios').removeClass('hidden');
			$('.header-perfil-usuarios').removeClass('hidden');
		});


	}


	function setBasicInfoModal(item){
		currentModalData = item;
		$('.modal-mte .alias-text, .modal-mte .txt-current').html(item.nombre);
	}

	function verifyRolName($element){
		var $input = $element.find('.editar-alias');
		var value = $input.val();
		var id = $element.data('item').id;

		if(validName(value)){

			$element.find('.triangle-tooltip').remove();
			$input.removeClass('error');

			var urlPOST = Services.apiURL.editarNombreRol();

			$.post( urlPOST , { edit: value, id: id })
			  .done(function( json ) {
			  	Services.configuracion.editarNombreRolSuccessCallback( json, value, appendError, {input : $input, element : $element });
			  	
			  	//Checar si hay algún elemento que se quiere editar
			  	$input.blur();
				$input.focusout();
			  	checkElementToEdit();
			  	updateBlock($element);
			  })
			  .fail(function( jqxhr, textStatus, error ) {
			  	Services.configuracion.editarNombreRolFailCallback( error );
			});
		}
		else if(editandoNombre && editandoNombreValor!=null){
			$input.val(editandoNombreValor);
			$closestGuardarElement.trigger('click');
			editandoNombreValor = null;
		}
	}

	function checkElementToEdit(){
		editandoNombre = false;
		if($closestEditarBtn!=null){
			$closestEditarBtn.find('.name-container').addClass('active-edit');
			editandoNombre = true;
			editandoNombreValor = $closestEditarBtn.find('input.editar-alias').val();
			$closestGuardarElement = $closestEditarBtn.closest('.rol-element').find('.btn-guardar-nombre');
			$closestEditarBtn = null;
		}
	}

	function validName(value){
		var validation = {
			empty : { test : value.length>0 , message: 'Es necesario ingresar un nombre para el perfil.' },
			name : 	{ test : /^[A-Za-zÑñ]*[A-Za-zNñ-\s]*[A-Za-zNñ]$/i.test( value ), message: 'El nombre no debe tener caracteres especiales, números y espacio al inicio o final.' },
			minlength :{ test : value.length>=5 , message: 'El nombre debe tener al menos 5 caracteres.' }
		};
		
		return validation.name.test && validation.minlength.test && validation.empty.test;
	}

	function validNameMsg(value){
		var validation = {
			empty : { test : value.length>0 , message: 'Es necesario ingresar un nombre para el perfil.' },
			name : 	{ test : /^[A-Za-zÑñ]*[A-Za-zNñ-\s]*[A-Za-zNñ]$/i.test( value ), message: 'El nombre no debe tener caracteres especiales, números y espacio al inicio o final.' },
			minlength :{ test : value.length>=5 , message: 'El nombre debe tener al menos 5 caracteres.' }
		};

		return ( !validation.empty.test ? validation.empty.message : ( !validation.name.test ? validation.name.message : validation.minlength.message) );
	}

	function validateNameOnInput($input){
		var value = $input.val();
		var $element = $input.closest('.rol-element');
		var $button = $input.next('.btn-guardar-nombre');

		if(validName(value)){
			$element.find('.triangle-tooltip').remove();
			$input.removeClass('error');
			$button.prop('disabled', false);
		}
		else{
			$button.prop('disabled', true);
			appendError($element, $input, validNameMsg(value));
		}
	}

	function updateBlock($element){
		
		var $input = $element.find('.editar-alias'),
		nameChanged = beforeEditando!=$input.val();
		beforeEditando = editandoNombreValor;

		if($element.hasClass('with-legal-name-mv') && nameChanged){
			var $textos = $element.find('.legal-name-imv'),
			$icon = $element.find('.ribbon .io-City');

			$element.addClass('changed-block');
			$textos.fadeOut(500);
			$icon.animate({opacity: 0}, 300, function(){
				$icon.removeClass('io-City').addClass('io-Maletin');
				$element.removeClass('with-legal-name-mv');
				$icon.animate({opacity: 1}, 300);
				$textos.remove();
			});

			setTimeout(function(){
				$element.removeClass('changed-block');
			}, 1100);
		}
		
	}

	function cancelEditName(){
		editandoNombre = false;
		var $elementos_activos = $('.rol-element .name-container.active-edit');
		returnEditaNamePreviousValue($elementos_activos);

		$('.rol-element').find('.name-container').removeClass('active-edit');
	}

	function returnEditaNamePreviousValue($elementos_activos){
		if($elementos_activos.length>0){
			//alert('Editando');

			for (var i = 0; i < $elementos_activos.length; i++) {
				var nombre_anterior = $($elementos_activos[i]).find('strong.ribbon-content').html();
				$($elementos_activos[i]).find('.editar-alias').val(nombre_anterior)
					//Remover errores - revisar la mejor forma de hacerlo con el Valid de jquery
					.removeClass('error');
				$($elementos_activos[i]).parent().parent().parent().find('.triangle-tooltip').hide();
			}	

		}
	}

	function appendError($e, $i, message){
		if($e.find('.triangle-tooltip').length == 0){
			var errorhtml = '<div class="triangle-tooltip error-tooltip triangle-bottom nombre-error"><p>'+message+'</p></div>';
			$e.append(errorhtml);
			$i.addClass('error');
		}
	}

	return{
		inicializar : init,
		cancelEdit : cancelEditName
	}

})();


var configuracionUsuarios = (function(){

	var $mainUsuariosTable = $('.usuarios-table'),
	$usuariosTable = $('#usuarios-table'),
	$otrosUsuariosTable = $('#otros-usuarios-table'),
	sinGrupo = $mainUsuariosTable.hasClass('sin-grupos'),
	vip = $mainUsuariosTable.hasClass('vip');

	var usuariosSection = null,
	getListadoSection = null;


	function getUsuariosSection(){
		return ($otrosUsuariosTable.length>0 ? 'otros' : 'byrol' );
	}

	usuariosSection = getUsuariosSection();

	var generarHTMLListado = {
		otros : generarHTMLOtrosUsuarios,
		byrol : generarHTMLUsuarios
	};

	getListadoSection = typeof generarHTMLListado[usuariosSection] != 'undefined' ? generarHTMLListado[usuariosSection] : null ;


	function init(){
		generarListadoConfirmacionInicial();
		initModales();
		setActions();
		generalCheckBoxAll.inicializar();
	}

	function initModales(){
		
	}

	function setActions(){

		var $generalConfig = $('.general-group-options-container');

		$mainUsuariosTable.on('click', '.btn-user-config', function(e){
			e.stopPropagation();
			var $element = $(this).closest('.linea-batch');

			$generalConfig.removeClass('active');
			$('.linea-batch').removeClass('active-settings');
			$('body').addClass('settings-open');

			$element.addClass('active-settings');
			if(is_mobile())
				$('body').addClass('fixed-body');

		});

		$mainUsuariosTable.on('click', '.btn-close-config', function(e){
			e.stopPropagation();
			var $element = $(this).closest('.linea-batch');
			$element.removeClass('active-settings');
		});

		// ESCONDER OPCIONES DE CONFIGURACIÓN GENERAL
		$generalConfig.on('click', '.btn-close-general-config', function(e){
			e.stopPropagation();
			$generalConfig.removeClass('active');
		});

		$generalConfig.on('click', '.btn-open-general-config', function(e){
			e.stopPropagation();
			$('.linea-batch').removeClass('active-settings');
			$('body').addClass('settings-open');
			$generalConfig.addClass('active');
			if(is_mobile())
				$('body').addClass('fixed-body');

		});
	}

	function generarListadoConfirmacionInicial(){

		var $elements = $mainUsuariosTable.find('.linea-batch');
		var total = $elements.length;

		$elements.each(function (index, value) { 
		  var meta = ( typeof $(this).data('item') != 'undefined' ? $(this).data('item') : null );
		  var $element = $(this);

			if(meta != null){
				var elemento = getListadoSection(meta, index);
				$element.html(elemento);
				//dataListadoCuentasAsociadas.push(meta);

				// bindElementActions();

			}
		});
	}

	function generarHTMLUsuarios(meta, index){

		var html = '';

		html = '<div class="col-sm-12 col-xs-12 content-item-block"><div class="col-sm-1 hidden-xs checkbox-container flexbox h-align-center"> <input type="checkbox" id="i-'+meta.id+'" name="i-'+meta.id+'" value="'+meta.id+'" data-index="0"> <label for="i-'+meta.id+'"><span class="check-sq"></span></label> </div><div class="col-sm-11 col-xs-12 usuario-info-block"><div class="'+(!sinGrupo ? 'col-sm-pr-25' : 'col-sm-pr-30')+'  col-xs-12"><label class="hidden-sm hidden-md hidden-lg">Nombre:</label><p title="'+meta.nombre+'">'+meta.nombre+'</p></div><div class="'+(!sinGrupo ? 'col-sm-pr-20' : 'col-sm-pr-30')+' col-xs-12 flexbox"><label class="hidden-sm hidden-md hidden-lg">Número:</label><p title="'+meta.numero+'">'+meta.numero+'</p></div><div class="'+(!sinGrupo ? 'col-sm-pr-25' : 'col-sm-pr-30')+' col-xs-12"><label class="hidden-sm hidden-md hidden-lg">Correo:</label><p title="'+meta.correoelectronico+'">'+meta.correoelectronico+'</p></div>'+(!sinGrupo ? '<div class="col-sm-pr-20 col-xs-12 imei-extra-detail"><label class="hidden-sm hidden-md hidden-lg">Grupo:</label><div class="show-more-details-container col-xs-6 col-sm-12"><p class="p-value" title="['+meta.total+'] grupo(s)">['+meta.total+'] grupo(s)</p> </div></div>' : '' )+'<div class="col-sm-pr-10 hidden-xs"><div class="icon-container"> <button class="simple btn-editar-usuario" type="button" title="Editar"> <span class="icon io-Admin"></span> </button> </div></div></div><div class="btn-mobile-container col-xs-12 hidden-sm hidden-md hidden-lg"> <div class="col-xs-6"> <button type="button" class="btn-quitar-usuarios full-width">Eliminar usuario</button> </div> <div class="col-xs-6"> <button type="button" class="btn-cambiar-rol full-width blue-dark">Cambiar rol</button> </div><div class="col-xs-12"> <button type="button" class="btn-editar-usuario full-width">Editar usuario</button> </div></div>';

		return html;

	}

	function generarHTMLOtrosUsuarios(meta, index){

		var html = '';

		html = '<div class="col-sm-12 col-xs-12 content-item-block"><div class="col-sm-1 hidden-xs checkbox-container flexbox h-align-center"> <input type="checkbox" id="i-'+meta.id+'" name="i-'+meta.id+'" value="'+meta.id+'" data-index="0"> <label for="i-'+meta.id+'"><span class="check-sq"></span></label> </div><div class="col-sm-11 col-xs-12 usuario-info-block"><div class="col-sm-pr-30 col-xs-12"><label class="hidden-sm hidden-md hidden-lg">Region:</label><p title="'+meta.region+'">'+meta.region+'</p></div><div class="col-sm-pr-35 col-xs-12 flexbox"><label class="hidden-sm hidden-md hidden-lg">Cuenta:</label><p title="'+meta.cuenta+'">'+meta.cuenta+'</p></div><div class="col-sm-pr-35 col-xs-12"><label class="hidden-sm hidden-md hidden-lg">Número:</label><p title="'+meta.numero+'">'+meta.numero+'</p></div></div></div><div class="btn-mobile-container col-xs-12 hidden-sm hidden-md hidden-lg"> '+(vip ? '<div class="col-xs-6"> <button type="button" class="btn-quitar-usuarios full-width">Quitar usuario</button> </div>' : '' ) + '<div class="'+(vip ? 'col-xs-6' : 'col-xs-12')+'"> <button type="button" class="btn-cambiar-rol full-width blue-dark">Cambiar rol</button> </div> </div>';

		return html;

	}

	return{
		inicializar : init
	}
})();


var modalesConfiguracion = (function(){
	var formElementsModales = { 
		'eliminarRol' : {id : null, validator : null, sending: false },
		'cambiarRol' : {id : null, validator : null, sending: false },
		'nuevoUsuario' : {id : null, validator : null, sending: false },
		'editarUsuario' : {id : null, validator : null, sending: false },
		'eliminarUsuario' : {id : null, validator : null, sending: false },
		'agregarLineas' : {id : null, validator : null, sending: false },
		'nuevoRol' : {id : null, validator : null, sending: false },
		'nuevoRolAdmin' : {id : null, validator : null, sending: false },
	},
	currentModalData = null,
	singleElement = false;

	var modalAgregarRol = null, modalAgregarRolAdmin = null, modalEliminarRol = null, modalEliminarRolAdmin = null, modalCambiarRol = null, modalAgregarUsuario = null, modalEditarUsuario = null, modalAgregarLineas = null, modalCancelarRol = null;

	var _modalAgregarRolAdmin = { isFirstTime : false, perfil : null, element : null, done : false };

	function init(){
		setActions();

		if($('#modal-agregar-rol').length>0)
			initModalAgregarRol();

		if($('#modal-agregar-rol-admin').length>0)
			initModalAgregarRolAdmin();

		if($('#modal-eliminar-rol').length>0)
			initModalEliminarRol();

		if($('#modal-eliminar-rol-admin').length>0)
			initModalEliminarRolAdmin();

		if($('#modal-cambiar-rol').length>0)
			initModalCambiarRol();

		if($('#modal-agregar-usuario').length>0)
			initModalAgregarUsuario();

		if($('#modal-editar-usuario').length>0)
			initModalEditarUsuario();

		if($('#modal-quitar-usuario').length>0)
			initModalQuitarUsuario();

		if($('#modal-agregar-usuarios').length>0)
			initmodalAgregarLineas();

		if($('#modal-cancelar-rol').length>0)
			initModalCancelarRol();

		checkNuevoUsuario();
	}


	function checkNuevoUsuario(){
		/**simular casp de uso**/
		var hash = window.location.hash;

		if(hash=='#rolCreado'){

			setBasicInfoModal($('#rol-5').data('item'));
			$('.modal-mte .rol-txt').html(currentModalData.nombre);
			modalAgregarRol.openModal();

			$('#form-agregar-rol').hide().addClass('success');
			$('.btn-agregar-lineas-grupo-modal').attr('data-item', '{"id": "'+currentModalData.id+'" ,"nombre": "'+currentModalData.nombre+'", "showgrupo" : true}');

			$('.options-header-block p').removeClass('active');
			$('#btn-perfil-usuario').addClass('active');
			$('#perfiles-administrador').addClass('hidden');
			$('.header-perfil-administrador').addClass('hidden');
			$('#perfiles-usuarios').removeClass('hidden');
			$('.header-perfil-usuarios').removeClass('hidden');
		}
	}

	function setActions(){

		$('.general-group-options-container').on('click', '.btn-eliminar-rol', function(){
			var $element = $('.general-group-options-container');
			setBasicInfoModal($element.data('item'));
			modalEliminarRol.openModal();
		});

		$('body').on('click', '.linea-batch .btn-eliminar-rol, .rol-element .btn-eliminar-rol', function(){
			var $element = ( $(this).closest('.rol-element').length>0 ? $(this).closest('.rol-element') : $(this).closest('.linea-batch') );
			setBasicInfoModal($element.data('item'));
			modalEliminarRol.openModal();
		});

		$('body').on('click', '.linea-batch .btn-eliminar-rol-admin, .rol-element .btn-eliminar-rol-admin', function(){
			var $element = ( $(this).closest('.rol-element').length>0 ? $(this).closest('.rol-element') : $(this).closest('.linea-batch') );
			setBasicInfoModal($element.data('item'));
			modalEliminarRolAdmin.openModal();
		});

		$('body').on('click', '.linea-batch .btn-cambiar-rol', function(){
			var $element = $(this).closest('.linea-batch');
			setBasicInfoModal($element.data('item'));
			singleElement = true;
			modalCambiarRol.openModal();
		});

		$('body').on('click', '.linea-batch .btn-quitar-usuarios', function(){
			var $element = $(this).closest('.linea-batch');
			setBasicInfoModal($element.data('item'));
			singleElement = true;
			modalQuitarUsuario.openModal();
		});

		$('.header-actions').on('click', '.btn-cambiar-rol', function(){
			var $element = $('.header-actions');
			setBasicInfoModal($element.data('item'));
			singleElement = false;
			modalCambiarRol.openModal();
		});

		$('.header-actions').on('click', '.btn-quitar-usuarios', function(){
			var $element = $('.header-actions');
			setBasicInfoModal($element.data('item'));
			singleElement = false;
			modalQuitarUsuario.openModal();
		});
		

		$('.add-item-usuario').on('click', '.btn-agregar-usuario', function(){
			var $element = $(this);
			setBasicInfoModal($element.data('item'));
			modalAgregarUsuario.openModal();
		});

		$('.group-list-block').on('click', '.btn-agregar-usuario', function(){
			configuracionRoles.cancelEdit();
			var $element = $(this).closest('.rol-element');
			setBasicInfoModal($element.data('item'));
			modalAgregarUsuario.openModal();
		});

		$('body').on('click', '.linea-batch .btn-editar-usuario', function(){
			var $element = $(this).closest('.linea-batch');
			setBasicInfoModal($element.data('item'));
			modalEditarUsuario.openModal();
		});

		$('.add-item-usuario').on('click', '.btn-agregar-lineas', function(){
			var $element = $(this);
			setBasicInfoModal($element.data('item'));
			modalAgregarLineas.openModal();
		});

		$('.group-list-block').on('click', '.btn-agregar-lineas', function(){
			configuracionRoles.cancelEdit();
			var $element = $(this).closest('.rol-element');
			setBasicInfoModal($element.data('item'));
			modalAgregarLineas.openModal();
		});

		$('#btn-cancel-changes-nu').click(function(){
			modalCancelarRol.openModal();
		});
	}

	/**Inicio modal agregar rol**/
	function initModalAgregarRol(){
		var processCompleted = false;
		var $form = $('.form-agregar-rol #form-agregar-rol');
		var $input = $form.find('input[name="nombre"]');

		$input.bind('input', function(e){
			var $errori = $form.find('.general-error-tooltip');
			if($errori.length>0){
				$input.removeClass('error').removeClass('error-dd');
				$errori.remove();
			}
		});

		modalAgregarRol = new modalesTelcel($('#modal-agregar-rol'),{
			onInit : function(){
				validateAgregarRol();
				addAction();
			},
			onReset : function(){
				//resetModalDesasociarCuentas();
			},
			onOpen : function(){
				processCompleted = false;
				resetFormModal($('.form-agregar-rol #form-agregar-rol'), 'nuevoRol');
			},
			onClose : function(){

				//Cuando cierre el modal si quieren hacer refresh hay que descomentar esto
				// if(processCompleted)
				// 	location.reload();
			}
		});

		function addAction(){
			// ABRIR AGREGAR LINEAS DESDE MODAL
			$('.btn-agregar-lineas-grupo-modal').click(function(){
				var $element = $(this),
				dataitem = JSON.parse($element.attr('data-item'));

				setBasicInfoModal(dataitem);

				modalAgregarRol.closeModal();
				modalAgregarRolAdmin.closeModal();

				if($element.hasClass('btn-agregar-usuario'))
					modalAgregarUsuario.openModal();
				else
					modalAgregarLineas.openModal();

				$element.removeClass('btn-agregar-usuario').removeClass('btn-agregar-lineas');
			});

		}

		function validateAgregarRol(){

			var $form = $('.form-agregar-rol #form-agregar-rol');

			disableSumbitButton($form, true);

			formElementsModales['nuevoRol']['validator'] = $form.validate({
			  rules: {
				nombre: {
					required: true,
					minlength: 5,
					grupoNombre : true,
			  		maxlength: 45
				}
			  },
			  messages: {
				 nombre: {
				   required: "Es necesario ingresar un nombre para el perfil.",
				   minlength : " El nombre debe tener al menos 5 caracteres.",
				   grupoNombre : "El nombre no debe tener caracteres especiales, números y espacio al inicio o final.",
				   maxlength : "El nombre debe tener un máximo de 45 caracteres."
				 }
			   },
			   errorClass : "error-dd error",
				submitHandler: function(form) {
					if(!formElementsModales['nuevoRol']['sending']){

						formElementsModales['nuevoRol']['sending'] = true;

						$(form).find('button[type="submit"]').prop('disabled', true);
						
						var self = $(form).serialize();
						var selfArray = $(form).serializeArray();

						generalLoadingIcon(form, true);

						var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;

						$.post( urlPOST , { data: self })
						  .done(function( json ) {
						  	
						  	var elementData = { name : selfArray[0].value , input : $input };

						  	Services.configuracion.agregarRolSuccessCallback(json, form, elementData, addCreatedElementToHTML );
						  	formElementsModales['nuevoRol']['sending'] = false;
						  	generalLoadingIcon(form, false);
						  	processCompleted = true;

						  })
						  .fail(function( jqxhr, textStatus, error ) {
						  	//Mensaje de error del SISTEMA
						  	Services.configuracion.agregarRolFailCallback(error, form );
						  	formElementsModales['nuevoRol']['sending'] = false;
						  	generalLoadingIcon(form, false);
						  	processCompleted = true;
						});

					}

				}
			});

			checkGeneralValidForm($form);
			

		}


		var addCreatedElementToHTML = function (id, name){

			var html = '<div class="col-xs-6 col-sm-6 col-md-4 item-mv"> <div class="rol-element general-rol-element" id="group-'+id+'" data-item = "{&quot;id&quot;: &quot;'+id+'&quot; ,&quot;nombre&quot;: &quot;'+name+'&quot;,&quot;usuarios&quot;: &quot;0&quot;}"> <div class="header-group flexbox clearfix"> <div class="ribbon flexbox"> <span class="icon io-avatar col-sm-2 left-icon-ri" title="Rol de usuario"></span> <div class="flexbox v-align-center col-sm-10 padding-0 name-container"> <strong class="ribbon-content col-sm-10">'+name+'</strong> <input type="text" value="'+name+'" name="editar-alias" class="editar-alias only-alphanumeric meet-regex" maxlength="45" data-regex = "[^0-9A-Za-z-ñÑ\s]+$"/> <button class="simple edit-name-ri col-sm-2 btn-guardar-nombre" title="Guardar Nombre"><span class="icon io-save-doc"></span></button> <button class="simple edit-name-ri col-sm-2 btn-editar-nombre" title="Editar Nombre"><span class="icon io-Admin"></span></button> </div> </div> <div class="icon-container flexbox v-align-center"> <button class="btn-gear simple" title="Configuración"> <span class="icon io-Gear"></span> </button> </div> <div class="col-sm-12 settings-ri"> <div class="col-sm-12 cont-set-ri"> <p class="col-sm-12 title-ri"> <span class="in-text-ri">Configuración</span> <button class="simple btn-close-config" title="Cerrar"> <span class="icon io-Close"></span> </button> </p> <div class="col-sm-12 title-mod"> <span class="icon io-avatar col-xs-2 left-icon-ri"></span> <p class="title-ribon-sri">Administrador de grupos</p> </div> <div class="col-sm-12 submenu-ri"> <div class="first-bloq-ri"> <button class="simple btn-editar-nombre hide-mobile" type="button"> <span class="icon io-lapiz"></span> <span class="in-text-fbr">Cambiar nombre de rol</span> </button> <button class="simple btn-agregar-lineas" type="button"> <span class="icon io-More"></span> <span class="in-text-fbr">Agregar usuario(s)</span> </button> <a class="simple btn-editar-nombre" href="configuracion-1.html"> <span class="icon io-Admin"></span> <span class="in-text-fbr">Ver/Editar permiso(s)</span> </a> <button class="simple btn-eliminar-rol hide-mobile" type="button"> <span class="icon io-Bin"></span> <span class="in-text-fbr">Quitar perfil</span> </button> <a class="simple" href="configuracion-2.html"> <span class="icon io-Message"></span> <span class="in-text-fbr">Configurar notificaciones</span> </a> </div> </div> </div> </div> </div> <div class="body-group"> <div class="extend-imv"> <button type="button" class="btn-like-a btn-agregar-usuarios btn-agregar-lineas">Agregar usuario(s) a este perfil</button> </div> </div> </div> </div>';

			$('#main-view-block .mosaico-view').append(html);

		}

	}
	/**Fin modal agregar rol**/

	/**Inicio modal añadir perfil**/
	function initModalAgregarRolAdmin(){
		var $form = $('#modal-agregar-rol-admin #form-agregar-rol-admin');

		modalAgregarRolAdmin = new modalesTelcel($('#modal-agregar-rol-admin'),{
			onInit : function(){
				validateFormRolAdmin();
				$('#modal-agregar-rol-admin .secondary-modal-header').hide();
			},
			onOpen : function(){
				//checkElements();
			},
			onReset : function(){

				resetFormModal($('.form-agregar-rol-admin #form-agregar-rol-admin'), 'nuevoRolAdmin');
				$('#modal-agregar-rol-admin .main-modal-header').show();
				$('#modal-agregar-rol-admin .secondary-modal-header').hide();
			}
		});

		function checkElements(){

			var $perfilesRadio = $('#perfil-selector-block .perfil-opc');

		  	$perfilesRadio.each(function (index, value) { 
		  		var $perfilRadio = $(this),
		  		$radio = $perfilRadio.find('input[type="radio"]'),
		  		$perfil = $('#perfiles-administrador #rol-'+$radio.val());

		  		if($perfil.length>0)
		  			$perfilRadio.addClass('hidden');
		  		else
		  			$perfilRadio.removeClass('hidden');
		  	});


		  	if($perfilesRadio.length == $('#perfil-selector-block .perfil-opc.hidden').length){
		  		
		  		$('#modal-agregar-rol-admin #form-agregar-rol-admin').hide();
		  		$('#modal-agregar-rol-admin').addClass('all-created');
		  		$('#modal-agregar-rol-admin .api-msg-info').show();
		  		
		  	}
		  	else{
		  		$('#modal-agregar-rol-admin').removeClass('all-created');
		  		$('#modal-agregar-rol-admin .api-msg-info').hide();
		  		$('#modal-agregar-rol-admin #form-agregar-rol-admin').show();
		  	}
		}


		function validateFormRolAdmin(){

			var $form = $('.form-agregar-rol-admin #form-agregar-rol-admin');

			disableSumbitButton($form, true);
			checkTelefonoLength($form);
			
			formElementsModales['nuevoRolAdmin']['validator'] = $form.validate({
				rules: {
					perfil: {
						required: true
					},
				},
				messages: {
					perfil: {
						required: "Selecciona un perfil.",
					}
				},
				errorClass : "error-dd error",
				errorPlacement: function(error, $element) {
   	
				},
				submitHandler: function(form) {
					if(!formElementsModales['nuevoRolAdmin']['sending']){

						formElementsModales['nuevoRolAdmin']['sending'] = true;
						$(form).find('button[type="submit"]').prop('disabled', true);
						
						var self = $(form).serialize();

						generalLoadingIcon(form, true);

						var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;

						$.post( urlPOST , { data: self })
						  .done(function( json ) {

							Services.configuracion.agregarRolAdminSuccessCallback(json, form, $('#form-agregar-rol-admin input[type="radio"]:checked').val(), updateOnSuccess);
							formElementsModales['nuevoRolAdmin']['sending'] = false;
							$(form).find('button[type="submit"]').prop('disabled', false);
						  	generalLoadingIcon(form, false);

						  })
						  .fail(function( jqxhr, textStatus, error ) {
						  	Services.configuracion.agregarRolAdminFailCallback(error, form );
						  	formElementsModales['nuevoRolAdmin']['sending'] = false;
						  	generalLoadingIcon(form, false);
						});
					}
				}
			});

			checkGeneralValidForm($form);
		}

		function updateOnSuccess(perfil){

			var htmlPerfil = {
					'administrador' : {
						'html' : '<div class="col-xs-6 col-sm-6 col-md-4 item-mv hidden"> <div class="rol-element" id="rol-administrador" data-item = "{&quot;id&quot;: &quot;administrador&quot; ,&quot;nombre&quot;: &quot;Administrador de grupos&quot;, &quot;usuarios&quot; : &quot;0&quot;, &quot;showgrupo&quot; : true}"> <div class="header-group flexbox clearfix"> <div class="ribbon flexbox"> <span class="icon io-Maletin col-sm-2 left-icon-ri" title="Rol de usuario"></span> <div class="flexbox v-align-center col-sm-10 padding-0 name-container"> <strong class="ribbon-content no-edit col-sm-10">Administrador de grupos</strong> </div> </div> <div class="icon-container flexbox v-align-center"> <button class="btn-gear simple" title="Configuración"> <span class="icon io-Gear"></span> </button> </div> <div class="col-sm-12 settings-ri"> <div class="col-sm-12 cont-set-ri"> <p class="col-sm-12 title-ri"> <span class="in-text-ri">Configuración</span> <button class="simple btn-close-config" title="Cerrar"> <span class="icon io-Close"></span> </button> </p> <div class="col-sm-12 title-mod"> <span class="icon io-Maletin col-xs-2 left-icon-ri"></span> <p class="title-ribon-sri">Administrador de grupos</p> </div> <div class="col-sm-12 submenu-ri"> <div class="first-bloq-ri"> <button class="simple btn-agregar-usuario" type="button"> <span class="icon io-More"></span> <span class="in-text-fbr">Agregar usuario</span> </button> <a class="simple bton btn-editar-nombre" href="configuracion-1-a.html"> <span class="icon io-ojo"></span> <span class="in-text-fbr">Ver permiso(s)</span> </a> <button class="simple bton btn-eliminar-rol-admin hide-mobile" type="button"> <span class="icon io-Bin"></span> <span class="in-text-fbr">Eliminar perfil</span> </button><a class="simple bton" href="configuracion-2.html"> <span class="icon io-Message"></span> <span class="in-text-fbr">Configurar notificaciones</span> </a> </div> </div> </div> </div> </div> <div class="body-group"> <div class="group-total"> <p class="usuarios-total"><strong>[0]</strong> usuarios</p> </div> <div class="extend-imv"> <a href="configuracion-4-a.html" class="see-more-gt" title="Ver usuarios">Ver usuarios</a> </div> </div> </div> </div>',
							'btn' : 'btn-agregar-usuario'
						},

					'inplant' : 
						{'html': '<div class="col-xs-6 col-sm-6 col-md-4 item-mv hidden"> <div class="rol-element" id="rol-inplant" data-item = "{&quot;id&quot;: &quot;inplant&quot; ,&quot;nombre&quot;: &quot;Inplant&quot;, &quot;usuarios&quot; : &quot;0&quot;}"> <div class="header-group flexbox clearfix"> <div class="ribbon flexbox"> <span class="icon io-City col-sm-2 left-icon-ri" title="Rol de usuario"></span> <div class="flexbox v-align-center col-sm-10 padding-0 name-container"> <strong class="ribbon-content no-edit col-sm-10">Inplant</strong> </div> </div> <div class="icon-container flexbox v-align-center"> <button class="btn-gear simple" title="Configuración"> <span class="icon io-Gear"></span> </button> </div> <div class="col-sm-12 settings-ri"> <div class="col-sm-12 cont-set-ri"> <p class="col-sm-12 title-ri"> <span class="in-text-ri">Configuración</span> <button class="simple btn-close-config" title="Cerrar"> <span class="icon io-Close"></span> </button> </p> <div class="col-sm-12 title-mod"> <span class="icon io-City col-xs-2 left-icon-ri"></span> <p class="title-ribon-sri">Inplant</p> </div> <div class="col-sm-12 submenu-ri"> <div class="first-bloq-ri"> <button class="simple btn-agregar-usuario" type="button"> <span class="icon io-More"></span> <span class="in-text-fbr">Agregar usuario</span> </button> <a class="simple bton btn-editar-nombre" href="configuracion-1-a.html"> <span class="icon io-ojo"></span> <span class="in-text-fbr">Ver permiso(s)</span> </a> <button class="simple bton btn-eliminar-rol-admin hide-mobile" type="button"> <span class="icon io-Bin"></span> <span class="in-text-fbr">Eliminar perfil</span> </button><a class="simple bton" href="configuracion-2.html"> <span class="icon io-Message"></span> <span class="in-text-fbr">Configurar notificaciones</span> </a> </div> </div> </div> </div> </div> <div class="body-group"> <div class="group-total"> <p class="usuarios-total"><strong>[0]</strong> usuarios</p> </div> <div class="extend-imv"> <a href="configuracion-4-b.html" class="see-more-gt" title="Ver usuarios">Ver usuarios</a> </div> </div> </div> </div>',
						'btn' : 'btn-agregar-usuario'
					},
					'supervisor' : {
						'html': '<div class="col-xs-6 col-sm-6 col-md-4 item-mv hidden"> <div class="rol-element" id="rol-supervisor" data-item = "{&quot;id&quot;: &quot;supervisor&quot; ,&quot;nombre&quot;: &quot;Supervisor de grupo&quot;, &quot;usuarios&quot; : &quot;0&quot;}"> <div class="header-group flexbox clearfix"> <div class="ribbon flexbox"> <span class="icon io-Maletin col-sm-2 left-icon-ri" title="Rol de usuario"></span> <div class="flexbox v-align-center col-sm-10 padding-0 name-container"> <strong class="ribbon-content no-edit col-sm-10">Supervisor de grupo</strong> </div> </div> <div class="icon-container flexbox v-align-center"> <button class="btn-gear simple" title="Configuración"> <span class="icon io-Gear"></span> </button> </div> <div class="col-sm-12 settings-ri"> <div class="col-sm-12 cont-set-ri"> <p class="col-sm-12 title-ri"> <span class="in-text-ri">Configuración</span> <button class="simple btn-close-config" title="Cerrar"> <span class="icon io-Close"></span> </button> </p> <div class="col-sm-12 title-mod"> <span class="icon io-City col-xs-2 left-icon-ri"></span> <p class="title-ribon-sri">Supervisor</p> </div> <div class="col-sm-12 submenu-ri"> <div class="first-bloq-ri"> <button class="simple btn-agregar-lineas" type="button"> <span class="icon io-More"></span> <span class="in-text-fbr">Agregar usuario(s)</span> </button> <a class="simple bton btn-editar-nombre" href="configuracion-1-c.html"> <span class="icon io-ojo"></span> <span class="in-text-fbr">Ver permiso(s)</span> </a> <button class="simple bton btn-eliminar-rol-admin hide-mobile" type="button"> <span class="icon io-Bin"></span> <span class="in-text-fbr">Quitar perfil</span> </button><a class="simple bton" href="configuracion-2.html"> <span class="icon io-Message"></span> <span class="in-text-fbr">Configurar notificaciones</span> </a> </div> </div> </div> </div> </div> <div class="body-group"> <div class="group-total"> <p class="usuarios-total"><strong>[500]</strong> usuarios</p> </div> <div class="extend-imv"> <a href="configuracion-4-c.html" class="see-more-gt" title="Ver usuarios">Ver usuarios</a> </div> </div> </div> </div>',
						'btn' : 'btn-agregar-lineas'
					}
				};

				_modalAgregarRolAdmin.isFirstTime = true;
				_modalAgregarRolAdmin.done = false;
				_modalAgregarRolAdmin.perfil = perfil;

				var $added = $('#rol-'+perfil);

				if($added.length<1){
					$('#perfiles-administrador').append(htmlPerfil[perfil].html);
					$added = $('#rol-'+perfil);
				}

				_modalAgregarRolAdmin.element = $added;

				modalAgregarRolAdmin.closeModal();
				$added.find('.btn-agregar-usuario').trigger('click');		
		}


	}
	/**Fin modal añadir perfil**/

	/**Inicio modal agregar líneas**/
	function initmodalAgregarLineas(){
		var processCompleted = false;

		modalAgregarLineas = new modalesTelcel($('#modal-agregar-usuarios'),{
			onInit : function(){
				setActions();
			},
			onReset : function(){
				processCompleted = false;
			},
			onOpen : function(){
				resetModal();
			},
			onClose : function(){
				//Cuando cierre el modal si quieren hacer refresh hay que descomentar esto
				// if(processCompleted)
				// 	location.reload();
			}
		});

		function setActions(){

			$('#modal-agregar-usuarios #componente-ingresar-lineas .lineas-arbol').on('click', '#btn-add-lineas-arbol', function(){
				var dataArbol = ingresarLineasComponent.getDataArbol();
				if(dataArbol.length>0)
		 			postAgregarLineas(dataArbol, 'arbol');
			});

			$('#modal-agregar-usuarios #componente-ingresar-lineas .lineas-autocomplete').on('click', '#btn-add-lineas-autocomplete', function(){
				var dataAutocomplete = ingresarLineasComponent.getDataAutocomplete();
				if(dataAutocomplete.length>0)
					postAgregarLineas(dataAutocomplete, 'autocomplete');
			});


			$('#modal-agregar-usuarios #componente-ingresar-lineas .lineas-archivo').on('click', '#btn-add-lineas-archivo', function(e){
				e.preventDefault();
				var dataArchivo = ingresarLineasComponent.getDataArchivo();
				Services.configuracion.postAgregarLineasArchivo(dataArchivo,postAgregarLineas, showInvalidErrorArchivo);
			});

		}

		//Simular error de que es invalido el archivo
		function showInvalidErrorArchivo(){
			var msg = 'Este archivo está dañado o es ilegible, intenta con un nuevo archivo.';

			$('.lineas-archivo .extra-info').hide();
			$('.lineas-archivo .add-lines-ge-mod' ).append('<div class="error-dd error">'+msg+'</div>');
			$('#archivo').parent().addClass('error');

			$('#btn-add-lineas-archivo').prop('disabled', true);
		}

		function postAgregarLineas(dataPost, type){

			if(!formElementsModales['agregarLineas']['sending']){

				var form = '#modal-agregar-usuarios .in-cont-mod .form-modal-agregar-usuarios';

				nextStep('#modal-agregar-usuarios .step-2','#modal-agregar-usuarios .step-1');

				$('#modal-agregar-usuarios .loading-block-screen').show();

				formElementsModales['agregarLineas']['sending'] = true;

				$('#btn-add-lineas-arbol').prop('disabled', true);
				

				if(type==="archivo"){
					var postObject =
					{
				        url: Services.apiURL.agregarUsuariosArchivo(),
				        type: 'POST',
				        data: { lineas: dataPost, rol : currentModalData.id },
				        cache: false,
				        dataType: 'json',
				        processData: false, // Don't process the files
				        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
				        success : function (data, textStatus, jqXHR){ onSuccess(data);},
				        error : function(jqXHR, textStatus, errorThrown){ onError(); }
				    }

					$.ajax(postObject);
					processCompleted = true;
				
				}

				else{
					$.post( Services.apiURL.agregarUsuarios() , { lineas: dataPost, rol : currentModalData.id })
					  .done(function (data, textStatus, jqXHR){ onSuccess(data);})
					  .fail(function(jqXHR, textStatus, errorThrown){onError()});
				}

			}


			function onSuccess(json, textStatus, jqXHR){
				Services.configuracion.agregarLineasSuccessCallback(json, mostrarTablas,nextStep, {text : currentModalData.nombre});
				formElementsModales['agregarLineas']['sending'] = false;

				processCompleted = true;
			}

			function onError(jqXHR, textStatus, errorThrown){
				Services.configuracion.getAgregarLineasFailResponse(errorThrown);
				formElementsModales['agregarLineas']['sending'] = false;
			}

			function mostrarTablas(data){

				if(data.success.length>0){
					$('#modal-agregar-usuarios .step-3 .total-lineas-success').html(data.success.length);
				
					$('#modal-agregar-usuarios .step-3 .added-lines .div-nal').html('');

					$.each(data.success, function( index, value ) {
					  $('#modal-agregar-usuarios .step-3 .added-lines .div-nal').append('<div class="col-xs-12 col-sm-6"><p>'+value+'</p></div>');
					});

					$('#modal-agregar-usuarios .step-3 .error-success').show();
			  		$('#modal-agregar-usuarios .step-3 .added-lines').show();
				}

				if(data.error.length>0){
					$('#modal-agregar-usuarios .step-3 .not-added-lines .div-nal').html('');

					$('#modal-agregar-usuarios .step-3 .not-added-lines .div-nal').append('<div class="col-xs-6 col-sm-6"><p>	<b>Línea</b></p></div><div class="col-xs-6 col-sm-6"><p><b>Motivo</b></p></div>');

					$.each(data.error, function( index, value ) {
					  $('#modal-agregar-usuarios .step-3 .not-added-lines .div-nal').append('<div class="col-xs-6 col-sm-6"><p>'+value.numero+'</p></div><div class="col-xs-6 col-sm-6"><p>'+value.motivo+'</p></div>');
					});

					$('#modal-agregar-usuarios .step-3 .total-lineas-error').html(data.error.length);

			  		$('#modal-agregar-usuarios .step-3 .error-msg').show();
			  		$('#modal-agregar-usuarios .step-3 .not-added-lines').show();
			  	}

			}
		}

		function resetModal(){
			ingresarLineasComponent.reset();

			$('#modal-agregar-usuarios .loading-block-screen').hide();
			$('#modal-agregar-usuarios .step-1').show();
			$('#modal-agregar-usuarios .step-2, #modal-agregar-usuarios .step-3').hide();
			$('#modal-agregar-usuarios .error-msg').hide();
			$('#modal-agregar-usuarios .step-3 .error-success').hide();
			$('#modal-agregar-usuarios .step-3 .info-added-lines').hide();
		}


		function nextStep(show, hide){
			$(hide).hide();
			$(show).show();
		}

	}
	/**Fin modal agregar líneas**/

	/**Inicio modal quitar usuario**/
	function initModalQuitarUsuario(){
		var _mpoAccionMasiva = { data: [], allChecked : false };

		modalQuitarUsuario = new modalesTelcel($('#modal-quitar-usuario'),{
			onInit : function(){
				setActions();
				resetElements();
			},
			onReset : function(){
				resetElements();
			},
			onOpen : function(){
				if(!singleElement){
					$('.single-element').hide();
					$('.multiple-elements').show();
					setSelectedData();
				}
				else{
					$('.multiple-elements').hide();
					$('.single-element').show();
				}

				$('.single-msg, .multiple-lines').hide();

			},
			onClose : function(){
			}
		});

		function resetElements(){
			$('#modal-quitar-usuario .loading-block-screen').hide();
			$('#modal-quitar-usuario .step-1').show();
			$('#modal-quitar-usuario .step-2, #modal-quitar-usuario .step-3').hide();
			$('#modal-quitar-usuario .error-msg').hide();
			$('#modal-quitar-usuario .step-3 .error-success').hide();
			$('#modal-quitar-usuario .step-3 .info-added-lines').hide();
		}

		function setSelectedData(){
			_mpoAccionMasiva = generalCheckBoxAll.getCheckedElements();
			_mpoAccionMasiva.id = currentModalData.id;

			$('.total-usuarios-txt').html(_mpoAccionMasiva.total);
		}


		function setActions(){
			$('#btn-confirmar-quitar').click(function(){
				postEliminarUsuarios();
			});
		}

		function postEliminarUsuarios(){
			if(!formElementsModales['eliminarUsuario']['sending']){
				var form = '#form-quitar-usuario';

				$('#modal-quitar-usuario .step-1').hide();
				$('#modal-quitar-usuario .loading-block-screen').show();
				$('#modal-quitar-usuario .step-2').show();

				formElementsModales['eliminarUsuario']['sending'] = true;
				$('#btn-confirmar-quitar').prop('disabled', true);
				
				generalLoadingIcon(form, true);

				var urlPOST = Services.apiURL.eliminarUsuarioRol();

				$.post( urlPOST , { data: currentModalData.id, related : (singleElement ? currentModalData : _mpoAccionMasiva) })
				  .done(function( json ) {

					Services.configuracion.eliminarUsuarioRolSuccessCallback(json, form, mostrarTablas, {isMultiple : ( _mpoAccionMasiva.total>1 && !singleElement ) , rol : 'Usuario final' });
					formElementsModales['eliminarUsuario']['sending'] = false;
					$('#btn-confirmar-quitar').prop('disabled', false);
				  	generalLoadingIcon(form, false);

				  })
				  .fail(function( jqxhr, textStatus, error ) {
				  	Services.configuracion.eliminarUsuarioRolFailCallback(error, form );
				  	formElementsModales['eliminarUsuario']['sending'] = false;
				  	generalLoadingIcon(form, false);
				});
			}
		}

		function mostrarTablas(data){

			if(data.success.length>0){
				$('#modal-quitar-usuario .step-3 .total-lineas-success').html(data.success.length);
			
				$('#modal-quitar-usuario .step-3 .added-lines .div-nal').html('');

				$.each(data.success, function( index, value ) {
				  $('#modal-quitar-usuario .step-3 .added-lines .div-nal').append('<div class="col-xs-12 col-sm-6"><p>'+value+'</p></div>');
				});

				$('#modal-quitar-usuario .step-3 .error-success').show();
		  		$('#modal-quitar-usuario .step-3 .added-lines').show();
			}

			if(data.error.length>0){
				$('#modal-quitar-usuario .step-3 .not-added-lines .div-nal').html('');

				$('#modal-quitar-usuario .step-3 .not-added-lines .div-nal').append('<div class="col-xs-6 col-sm-6"><p>	<b>Línea</b></p></div><div class="col-xs-6 col-sm-6"><p><b>Motivo</b></p></div>');

				$.each(data.error, function( index, value ) {
				  $('#modal-quitar-usuario .step-3 .not-added-lines .div-nal').append('<div class="col-xs-6 col-sm-6"><p>'+value.numero+'</p></div><div class="col-xs-6 col-sm-6"><p>'+value.motivo+'</p></div>');
				});

				$('#modal-quitar-usuario .step-3 .total-lineas-error').html(data.error.length);

		  		$('#modal-quitar-usuario .step-3 .error-msg').show();
		  		$('#modal-quitar-usuario .step-3 .not-added-lines').show();
		  	}

		}
	}
	/**Fin modal quitar usuario**/

	/**Inicio modal cambiar rol**/
	function initModalCambiarRol(){
		var _mpoAccionMasiva = { data: [], allChecked : false };
		var $modal = $('#modal-cambiar-rol');
		var $arbol = $modal.find('.tree-grupos'),
		$grupo = $arbol.closest('.grupo-selector-block'),
		arbolId = $grupo.attr('id'),
		arbolFlag = false,
		currently_open = false,
		initialSize = 0;

		function setResize(){
			var size = null,
			type = $modal.find('input[name="usuariorol"]').val();
			initialSize = $( window ).width();

			$( window ).resize(function() {
				size = $( window ).width();

				if(initialSize>size && currently_open && type=='administrador')
					onResize();
			});
		}

		function onResize(){

			$modal.find('input[name="usuariorol"]').trigger('change');

			initialSize = $( window ).width();
		}

		modalCambiarRol = new modalesTelcel($('#modal-cambiar-rol'),{
			onInit : function(){
				setResize();
				validateForm();
				setActions();
				resetElements();
			},
			onReset : function(){
				resetElements();
			},
			onOpen : function(){

				$grupo.addClass('hidden');

				if(!singleElement){
					$('.single-element').hide();
					$('.multiple-elements').show();
					setSelectedData();
				}
				else{
					$('.multiple-elements').hide();
					$('.single-element').show();
				}

				$('.single-msg, .multiple-lines').hide();
				
				resetFormModal($('.form-cambiar-rol #form-cambiar-rol'), 'cambiarRol');

				currently_open = true;
			},
			onClose : function(){
				if($arbol.length>0 && arbolFlag){
					$arbol.jstree(true).deselect_all();
	  				$arbol.jstree(true).close_all();
					$('#'+arbolId).addClass('hidden');
				}

				currently_open = false;
			}
		});

		function setActions(){
			$('#usuariorol').change(function(){
				var $select = $(this),
				value = $select.val();
				checkShowArbol(value);
			});
		}

		function checkShowArbol(perfil){
			var $form = $('.form-cambiar-rol #form-cambiar-rol');

			if(perfil == 'administrador' && !is_mobile()){
				if(!arbolFlag){
					ingresarGruposComponent.initArbol($grupo, arbolId);
					arbolFlag = true;
				}

	  			$modal.find('.grupo-selector-block').removeClass('hidden');
	  			checkGeneralValidForm($form, validIngresarGruposComponentTotal);
			}
	  		else{
	  			if($arbol.length>0 && arbolFlag){
	  				$arbol.jstree(true).deselect_all();
	  				$arbol.jstree(true).close_all();
	  			}
	  			
	  			checkGeneralValidForm($form);

	  			if(perfil=='administrador')
	  				$modal.find('.grupo-selector-block').removeClass('hidden');
	  			else
	  				$modal.find('.grupo-selector-block').addClass('hidden');
	  		}

	  		//Ejecutar validación
	  		setTimeout(
	  			function(){
	  				$('#usuariorol').trigger('change');
	  			}, 500);
	  		
		}

		function validIngresarGruposComponentTotal(){
			var valid = false,
			data = $arbol.jstree('get_selected');

			if(data.length>0)
				valid = true;

			return valid;
		}

		function resetElements(){

			$('#modal-cambiar-rol .loading-block-screen').hide();
			$('#modal-cambiar-rol .step-1').show();
			$('#modal-cambiar-rol .step-2, #modal-cambiar-rol .step-3').hide();
			$('#modal-cambiar-rol .error-msg').hide();
			$('#modal-cambiar-rol .step-3 .error-success').hide();
			$('#modal-cambiar-rol .step-3 .info-added-lines').hide();
		}

		function setSelectedData(){
			_mpoAccionMasiva = generalCheckBoxAll.getCheckedElements();
			_mpoAccionMasiva.id = currentModalData.id;
		}

		function validateForm(){
			var $form = $('.form-cambiar-rol #form-cambiar-rol');

			disableSumbitButton($form, true);
			checkTelefonoLength($form);
			
			formElementsModales['cambiarRol']['validator'] = $form.validate({
			ignore: "",
				onkeyup:  function(element) { $(element).valid(); },
				rules: {
					"usuariorol": {
						required: true
					}
				},
				messages: {
					usuariorol : {
						required : "Ingresa un perfil."
					}
				},
				errorClass : "error-dd error",
				errorPlacement: function(error, $element) {
				   	var $parent = $element.parent().parent();
				   	$parent.append( error );
				},
				submitHandler: function(form) {
					if(!formElementsModales['cambiarRol']['sending']){
						$('#modal-cambiar-rol .step-1').hide();
						$('#modal-cambiar-rol .loading-block-screen').show();
						$('#modal-cambiar-rol .step-2').show();

						formElementsModales['cambiarRol']['sending'] = true;
						$(form).find('button[type="submit"]').prop('disabled', true);
						
						var self = $(form).serialize();

						generalLoadingIcon(form, true);

						var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;

						$.post( urlPOST , { data: self, related : (singleElement ? currentModalData : _mpoAccionMasiva) })
						  .done(function( json ) {

							Services.configuracion.cambiarRolSuccessCallback(json, form, mostrarTablas, {isMultiple : ( _mpoAccionMasiva.total>1 && !singleElement ), rol : $('#modal-cambiar-rol #usuariorol :selected').data('rol') });
							formElementsModales['cambiarRol']['sending'] = false;
							$(form).find('button[type="submit"]').prop('disabled', false);
						  	generalLoadingIcon(form, false);

						  })
						  .fail(function( jqxhr, textStatus, error ) {
						  	Services.configuracion.cambiarRolFailCallback(error, form );
						  	formElementsModales['cambiarRol']['sending'] = false;
						  	generalLoadingIcon(form, false);
						});
					}
				}
			});

			checkGeneralValidForm($form);
		}

		function mostrarTablas(data){

			if(data.success.length>0){
				$('#modal-cambiar-rol .step-3 .total-lineas-success').html(data.success.length);
			
				$('#modal-cambiar-rol .step-3 .added-lines .div-nal').html('');

				$.each(data.success, function( index, value ) {
				  $('#modal-cambiar-rol .step-3 .added-lines .div-nal').append('<div class="col-xs-12 col-sm-6"><p>'+value+'</p></div>');
				});

				$('#modal-cambiar-rol .step-3 .error-success').show();
		  		$('#modal-cambiar-rol .step-3 .added-lines').show();
			}

			if(data.error.length>0){
				$('#modal-cambiar-rol .step-3 .not-added-lines .div-nal').html('');

				$('#modal-cambiar-rol .step-3 .not-added-lines .div-nal').append('<div class="col-xs-6 col-sm-6"><p>	<b>Línea</b></p></div><div class="col-xs-6 col-sm-6"><p><b>Motivo</b></p></div>');

				$.each(data.error, function( index, value ) {
				  $('#modal-cambiar-rol .step-3 .not-added-lines .div-nal').append('<div class="col-xs-6 col-sm-6"><p>'+value.numero+'</p></div><div class="col-xs-6 col-sm-6"><p>'+value.motivo+'</p></div>');
				});

				$('#modal-cambiar-rol .step-3 .total-lineas-error').html(data.error.length);

		  		$('#modal-cambiar-rol .step-3 .error-msg').show();
		  		$('#modal-cambiar-rol .step-3 .not-added-lines').show();
		  	}

		}
	}
	/**Fin modal cambiar rol**/

	/**Inicio modal eliminar rol**/
	function initModalEliminarRol(){
		var processCompleted = false;

		modalEliminarRol = new modalesTelcel($('#modal-eliminar-rol'),{
			onInit : function(){
				setModalActions();
				$('#confirmar-eliminar-rol').hide();
				$('#eliminar-rol-confirmacion').hide();
				$('#eliminar-rol-ya-eliminado').hide();
			},
			onReset : function(){
				processCompleted = false;
				$('#confirmar-eliminar-rol').hide();
			  	$('#eliminar-rol-confirmacion').hide();
			  	$('#eliminar-rol-ya-eliminado').hide();
			},
			onOpen : function(){
				$('#confirmar-eliminar-rol').show();
				$('#modal-eliminar-rol .total-usuarios-txt').html(currentModalData.usuarios);
				//consultarLineas();
			},
			onClose : function(){

				//Cuando cierre el modal si quieren hacer refresh hay que descomentar esto
				// if(processCompleted)
				// 	location.reload();
			}
		});

		function consultarLineas(){

			if(!formElementsModales['consultarLineas']['sending']){

				formElementsModales['consultarLineas']['sending'] = true;

				generalLoadingIcon('#modal-eliminar-rol .in-cont-mod', true);

				var postURL = Services.apiURL.consultarLineas();

				$.post( postURL , { id: currentModalData.id })
				  .done(function( json ) {
				  	
				  	//Services.gestionGrupos.consultarLineasSuccessCallback(json,currentModalData, removeElementFromHTML);

				  	formElementsModales['consultarLineas']['sending'] = false;
				  	generalLoadingIcon('#modal-eliminar-rol .in-cont-mod', false);

				  	processCompleted = true;

				  })
				  .fail(function( jqxhr, textStatus, error ) {
		
				  	//Services.gestionGrupos.consultarLineasFailCallback(error, form);
				  	formElementsModales['consultarLineas']['sending'] = false;
				  	generalLoadingIcon('#modal-eliminar-rol .in-cont-mod', false);

				});

			}

			var removeElementFromHTML = function (idDeleted){
				$('#group-'+idDeleted).parent().remove();
			}
		}

		function setModalActions(){
			$('#btn-eliminar-rol').click(function(){
				postSaveDeleteRol();
			});
		}

		function postSaveDeleteRol(){
			var form = '#modal-eliminar-rol .in-cont-mod';

			if(!formElementsModales['eliminarRol']['sending']){

				formElementsModales['eliminarRol']['sending'] = true;

				generalLoadingIcon(form, true);

				var postURL = Services.apiURL.eliminarRol();

				$.post( postURL , { delete: currentModalData.id })
				  .done(function( json ) {
				  	Services.configuracion.eliminarRolSuccessCallback(json, form, currentModalData );
				  	formElementsModales['eliminarRol']['sending'] = false;
				  	generalLoadingIcon(form, false);

				  })
				  .fail(function( jqxhr, textStatus, error ) {
				  	Services.configuracion.eliminarRolFailCallback(error, form);
				  	formElementsModales['eliminarRol']['sending'] = false;
				  	generalLoadingIcon(form, false);
				});
			}
		}

	}
	/**Fin modal eliminar rol**/

	/**Inicio modal eliminar rol admin**/
	function initModalEliminarRolAdmin(){
		var processCompleted = false,
		$modal = $('#modal-eliminar-rol-admin');

		modalEliminarRolAdmin = new modalesTelcel($('#modal-eliminar-rol-admin'),{
			onInit : function(){
				setModalActions();
				$('#confirmar-eliminar-rol-admin').hide();
				$('#eliminar-rol-admin-confirmacion').hide();
				$('#eliminar-rol-admin-ya-eliminado').hide();
			},
			onReset : function(){
				processCompleted = false;
				$('#confirmar-eliminar-rol-admin').hide();
			  	$('#eliminar-rol-admin-confirmacion').hide();
			  	$('#eliminar-rol-admin-ya-eliminado').hide();
			},
			onOpen : function(){
				$('#confirmar-eliminar-rol-admin').show();
				setCurrentPerfilData();
			},
			onClose : function(){

				//Cuando cierre el modal si quieren hacer refresh hay que descomentar esto
				// if(processCompleted)
				// 	location.reload();
			}
		});

		
		function setCurrentPerfilData(){

			$('#modal-eliminar-rol-admin .total-usuarios-txt').html(currentModalData.usuarios);

			if(typeof currentModalData.showgrupo!='undefined' && currentModalData.showgrupo ){
				$modal.find('.sublevel-tm .icon').removeClass('io-avatar io-City').addClass('io-Maletin');
			}
			else{
				$modal.find('.sublevel-tm .icon').removeClass('io-avatar io-Maletin').addClass('io-City');	
			}		

		}

		function setModalActions(){
			$('#btn-eliminar-rol-admin').click(function(){
				postSaveDeleteRol();
			});
		}

		function postSaveDeleteRol(){
			var form = '#modal-eliminar-rol-admin .in-cont-mod';

			if(!formElementsModales['eliminarRol']['sending']){

				formElementsModales['eliminarRol']['sending'] = true;

				generalLoadingIcon(form, true);

				var postURL = Services.apiURL.eliminarRol();

				$.post( postURL , { delete: currentModalData.id })
				  .done(function( json ) {
				  	Services.configuracion.eliminarRolAdminSuccessCallback(json, form, currentModalData, updateOnSuccess );
				  	formElementsModales['eliminarRol']['sending'] = false;
				  	generalLoadingIcon(form, false);

				  })
				  .fail(function( jqxhr, textStatus, error ) {
				  	Services.configuracion.eliminarRolAdminFailCallback(error, form);
				  	formElementsModales['eliminarRol']['sending'] = false;
				  	generalLoadingIcon(form, false);
				});
			}
		}

		function updateOnSuccess(){
			var perfiles = ['administrador', 'inplant', 'supervisor'];

			$.each(perfiles, function( index, value ) {
			  if($('#rol-'+value).length==0)
			  	allExist = false;
			});

			if(allExist)
				$('.btn-add-rol-admin').addClass('simulate-disabled');
			else
				$('.btn-add-rol-admin').removeClass('simulate-disabled');
		}

	}
	/**Fin modal eliminar rol admin**/

	/**Inicio modal agregar usuario**/
	function initModalAgregarUsuario(){
		var $form = $('#modal-agregar-usuario #form-agregar-usuario');
		var $input = $form.find('input[name="email"]');
		var type = 'inplant',
		$modal = $('#modal-agregar-usuario'),
		$arbol = $modal.find('.tree-grupos'),
		$grupo = $arbol.closest('.grupo-selector-block'),
		arbolId = $grupo.attr('id'),
		currently_open = false,
		initialSize = 0;

		$input.bind('input', function(e){
			var $errori = $form.find('.general-error-tooltip');
			if($errori.length>0){
				$input.removeClass('error').removeClass('error-dd');
				$errori.remove();
			}
		});

		function setResize(){
			var size = null;
			initialSize = $( window ).width();

			$( window ).resize(function() {
				size = $( window ).width();

				if(initialSize>size && currently_open && type=='administrador')
					onResize();
			});
		}

		function onResize(){

			if(is_mobile())
				checkGeneralValidForm($form);	
			else
				checkGeneralValidForm($form, validIngresarGruposComponentTotal);

			$form.find('input[name="lada"]').trigger('keyup');

			initialSize = $( window ).width();
		}

		modalAgregarUsuario = new modalesTelcel($('#modal-agregar-usuario'),{
			onInit : function(){
				setResize();
				validateFormAgregarUsuario();
				$('#modal-agregar-usuario .secondary-modal-header').hide();

			},
			onOpen : function(){

				setCurrentPerfilData();	
				currently_open = true;

			},
			onReset : function(){

				if(_modalAgregarRolAdmin.isFirstTime){

					if(_modalAgregarRolAdmin.done)
						_modalAgregarRolAdmin.element.parent().removeClass('hidden');
					else
						_modalAgregarRolAdmin.element.parent().remove();
				}

				if(type=='administrador')
					ingresarGruposComponent.reset(arbolId);
				
				resetFormModal($('.form-agregar-usuario #form-agregar-usuario'), 'nuevoUsuario');
				$('#modal-agregar-usuario .main-modal-header').show();
				$('#modal-agregar-usuario .secondary-modal-header').hide();
			},
			onClose : function(){
				currently_open = false;
			}
		});


		function setCurrentPerfilData(){

			if(typeof currentModalData.showgrupo!='undefined' && currentModalData.showgrupo ){
				$grupo.removeClass('hidden');
				$grupo.find('.grupo').addClass('required');
				$modal.find('.sublevel-tm .icon').removeClass('io-avatar io-City').addClass('io-Maletin');
				type = 'administrador';
				ingresarGruposComponent.inicializar();

				if(!is_mobile())
					checkGeneralValidForm($form, validIngresarGruposComponentTotal);
				else
					checkGeneralValidForm($form);
			}
			else{
				$grupo.addClass('hidden');
				$grupo.find('.grupo');
				$grupo.find('.grupo').removeClass('required');
				$modal.find('.sublevel-tm .icon').removeClass('io-avatar io-Maletin').addClass('io-City');
				type = 'inplant';
				checkGeneralValidForm($form);
			}		

			_modalAgregarRolAdmin.perfil = type;
		}

		function validateFormAgregarUsuario(){
			var $form = $('.form-agregar-usuario #form-agregar-usuario');

			disableSumbitButton($form, true);
			checkTelefonoLength($form);
			
			formElementsModales['nuevoUsuario']['validator'] = $form.validate({
			ignore: "",
				onkeyup:  function(element) { $(element).valid(); },
				rules: {
					email: {
						required: true,
						email: true
					},
					nombre: {
						required: true,
						basicName: true,
						minlength: 3,
						maxlength: 40
					},
					numero : {
						digits: true,
						minlength: 10,
						maxlength: 10,
						required : {
							depends: function(element) {
								var $lada = $form.find('.lada').val(),
								$telefono = $form.find('.telefono').val(),
								$ext = $form.find('.extension').val();

			                	return $lada.length>0 || $telefono.length>0 || $ext.length;
			                }
						}
					},
					extension : {
						digits: true
					}
				},
				messages: {
					email: {
						required: "Ingresa un correo electrónico.",
						email: "Ingresa un correo electrónico válido."
					},
					nombre: {
						required : "Ingresa el nombre del usuario.",
						basicName: "Este campo solo acepta letras, números, punto y espacios.",
						minlength: "El nombre debe contener al menos 3 caracteres.",
					   	maxlength : "El nombre no debe ser mayor a 40 caracteres."
					},
					numero: {
						required: "Ingresa un número de contacto.",
						digits: "Ingresa un número válido.",
						minlength: "Ingresa un número de 10 dígitos.",
						maxlength: "Ingresa un número de 10 dígitos."
					},
					extension : {
						digits: "Ingresa una extensión válida."
					}
				},errorClass : "error-dd error",
				errorPlacement: function(error, $element) {
				   	var $parent = $element.parent();

				   	if($element.attr("name") == "numero"){
				   		$form.find('.lada').addClass('error-dd error');
				   		$form.find('.telefono').addClass('error-dd error');
				   		$parent.append( error );
				   	}
				   	else if( $.inArray( $element.attr("name"), ['lada', 'telefono']) < 0){
				   		$parent.append( error );
				   	}
   	
				},
				unhighlight: function(element, errorClass, validClass) {

					var $element = $(element);
					if(!$element.hasClass('lada') && !$element.hasClass('telefono') && !$element.hasClass('extension'))
		        		$element.removeClass('error error-dd').addClass('valid');
		        	else{
		        		var $numero = $form.find('.numero');
		        		if($numero.valid()){
				  			$('#numero-error').remove();
				  			$('#lada-error').remove();
				  			$('#telefono-error').remove();
				    		$form.find('.lada').removeClass('error-dd error');
				    		$form.find('.telefono').removeClass('error-dd error');
				  		}
		        	}

		        },
		        highlight : function(element, errorClass){
		        	var $element = $(element);
		        	$element.removeClass('valid').addClass('error error-dd');

		        	if($element.hasClass('numero')){
		        		$form.find('.lada').addClass('error-dd error');
				   		$form.find('.telefono').addClass('error-dd error');
		        	}

		        },
				submitHandler: function(form) {
					if(!formElementsModales['nuevoUsuario']['sending']){
						formElementsModales['nuevoUsuario']['sending'] = true;
						$(form).find('button[type="submit"]').prop('disabled', true);
						
						var self = $(form).serialize();
						var selfArray = $(form).serializeArray();

						generalLoadingIcon(form, true);

						var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;

						$.post( urlPOST , { data: self, related : currentModalData.id})
						  .done(function( json ) {

						  	var gruposData = (type=='administrador' ? ingresarGruposComponent.getDataArbol(arbolId) : [] );

							var elementData = {
								rol : currentModalData.nombre,
								correo: selfArray[1].value,
								nombre : selfArray[0].value,
								grupos : gruposData
							};

							Services.configuracion.agregarUsuarioSuccessCallback(json, form, elementData, updateOnSuccess);
							formElementsModales['nuevoUsuario']['sending'] = false;
							$(form).find('button[type="submit"]').prop('disabled', false);
						  	generalLoadingIcon(form, false);

						  })
						  .fail(function( jqxhr, textStatus, error ) {
						  	Services.configuracion.agregarUsuarioFailCallback(error, form );
						  	formElementsModales['nuevoUsuario']['sending'] = false;
						  	generalLoadingIcon(form, false);
						});
					}
				}
			});
		}

		function updateOnSuccess(msg){
			$('#modal-agregar-usuario .api-msg-success').html('<p>'+msg+'</p>');

			var $rol = $('#rol-'+type);

			if($rol.length>0){
				var $bodygroup = $rol.find('.body-group'),
				$total = $bodygroup.find('.usuarios-total strong'),
				total =  parseInt(($total.html()).replace('[', '').replace(']', ''));
				total+=1,
				data = $rol.data('item');

				data.usuarios = total;

				$rol.data('item', data);

				$bodygroup.find('.btn-agregar-usuarios').addClass('hidden');
				$bodygroup.find('.group-total').removeClass('hidden');
				$bodygroup.find('.see-more-gt').removeClass('hidden');

				$total.html('['+total+']')
			}

			_modalAgregarRolAdmin.done = true;
			
		}

		function validIngresarGruposComponentTotal()
		{	
			var valid = false,
			data = $arbol.jstree('get_selected');

			if(data.length>0)
				valid = true;

			return valid;
		}

	}
	/**Fin modal agregar usuario**/

	/**Inicio modal editar usuario**/
	function initModalEditarUsuario(){
		var processCompleted = false;
		var $modal = $('#modal-editar-usuario');
		var $formContainer = null; 
  		var index = null;
  		var $parent = null;
  		var $arbol = $modal.find('.tree-grupos'),
  		currently_open = false,
  		initialSize = 0;

  		function setResize(){
			var size = null;
			initialSize = $( window ).width();

			$( window ).resize(function() {
				size = $( window ).width();

				if(initialSize>size && currently_open && type=='administrador')
					onResize();
			});
		}

		function onResize(){
			$('#perfilusuario').trigger('change');
			initialSize = $( window ).width();
		}

		modalEditarUsuario = new modalesTelcel($modal,{
			onInit : function(){
				setResize();
				validateFormEditarUsuario();
				setActions();
			},
			onReset : function(){
				resetFormModal($('.form-editar-usuario #form-editar-usuario'), 'editarUsuario');
			},
			onOpen : function(){
				processCompleted = false;
				setElementInfo();
				currently_open = true;

			},
			onClose : function(){
				currently_open = false;
				//Cuando cierre el modal si quieren hacer refresh hay que descomentar esto
				// if(processCompleted)
				// 	location.reload();
			}
		});


		function setActions(){
			$('#perfilusuario').change(function(){
				var $select = $(this),
				value = $select.val();

				checkShowArbol(value);

			});
		}

		function checkShowArbol(perfil){
			var $form = $('.form-editar-usuario #form-editar-usuario');

			if(perfil == 'administrador' && !is_mobile()){
	  			$modal.find('.grupo-selector-block').removeClass('hidden');
	  			checkGeneralValidForm($form, validIngresarGruposComponentTotal);
			}
	  		else{
	  			checkGeneralValidForm($form);

	  			if(perfil == 'administrador')
	  				$modal.find('.grupo-selector-block').removeClass('hidden');
	  			else
	  				$modal.find('.grupo-selector-block').addClass('hidden');
	  		}

	  		//Ejecutar validación
	  		setTimeout(
	  			function(){
	  				$modal.find('input[name="email"]').trigger('keydown');
	  			}, 500);
	  		
		}

		function validIngresarGruposComponentTotal(){
			var valid = false,
			data = $arbol.jstree('get_selected');

			if(data.length>0)
				valid = true;

			return valid;
		}

		function setElementInfo(){
	  		var meta = currentModalData;

	  		$modal.find('input[name="numero"]').val(meta.numero);
	  		$modal.find('input[name="email"]').val(meta.correoelectronico);
	  		$modal.find('input[name="nombre"]').val(meta.nombre);
	  		$modal.find('input[name="lada"]').val(meta.lada);
	  		$modal.find('input[name="telefono"]').val(meta.telefono);
	  		$modal.find('input[name="extension"]').val(meta.extension);
	  		$modal.find('select[name="perfilusuario"]').val(meta.perfil);

	  		$modal.find('.alias-txt').html(meta.texto);

	  		$modal.find('input[name="lada"]').trigger('keyup');
	  		disableSumbitButton($('.form-editar-usuario #form-editar-usuario'), true);

	  		if(meta.perfil=='administrador'){
		  		checkShowArbol(meta.perfil);
		  		ingresarGruposComponent.setSelectedDataArbol($arbol, meta.grupos);
		  	}
		}


		function validateFormEditarUsuario(){

			var $form = $('.form-editar-usuario #form-editar-usuario');

			disableSumbitButton($form, true);
			checkTelefonoLength($form);
		
			formElementsModales['editarUsuario']['validator'] = $form.validate({
				ignore: "",
				onkeyup:  function(element) { $(element).valid(); },
				rules: {
					email: {
						required: true,
						email: true
					},
					nombre: {
						required: true,
						basicName: true,
						minlength: 3,
						maxlength: 40
					},
					numero : {
						digits: true,
						minlength: 10,
						maxlength: 10,
						required : {
							depends: function(element) {
								var $lada = $form.find('.lada').val(),
								$telefono = $form.find('.telefono').val(),
								$ext = $form.find('.extension').val();

			                	return $lada.length>0 || $telefono.length>0 || $ext.length;
			                }
						}
					},
					extension : {
						digits: true
					},
					perfilusuario : {
						required : true
					}
				},
				messages: {
					email: {
						required: "Ingresa un correo electrónico.",
						email: "Ingresa un correo electrónico válido."
					},
					nombre: {
						required : "Ingresa el nombre del usuario.",
						basicName: "Este campo solo acepta letras, números, punto y espacios.",
						minlength: "El nombre debe contener al menos 3 caracteres.",
					   	maxlength : "El nombre no debe ser mayor a 40 caracteres."
					},
					numero: {
						required: "Ingresa un número de contacto.",
						digits: "Ingresa un número válido.",
						minlength: "Ingresa un número de 10 dígitos.",
						maxlength: "Ingresa un número de 10 dígitos."
					},
					extension : {
						digits: "Ingresa una extensión válida."
					},
					perfilusuario : {
						required : "Selecciona un perfil para el usuario."
					}
				},
				errorClass : "error-dd error",
				errorPlacement: function(error, $element) {
				   	var $parent = $element.parent();

				   	if($element.attr("name") == "numero"){
				   		$form.find('.lada').addClass('error-dd error');
				   		$form.find('.telefono').addClass('error-dd error');
				   		$parent.append( error );
				   	}
				   	else if( $.inArray( $element.attr("name"), ['lada', 'telefono']) < 0){
				   		$parent.append( error );
				   	}
   	
				},
				unhighlight: function(element, errorClass, validClass) {

					var $element = $(element);
					if(!$element.hasClass('lada') && !$element.hasClass('telefono') && !$element.hasClass('extension'))
		        		$element.removeClass('error error-dd').addClass('valid');
		        	else{
		        		var $numero = $form.find('.numero');
		        		if($numero.valid()){
				  			$('#numero-error').remove();
				  			$('#lada-error').remove();
				  			$('#telefono-error').remove();
				    		$form.find('.lada').removeClass('error-dd error');
				    		$form.find('.telefono').removeClass('error-dd error');
				  		}
		        	}

		        },
		        highlight : function(element, errorClass){
		        	var $element = $(element);
		        	$element.removeClass('valid').addClass('error error-dd');

		        	if($element.hasClass('numero')){
		        		$form.find('.lada').addClass('error-dd error');
				   		$form.find('.telefono').addClass('error-dd error');
		        	}

		        },
				submitHandler: function(form) {
					if(!formElementsModales['editarUsuario']['sending']){

						formElementsModales['editarUsuario']['sending'] = true;

						$(form).find('button[type="submit"]').prop('disabled', true);
						
						var self = $(form).serialize();
						var selfArray = $(form).serializeArray();

						generalLoadingIcon(form, true);

						var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;

						$.post( postURL , { data: self, related : currentModalData.id})
						  .done(function( json ) {

						  	var elementData = {
								id : currentModalData.id,
								nombre: selfArray[0].value,
							};

						  	Services.configuracion.editarUsuarioSuccessCallback(json, form, elementData, updateOnSuccess );
						  	formElementsModales['editarUsuario']['sending'] = false;
						  	$(form).find('button[type="submit"]').prop('disabled', false);
						  	generalLoadingIcon(form, false);
						  	processCompleted = true;

						  })
						  .fail(function( jqxhr, textStatus, error ) {
						  	Services.configuracion.editarUsuarioFailCallback(error, form );
						  	formElementsModales['editarUsuario']['sending'] = false;
						  	generalLoadingIcon(form, false);
						  	processCompleted = true;
						  	
						});

					}

				}
			});

		}

		function updateOnSuccess(msg){
			$('#modal-editar-usuario .api-msg-success').html('<p>'+msg+'</p>');

		}

	}

	/**Fin modal editar usuario**/


	/**Inicio modal cancelar rol**/
	function initModalCancelarRol(){
		modalCancelarRol = new modalesTelcel($('#modal-cancelar-rol'),{
			onInit : function(){
				setActions();
			},
			onReset : function(){

			},
			onOpen : function(){

			},
			onClose : function(){
			}
		});

		function setActions(){
			$('#btn-cancelar-rol').click(function(e){
				e.preventDefault();
				var $btn = $(this),
				redirect = $btn.data('href');

				postCancelRol(redirect);
			});
		}

		function postCancelRol(redirect){

			var form = '#confirmar-cancelar-rol';

			generalLoadingIcon(form, true);

			var urlPOST = Services.apiURL.cancelarRol();

			$.post( urlPOST , {  })
			  .done(function( json ) {

				Services.configuracion.cancelarAgregarRolSuccessCallback(json, form, redirect);

			  })
			  .fail(function( jqxhr, textStatus, error ) {
			  	Services.configuracion.cancelarAgregarRolFailCallback(error, form );
			});
		}
	}
	/**Fin modal cancelar rol**/

	function setBasicInfoModal(item){
		currentModalData = item;
		var texto =(typeof item.nombre != 'undefined' ? item.nombre : item.numero);
		$('.modal-mte .alias-text, .modal-mte .txt-current').html(texto);
	}

	function resetFormModal($form, form){
		$form.find('.general-error-tooltip').remove();
		$form.find("input[type=text], input[type=email], input[type=password], select, input[type=number]").val("");
		$form.find("input[type=text], input[type=email], input[type=password], select, input[type=number]").removeClass("error").removeClass("error-dd");
		$form.find("input[type=checkbox], input[type=radio]").prop('checked', false);
		$form.find('button[type="submit"]').prop('disabled', true);
		$form.removeClass('success').removeClass('error').show();

		if(formElementsModales[form]['validator']){
			formElementsModales[form]['validator'].resetForm();
		}
	}

	return{
		inicializar : init,
		openModalAgregarRol : function(){
			modalAgregarRol.openModal();
		},
		openModalAgregarRolAdmin : function(){
			modalAgregarRolAdmin.openModal();
		}
	}

})();

var configuracionNotificaciones = (function(){
	var formElementsSubmit = {id : null, validator : null, sending: false };

	function init(){
		setActions();
		validateForm();
	}

	function setActions(){
		$('.switch-single').on('change', function(){
			var $switch = $(this),
			$container = $switch.closest('.config-switches-box'),
			$status = $switch.parent('.switch').next('.status');

			if($switch.is(':checked'))
				$status.html('Activo');
			else
				$status.html('Inactivo');

			var allChecked = $container.find('.switch-single').length == $container.find('.switch-single:checked').length;
			$container.find('.switch-all').prop('checked', allChecked);
		});

		$('.switch-all').on('change', function(){
			var $switch = $(this),
			$parent = $switch.closest('.config-switches-box'),
			$switches = $parent.find('.switch-single'),
			checked = ($switch.is(':checked') ? true : false),
			$status = $parent.find('.status');

			$switches.prop('checked', checked);

			if(checked)
				$status.html('Activo');
			else
				$status.html('Inactivo');

			
		});

		$('.btn-toggle-config').on('click', function(e){
			var $btn = $(this),
			$container = $btn.closest('.config-box'),
			open = false;

			if($container.hasClass('open-mobile'))
				open = false;
			else
				open = true;

			$('.config-box').removeClass('open-mobile');

			if(open)
				$container.addClass('open-mobile');
			else
				$container.removeClass('open-mobile');
			
		});
		
	}

	function validateForm(){
		var $form = $('#form-config-notif');

		disableSumbitButton($form, true);
		checkTelefonoLength($form);
		
		formElementsSubmit['validator'] = $form.validate({
		ignore: "",
			onkeyup:  function(element) { $(element).valid(); },
			rules: {
				"notificacion[]": {
					required: true
				}
			},
			messages: {
				
			},
			errorClass : "error-dd error",
			errorPlacement: function(error, $element) {

			},
			submitHandler: function(form) {
				if(!formElementsSubmit['sending']){

					formElementsSubmit['sending'] = true;
					$(form).find('button[type="submit"]').prop('disabled', true);
					
					var self = $(form).serialize();

					generalLoadingIcon(form, true);

					var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;

					$.post( urlPOST , { data: self })
					  .done(function( json ) {

						Services.configuracion.editarNotificacionesSuccessCallback(json, form);
						formElementsSubmit['sending'] = false;
						$(form).find('button[type="submit"]').prop('disabled', false);
					  	generalLoadingIcon(form, false);

					  })
					  .fail(function( jqxhr, textStatus, error ) {
					  	Services.configuracion.editarNotificacionesFailCallback(error, form );
					  	formElementsSubmit['sending'] = false;
					  	generalLoadingIcon(form, false);
					});
				}
			}
		});

		checkGeneralValidForm($form);
	}

	return{
		inicializar : init
	}

})();


var configuracionPermisos = (function(){

	var $mainContainer = $('.configuracion-block'),
	$checkboxes = $('.permisos-ul .permiso'),
	$checkboxesAll = $('.permisos-box .checkbox-container-all input[type="checkbox"]'),
	formElementsSubmit = {id : null, validator : null, sending: false };

	function init(){
		setActions();
		validateForm();
	}

	function setActions(){
		$('#btn-enable-edit').click(function(){
			enableEditingMode();
		});

		$('#btn-save-changes').click(function(e){
			e.preventDefault();
			$('.form-editar-permisos').submit();
		});
		
		$('#btn-cancel-changes').click(function(){
			$mainContainer.removeClass('enable-editing-mode');
			$checkboxes.prop('disabled', true);
		});

		$checkboxes.on('change', function(){
			var $checkbox = $(this),
			allChecked = $checkboxes.length == $('.permisos-ul .permiso:checked').length,
			$box = $checkbox.closest('.permisos-box'),
			$boxCheckboxes = $box.find('.permiso'),
			$boxCheckboxesChecked = $box.find('.permiso:checked'),
			allBoxChecked = $boxCheckboxes.length == $boxCheckboxesChecked.length;

			$('#checkbox-pagina-all').prop('checked', allChecked);

			$box.find('.checkbox-container-all input[type="checkbox"]').prop('checked', allBoxChecked);

			checkSelected();
		});

		$checkboxesAll.on('change', function(){
			var $checkbox = $(this),
			checked = ($checkbox.is(':checked') ? true : false),
			allChecked = $checkboxesAll.length == $('.permisos-box .checkbox-container-all input[type="checkbox"]:checked').length,
			$boxCheckboxes = $checkbox.closest('.permisos-box').find('.permiso');

			$('#checkbox-pagina-all').prop('checked', allChecked);
			$boxCheckboxes.prop('checked', checked);

			checkSelected();
		});

		$('#checkbox-pagina-all').on('change', function(){
			var $checkbox = $(this),
			checked = ($checkbox.is(':checked') ? true : false);

			$checkboxes.prop('checked', checked);
			$checkboxesAll.prop('checked', checked);
			checkSelected();

		});
	}

	function checkSelected(){
		if($('.permisos-ul .permiso:checked').length>0){
			$('.select-all-permisos').addClass('elements-selected');
			$('.btn-save-changes').prop('disabled', false);
		}
		else{
			$('.select-all-permisos').removeClass('elements-selected');
			$('.btn-save-changes').prop('disabled', true);
		}
	}

	function enableEditingMode(){
		$mainContainer.addClass('enable-editing-mode');
		$checkboxes.prop('disabled', false);
	}

	function validateForm(){
		var $form = $('.form-editar-permisos'),
		isNuevoRol = $form.attr('id') == 'form-add-permisos',
		redirect = (isNuevoRol ? $form.data('href') : null);

		disableSumbitButton($form, true);
		checkTelefonoLength($form);
		
		formElementsSubmit['validator'] = $form.validate({
		ignore: "",
			onkeyup:  function(element) { $(element).valid(); },
			rules: {
				"permiso[]": {
					required: true
				}
			},
			messages: {
				
			},
			errorClass : "error-dd error",
			errorPlacement: function(error, $element) {

			},
			submitHandler: function(form) {
				if(!formElementsSubmit['sending']){

					formElementsSubmit['sending'] = true;
					$(form).find('button[type="submit"]').prop('disabled', true);
					
					var self = $(form).serialize();

					generalLoadingIcon(form, true);

					var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;

					$.post( urlPOST , { data: self })
					  .done(function( json ) {

						Services.configuracion.editarPermisosSuccessCallback(json, form, redirect);
						formElementsSubmit['sending'] = false;
						$(form).find('button[type="submit"]').prop('disabled', false);
					  	generalLoadingIcon(form, false);

					  })
					  .fail(function( jqxhr, textStatus, error ) {
					  	Services.configuracion.editarPermisosFailCallback(error, form );
					  	formElementsSubmit['sending'] = false;
					  	generalLoadingIcon(form, false);
					});
				}
			}
		});

		checkGeneralValidForm($form);
	}

	return{
		inicializar : init
	}

})();

var ingresarGruposComponent = (function(){

	var $component = $('.grupo-selector-block');
	
	var elementsForm = {
		'agregarGruposArbol' : {
			id : null,
			validator : null,
			sending: false
		},
		'buscarArbolGrupos' : {
			id : null,
			validator : null,
			sending: false
		}
	};

	// GUARDAR ELEMENTOS DEPENDIENDO DEL TIPO DE SUBIDA
	var elementsPost = [];

	function init(){

		if($component.length>0)
			initArboles();
	}

	function initArboles(){
		var c = 0;

		$component.each(function (index) {
			c+=1; 
			var $arbolMain = $(this),
			arbolId = 'grupo-selector-block-'+c;
			$arbolMain.attr('id', arbolId)
			initArbol($arbolMain, arbolId);
		});
		
	}

	function validateParentForm($form, arbolId){
		var result = $('#' + arbolId + ' .tree-grupos').jstree('get_selected'); 

		if ($form.validate().checkForm() && result.length>0) {                  
            $form.find('.first-submit, button[type="submit"]').prop('disabled', false);    
        } else {
           	$form.find('.first-submit, button[type="submit"]').prop('disabled', true); 
        }
	}

	function resetSearchTree(arbolId){
		$('#' + arbolId + ' .tree-grupos-search').jstree("deselect_all");
	    $('#' + arbolId + ' .search-input').val('');
	    $('#' + arbolId + ' .btn-remover-busqueda').removeClass('active');
	    $('#' + arbolId + ' .btn-search').prop('disabled', true);
	    $('#' + arbolId + ' .tree-grupos-search').hide();
	    $('#' + arbolId + ' .tree-grupos').show();
	   	if($('#' + arbolId + ' .tree-grupos .jstree-clicked').length>0){
			$("#" + arbolId + " .block-content-arbol-btn").removeClass('hidden');
			$("#" + arbolId + " .block-content-arbol-btn .btn-remover-seleccion").addClass('active');
		}
		else{
			$("#" + arbolId + " .block-content-arbol-btn").addClass('hidden');
			$("#" + arbolId + " .block-content-arbol-btn .btn-remover-seleccion").removeClass('active');
		}
	}

	function resetTree(arbolId){
		$('#' + arbolId + ' .tree-grupos').jstree("deselect_all");
		$('#' + arbolId + ' .tree-grupos-search').jstree("deselect_all");

		$('#' + arbolId + ' .tree-grupos').jstree("destroy").empty();
		$('#' + arbolId + ' .tree-grupos-search').jstree("destroy").empty();

		$('#btn-mover-lineas').prop('disabled', true);
		$('#' + arbolId + ' .tree-grupos').jstree("close_all");
		$('#' + arbolId + ' .tree-grupos .detail-group').remove();
		$('#' + arbolId + ' .block-content-arbol-btn').addClass('hidden');
		$('#' + arbolId + ' .btn-like-a').removeClass('active');
	}

	function getDataArbol(arbolId){
		//Obtener los elementos seleccionados
		var result = $('#' + arbolId + ' .tree-grupos').jstree('get_selected'); 

		formatDataArbol(result);

		return elementsPost;
		//postAgregarGrupos(phoneChecked, total);
	}

	// UNIFICAR LA INFORMACIÓN AL MISMO FORMATO
	function formatDataArbol(data){

		var dataT = null;

		elementsPost = [];

		data.forEach(function(item, index){
			dataT = {
				id : ( typeof item != 'undefined' ? item : null ),
		 		tipo : 'group',
		 		selected : 'all'
			 };

			elementsPost.push(dataT);

		});

	}

	function initArbol($arbol, arbolId){

		var $element = $('#' + arbolId + ' .componente-lb.lineas-arbol'),
		selectedGroup = { id: null , nombre: null, actual : null };

		initActions();
		initTree();

		function initActions(){


			//EJECUTAR BUSQUEDA
			$('#' + arbolId + ' .btn-search').click(function() {
		        	
		        var searchString = $('#' + arbolId + ' .search-input').val();

		        if(searchString!=''){
		       		searchTree(searchString);
		        }

		    });

			//CAMBIAR ESTADO DEL BOTÓN Y DEL ARBOL DEPENDIENDO DEL SEARCH INGRESADO
		    $('#' + arbolId + ' .search-input').keyup(function() {

		        var searchString = $('#' + arbolId + ' .search-input').val();
		        var $input = $(this);
		        var min = (typeof $input.data('min') != 'undefined' ? $input.data('min') : 1);
		        if(searchString.length>=min)
		        	$('#' + arbolId + ' .btn-search').prop('disabled', false);
		       	else
		       		$('#' + arbolId + ' .btn-search').prop('disabled', true);
		    });

		    //BORRAR BUSQUEDA
		    $('#' + arbolId).on('click', '.btn-remover-busqueda', function() {
		       	resetSearchTree(arbolId);
		    });

		    //BORRAR SELECCION
		    $('#' + arbolId + ' .btn-remover-seleccion').click(function() {
		       	resetTree(arbolId);
		       	initTree(arbolId);
		    });
		}

		function mostrarNodos(node){
			
			$('#' + arbolId + ' .tree-grupos').jstree('open_node', node.id, function(e, data) {
			}, true);			 
		}

		function esconderNodos(node){

			$('#' + arbolId + ' .tree-grupos').jstree('close_node', node.id);
		}

		function mobileNode(nodeId){
			if(nodeId!='#'){
				
				$('#' + arbolId + ' .tree-grupos .jstree-node').removeClass('active-node');
				$('#' + arbolId + ' .tree-grupos #'+nodeId).addClass('active-node');
			}
			else{
				$('#' + arbolId + ' .tree-grupos .jstree-node').removeClass('active-node');
				
			}
		}
		
		function initTree(){

			$('#' + arbolId + ' .tree-grupos')
			.on("changed.jstree", function (e, data) {

				if(data.action == "select_node"){
					
					mostrarNodos(data.node);
					validateParentForm($('#' + arbolId + '').closest('form'), arbolId);
				}
				else if(data.action == "deselect_node"){
					esconderNodos(data.node);
					validateParentForm($('#' + arbolId + '').closest('form'), arbolId);
				}
				
			})
			.bind("open_node.jstree", function (event, data) { 
			  mostrarNodos(data.node);
			  mobileNode(data.node.id); 

			  if(is_mobile()){
			  	selectedGroup.id = data.node.id;
				selectedGroup.nombre = data.node.text;
			  }

			})
			.bind("close_node.jstree", function (event, data) { 
			  mobileNode(data.node.parent); 
			})
			.jstree({
				'core' : {
					'check_callback' : true,
					'data' : {
						'dataType' : 'json',
						'url' : function (node) {
					      return node.id === '#' ?
					      	Services.apiURL.arbolOnlyGruposRoot() :
					        Services.apiURL.arbolGruposChildren();
					    },
						'data' : function (node) {
						
							return { 'id' : node.id };
						}
					},
					'multiple' : true
				},
				'plugins' : [ 'checkbox' ]
			});

			//Verificar si sale el mensaje de un solo grupo
			verifyGroupMsg(arbolId);

			

			// ARBOL DEL BUSCADOR
			$('#' + arbolId + ' .tree-grupos-search').hide();

			$('#' + arbolId + ' .tree-grupos-search')
			.on("changed.jstree", function (e, data) {

				if(data.action == "select_node"){
					
					var instance = $('#' + arbolId + ' .tree-grupos').jstree(true);
					instance.check_node(data.node.id);
					instance._open_to(data.node.id)

				}
				else if(data.action == "deselect_node"){
					var instance = $('#' + arbolId + ' .tree-grupos').jstree(true);
					instance.uncheck_node(data.node.id);
				}
			})
			.bind("refresh.jstree", function (event, data) {
		        
		        var search = $('#' + arbolId + ' .search-input').val();

		        $('#' + arbolId + ' .tree-grupos-search').jstree("open_all");
		        $('#' + arbolId + ' .tree-grupos-search').jstree('search', search);

		        $('#' + arbolId + ' .tree-grupos-search .jstree-search').each(function( index ) {
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

				var treeData = $('#' + arbolId + ' .tree-grupos').jstree('get_selected');
				treeData.forEach(function(item, i){
					var instance = $('#' + arbolId + ' .tree-grupos-search').jstree(true);
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

			if(!elementsForm['buscarArbolGrupos']['sending']){

				var form = '.tree-groups-asoc';
				generalLoadingIcon(form, true);
				elementsForm['buscarArbolGrupos']['sending'] = true;

				var postURL = Services.apiURL.arbolOnlyGruposBusqueda();

				$.post( postURL , { search: search })
				  .done(function( json ) {

				  	Services.general.getArbolBusquedaGruposCallSuccess(json , form, arbolId);
				  	elementsForm['buscarArbolGrupos']['sending'] = false;
				  	generalLoadingIcon(form, false);

				  })
				  .fail(function( jqxhr, textStatus, error ) {
				  	Services.general.getArbolBusquedaGruposCallFail(error, form, arbolId);
				  	elementsForm['buscarArbolGrupos']['sending'] = false;
				  	generalLoadingIcon(form, false);
				});

			}
		}
	}

	function resetComponente(arbolId){
		resetSearchTree(arbolId);
		resetTree(arbolId);
	}


	function verifyGroupMsg(arbolId){
		var hash = window.location.hash;
		var $msg = $('.msg-info-block-arbol');

		if(hash=='#soloSinAgrupar' && $msg.length<1){
			var msg = '*Por el momento no tienes ningún grupo, por lo tanto el Administrador de grupo que elijas tendrá permisos sobre todas las líneas.';

			var $main = $('#' + arbolId + ' .tree-grupos').parent();

			$('<div class="col-sm-12 col-xs-12 msg-info-block msg-info-block-arbol"><p>'+msg+'</p></div>').insertAfter($main);
		}

	}

	function setDataArbol($arbol, data){
		var instance = $arbol.jstree(true);

		data = data.split('|');

		$.each(data, function( index, value ) {
			instance.check_node(value);
			instance._open_to(value);
		});
		
	}

	return{
		inicializar: init,
		getDataArbol : getDataArbol,
		setSelectedDataArbol : setDataArbol,
		reset : resetComponente,
		initArbol : initArbol
	}

})();

ingresarGruposComponent.inicializar();

if($('.configuracion-block').length>0 )
	modalesConfiguracion.inicializar();

if($('.configuracion-block.roles-block').length>0)
	configuracionRoles.inicializar();

if($('.configuracion-block .usuarios-table').length>0)
	configuracionUsuarios.inicializar();

if($('.configuracion-block .table-notificaciones-config-block').length>0)
	configuracionNotificaciones.inicializar();

if($('.configuracion-block .form-editar-permisos'))
	configuracionPermisos.inicializar();

setMsg();

function setMsg(){
	var $msg = $('.success-error-msg-container');

	if($msg.length>0){
		var hash = window.location.hash;;
		if(hash== '#error'){
			$msg.find('.error-tooltip').removeClass('hidden');
			$msg.removeClass('hidden');
		}

		if(hash== '#exito'){
			$msg.find('.success-tooltip').removeClass('hidden');
			$msg.removeClass('hidden');
		}


	}

}