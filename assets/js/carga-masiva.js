var cargaMasivaGrupos = (function(){
	var $treeLineas = $('#tree-lineas'),
	elementsForm = {
		id : null,
		validator : null,
		sending: false
	};

	var modalRevertir = null,
	$arbolData = $('#v-arbol-data'),
	confirmarRevertir = false;
	
	function initModalRevertir(){

		modalRevertir = new modalesTelcel($('#modal-revertir'),{
			onInit : function(){
				setActions();
				setModalData();
				
			},
			onReset : function(){
			},
			onOpen : function(){
			}
		});

		function setActions(){
			$('#btn-confirmar-revertir').click(function(){
				confirmarRevertir = true;
				$('#form-carga-masiva-anterior').submit();
			});
		}

		function setModalData(){
			var date = $arbolData.data('date'),
			available = $arbolData.data('available');

			$('.v-arbol-date').html(date);
			$('.v-arbol-date-last').html(available);
		}

	}

	var modalNuevaEstructura = null,
	confirmarNuevaEstructura = false;
	
	function initModalNuevaEstructura(){

		modalNuevaEstructura = new modalesTelcel($('#modal-nueva-estructura'),{
			onInit : function(){
				setActions();
				
			},
			onReset : function(){
			},
			onOpen : function(){
			}
		});

		function setActions(){
			$('#btn-confirmar-nueva-estructura').click(function(){
				confirmarNuevaEstructura = true;
				$('#form-carga-masiva').submit();
			});
		}

	}

	function init(){
		if($treeLineas.length>0)
			initArbol();

		if($('#autogestion-form').length>0)
			initFormularioCargaMasiva();

		if($('#autogestion-form-confirmar').length>0)
			initFormularioCargaMasivaConfirmacion();

		if($('#modal-revertir').length>0)
			initModalRevertir();

		if($('#modal-nueva-estructura').length>0)
			initModalNuevaEstructura();

	}

	//Simular error de que es invalido el archivo
	function showInvalidErrorArchivo(){
		var msg = 'Este archivo está dañado o es ilegible, intenta con un nuevo archivo.';

		$('#archivo-invalido').remove();
		$('.lineas-archivo .extra-info').hide();
		$('.lineas-archivo .add-lines-ge-mod' ).append('<div class="error-dd error" id="archivo-invalido">'+msg+'</div>');
		$('#archivo').parent().addClass('error');

		$('#autogestion-form').find('button[type="submit"]').prop('disabled', true);
	}

	//FORMULARIO Carga Masiva
	function initFormularioCargaMasiva(){

		var $mainForm = $('#autogestion-form');

		var tipoIngreso = null;

		initActions();
		validateMainForm();

		function validateMainForm(){

			disableSumbitButton($mainForm, true);

			elementsForm['validator'] = 
				$mainForm.validate({
					  rules: {
						archivo: {
							required : {
								depends: function(element) {
									var motivo = $mainForm.find('.motivo-autogestion:checked').val();

				                	return motivo == 'estructura-nueva';
				                }
							},
							extension: "xls",
							filesize: 10000000
						},
						motivoAutogestion: {
							required: true
						}
					  },
					  messages: {
						 archivo: {
						   required: "Ingresa un archivo de 10 MB máximo.",
						   extension: "Ingresa un archivo con extensión: .xls",
						   filesize: "Ingresa un archivo de 10 MB máximo."
						 },
						 motivoAutogestion: {
						   required: "Selecciona un motivo.",
						 }
					   },
						errorClass : "error-dd error",
						errorElement : 'div',
						errorPlacement: function(error, element) {
							var elementInput = element[0];
							if(element[0]['id']==='archivo'){
								$('.lineas-archivo .extra-info').hide();
								error.appendTo( $('.lineas-archivo .add-lines-ge-mod' ));
								element.parent().addClass('error');

							}
						},
						success: function ($error) {
							if($error.length>0 && $('#archivo').val() != ''){
								$('.lineas-archivo .extra-info').hide();
								$('.lineas-archivo .file.error' ).removeClass('error');
				   				$error.remove();
							}
				        },
				        highlight : function(element, errorClass){
				        	var $element = $(element);
				        	if($element.attr('id')==='archivo' && $element.val() == ''){
				        		$('.lineas-archivo .extra-info').hide();
								$element.parent().addClass('error');
				        	}
				        },
				        submitHandler: function(form) {
							if(!elementsForm['sending']){
								sendFormData(form);
					  		}
						}
				});

				checkGeneralValidForm($mainForm);

				function sendFormData(form){
					elementsForm['sending'] = true;
					$(form).find('button[type="submit"]').prop('disabled', true);

					var self = $(form).serialize();

					var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
					
					/**Quitar una vez en producción y aqui solo checamos si es una línea en development para mandar a otra liga**/
					var sendTo = urlPOST;
					urlPOST = checkDevelopmentPostHTML(urlPOST);

					$.post(  urlPOST , self )
					.done(function( data ) {
					  	Services.gestionGrupos.cargaMasivaCallSuccess(data, form, sendTo, showInvalidErrorArchivo );
						elementsForm['sending'] = false;
					 })
					.fail(function( jqxhr, textStatus, error ) {
					  	//Mensaje de error del sistema
					  	Services.gestionGrupos.cargaMasivaCallFail(error, form);
					  	elementsForm['sending'] = false;
					});
				}	
		}


		function initActions(){

			/**
				Setea la info del Motivo
			**/
			var $lastStep = $('.carga-masiva-last-step');
			$('.motivo-autogestion').change(function() {
				var $checkbox = $(this);
				if(typeof ingresarLineasComponent != 'undefined')
					ingresarLineasComponent.reset();
				/**Quitar una vez en producción solo es para propositos de development y simular**/
				updateFormPostURL($checkbox.val());

				if($('.motivo-autogestion:checked').length>0){
					var current = $checkbox.val(),
					btntext = (typeof $checkbox.data('btn') != 'undefined' ? $checkbox.data('btn') : 'Subir archivo');

					if(current=='estructura-anterior')
						$lastStep.addClass('revertir-estructura');
					else
						$lastStep.removeClass('revertir-estructura');

					$('#autogestion-btn').html(btntext);
					$lastStep.addClass('active');
				}
				else
					$lastStep.removeClass('active');
			});

		}

		function resetMainForm(){

			$mainForm.find("input[type=text], input[type=email], input[type=password], select").val("");
			$mainForm.find("input[type=checkbox], input[type=radio]").prop("checked", false);
			$mainForm.find('button[type="submit"]').prop('disabled', true);
			
			if(elementsForm['validator']){
				elementsForm['validator'].resetForm();
			}
		}

	}	
	//FIN FORMULARIO Carga Masiva

	//FORMULARIO Carga Masiva
	function initFormularioCargaMasivaConfirmacion(){

		var $mainForm = $('#autogestion-form-confirmar');

		var tipoIngreso = null;

		initActions();
		validateMainForm();

		function validateMainForm(){

			disableSumbitButton($mainForm, true);

			elementsForm['validator'] = 
				$mainForm.validate({
					  rules: {
						archivo: {
							required : {
								depends: function(element) {
									var motivo = $mainForm.find('.motivo-autogestion:checked').val();

				                	return motivo == 'estructura-nueva';
				                }
							},
							extension: "xls",
							filesize: 10000000
						},
						motivoAutogestion: {
							required: true
						}
					  },
					  messages: {
						 archivo: {
						   required: "Ingresa un archivo de 10 MB máximo.",
						   extension: "Ingresa un archivo con extensión: .xls",
						   filesize: "Ingresa un archivo de 10 MB máximo."
						 },
						 motivoAutogestion: {
						   required: "Selecciona un motivo.",
						 }
					   },
						errorClass : "error-dd error",
						errorElement : 'div',
						errorPlacement: function(error, element) {
							var elementInput = element[0];
							if(element[0]['id']==='archivo'){
								$('.lineas-archivo .extra-info').hide();
								error.appendTo( $('.lineas-archivo .add-lines-ge-mod' ));
								element.parent().addClass('error');

							}
						},
						success: function ($error) {
							if($error.length>0 && $('#archivo').val() != ''){
								$('.lineas-archivo .extra-info').hide();
								$('.lineas-archivo .file.error' ).removeClass('error');
				   				$error.remove();
							}
				        },
				        highlight : function(element, errorClass){
				        	var $element = $(element);
				        	if($element.attr('id')==='archivo' && $element.val() == ''){
				        		$('.lineas-archivo .extra-info').hide();
								$element.parent().addClass('error');
				        	}
				        },
				        submitHandler: function(form) {
							if(!elementsForm['sending']){
								sendFormData(form);
					  		}
						}
				});

				checkGeneralValidForm($mainForm);

				function sendFormData(form){
					elementsForm['sending'] = true;
					$(form).find('button[type="submit"]').prop('disabled', true);

					var self = $(form).serialize();

					var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
					
					/**Quitar una vez en producción y aqui solo checamos si es una línea en development para mandar a otra liga**/
					var sendTo = urlPOST;
					urlPOST = checkDevelopmentPostHTML(urlPOST);

					$.post(  urlPOST , self )
					.done(function( data ) {
					  	Services.gestionGrupos.cargaMasivaCallSuccess(data, form, sendTo, showInvalidErrorArchivo );
						elementsForm['sending'] = false;
					 })
					.fail(function( jqxhr, textStatus, error ) {
					  	//Mensaje de error del sistema
					  	Services.gestionGrupos.cargaMasivaCallFail(error, form);
					  	elementsForm['sending'] = false;
					});
				}	
		}


		function initActions(){

			/**
				Setea la info del Motivo
			**/
			var $lastStep = $('.carga-masiva-last-step');
			$('.motivo-autogestion').change(function() {
				var $checkbox = $(this);
				if(typeof ingresarLineasComponent != 'undefined')
					ingresarLineasComponent.reset();

				if($('.motivo-autogestion:checked').length>0){
					var current = $checkbox.val(),
					btntext = (typeof $checkbox.data('btn') != 'undefined' ? $checkbox.data('btn') : 'Subir archivo');

					if(current=='continuar-con-lineas')
						$lastStep.addClass('revertir-estructura');
					else
						$lastStep.removeClass('revertir-estructura');

					$('#autogestion-btn').html(btntext);
					$lastStep.addClass('active');
				}
				else
					$lastStep.removeClass('active');



			});

		}

		function resetMainForm(){

			$mainForm.find("input[type=text], input[type=email], input[type=password], select").val("");
			$mainForm.find("input[type=checkbox], input[type=radio]").prop("checked", false);
			$mainForm.find('button[type="submit"]').prop('disabled', true);
			
			if(elementsForm['validator']){
				elementsForm['validator'].resetForm();
			}
		}

	}	
	//FIN FORMULARIO Carga Masiva

	function updateFormPostURL(value){

		var $masivo = $('#autogestion-form');

		var masivoPosts = {
			'estructura-nueva' : 'carga-masiva-2-a.html',
			'estructura-anterior' : 'carga-masiva-2-b.html',
		};

		$masivo.prop('action', masivoPosts[value]);
	}

	/**Inicio carga masiva**/
	function getDataArbol(){
		//Obtener los elementos seleccionados
		var result = $treeLineas.jstree('get_selected'); 

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
		treeCuentas = false,
		rootElements = [],
		allSelected = false;

		initActions();
		initTree();

		function initActions(){

			// $('#checkbox-all').change(function(){
			// 	var $all = $(this),
			// 	checked = $all.is(':checked');

			// 	if(checked){
			// 		$treeLineas.jstree("select_all");
			// 		allSelected = true;
			// 	}
			// 	else{
			// 		$treeLineas.jstree("deselect_all");
			// 		allSelected = false;
			// 	}
				
			// });

			// $('#btn-delete-all').click(function(){
			// 	deleteNodes();
			// });

			$('#form-carga-masiva-anterior').submit(function(e){
		   		e.preventDefault();
				if(!confirmarRevertir)
					modalRevertir.openModal();
				else
					sendFormDataEstructuraAnterior();

			});

		   	$('#form-carga-masiva').submit(function(e){
		   		e.preventDefault();
		   		if(!confirmarNuevaEstructura)
					modalNuevaEstructura.openModal();
				else
					sendFormDataNuevaEstructura();
				
			});
		}

		function sendFormDataEstructuraAnterior(){
			var form = '#form-carga-masiva-anterior';

			elementsForm['sending'] = true;
			$(form).find('button[type="submit"]').prop('disabled', true);

			var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
			
			/**Quitar una vez en producción**/
			var sendTo = urlPOST;

			urlPOST = checkDevelopmentPostHTML(urlPOST);

			$.post(  urlPOST , {} )
			.done(function( data ) {
			  	Services.gestionGrupos.cargaMasivaPostArbolCallSuccess(data, form, sendTo );
				elementsForm['sending'] = false;

			 })
			.fail(function( jqxhr, textStatus, error ) {
			  	//Mensaje de error del sistema
			  	Services.gestionGrupos.cargaMasivaPostArbolCallFail(error, form);
			  	elementsForm['sending'] = false;
			});
		}

		function sendFormDataNuevaEstructura(){
			var form = '#form-carga-masiva';

			elementsForm['sending'] = true;
			$(form).find('button[type="submit"]').prop('disabled', true);

			var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
			
			/**Quitar una vez en producción**/
			var sendTo = urlPOST;

			urlPOST = checkDevelopmentPostHTML(urlPOST);

			$.post(  urlPOST , {} )
			.done(function( data ) {
			  	Services.gestionGrupos.cargaMasivaPostArbolCallSuccess(data, form, sendTo );
				elementsForm['sending'] = false;

			 })
			.fail(function( jqxhr, textStatus, error ) {
			  	//Mensaje de error del sistema
			  	Services.gestionGrupos.cargaMasivaPostArbolCallFail(error, form);
			  	elementsForm['sending'] = false;
			});
		}

		function deleteNodes(){
			var deleted = $treeLineas.jstree('get_selected');

			$.each(deleted, function( index, value ) {
				$treeLineas.jstree('delete_node', '#'+value);
			});
		}

		function mostrarNodos(node){
			$treeLineas.jstree('open_node', node.id, function(e, data) {
				
			}, true);			 
		}

		function esconderNodos(node){
			$treeLineas.jstree('close_node', node.id);
			
		}

		function updateTotal(){
			var result = $treeLineas.jstree('get_selected'),
			rootTotal = 0;

			$.each(result, function( index, value ) {
			  if($.inArray(value, rootElements)>-1)
			  	rootTotal++;
			});

			if(rootTotal==rootElements.length){
				$('#checkbox-all').prop('checked', true);
				allSelected = true;
			}
			else{
				$('#checkbox-all').prop('checked', false);
				allSelected = false;
			}

			if(result.length>0)
				$('.active-selected').prop('disabled', false);
			else
				$('.active-selected').prop('disabled', true);
		}

		function initTree(){

			treeCuentas = ($treeLineas.hasClass('tree-cuentas') ? '-cuentas' : '');

			$treeLineas
			.on("changed.jstree", function (e, data) {
				//updateTotal();
			})
			.bind("open_node.jstree", function (event, data) { 
			  mostrarNodos(data.node); 
			})
			.bind('loaded.jstree', function(e, data) {
			    $treeLineas.find('>ul >li').each(function(){
					var $node = $(this);
					rootElements.push($node.attr('id'));
				});
			})
			.bind("delete_node.jstree", function (event, data) { 
				// var $delete = $('#btn-delete-all'),
				// redirect = (typeof $delete.data('none') != 'undefined' ? $delete.data('none') : null) ;

				// if(redirect!=null && allSelected)
				// 	window.location.href = redirect;
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
				}
			});

		}

	}
	/**Fin carga masiva**/

	return{
		inicializar: init
	}

})();