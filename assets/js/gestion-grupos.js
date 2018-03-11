var gestionGrupos = (function(){

	var currentView = 'mosaico';
	var $currentMainView = null;

	var $mainmosaico = $('.js .group-list-block .mosaico-view');
	var $mainlista = $('.js .lista-view .listado-general');

	var $mainmosaicoP = $('js .group-list-block');
	var $mainlistaP = $('js .lista-view');

	var dataEmpresas = null;
	var dataFiltered = null; //Todos los elementos que se pueden mostrar
	var dataPaginacion = null; //Todos los elementos que se muestran en la paginacion

	var paginacion = null;

	var _mpoAccionMasiva = { data: [], allChecked : false };

	// MODALES
	var formElementsModales = { 
		'nuevoGrupo' : {id : null, validator : null, sending: false }, 
		'eliminarGrupo' : {id : null, validator : null, sending: false }, 
		'moverGrupo' : {id : null, validator : null, sending: false }, 
		'agregarLineas' : {id : null, validator : null, sending: false }, 
		'agregarLineasArchivo' : {id : null, validator : null, sending: false }, 
		'buscarArbolGrupo' : {id : null, validator : null, sending: false }, 
		'buscarArbolLineas' : {id : null, validator : null, sending: false }, 
		'consultarLineas' : {id: null, validator: null, sending: false }, 
		'descargarFacturas': {id: null, validator: null, sending: false } };

	function init(){
		if($('.gestion-cuentas-block').length>0){
			if($('.general-group-options-container').length>0)
				setConfigInfo();
			setActions();
		}
	}


	function setConfigInfo(){
		var itemData = $('.general-group-options-container').data('item');
		$('.main-group-text').html(itemData.texto);
	}


	var modalAgregarGrupo = null;
	if($('#modal-agregar-grupo').length>0)
		initModalAgregarGrupo();

	var modalEliminarGrupo = null;
	if($('#modal-eliminar-grupo').length>0)
		initModalEliminarGrupo();

	var _modalCuentasAsociadas = {};
	var modalCuentasAsociadas = null;
	if($('#modal-cuentas-asociadas').length>0)
		initModalCuentasAsociadas();

	var _modalCuentasAuxiliar = {};
	var modalCuentasAuxiliar = null;
	if($('#modal-cuentas-auxiliar').length>0)
		initModalCuentasAuxiliar();

	var modalDescargarFacturas = null;	
	var _modalDescargarFacturas = {
		data : [],
		allChecked : false
	};
	if($('.gestion-cuentas-block #modal-descargar').length>0)
		initModalDescargarFacturas();

	var modalAgregarLineas = null;
	if($('#modal-agregar-lineas').length>0)
		initmodalAgregarLineas();


	var modalMoverGrupo = null;
	if($('#modal-mover-grupo').length>0)
		initmodalMoverGrupo();

	/**Inicio modal consultar cuentas asociadas**/
	function initModalCuentasAsociadas(){
		var $modal = $('#modal-cuentas-asociadas');
		var cuentasAsociadas = [];

		_modalCuentasAsociadas = {
			container: '#modal-cuentas-asociadas',
			paginacion : null, 
			modal : null,
			data : [],
			dataPaginacion : []
		};

		modalCuentasAsociadas = new modalesTelcel($modal,{
			onInit : function(){
			},
			onReset : function(){
			},
			onOpen : function(){
				getDataCuentasAsociadas();
			}
		});

		_modalCuentasAsociadas['paginacion'] = new PaginacionTelcel(_modalCuentasAsociadas['data'], {
			itemsPerPage : 5,
			paginationControlsContainer: '#modal-cuentas-asociadas .pagination-block',
			onPageClick : function(data){
				setOnActionsModalCA(data);
			},
			onInit : function(data){
				setOnActionsModalCA(data);
			},
			onReset : function(data){
				setOnActionsModalCA(data);
			}
		});

		initActionsModalCuentasAsociadas();

		function setOnActionsModalCA(data){
			_modalCuentasAsociadas['dataPaginacion'] = data;
			generarListadoCuentasAsociadas(_modalCuentasAsociadas['dataPaginacion']);
		}

		function initActionsModalCuentasAsociadas(){

			$('#modal-cuentas-asociadas .order-by-modal').on('click', 'button', function(){
				var opciones = $(this).data('opc');
				_modalCuentasAsociadas['data'] = orderItemsModal(opciones, cuentasAsociadas);
				_modalCuentasAsociadas['paginacion'].updateItems(_modalCuentasAsociadas['data']);
				_modalCuentasAsociadas['dataPaginacion'] = _modalCuentasAsociadas['paginacion'].showPage(1);
				generarListadoCuentasAsociadas(_modalCuentasAsociadas['dataPaginacion']);
			});
		}

		function getDataCuentasAsociadas(){

			generalLoadingIcon('#modal-cuentas-asociadas .in-cont-mod', true);

			// Aquí va el llamado al SERVICIO y a la API json 
			var apiCuentas = (typeof $modal.data('api') != 'undefined' ? $modal.data('api') : postURL);

			$.getJSON( apiCuentas, {id: modalCurrentData.id })
			  .done(function( json ) {
			  	
			  	Services.gestionGrupos.cuentasAsociadasSuccessCallback(_modalCuentasAsociadas, json, cuentasAsociadas);

			  	generalLoadingIcon('#modal-cuentas-asociadas .in-cont-mod', false);
			  	cuentasAsociadas = cuentasAsociadas.value;
			  })
			  .fail(function( jqxhr, textStatus, error ) {

			  	Services.gestionGrupos.cuentasAsociadasFailCallback(_modalCuentasAsociadas, json);
			  	generalLoadingIcon('#modal-cuentas-asociadas .in-cont-mod', false);
			});
		}

		function generarListadoCuentasAsociadas(data){

			var $main = $('#modal-cuentas-asociadas .let-allow-asoc');

			$( "#modal-cuentas-asociadas .let-allow-asoc .content-r-asoc" ).remove();

			$.each(data , function( index, elemento ) {

				var htmlLista = '<div class="col-sm-12 content-r-asoc"> <div class="col-sm-12 content-item-block"> <div class="col-sm-2 region-container"> <label class="hidden-sm hidden-md hidden-lg">Región:</label><p title="'+elemento.region+'">'+elemento.region+'</p> </div><div class="col-sm-3 flexbox h-align-center v-align-center"> <span class="icon '+(elemento.tipo == 1 ? 'io-City' : 'io-simple-avatar')+'" title="'+(elemento.tipo == 1 ? 'Cuenta padre' : 'Cuenta hija')+'"></span> <p class="account-hra" title="'+elemento.cuenta+'">'+elemento.cuenta+'</p> </div> <div class="col-sm-3"> <p title="'+elemento.rfc+'">'+elemento.rfc+'</p> </div> <div class="col-sm-4 rs-container"> <p title="'+elemento.razonsocial+'">'+elemento.razonsocial+'</p> </div> <div class="vis-mobile-hra"> <button class="simple show-md-aux-info" data-info=\'{"tipo" : "'+elemento.tipo+'",  "rfc" : "'+elemento.rfc+'", "razonsocial" : "'+elemento.razonsocial+'", "cuenta" : "'+elemento.cuenta+'"}\' type="button"> <span class="icon io-dots-vertical"></span> </button> </div> </div> </div>';

			  	$main.append(htmlLista);

			});
		}

	}
	/**Fin modal consultar cuentas asociadas**/

	/**Inicio modal consultar cuentas asociadas auxiliar mobile**/
	function initModalCuentasAuxiliar(){
		modalCuentasAuxiliar = new modalesTelcel($('#modal-cuentas-auxiliar'),{
			onInit : function(){
				initActionsModalAuxiliar();
			},
			onReset : function(){
			},
			onOpen : function(){
				updateModalData();
			}
		});


		function initActionsModalAuxiliar(){
			$('.modal-mte').on('click', '.show-md-aux-info', function(){
				_modalCuentasAuxiliar = $(this).data('info');
				modalCuentasAuxiliar.openModal();
			});

			$('body').on('click', '#modal-cuentas-auxiliar.active-up-black', function(e){
				e.preventDefault();
				$(this).removeClass('active-up-black').removeClass('active');
			});
		}

		function updateModalData(){

			$('#modal-cuentas-auxiliar .rfc-txt').html(_modalCuentasAuxiliar.rfc);

			$('#modal-cuentas-auxiliar .title-mod .icon').remove();
			$('#modal-cuentas-auxiliar .title-mod').prepend('<span class="icon '+ (_modalCuentasAuxiliar.tipo == 1 ? 'io-City' : 'io-simple-avatar') +'"></span>');

			$('#modal-cuentas-asociadas .title-mod .icon').prop('title', _modalCuentasAuxiliar.tipo == 1 ? 'Cuenta padre' : 'Cuenta hija');

			$('#modal-cuentas-auxiliar .razonsocial-txt').html(_modalCuentasAuxiliar.razonsocial);

			$('#modal-cuentas-auxiliar .cuenta-txt').html(_modalCuentasAuxiliar.cuenta);

			$('#modal-cuentas-auxiliar').addClass('active-up-black');
		}

	}
	/**Fin modal consultar cuentas asociadas auxiliar mobile**/

	/**Inicio modal descargar facturas**/
	function initModalDescargarFacturas(){
		var $titleP = $('#modal-descargar .heading-mod .title-mod p.h2'),
		titleBefore = ( typeof $titleP.data('before') != 'undefined' ? $titleP.data('before') : null ),
		titleAfter = ( typeof $titleP.data('after') != 'undefined' ? $titleP.data('after') : null ),
		emailDefault = '',
		$input = $('#modal-descargar').find('input[name="email"]');

		validateForm();

		modalDescargarFacturas = new modalesTelcel($('#modal-descargar'),{
			onInit : function(){
				$('#descargar-facturas-confirmacion').hide();
				emailDefault = $input.val();
			},
			onReset : function(){
				removeGeneralError();
				$('#form-confirmar-descargar-facturas').show();
			  	$('#descargar-facturas-confirmacion').hide();
			  	resetMainForm();
			},
			onOpen : function(){
				if(titleBefore!=null)
					$titleP.html(titleBefore);
				$('#descargar-facturas-confirmacion').hide();

				var $form = $('#form-confirmar-descargar-facturas');
				disableSumbitButton($form, false);
			}
		});

		function validateForm(){
			var $form = $('#form-confirmar-descargar-facturas');

			disableSumbitButton($form, true);
			//checkRequiredElements('#form-confirmar-descargar-facturas');

			formElementsModales['descargarFacturas']['validator'] = $form.validate({
				rules: {
					email: {
					  required: true,
					  email: true
					}
				},
				messages: {
				 email: {
				   required: "Ingresa un correo electrónico.",
				   email: "Ingresa un correo electrónico válido."
				 }
				},
				errorClass : "error-dd error",
				submitHandler: function(form) {
					if(!formElementsModales['descargarFacturas']['sending']){

						formElementsModales['descargarFacturas']['sending'] = true;

						$(form).find('button[type="submit"]').prop('disabled', true);
						
						var self = $(form).serialize();

						generalLoadingIcon(form, true);

						if( typeof currentModalData != 'undefined' && currentModalData != null){
							_modalDescargarFacturas.data = currentModalData.id;
							_modalDescargarFacturas.is_line = (typeof currentModalData.is_line != 'undefined' && currentModalData.is_line ? true : false );
						}
						else{
							_modalDescargarFacturas.is_line = true;
						}

						var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;

						$.post( urlPOST , { data: self, data: _modalDescargarFacturas })
						  .done(function( json ) {
						  	Services.gestionGrupos.descargarFacturasSuccessCallback(json, form, { element : $titleP, text : titleAfter });
						  	formElementsModales['descargarFacturas']['sending'] = false;
						  	generalLoadingIcon(form, false);

						  })
						  .fail(function( jqxhr, textStatus, error ) {
						  	Services.gestionGrupos.descargarFacturasFailCallback(error, form);
						  	formElementsModales['descargarFacturas']['sending'] = false;
						  	generalLoadingIcon(form, false);
						});

					}

				}
			});
			
			checkGeneralValidForm($form);
		}

		function removeGeneralError(){
			$('#modal-descargar .system-error-msg').remove();
			$('#modal-descargar .has-system-error').removeClass('has-system-error');
		}

		$('#modal-descargar').on('click', '#btn-r-descargar-facturas', function(){
			removeGeneralError();
			$('#form-confirmar-descargar-facturas').submit();
		});

		function resetMainForm(){
			$input.removeClass('error error-dd');
			$input.val(emailDefault);

			if(formElementsModales['descargarFacturas']['validator']){
				formElementsModales['descargarFacturas']['validator'].resetForm();
			}		
		}
	}
	/**Fin modal descargar facturas**/

	/**Inicio modal agregar grupo**/
	function initModalAgregarGrupo(){
		var processCompleted = false;
		var $form = $('.form-agregar-grupo #form-agregar-grupo');
		var $input = $form.find('input[name="nombre"]');

		$input.bind('input', function(e){
			var $errori = $form.find('.general-error-tooltip');
			if($errori.length>0){
				$input.removeClass('error').removeClass('error-dd');
				$errori.remove();
			}
		});

		modalAgregarGrupo = new modalesTelcel($('#modal-agregar-grupo'),{
			onInit : function(){
				validateFormAddGrupo();
				addAction();
			},
			onReset : function(){
				//resetModalDesasociarCuentas();
			},
			onOpen : function(){
				processCompleted = false;
				resetFormModal($('.form-agregar-grupo #form-agregar-grupo'), 'nuevoGrupo');
			},
			onClose : function(){

				//Cuando cierre el modal si quieren hacer refresh hay que descomentar esto
				// if(processCompleted)
				// 	location.reload();
			}
		});

		function addAction(){
			// ABRIR AGREGAR LINEAS DESDE MODAL
			$('#btn-agregar-lineas-grupo-modal').click(function(){
				var $element = $(this);
				setBasicInfoModal($element.data('item'));
				modalAgregarGrupo.closeModal();
				modalAgregarLineas.openModal();
			});

		}

		function validateFormAddGrupo(){

			var $form = $('.form-agregar-grupo #form-agregar-grupo');

			disableSumbitButton($form, true);
			//checkRequiredElements('#form-agregar-grupo');
		
			formElementsModales['nuevoGrupo']['validator'] = $form.validate({
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
				   required: "Es necesario ingresar un nombre para el grupo.",
				   minlength : " El nombre debe tener al menos 5 caracteres.",
				   grupoNombre : "El nombre no debe tener caracteres especiales, números y espacio al inicio o final.",
				   maxlength : "El nombre debe tener un máximo de 45 caracteres."
				 }
			   },
			   errorClass : "error-dd error",
				submitHandler: function(form) {
					if(!formElementsModales['nuevoGrupo']['sending']){

						formElementsModales['nuevoGrupo']['sending'] = true;

						$(form).find('button[type="submit"]').prop('disabled', true);
						
						var self = $(form).serialize();
						var selfArray = $(form).serializeArray();

						generalLoadingIcon(form, true);

						var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;

						$.post( urlPOST , { data: self, id: currentModalData.id })
						  .done(function( json ) {
						  	
						  	var elementData = { name : selfArray[0].value , currentId : currentModalData.id, input : $input };

						  	Services.gestionGrupos.agregarGrupoSuccessCallback(json, form, elementData, addCreatedElementToHTML );

						  	//$(form).find('button[type="submit"]').prop('disabled', false);
						  	formElementsModales['nuevoGrupo']['sending'] = false;
						  	generalLoadingIcon(form, false);
						  	processCompleted = true;

						  })
						  .fail(function( jqxhr, textStatus, error ) {
						  	//Mensaje de error del SISTEMA

						  	Services.gestionGrupos.agregarGrupoFailCallback(error, form );

						  	formElementsModales['nuevoGrupo']['sending'] = false;
						  	generalLoadingIcon(form, false);
						  	processCompleted = true;
						});

					}

				}
			});

			checkGeneralValidForm($form);
			

		}


		var addCreatedElementToHTML = function (id, name){
			var html = '<div class="col-xs-6 col-sm-6 col-md-4 item-mv"> <div class="group-block" id="group-'+id+'" data-item = "{&quot;id&quot;: &quot;'+id+'&quot; ,&quot;texto&quot;: &quot;'+name+'&quot;,&quot;lineas&quot;: &quot;0&quot;, &quot;grupos&quot;: &quot;0&quot; }"> <div class="header-group flexbox clearfix"> <div class="ribbon flexbox"> <span class="icon io-Maletin col-sm-2 left-icon-ri"></span> <div class="flexbox v-align-center col-sm-10 padding-0 name-container"> <strong class="ribbon-content col-sm-10">'+name+'</strong> <input type="text" value="'+name+'" name="editar-alias" class="editar-alias only-alphanumeric meet-regex" maxlength="45"/> <button class="simple edit-name-ri col-sm-2 btn-guardar-nombre" title="Guardar Nombre"><span class="icon io-save-doc"></span></button> <button class="simple edit-name-ri col-sm-2 btn-editar-nombre" title="Editar Nombre"><span class="icon io-Admin"></span></button> </div> </div> <div class="icon-container flexbox v-align-center"> <button class="btn-gear simple" title="Configuración"> <span class="icon io-Gear"></span> </button> </div> <div class="col-sm-12 settings-ri"> <div class="col-sm-12 cont-set-ri"> <p class="col-sm-12 title-ri"> <span class="in-text-ri">Configuración</span> <button class="simple icon-text-ri" title="Cerrar"> <span class="icon io-Close"></span> </button> </p> <div class="col-sm-12 title-mod"> <span class="icon io-Maletin col-xs-2 left-icon-ri"></span> <p class="title-ribon-sri">'+name+'</p> </div> <div class="col-sm-12 submenu-ri"> <div class="first-bloq-ri no-second-block"> <button class="simple btn-editar-nombre hide-mobile" type="button"> <span class="icon io-Admin"></span> <span class="in-text-fbr">Cambiar nombre de grupo</span> </button> <button class="simple btn-add-subgrupo" type="button"> <span class="icon io-add-folder"></span> <span class="in-text-fbr">Crear nuevo subgrupo</span> </button> <button class="simple btn-agregar-lineas" type="button"> <span class="icon io-More"></span> <span class="in-text-fbr">Agregar líneas a este grupo</span> </button> <button class="simple btn-mover-grupo" type="button" > <span class="icon io-move-folder"></span> <span class="in-text-fbr">Mover grupo</span> </button> <button class="simple btn-eliminar-grupo" type="button"> <span class="icon io-Bin"></span> <span class="in-text-fbr">Eliminar grupo</span> </button> </div>  </div> </div> </div> </div> <div class="body-group"> <div class="group-total"> <div class="row desc-imv"> <div class="col-sm-6 details-desc-imv"> <p>0</p> <span>subgrupos</span> </div> <span class="line-separator">-</span> <div class="col-sm-6 details-desc-imv"> <p>0</p> <span>líneas</span> </div> </div> </div> <div class="col-xs-12 extend-imv"> <a href="../gestion-grupos/gestion-grupos-3.html" class="see-more-gt" title="Ver todo">Ver todo</a> </div> </div> </div> </div>';

			$('#main-view-block .mosaico-view').append(html);

		}

	}
	/**Fin modal agregar grupo**/

	/**Inicio modal eliminar grupo**/
	function initModalEliminarGrupo(){
		var processCompleted = false;

		modalEliminarGrupo = new modalesTelcel($('#modal-eliminar-grupo'),{
			onInit : function(){
				setModalActions();
				$('#confirmar-eliminar-grupo').hide();
				$('#eliminar-grupo-confirmacion').hide();
				$('#eliminar-grupo-ya-eliminado').hide();
			},
			onReset : function(){
				processCompleted = false;
				$('#confirmar-eliminar-grupo').hide();
			  	$('#eliminar-grupo-confirmacion').hide();
			  	$('#eliminar-grupo-ya-eliminado').hide();
			},
			onOpen : function(){
				consultarLineas();
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

				generalLoadingIcon('#modal-eliminar-grupo .in-cont-mod', true);

				var postURL = Services.apiURL.consultarLineas();

				$.post( postURL , { id: currentModalData.id })
				  .done(function( json ) {
				  	
				  	Services.gestionGrupos.consultarLineasSuccessCallback(json,currentModalData, removeElementFromHTML);

				  	formElementsModales['consultarLineas']['sending'] = false;
				  	generalLoadingIcon('#modal-eliminar-grupo .in-cont-mod', false);

				  	processCompleted = true;

				  })
				  .fail(function( jqxhr, textStatus, error ) {
		
				  	Services.gestionGrupos.consultarLineasFailCallback(error, form);
				  	formElementsModales['consultarLineas']['sending'] = false;
				  	generalLoadingIcon('#modal-eliminar-grupo .in-cont-mod', false);

				});

			}

			var removeElementFromHTML = function (idDeleted){
				$('#group-'+idDeleted).parent().remove();
			}
		}

		function setModalActions(){
			$('#btn-eliminar-grupo').click(function(){
				postSaveDeleteGrupo();
			});
		}

		function postSaveDeleteGrupo(){
			var form = '#modal-eliminar-grupo .in-cont-mod';

			if(!formElementsModales['eliminarGrupo']['sending']){

				formElementsModales['eliminarGrupo']['sending'] = true;

				generalLoadingIcon(form, true);

				var postURL = Services.apiURL.eliminarGrupo();

				$.post( postURL , { delete: modalCurrentData.id })
				  .done(function( json ) {
				  	Services.gestionGrupos.eliminarGrupoSuccessCallback(json, form, currentModalData );
				  	formElementsModales['eliminarGrupo']['sending'] = false;
				  	generalLoadingIcon(form, false);

				  })
				  .fail(function( jqxhr, textStatus, error ) {
				  	Services.gestionGrupos.eliminarGrupoFailCallback(error, form);
				  	formElementsModales['eliminarGrupo']['sending'] = false;
				  	generalLoadingIcon(form, false);
				});
			}
		}

	}
	/**Fin modal eliminar grupo**/

	/**Inicio modal agregar líneas**/
	function initmodalAgregarLineas(){
		var processCompleted = false;

		modalAgregarLineas = new modalesTelcel($('#modal-agregar-lineas'),{
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

			$('#modal-agregar-lineas #componente-ingresar-lineas .lineas-arbol').on('click', '#btn-add-lineas-arbol', function(){
				var dataArbol = ingresarLineasComponent.getDataArbol();
				if(dataArbol.length>0)
		 			postAgregarLineas(dataArbol, 'arbol');
			});

			$('#modal-agregar-lineas #componente-ingresar-lineas .lineas-autocomplete').on('click', '#btn-add-lineas-autocomplete', function(){
				var dataAutocomplete = ingresarLineasComponent.getDataAutocomplete();
				if(dataAutocomplete.length>0)
					postAgregarLineas(dataAutocomplete, 'autocomplete');
			});


			$('#modal-agregar-lineas #componente-ingresar-lineas .lineas-archivo').on('click', '#btn-add-lineas-archivo', function(e){
				e.preventDefault();
				var dataArchivo = ingresarLineasComponent.getDataArchivo();
				Services.gestionGrupos.postAgregarLineasArchivo(dataArchivo,postAgregarLineas, showInvalidErrorArchivo);
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

				var form = '#modal-agregar-lineas .in-cont-mod .form-modal-agregar-lineas';

				nextStep('#modal-agregar-lineas .step-2','#modal-agregar-lineas .step-1');

				$('#modal-agregar-lineas .loading-block-screen').show();

				formElementsModales['agregarLineas']['sending'] = true;

				$('#btn-add-lineas-arbol').prop('disabled', true);
				

				if(type==="archivo"){
					var postObject =
					{
				        url: Services.apiURL.agregarLineasArchivo(),
				        type: 'POST',
				        data: { lineas: dataPost, grupo : modalCurrentData.id },
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
					$.post( Services.apiURL.agregarLineas() , { lineas: dataPost, grupo : modalCurrentData.id })
					  .done(function (data, textStatus, jqXHR){ onSuccess(data);})
					  .fail(function(jqXHR, textStatus, errorThrown){onError()});
				}

			}


			function onSuccess(json, textStatus, jqXHR){
				Services.gestionGrupos.agregarLineasSuccessCallback(json, mostrarTablas,nextStep, {text : currentModalData.texto});
				formElementsModales['agregarLineas']['sending'] = false;

				processCompleted = true;
			}

			function onError(jqXHR, textStatus, errorThrown){
				Services.gestionGrupos.getAgregarLineasFailResponse(errorThrown);
				formElementsModales['agregarLineas']['sending'] = false;
			}

			function mostrarTablas(data){

				if(data.success.length>0){
					$('#modal-agregar-lineas .step-3 .total-lineas-success').html(data.success.length);
				
					$('#modal-agregar-lineas .step-3 .added-lines .div-nal').html('');

					$.each(data.success, function( index, value ) {
					  $('#modal-agregar-lineas .step-3 .added-lines .div-nal').append('<div class="col-xs-12 col-sm-6"><p>'+value+'</p></div>');
					});

					$('#modal-agregar-lineas .step-3 .error-success').show();
			  		$('#modal-agregar-lineas .step-3 .added-lines').show();
				}

				if(data.error.length>0){
					$('#modal-agregar-lineas .step-3 .not-added-lines .div-nal').html('');

					$('#modal-agregar-lineas .step-3 .not-added-lines .div-nal').append('<div class="col-xs-6 col-sm-6"><p>	<b>Línea</b></p></div><div class="col-xs-6 col-sm-6"><p><b>Motivo</b></p></div>');

					$.each(data.error, function( index, value ) {
					  $('#modal-agregar-lineas .step-3 .not-added-lines .div-nal').append('<div class="col-xs-6 col-sm-6"><p>'+value.numero+'</p></div><div class="col-xs-6 col-sm-6"><p>'+value.motivo+'</p></div>');
					});

					$('#modal-agregar-lineas .step-3 .total-lineas-error').html(data.error.length);

			  		$('#modal-agregar-lineas .step-3 .error-msg').show();
			  		$('#modal-agregar-lineas .step-3 .not-added-lines').show();
			  	}

			}
		}

		function resetModal(){
			ingresarLineasComponent.reset();

			$('#modal-agregar-lineas .loading-block-screen').hide();
			$('#modal-agregar-lineas .step-1').show();
			$('#modal-agregar-lineas .step-2, #modal-agregar-lineas .step-3').hide();
			$('#modal-agregar-lineas .error-msg').hide();
			$('#modal-agregar-lineas .step-3 .error-success').hide();
			$('#modal-agregar-lineas .step-3 .info-added-lines').hide();
		}


		function nextStep(show, hide){
			$(hide).hide();
			$(show).show();
		}

	}
	/**Fin modal agregar líneas**/

	/**Inicio modal mover grupo**/
	function initmodalMoverGrupo(){
		// VARIABLE ARBOL HARDCODEADO

		var selectedGroup = { id: null , nombre: null, actual : null };

		modalMoverGrupo = new modalesTelcel($('#modal-mover-grupo'),{
			onInit : function(){
				setActions();
			},
			onReset : function(){
				resetSearchTree();
				resetTree();
				currentModalData = null;
				$('#modal-mover-grupo .single-msg').hide();
				$('#modal-mover-grupo .multiple-lines').hide();
				$('#modal-mover-grupo .multiple-lines .error-msg').hide();
			  	$('#modal-mover-grupo .multiple-lines .error-success').hide();
			  	$('#modal-mover-grupo .multiple-lines .info-added-lines').hide();
			},
			onOpen : function(){
				$('#modal-mover-grupo .grupo-txt-old').html(modalCurrentData.name);
				initTree();
				$('#modal-mover-grupo .multiple-lines .error-msg').hide();
			  	$('#modal-mover-grupo .multiple-lines .error-success').hide();
			  	$('#modal-mover-grupo .multiple-lines .info-added-lines').hide();
				resetFormModal($('#form-mover-grupo'), 'moverGrupo');
			}
		});

		function mobileNode(nodeId){
			if(nodeId!='#'){
				$('#tree-grupo').removeClass('current-root');
				$('#tree-grupo .jstree-node').removeClass('active-node');
				$('#tree-grupo #'+nodeId).addClass('active-node');
			}
			else{
				$('#tree-grupo .jstree-node').removeClass('active-node');
				$('#tree-grupo').addClass('current-root');
			}
		}


		function initTree(){

			$('#tree-grupo')
			.on("changed.jstree", function (e, data) {
				if(data.selected.length) {
					selectedGroup.id = data.selected[0];
					selectedGroup.nombre = data.instance.get_node(data.selected[0]).text;
					$('#btn-mover-grupo').prop('disabled', false);
				}
			})
			.bind("open_node.jstree", function (event, data) { 
			  mobileNode(data.node.id); 

			  if(is_mobile()){
			  	selectedGroup.id = data.node.id;
				selectedGroup.nombre = data.node.text;
				$('#btn-mover-grupo').prop('disabled', false);
			  }

			})
			.bind("close_node.jstree", function (event, data) { 
			  mobileNode(data.node.parent); 
			})
			.jstree({
				'core' : {
					'check_callback' : true,
					'data' : {
						"dataType" : "json",
						"url" : function (node) {
					      return node.id === '#' ?
					        Services.apiURL.arbolGruposRoot() :
					        Services.apiURL.arbolGruposChildren() ;
					    },
						"data" : function (node) {

							return { "id" : node.id };
						}
					},
					"multiple" : false
				}
			});

			$('#tree-grupo').addClass('current-root');

			// ARBOL DEL BUSCADOR
			$('#tree-grupo-search').hide();

			$('#tree-grupo-search')
			.on("changed.jstree", function (e, data) {
				if(data.selected.length) {

					selectedGroup.id = data.instance.get_node(data.selected[0]).id;
					selectedGroup.nombre = data.instance.get_node(data.selected[0]).text;

					var instance = $('#tree-grupo').jstree(true);
					instance.deselect_all();
					instance.select_node(selectedGroup.id);

					$('#btn-mover-grupo').prop('disabled', false);
				}
			})
			.bind("refresh.jstree", function (event, data) {
				var search = $('#modal-mover-grupo .search-input').val();

		        $('#tree-grupo-search').jstree("open_all");
		        $('#tree-grupo-search').jstree('search', search);

		        $('#tree-grupo-search .jstree-search').each(function( index ) {
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
					"multiple" : false
				},
				'plugins' : ["noclose", "search"],
				'search': {
					"case_insensitive": true,
            		"show_only_matches" : true
				}
			});

			// FIN ARBOL BUSCADOR
		}



		function setActions(){
			$('#btn-mover-grupo').prop('disabled', true);

			//EJECUTAR MOVER GRUPO
			$('#modal-mover-grupo').on('click', '#btn-mover-grupo', function(){

				if(selectedGroup.id!=0){
					postMoverGrupo('#modal-mover-grupo #form-mover-grupo');
				}
			});

			//EJECUTAR BUSQUEDA
			$("#modal-mover-grupo .btn-search").click(function() {

		        var searchString = $('#modal-mover-grupo .search-input').val();

		        if(searchString!=''){
		       		searchTree(searchString);
		        }

		    });

			//CAMBIAR ESTADO DEL BOTÓN Y DEL ARBOL DEPENDIENDO DEL SEARCH INGRESADO
		    $("#modal-mover-grupo .search-input").keyup(function() {

		        var searchString = $('#modal-mover-grupo .search-input').val();
		        var $input = $(this);
		        var min = (typeof $input.data('min') != 'undefined' ? $input.data('min') : 1);
		        if(searchString.length>=min){
		        	$('#modal-mover-grupo .btn-search').prop('disabled', false);	
		        }
		       	else{
		       		$('#modal-mover-grupo .btn-search').prop('disabled', true);
		       		//resetSearchTree();
		       	}

		    });

		    //BORRAR BUSQUEDA
		    $("#modal-mover-grupo").on('click', '.btn-remover-busqueda',function() {
		       	resetSearchTree();
		    });
		    
		}

		function resetSearchTree(){
			$('#modal-mover-grupo .search-input').val('');
		    $('#modal-mover-grupo .btn-remover-busqueda').removeClass('active');
		    $('#modal-mover-grupo .btn-search').prop('disabled', true);
		    $('#tree-grupo-search').hide();
		    $('#tree-grupo').show();
		}

		function resetTree(){

			$('#tree-grupo').jstree("deselect_all");
			$('#tree-grupo-search').jstree("deselect_all");

			$('#tree-grupo').jstree("destroy").empty();
			$('#tree-grupo-search').jstree("destroy").empty();

			selectedGroup = { id: null , nombre: null, actual : null };
			$('#btn-mover-grupo').prop('disabled', true);
		}

		function mostrarTablas(data){

				if(data.success.length>0){
					$('#modal-mover-grupo .multiple-lines .total-lineas-success').html(data.success.length);
					
					$('#modal-mover-grupo .multiple-lines .added-lines .div-nal').html('');

					$.each(data.success, function( index, value ) {
					  $('#modal-mover-grupo .multiple-lines .added-lines .div-nal').append('<div class="col-xs-12 col-sm-6"><p>'+value+'</p></div>');
					});

					$('#modal-mover-grupo .multiple-lines .error-success').show();
			  		$('#modal-mover-grupo .multiple-lines .added-lines').show();
				}

				if(data.error.length>0){
					$('#modal-mover-grupo .multiple-lines .not-added-lines .div-nal').html('');

					$('#modal-mover-grupo .multiple-lines .not-added-lines .div-nal').append('<div class="col-xs-6 col-sm-6"><p>	<b>Línea</b></p></div><div class="col-xs-6 col-sm-6"><p><b>Motivo</b></p></div>');

					$.each(data.error, function( index, value ) {
					  $('#modal-mover-grupo .multiple-lines .not-added-lines .div-nal').append('<div class="col-xs-6 col-sm-6"><p>'+value.numero+'</p></div><div class="col-xs-6 col-sm-6"><p>'+value.motivo+'</p></div>');
					});

					$('#modal-mover-grupo .multiple-lines .total-lineas-error').html(data.error.length);

			  		$('#modal-mover-grupo .multiple-lines .error-msg').show();
			  		$('#modal-mover-grupo .multiple-lines .not-added-lines').show();

			  	}

			}


		function postMoverGrupo(form){

			if(!formElementsModales['moverGrupo']['sending']){

				formElementsModales['moverGrupo']['sending'] = true;

				$('#btn-mover-grupo').prop('disabled', true);
				
				generalLoadingIcon(form, true);
				
				var oldMove = '';

				if( typeof currentModalData != 'undefined' && currentModalData != null){
					_mpoAccionMasiva.data = currentModalData.id;
					_mpoAccionMasiva.is_line = (typeof currentModalData.is_line != 'undefined' && currentModalData.is_line ? true : false );
					oldMove = currentModalData.texto;
				}
				else{
					_mpoAccionMasiva.is_line = true;
					oldMove = _mpoAccionMasiva.data.toString();
				}


				
				var postURL = Services.apiURL.moverGrupo();

				$.post( postURL , { id: selectedGroup.id, related : _mpoAccionMasiva })
				  .done(function( json ) {

				  	Services.gestionGrupos.moverGrupoSuccessCallback(json, form, appendErrorGeneral, mostrarTablas, { moverLineas : _mpoAccionMasiva.is_line && Object.prototype.toString.call(_mpoAccionMasiva.data) === "[object Array]", oldMove : oldMove, grupo : selectedGroup.nombre });
				  	formElementsModales['moverGrupo']['sending'] = false;
				  	generalLoadingIcon(form, false);

				  })
				  .fail(function( jqxhr, textStatus, error ) {
				  	Services.gestionGrupos.moverGrupoFailCallback(error, form);
				  	formElementsModales['moverGrupo']['sending'] = false;
				  	generalLoadingIcon(form, false);
				});

			}
		}

		function searchTree(search){
			//

			if(!formElementsModales['buscarArbolGrupo']['sending']){

				var form = '#modal-mover-grupo .tree-groups-asoc';

				formElementsModales['buscarArbolGrupo']['sending'] = true;

				$('#btn-mover-grupo').prop('disabled', true);
				
				generalLoadingIcon(form, true);

				var urlPOST = Services.apiURL.arbolGruposBusqueda();

				$.post( urlPOST , { search: search })
				  .done(function( json ) {

				  	Services.gestionGrupos.busquedaArbolGruposSuccessCallback(json);

				  	formElementsModales['buscarArbolGrupo']['sending'] = false;
				  	generalLoadingIcon(form, false);

				  })
				  .fail(function( jqxhr, textStatus, error ) {
				  	Services.gestionGrupos.busquedaArbolGruposFailCallback(error);
				  	formElementsModales['buscarArbolGrupo']['sending'] = false;
				  	generalLoadingIcon(form, false);
				});

			}
		}
	}
	/**Fin modal mover grupo**/


	function resetFormModal($form, form){
		$form.find('.general-error-tooltip').remove();
		$form.find("input[type=text], input[type=email], input[type=password], select").val("");
		$form.find("input[type=text], input[type=email], input[type=password], select").removeClass("error").removeClass("error-dd");
		$form.find('button[type="submit"]').prop('disabled', true);
		$form.removeClass('success').removeClass('error').show();

		if(formElementsModales[form]['validator']){
			formElementsModales[form]['validator'].resetForm();
		}
	}


	//Variable que guarda la Data de la Cuenta/Grupo/Alias/Línea a Editar
	var modalCurrentData = {};

	// FIN MODALES


	function setActionsGenerales(){

		// MOSTRAR OPCIONES DE CONFIGURACIÓN

		$('body').on('click', '.mosaico-view .item-mv', function(e){
			if(is_mobile()){
				e.stopPropagation();
				var $element = $(this).find('.see-more-gt');
				var url = $element.prop('href');
		
				window.location.href = url;
			}
		});

		$('.group-list-block').on('click', '.btn-gear', function(e){
			e.stopPropagation();
			cancelEditName();
			var $element = $(this).closest('.group-block');
			$('.group-block').removeClass('active');
			$('.general-group-options-container').removeClass('active');
			$('body').addClass('settings-open');
			$element.addClass('active');

			if(is_mobile())
				$('body').addClass('fixed-body');

		});

		// ESCONDER OPCIONES DE CONFIGURACIÓN
		$('.group-list-block').on('click', '.icon-text-ri', function(e){
			e.stopPropagation();
			var $element = $(this).closest('.group-block');
			$element.removeClass('active');
		});

		// ESCONDER OPCIONES DE CONFIGURACIÓN GENERAL
		$('.general-group-options-container').on('click', '.icon-text-ri', function(e){
			e.stopPropagation();
			var $element = $('.general-group-options-container');
			$element.removeClass('active');
		});

		$('.general-group-options-container').on('click', '.btn-open-general-config', function(e){
			cancelEditName();
			e.stopPropagation();
			var $element = $('.general-group-options-container');
			$('.group-block').removeClass('active');
			$('.row-ls').removeClass('active-settings');

			$('body').addClass('settings-open');
			$element.addClass('active');

			if(is_mobile())
				$('body').addClass('fixed-body');

		});

		$('body').on('click', '.settings-ri', function(e){			
			if(is_mobile()){
				e.stopPropagation();
				$('.general-group-options-container').removeClass('active');
				$('.group-block').removeClass('active');
				$('.row-ls').removeClass('active-settings');
				$('.settings-ri').removeClass('active');
				$('body').removeClass('fixed-body');
				$('body').removeClass('settings-open');
			}
		});

		// FUNCIONAMIENTOS LISTADO DE RESULTADOS
		$('.lista-results .settings-ico-ls, .group-list-settings .settings-ico-ls').on('click', 'button', function(e){
			e.stopPropagation();
			var $element = $(this).closest('.row-ls');
			$('.general-group-options-container').removeClass('active');
			$('.row-ls, .group-list-settings .settings-ico-ls').removeClass('active-settings');
			
			$('body').addClass('settings-open');
			$element.addClass('active-settings');

		});

		$('.lista-results, .group-list-settings').on('click', '.icon-text-ri', function(){
			var $element = $(this).closest('.row-ls');
			$element.removeClass('active-settings');
		});

		$('.lista-results .arrow-ico-ls, .group-list-settings .arrow-ico-ls').on('click', 'button', function(){
			var $element = $(this).closest('.row-ls');
			
			if($element.hasClass('active-ls')){
				$element.removeClass('active-ls');
				$(this).find('span').removeClass('i-angle-up');
			}
			else{
				$('.lista-results .row-ls, .group-list-settings .row-ls').removeClass('active-ls');
					$('.lista-results .arrow-ico-ls span, .group-list-settings .arrow-ico-ls span').removeClass('i-angle-up');
				$element.addClass('active-ls');
				$(this).find('span').addClass('i-angle-up');
			}


		});

		$('.manage-particular-options').on('click', '.btn-show-mpo', function(){
			var $element = $(this).closest('.manage-particular-options');
			$element.toggleClass('active');
			$(this).find('.icon').toggleClass('i-angle-up');
		});
		

		//FIN FUNCIONAMIENTOS LISTADO DE RESULTADOS

		// CAMBIAR A VISTA MOSAICO
		$('body').on('click', '#vista-mosaico', function(){
			cancelEditName();
			currentView = 'mosaico';
			$('#vista-mosaico').removeClass('active');
			$('#vista-lista').addClass('active');
			$('#main-view-block').removeClass('group-row-block').addClass('group-list-block');
			// paginacion.updateItemsPerPage(0);
			// paginacion.reset();
		});

		// CAMBIAR A VISTA LISTA
		$('body').on('click', '#vista-lista', function(){
			cancelEditName();
			currentView = 'lista';
			$('#vista-lista').removeClass('active');
			$('#vista-mosaico').addClass('active');
			$('#main-view-block').removeClass('group-list-block').addClass('group-row-block');
			// paginacion.updateItemsPerPage(10);
			// paginacion.reset();
		});

		// ABRIR MODAL AGREGAR GRUPO
		$('body').on('click', '.btn-add-grupo', function(){
			cancelEditName();
			setBasicInfoModal($(this).data('item'));
			$('#modal-agregar-grupo .grupo-type').html('grupo');
			modalAgregarGrupo.openModal();
		});
		
		// ABRIR MODAL AGREGAR GRUPO
		$('body').on('click', '.btn-add-subgrupo', function(){
			cancelEditName();
			var $element = ($(this).closest('.group-block').length>0 ? $(this).closest('.group-block') : ($(this).closest('.row-ls').length>0 ? $(this).closest('.row-ls') : $(this).closest('.general-group-options-container')));
			setBasicInfoModal($element.data('item'));
			
			if($element.hasClass('general-group-options-container'))
				$('#modal-agregar-grupo .grupo-type').html('grupo');
			else
				$('#modal-agregar-grupo .grupo-type').html('subgrupo');
			
			modalAgregarGrupo.openModal();
		});

	}

	function setBasicInfoModal(item){
		currentModalData = item;
		$('.modal-mte .alias-text, .modal-mte .txt-grupo').html(item.texto);
	}

	function setBasicInfoParent(item){
		var itemData = item;
		$('.parent-text').html(itemData.texto);
	}

	function getElementId($element, selector){
		var id = $element.data('eid');
		var el = document.querySelector(selector);
		el.setAttribute('data-modaleid', id);
		return id;
	}


	function setActionsConfiguracion(){

		var $elmodal = $('#modal-configurar-administrador');

		$('.settings-ri .submenu-ri').on('click', 'button', function(){
			$('.group-block').removeClass('active');
		});


		// ABRIR EL CONFIGURAR ADMINISTRADOR 
		$('body').on('click', '.btn-configurar-administradores', function(){
			var $element = ($(this).closest('.group-block').length>0 ? $(this).closest('.group-block') : ($(this).closest('.row-ls').length>0 ? $(this).closest('.row-ls') : $(this).closest('.general-group-options-container')));
			setBasicInfoModal($element.data('item'));
			modalAdministradores.openModal();
		});

		// ABRIR EL CUENTAS ASOCIADAS
		$('body').on('click', '.btn-cuentas-asociadas', function(){

			var $element = ($(this).closest('.group-block').length>0 ? $(this).closest('.group-block') : ($(this).closest('.row-ls').length>0 ? $(this).closest('.row-ls') : $(this).closest('.general-group-options-container')));
			setBasicInfoModal($element.data('item'));
			modalCuentasAsociadas.openModal();

		});

		// ABRIR ELIMINAR ALIAS
		$('body').on('click', '.btn-eliminar-alias', function(){
			var $element = ($(this).closest('.group-block').length>0 ? $(this).closest('.group-block') : ($(this).closest('.row-ls').length>0 ? $(this).closest('.row-ls') : $(this).closest('.general-group-options-container')));
			setBasicInfoModal($element.data('item'));
			modalEliminarAlias.openModal();
		});

		$('body').on('click', '.btn-general-solicitud-descarga', function(){
			var $element = ($(this).closest('.group-block').length>0 ? $(this).closest('.group-block') : ($(this).closest('.row-ls').length>0 ? $(this).closest('.row-ls') : $(this).closest('.general-group-options-container')));
			setBasicInfoModal($element.data('item'));
			modalDescargarFacturas.openModal();
		});


		// ABRIR EL ELIMINAR GRUPO
		$('body').on('click', '.btn-eliminar-grupo', function(){
			var $element = ($(this).closest('.group-block').length>0 ? $(this).closest('.group-block') : ($(this).closest('.row-ls').length>0 ? $(this).closest('.row-ls') : $(this).closest('.general-group-options-container')));
			setBasicInfoModal($element.data('item'));

			var parentData = $element.data('parent');

			if(typeof parentData =='undefined'){
				$parent = $('#group-data-info');
				parentData = $element.data('item');
			}

			setBasicInfoParent(parentData);
			modalEliminarGrupo.openModal();
		});

		// ABRIR AGREGAR LINEAS
		$('body').on('click', '.btn-agregar-lineas', function(){
			var $element = ($(this).closest('.group-block').length>0 ? $(this).closest('.group-block') : ($(this).closest('.row-ls').length>0 ? $(this).closest('.row-ls') : $(this).closest('.general-group-options-container')));
			setBasicInfoModal($element.data('item'));
			modalAgregarLineas.openModal();
		});

		
		//CAMBIAR NOMBRE
		$('body').on('click', '.btn-cambiar-nombre', function(){
			var $element = ($(this).closest('.group-block').length>0 ? $(this).closest('.group-block') : ($(this).closest('.row-ls').length>0 ? $(this).closest('.row-ls') : $(this).closest('.general-group-options-container')));
			setBasicInfoModal($element.data('item'));
			modalMoverGrupo.openModal();
		});

		// ABRIR AGREGAR LINEAS
		$('body').on('click', '.btn-mover-grupo', function(){
			var $element = ($(this).closest('.group-block').length>0 ? $(this).closest('.group-block') : ($(this).closest('.row-ls').length>0 ? $(this).closest('.row-ls') : $(this).closest('.general-group-options-container')));
			setBasicInfoModal($element.data('item'));
			$('#modal-mover-grupo .sublevel-tm').show();
			modalMoverGrupo.openModal();
		});

		$('body').on('click', '.btn-single-action', function(){
			var $button = $(this),
			postURL = (typeof $button.data('post') != 'undefined' ? $button.data('post') : null);
			
			if(postURL != null)
			//Aquí mandar el valor de la línea a modificar
				window.location.href = postURL;

		});
		
		$elmodal.on('click', '.m-btn-close-modal', function(){
			modalAdministradores.closeModal();
		});

		// Mostrar modal de agregar usuario
		$elmodal.on('click', '#btn-show-modal-usuario', function(){
			modalAgregarAdmin.openModal();
		});
	}

	var editandoNombre = false,
	$closestGuardarElement = null,
	$closestEditarBtn = null,
	editandoNombreValor = null,
	beforeEditando = null;

	function checkActiveElementEditName($element){
		return (
			$element.hasClass('name-container') && $element.hasClass('name-container') 
			|| $($element).parents('.ribbon').length 
			|| ($element.hasClass('error-tooltip') 
				|| $element.parent().hasClass('error-tooltip'))
		);
	}

	function cancelEditName(){
		editandoNombre = false;
		var $elementos_activos = $('.group-block .name-container.active-edit');
		returnEditaNamePreviousValue($elementos_activos);

		$('.group-block').find('.name-container').removeClass('active-edit');
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

	function checkElementToEdit(){
		editandoNombre = false;
		if($closestEditarBtn!=null){
			$closestEditarBtn.find('.name-container').addClass('active-edit');
			editandoNombre = true;
			editandoNombreValor = $closestEditarBtn.find('input.editar-alias').val();
			$closestGuardarElement = $closestEditarBtn.closest('.group-block').find('.btn-guardar-nombre');
			$closestEditarBtn = null;
		}
	}

	function setActionsEditName(){
		// EDITAR NOMBRE EN MOSAICO
		$('.group-list-block').on('click', '.btn-editar-nombre', function(e){
			e.stopPropagation();
			var $element = $(this).closest('.group-block');

			if(!editandoNombre){
				$element.find('.name-container').addClass('active-edit');
				editandoNombre = true;
				$closestGuardarElement = $element.closest('.group-block').find('.btn-guardar-nombre');
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

		// GUARDAR NOMBRE EN MOSAICO
		$('.group-list-block').on('click', '.btn-guardar-nombre', function(e){
			e.stopPropagation();
			var $element = $(this).closest('.group-block');
			verifyName($element);	
		});

		$('.group-list-block').on('keydown','.editar-alias', function (e) {
			var $input = $(this);

			var $errori = $('.error-tooltip.nombre-error');

			if($errori.length>0){
				$input.removeClass('error').removeClass('error-dd');
				$errori.remove();
			}

		    if (e.keyCode === 13) { //Si es enter
		        var $element = $(this).closest('.group-block');
		        $closestGuardarElement = null;
				verifyName($element);
		    }
		});

		$('.group-list-block .editar-alias').bind('keyup', function (e) {
			var $input = $(this);
			validateNameOnInput($input);
		});


	}

	function initDetalleLinea(){

		//checkRequiredElements('.editar-nombre-form');
		setActions();

		function validNameLinea(value){
			return (/^[A-Za-zá-úÁ-Ú0-9\-.'ñ \s]+$/i.test( value ));
		}

		function validateNameLineaOnInput($input){
			var value = $input.val();
			var $element = $input.closest('.editar-nombre-form');
			var $button = $element.find('.btn-guardar-nombre');

			if(validNameLinea(value)){
				$element.find('.triangle-tooltip').remove();
				$input.removeClass('error');
				$button.prop('disabled', false);
			}
			else{
				$button.prop('disabled', true);
				appendError($element, $input, 'Es necesario ingresar el nombre.');
			}
			
		}

		function appendError($e, $i, message){
			if($e.find('.triangle-tooltip').length == 0){
				var errorhtml = '<div class="triangle-tooltip error-tooltip triangle-bottom nombre-error"><p>'+message+'</p></div>';
				$e.append(errorhtml);
				$i.addClass('error');
			}
		}

		function verifyNameLinea($element){
			var $input = $('.editar-nombre-form #editar-nombre');
			var value = $input.val();
			var id = $element.data('item').id;
			var form = '.edit-line-info .editar-nombre-form';
			
			if(validNameLinea(value)){

				$element.find('.triangle-tooltip').remove();
				$input.removeClass('error');

				var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;

				$.post( urlPOST , { edit: value, id: id })
				  .done(function( json ) {
				  	Services.gestionGrupos.editarNombreLineaSuccessCallback(json, value, appendError, {input : $input, element : $element });
				  })
				  .fail(function( jqxhr, textStatus, error ) {
				  	Services.gestionGrupos.editarNombreLineaFailCallback(error);
				});
			}
		}

		function setActions(){

			$( ".editar-nombre-form" ).submit(function(e) {
			 	e.preventDefault();
			 	var $element = $(this);
			 	verifyNameLinea($element);
			
			});

			// EDITAR NOMBRE EN MOSAICO
			$('.block-eli-admin').on('click', '.btn-editar-nombre', function(){
				var $element = $('.editar-nombre-form');
				$element.addClass('active-edit');
			});

			$('.block-eli-admin').on('click', '.toggle-config', function(e){
				e.stopPropagation();
				var $button = $(this);
				var $element = $button.next('.settings-ri');
				$element = ($element.length>0 ? $element : $button.closest('.settings-ri'));
				$element.toggleClass('active');
				$('body').addClass('settings-open');
				// if($element.hasClass('active'))
				// 	$element.removeClass('active')
				// else
				// 	$element.addClass('active');

			});

			$('.block-eli-admin .editar-nombre').bind('input keyup', function (e) {
				var $input = $(this);
				validateNameLineaOnInput($input);
			});
		
		}

		function updateNombre(){

			var value = $('.editar-nombre-form #editar-nombre').val();
			var id = $('.editar-nombre-form').data('id');

			var data = { success : true, data : [] };

			$.post( postURL , { edit: value, id: id })
			  .done(function( json ) {

			    //SETEO SUCCESS TRUE HARDCODEADO
			  	//aqui iría el data que regrese el json
			  	data.success = true;
			  	
			  	if(data.success){
			  		$('.name-toedit-eli').html(value);
			  		$('.editar-nombre-form').removeClass('active-edit');
			  		// Guardar el nombre
			  	}
			  	else{
			  		//JSON SUCCESS FALSE
			  	}

			  })
			  .fail(function( jqxhr, textStatus, error ) {
			  	//Mensaje de error del SISTEMA
			});
		}
	}

	if($('.edit-line-info').length>0){
		initDetalleLinea();
	}


	function setActions(){
		setActionsGenerales();
		setActionsEditName();
		setActionsFilter();
		setActionsSearch();
		setActionsConfiguracion();

		if($('#detalle-grupo-block').length>0){
			generalCheckBoxAll.inicializar();
			setActionsCheckbox();
		}
	}

	function setActionsCheckbox(){

		$('.manage-particular-options .childs-mpo .btn-mover-grupo-mpo').click(function(e){
			modalCurrentData = {};
			e.stopPropagation();
			_mpoAccionMasiva = generalCheckBoxAll.getCheckedElements();
			$('#modal-mover-grupo .sublevel-tm').hide();
			modalMoverGrupo.openModal();
		});


		$('.manage-particular-options .childs-mpo .btn-mpo-masivo').click(function(e){
			
			var $button = $(this),
			postDataTo = (typeof $button.data('post') != 'undefined' ? $button.data('post') : null);

			if(postDataTo != null){
				modalCurrentData = {};
				e.stopPropagation();
				 _mpoAccionMasiva = generalCheckBoxAll.getCheckedElements();

				Services.gestionGrupos.enviarDatosAutogestionMasivosPost(_mpoAccionMasiva, postDataTo);
			}

		});
	}
	
	function setActionsFilter(){

		$('#orderby').change(function(){
			var opciones = $(this).find(":selected").data('value');
			orderItems(opciones);
		});

		$('#orderby-query').change(function(){
			var opciones = $(this).find(":selected").data('value');
			orderItemsQuery(opciones);
		});

		$('.order-by-query-btn button').click(function(){
			var opciones = $(this).data('opc');
			orderItemsQuery(opciones);
		});

		$('#orderby-gestiongrupos').click(function(){
			cancelEditName();
		});

		$('#orderby-gestiongrupos').change(function(){
			var opciones = $(this).find(":selected").data('value');
			var $main = $(".mosaico-view");
			var $children = $main.children(".item-mv");
			orderItemsE(opciones, $main, $children, '.group-block');
		});

		$('#orderby-gestiongrupos-a').change(function(){
			var opciones = $(this).find(":selected").data('value');
			var $main = $(".lista-results .content-ls");
			var $children = $main.children(".row-ls");
			orderItemsE(opciones, $main, $children);
		});

	}

	function orderItemsE(opc, $main, $children, element){
		$children.detach().sort(function(a, b) {

			if(typeof element!= 'undefined'){
			   var aData = $(a).find(element).data('item');
			   var bData = $(b).find(element).data('item');
			}
			else{
				var aData = $(a).data('item');
				var bData = $(b).data('item');
			}
		   
		   if(opc.key != 'texto' && opc.key != 'responsable' && opc.key != 'asignado' && opc.key != 'titular')
		  		return Number(aData[opc.key]) > Number(bData[opc.key]) ? 1 : -1;
		  	else
		  		return aData[opc.key] > bData[opc.key] ? 1 : -1;

		});

		if(opc.orderby == 'desc')
			$main.append($children.get().reverse());
		else
			$main.append($children);

		// opc.key
		// opc.orderby
	}

	function orderItemsModal(opc, elementos){
		var dataOrdered = elementos;

		dataOrdered = sortByAZ(dataOrdered, opc.key);

		if(opc.orderby == 'desc')
			dataOrdered.reverse();

		return dataOrdered;
	}

	function validName(value){
		var validation = {
			empty : { test : value.length>0 , message: 'Es necesario ingresar un nombre para el grupo.' },
			name : 	{ test : /^[A-Za-zÑñ]*[A-Za-zNñ-\s]*[A-Za-zNñ]$/i.test( value ), message: 'El nombre no debe tener caracteres especiales, números y espacio al inicio o final.' },
			minlength :{ test : value.length>=5 , message: 'El nombre debe tener al menos 5 caracteres.' }
		};
		
		return validation.name.test && validation.minlength.test && validation.empty.test;
	}

	function validNameMsg(value){
		var validation = {
			empty : { test : value.length>0 , message: 'Es necesario ingresar un nombre para el grupo.' },
			name : 	{ test : /^[A-Za-zÑñ]*[A-Za-zNñ-\s]*[A-Za-zNñ]$/i.test( value ), message: 'El nombre no debe tener caracteres especiales, números y espacio al inicio o final.' },
			minlength :{ test : value.length>=5 , message: 'El nombre debe tener al menos 5 caracteres.' }
		};

		return ( !validation.empty.test ? validation.empty.message : ( !validation.name.test ? validation.name.message : validation.minlength.message) );
	}

	function validateNameOnInput($input){
		var value = $input.val();
		var $element = $input.closest('.group-block');
		var $button = $input.next('.btn-guardar-nombre');

		if(validName(value)){
			$element.find('.triangle-tooltip').remove();
			$input.removeClass('error');
			$button.prop('disabled', false);
		}
		else{
			$button.prop('disabled', true);
			appendError($element, $input, validNameMsg(value));
			console.log(validNameMsg(value));
		}
	}

	function appendError($e, $i, message){
		if($e.find('.triangle-tooltip').length == 0){
			var errorhtml = '<div class="triangle-tooltip error-tooltip triangle-bottom nombre-error"><p>'+message+'</p></div>';
			$e.append(errorhtml);
			$i.addClass('error');
		}
	}

	function verifyName($element){
		var $input = $element.find('.editar-alias');
		var value = $input.val();
		var id = $element.data('item').id;

		if(validName(value)){

			$element.find('.triangle-tooltip').remove();
			$input.removeClass('error');

			var urlPOST = Services.apiURL.editarNombreGrupo();

			$.post( urlPOST , { edit: value, id: id })
			  .done(function( json ) {
			  	Services.gestionGrupos.editarNombreGrupoSuccessCallback( json, value, appendError, {input : $input, element : $element });
			  	//Checar si hay algún elemento que se quiere editar
			  	$input.blur();
				$input.focusout();
			  	checkElementToEdit();
			  	updateBlock($element);
			  })
			  .fail(function( jqxhr, textStatus, error ) {
			  	Services.gestionGrupos.editarNombreGrupoFailCallback( error );
			});
		}
		else if(editandoNombre && editandoNombreValor!=null){
			$input.val(editandoNombreValor);
			$closestGuardarElement.trigger('click');
			editandoNombreValor = null;
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

	var validNotEmpty = [];
	var searchby = [];
	var currentSearch = [];

	function setActionsSearch(){

		function addActionSearch($parent, i){

			$parent.find('button[type="submit"]').click(function(){
				var search = $parent.find('.search-input-block .search-input-'+searchby[i].key).val();
				var query = '?search-by='+searchby[i].key+'&search='+search;
				window.location.href = (location.hostname!='localhost' ? '/cliente/2016/mi-telcel-empresas' : '' )+'/sections/gestion-grupos/'+searchby[i].view+query;
			});
		}

		function getUrlNoQuery(){
			
			var url = window.location.href.split('?')[0];
			return url;
		}

		$('.search-by-container').each(function (index) { 
			var $container = $(this);
			$container.data('searchi', index);
			validNotEmpty[index] = true;
			searchby[index] = null;
			currentSearch[index] = '';


			//resetSearchInput($container, index);

			$container.find('.search-input-block input').each(function (i) { 
			  	var $element = $(this);
			  	validateNotEmptySearch($element, index, $container);
			});
			
			// if($container.hasClass('gestion-cuentas-search')){
			// 	addActionSearch($container, index);
			// }

			$container.find('.searchby').change(function(){


				searchby[index] = $(this).find(":selected").data('value');
				resetSearchInput($container, index);
				setPostUrl( $container, index);

				if(typeof searchby[index] !='undefined')
					$container.find('.search-input-block .search-input-'+searchby[index].key).show();

			}).click(function(){
				cancelEditName();
			});

			$container.find('input').click(function(){
				cancelEditName();
			});

			
			initCheckInputRegex();
			
			var $firstSelected = $container.find(":selected");

			if($firstSelected.val()==''){
				//resetSearchInput($container, index);
				//Seleccionar la primera
				$container.find('option:nth-child(2)').prop("selected", true);
				$firstSelected = $container.find(":selected");
				//Fix safari
				if($firstSelected.length>1)
					$firstSelected = $container.find(":selected:nth-child(2)");
				//Fin fix safari
				
			}
			
			searchby[index] = $firstSelected.data('value');
			
			
			$container.find('.search-input-block .search-input-'+searchby[index].key).show();

			//Seleccionar primera opcion
		});

	}

	function resetSearchInput($parent, i){
		validNotEmpty[i] = true;
		$parent.find('.search-input-block input[type="text"], .search-input-block input[type="number"]').val('');
		$parent.find('.search-input-block input[type="text"], .search-input-block input[type="number"]').hide();
		$parent.find('.search-input-block button[type="submit"]').prop('disabled', true);
	}

	function validateNotEmptySearch($element, i, $container){

		$element.bind('input', function() {

			if(searchby[i] && $container.find('.search-input-'+searchby[i].key) ){
				var ivalue = $container.find('.search-input-'+searchby[i].key).val();

				currentSearch[i] = ivalue;

				if (ivalue.length>=searchby[i].min) 
					validNotEmpty[i] = false;
				else
					validNotEmpty[i] = true;
			}

			disableSumbitButton($container.closest('.search-by-container'), validNotEmpty[i]);

		});

	}

	function setPostUrl( $parent, i){
		var $form = $parent.closest('.wrapper-gfsc');
		$form.prop('action',  searchby[i].view)
	}

	function orderItems(opc){
		if(opc.key == 'nombre')
			dataFiltered = sortByAZ(dataFiltered, opc.key);
		else
			dataFiltered = sortByNumber(dataFiltered, opc.key);

		if(opc.orderby == 'desc')
			dataFiltered.reverse();

		paginacion.updateItems(dataFiltered);
		paginacion.reset();

	}

	return{
		inicializar : init
	}

})();