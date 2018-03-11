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
			arbolId = 'grupo-selector-block-'c;
			$arbolMain.attr('id', arbolId)
			initArbol($arbolMain, arbolId);
		});
		
	}

	function validateParentForm($form){
		if ($form.validate().checkForm() && ingresarGruposComponentTotal>0) {                  
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
		$("#" + arbolId + " .block-content-arbol-btn").addClass('hidden');
		$("#" + arbolId + " .btn-like-a").removeClass('active');
	}

	function getDataArbol(){
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

		var $element = $('#' + arbolId + ' .componente-lb.lineas-arbol');
		initActions();
		initTree();

		function initActions(){


			//EJECUTAR BUSQUEDA
			$("#" + arbolId + " .btn-search").click(function() {
		        	
		        var searchString = $('#' + arbolId + ' .search-input').val();

		        if(searchString!=''){
		       		searchTree(searchString);
		        }

		    });

			//CAMBIAR ESTADO DEL BOTÓN Y DEL ARBOL DEPENDIENDO DEL SEARCH INGRESADO
		    $("#" + arbolId + " .search-input").keyup(function() {

		        var searchString = $('#' + arbolId + ' .search-input').val();
		        var $input = $(this);
		        var min = (typeof $input.data('min') != 'undefined' ? $input.data('min') : 1);
		        if(searchString.length>=min){
		        	$('#' + arbolId + ' .btn-search').prop('disabled', false);
		       		//$('#' + arbolId + ' .btn-remover-busqueda').addClass('active');	
		        }
		       	else{
		       		$('#' + arbolId + ' .btn-search').prop('disabled', true);
		       		//resetSearchTree();
		       	}

		    });

		    //BORRAR BUSQUEDA
		    $("#" + arbolId + "").on('click', '.btn-remover-busqueda', function() {
		       	resetSearchTree();
		    });

		    //BORRAR SELECCION
		    $("#" + arbolId + " .btn-remover-seleccion").click(function() {
		       	resetTree(arbolId);
		       	initTree(arbolId);
		    });
		}

		function mostrarNodos(node){
			
			$('#' + arbolId + ' .tree-grupos').jstree('open_node', node.id, function(e, data) {
				drawText(node);
			}, true);			 
		}

		function esconderNodos(node){

			$('#' + arbolId + ' .tree-grupos').jstree('close_node', node.id);
			drawText(node);
		}

		function drawText(node){
			if(node && typeof node.children != 'undefined' && node.children.length>0){

				var nSelectedLines =  $('#' + arbolId + ' .tree-grupos #'+node.id+' .jstree-clicked .io-Phone').length;
				var nSelectedGroups =  $('#' + arbolId + ' .tree-grupos #'+node.id+' >ul >li >.jstree-clicked .io-Maletin').length;
				
				var $append = $('#' + arbolId + ' .tree-grupos #'+node.id+' >.jstree-anchor');

				var text = '';

				if(node.state.selected)
					nSelectedLines = node.original.total;
				else if(nSelectedLines == 0 && nSelectedGroups>0){

					$('#' + arbolId + ' .tree-grupos #'+node.id+' >ul >li >.jstree-clicked .io-Maletin').each(function( index ){
						var $nodo = $(this).parent().parent();
						var nodoId = $nodo.attr('id');
						var realNode = $('#' + arbolId + ' .tree-grupos').jstree().get_node(nodoId);

						nSelectedLines += realNode.original.total;
					});
					
				}

				if($('#' + arbolId + ' .tree-grupos .jstree-clicked').length>0 || nSelectedLines>0){
					$("#" + arbolId + " .block-content-arbol-btn").removeClass('hidden');
					$("#" + arbolId + " .block-content-arbol-btn .btn-remover-seleccion").addClass('active');
				}
				else{
					$("#" + arbolId + " .block-content-arbol-btn").addClass('hidden');
					$("#" + arbolId + " .block-content-arbol-btn .btn-remover-seleccion").removeClass('active');
				}
			}

			if($('#' + arbolId + ' .tree-grupos .jstree-node .jstree-clicked').length>0)
				$('#btn-add-lineas-arbol').prop('disabled', false);
			else
				$('#btn-add-lineas-arbol').prop('disabled', true);
		}

		

		function updateTotal(node){
			var total = 0;
			var last = 0;
			var result = $('#' + arbolId + ' .tree-grupos').jstree('get_selected'); 

			$.each(result, function( index, value ) {
			  var n = $('#' + arbolId + ' .tree-grupos').jstree(true).get_node(value);
			  var exists = result.indexOf(n.parent);
			  if(exists<0)
			  	total+=n.original.total;
			});

			if(total>50){
				modalLimitarMasivo.openModal();
				$('#' + arbolId + ' .tree-grupos').jstree(true).deselect_node(node);
				total-=node.original.total;
			}

			$('#' + arbolId + ' .total-arbol .total').html(total);
			if(total>0)
				$('#' + arbolId + ' .total-arbol').removeClass('hidden');
			else
				$('#' + arbolId + ' .total-arbol').addClass('hidden');

			ingresarGruposComponentTotal = total;

			if(total>0){
				$("#" + arbolId + " .block-content-arbol-btn").removeClass('hidden');
				$("#" + arbolId + " .block-content-arbol-btn .btn-remover-seleccion").addClass('active');
			}
			else{
				$("#" + arbolId + " .block-content-arbol-btn").addClass('hidden');
				$("#" + arbolId + " .block-content-arbol-btn .btn-remover-seleccion").removeClass('active');
			}
		}

		function initTree(){

			$('#' + arbolId + ' .tree-grupos')
			.on("changed.jstree", function (e, data) {

				if(data.action == "select_node"){
					
					mostrarNodos(data.node);
					
					var results = getDataArbol();
					ingresarGruposComponentTotal = results.length;
					validateParentForm($('#' + arbolId + '').closest('form'));
					// updateTotal(data.node);

					
					//$('#' + arbolId + ' .tree-grupos').jstree('open_node', data.node.id); 
				}
				else if(data.action == "deselect_node"){
					esconderNodos(data.node);

					var results = getDataArbol();
					ingresarGruposComponentTotal = results.length;
					validateParentForm($('#' + arbolId + '').closest('form'));
					// updateTotal(data.node);
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
			verifyGroupMsg();

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

				  	Services.general.getArbolBusquedaGruposCallSuccess(json , form);
				  	elementsForm['buscarArbolGrupos']['sending'] = false;
				  	generalLoadingIcon(form, false);

				  })
				  .fail(function( jqxhr, textStatus, error ) {
				  	Services.general.getArbolBusquedaGruposCallFail(error, form);
				  	elementsForm['buscarArbolGrupos']['sending'] = false;
				  	generalLoadingIcon(form, false);
				});

			}
		}
	}

	function resetComponente(){
		resetSearchTree(arbolId);
		resetTree(arbolId);
	}


	function verifyGroupMsg(){
		var hash = window.location.hash;
		var $msg = $('.msg-info-block-arbol');

		if(hash=='#soloSinAgrupar' && $msg.length<1){
			var msg = '*Por el momento no tienes ningún grupo, por lo tanto el Administrador de grupo que elijas tendrá permisos sobre todas las líneas.';

			var $main = $('#' + arbolId + ' .tree-grupos').parent();

			$('<div class="col-sm-12 col-xs-12 msg-info-block msg-info-block-arbol"><p>'+msg+'</p></div>').insertAfter($main);
		}

	}

	return{
		inicializar: init,
		getDataArbol : getDataArbol,
		reset : resetComponente
	}

})();