var dateRange = null,
	datesJSON = null,
	$calendar = $('.calendar');
		dateRange = { min : (typeof $calendar.data('min') != 'undefined' ? $calendar.data('min') : null ) , max : (typeof $calendar.data('max') != 'undefined' ? $calendar.data('max') : null ) };

var modalGeolocation = null;
function initModalGeolocation(){

	modalGeolocation = new modalesTelcel($('#modal-geolocation'),{
		onInit : function(){
		},
		onReset : function(){
		},
		onOpen : function(){
		},
		onClose : function(){
			var $mapaContainer = $('.citas-cac-container');
			if($mapaContainer.length>0)
				scrollToElement($mapaContainer);
			
		}
	});

}

var modalSinHorarios = null;
function initModalSinHorarios(){

	modalSinHorarios = new modalesTelcel($('#modal-sin-horarios'),{
		onInit : function(){
		},
		onReset : function(){
			resetFechaHoraCAC(true);

			var $step = $('.fecha-hora-cac-block').closest('.citas-step');

			if($step.length>0)
				setTimeout(function(){
					scrollToElement($step);
				}, 500);

		},
		onOpen : function(){
		}
	});

}

var modalErrorSolicitud = null;
function initModalErrorSolicitud(){
	var loadingContainer = $('#modal-error-solicitud .form-ge-mod');

	modalErrorSolicitud = new modalesTelcel($('#modal-error-solicitud'),{
		onInit : function(){
			setModalActions();
			$('#redirect-txt').hide();
		},
		onReset : function(){
			generalLoadingIcon(loadingContainer, false);
			$('#redirect-txt').hide();
			$('#autogestion-form-citas button[type="submit"]').prop('disabled', false);
		},
		onOpen : function(){
			
		},
		onClose : function(){

			//Cuando cierre el modal si quieren hacer refresh hay que descomentar esto
			// if(processCompleted)
			// 	location.reload();
		}
	});


	function setModalActions(){
		$('#btn-reintentar-submit').click(function(){
			retrySendForm();
		});
	}

	function retrySendForm(){
		$('#autogestion-form-citas').submit();
		modalErrorSolicitud.closeModal();
	}

}

var formElementsModales = { 
	'cancelarVisita' : {id : null, validator : null, sending: false },
	'cancelarCita' : {id : null, validator : null, sending: false },
	'consultarDateTime' : {id : null, validator : null, sending: false },
	'reprogramarCita' : {id : null, validator : null, sending: false }
};

var _modalCancelarCita = null, _modalCancelarVisita = null;
var modalCancelarCita = null, modalCancelarVisita = null;

/**Inicio modal cancelar cita**/
function initModalCancelarCita(){
	var processCompleted = false;

	modalCancelarCita = new modalesTelcel($('#modal-cancelar-cita'),{
		onInit : function(){
			setModalActions();
			$('#confirmar-cancelar-cita').hide();
			$('#cancelar-cita-24-hrs').hide();
			$('#cancelar-cita-confirmacion').hide();
		},
		onReset : function(){
			processCompleted = false;
			$('#confirmar-cancelar-cita').hide();
		  	$('#cancelar-cita-confirmacion').hide();
		},
		onOpen : function(){
			$('#confirmar-cancelar-cita').hide();
			$('#cancelar-cita-24-hrs').hide();
			$('#cancelar-cita-confirmacion').hide();
			consultarDateTime();
			
		},
		onClose : function(){
			$('.linea-batch.active-settings').removeClass('active-settings');
			var $current = $('#cita-'+_modalCancelarCita.id);
			if($current.length>0)
				scrollToElement($current);
			//Cuando cierre el modal si quieren hacer refresh hay que descomentar esto
			// if(processCompleted)
			// 	location.reload();
		}
	});

	function consultarDateTime(){
		if(!formElementsModales['consultarDateTime']['sending']){

			formElementsModales['consultarDateTime']['sending'] = true;

			generalLoadingIcon('#modal-cancelar-cita .in-cont-mod', true);

			var postURL = Services.apiURL.getCurrentDateTime();

			$.post( postURL , { })
			  .done(function( json ) {
			  	
			  	Services.citas.consultarDateTimeSuccessCallback(json,_modalCancelarCita);
			  	formElementsModales['consultarDateTime']['sending'] = false;
			  	generalLoadingIcon('#modal-cancelar-cita .in-cont-mod', false);

			  })
			  .fail(function( jqxhr, textStatus, error ) {
	
			  	Services.citas.consultarDateTimeFailCallback(error, '#modal-cancelar-cita .in-cont-mod');
			  	formElementsModales['consultarDateTime']['sending'] = false;
			  	generalLoadingIcon('#modal-cancelar-cita .in-cont-mod', false);

			});

		}
	}

	function setModalActions(){
		$('#btn-cancelar-cita').click(function(){
			postCancelarCita();
		});
	}

	function postCancelarCita(){
		var form = '#modal-cancelar-cita .in-cont-mod';

		if(!formElementsModales['cancelarCita']['sending']){

			formElementsModales['cancelarCita']['sending'] = true;

			generalLoadingIcon(form, true);

			var postURL = Services.apiURL.cancelarCita();

			$.post( postURL , { delete: _modalCancelarCita.id })
			  .done(function( json ) {
			  	//Aquí le pusimos un delay de para simular que se tarda el servicio en regresar la info
			  	$('body').delay(8000);
				//En el servicio de cancelar la cita
				//Cuando sale el exito, se debe actualizar el html de la lista con la nueva información
				//Para que al cerrar el modal ya este actualizada

			  	Services.citas.cancelarCitaSuccessCallback(json, form, _modalCancelarCita);
			  	formElementsModales['cancelarCita']['sending'] = false;
			  	generalLoadingIcon(form, false);
			  	processCompleted = true;

			  })
			  .fail(function( jqxhr, textStatus, error ) {
			  	Services.citas.cancelarCitaFailCallback(error, form);
			  	formElementsModales['cancelarCita']['sending'] = false;
			  	generalLoadingIcon(form, false);
			});
		}
	}

}
/**Fin modal cancelar cita**/

/**Inicio modal cancelar visita**/
function initModalCancelarVisita(){
	var processCompleted = false;

	modalCancelarVisita = new modalesTelcel($('#modal-cancelar-visita'),{
		onInit : function(){
			setModalActions();
			$('#confirmar-cancelar-visita').hide();
			$('#cancelar-visita-confirmacion').hide();
		},
		onReset : function(){
			processCompleted = false;
			$('#confirmar-cancelar-visita').hide();
		  	$('#cancelar-visita-confirmacion').hide();
		},
		onOpen : function(){
			$('#modal-cancelar-visita .visita-folio').html(_modalCancelarVisita.folio);
			$('#confirmar-cancelar-visita').show();
			$('#cancelar-visita-confirmacion').hide();
			
		},
		onClose : function(){
			$('.linea-batch.active-settings').removeClass('active-settings');
			var $current = $('#cita-'+_modalCancelarVisita.id);
			if($current.length>0)
				scrollToElement($current);
			//Cuando cierre el modal si quieren hacer refresh hay que descomentar esto
			// if(processCompleted)
			// 	location.reload();
		}
	});

	function setModalActions(){
		$('#btn-cancelar-visita').click(function(){
			postCancelarVisita();
		});
	}

	function postCancelarVisita(){
		var form = '#modal-cancelar-visita .in-cont-mod';

		if(!formElementsModales['cancelarVisita']['sending']){

			formElementsModales['cancelarVisita']['sending'] = true;

			generalLoadingIcon(form, true);

			var postURL = Services.apiURL.cancelarVisita();

			$.post( postURL , { delete: _modalCancelarVisita.id })
			  .done(function( json ) {
			  	//Aquí le pusimos un delay de para simular que se tarda el servicio en regresar la info
			  	$('body').delay(8000);
				//En el servicio de cancelar la cita
				//Cuando sale el exito, se debe actualizar el html de la lista con la nueva información
				//Para que al cerrar el modal ya este actualizada

			  	Services.citas.cancelarVisitaSuccessCallback(json, form, _modalCancelarVisita);
			  	formElementsModales['cancelarVisita']['sending'] = false;
			  	generalLoadingIcon(form, false);
			  	processCompleted = true;

			  })
			  .fail(function( jqxhr, textStatus, error ) {
			  	Services.citas.cancelarVisitaFailCallback(error, form);
			  	formElementsModales['cancelarVisita']['sending'] = false;
			  	generalLoadingIcon(form, false);
			});
		}
	}

}
/**Fin modal cancelar cita**/

var _modalReprogramarCita = null;
var modalReprogramarCita = null;

/**Inicio modal cancelar cita**/
function initModalReprogramarCita(){
	var processCompleted = false;

	modalReprogramarCita = new modalesTelcel($('#modal-reprogramar-cita'),{
		onInit : function(){
			setModalActions();
			$('#confirmar-reprogramar-cita').hide();
			$('#reprogramar-cita-confirmacion').hide();
			$('#reprogramar-cita-24-hrs').hide();
		},
		onReset : function(){
			processCompleted = false;
			$('#confirmar-reprogramar-cita').hide();
		  	$('#reprogramar-cita-confirmacion').hide();
		  	resetFechaHoraCAC(false);
		  	$('#btn-reprogramar-cita').prop('disabled', true);
		},
		onOpen : function(){
			$('#modal-reprogramar-cita .date-picker').removeClass('open');
			$('#reprogramar-cita-confirmacion').hide();
			$('#reprogramar-cita-24-hrs').hide();
			$('#confirmar-reprogramar-cita').hide();
			consultarDateTime();
		},
		onClose : function(){
			$('.linea-batch.active-settings').removeClass('active-settings');
			removeHoraError($('#modal-reprogramar-cita').find('.time-picker .time-select'));
			var $current = $('#cita-'+_modalReprogramarCita.id);
			if($current.length>0)
				scrollToElement($current);
			//Cuando cierre el modal si quieren hacer refresh hay que descomentar esto
			// if(processCompleted)
			// 	location.reload();
		}
	});

	function consultarDateTime(){
		if(!formElementsModales['consultarDateTime']['sending']){

			formElementsModales['consultarDateTime']['sending'] = true;

			generalLoadingIcon('#modal-reprogramar-cita .in-cont-mod', true);

			var postURL = Services.apiURL.getCurrentDateTime();

			$.post( postURL , { })
			  .done(function( json ) {
			  	
			  	Services.citas.consultarDateTimeSuccessCallback(json,_modalReprogramarCita, getAvailableDateTimes);
			  	formElementsModales['consultarDateTime']['sending'] = false;
			  	generalLoadingIcon('#modal-reprogramar-cita .in-cont-mod', false);

			  	// getAvailableDateTimes(_modalReprogramarCita.fecha);
			  })
			  .fail(function( jqxhr, textStatus, error ) {
	
			  	Services.citas.consultarDateTimeFailCallback(error, '#modal-reprogramar-cita .in-cont-mod');
			  	formElementsModales['consultarDateTime']['sending'] = false;
			  	generalLoadingIcon('#modal-reprogramar-cita .in-cont-mod', false);

			});

		}
	}

	function setModalActions(){
		$('#btn-reprogramar-cita').click(function(){
			postReprogramarCita();
		});
	}

	function postReprogramarCita(){
		var form = '#modal-reprogramar-cita .in-cont-mod';

		if(!formElementsModales['reprogramarCita']['sending']){

			formElementsModales['reprogramarCita']['sending'] = true;

			generalLoadingIcon(form, true);

			var postURL = Services.apiURL.reprogramarCita();

			var data = { 
				id : _modalReprogramarCita.id, 
				fecha: $('#modal-reprogramar-cita #input-fecha-corte').val(), 
				hora : $('#modal-reprogramar-cita #time-picker').val()
			};

			$.post( postURL , data )
			  .done(function( json ) {
			  	//Aquí le pusimos un delay de para simular que se tarda el servicio en regresar la info
			  	$('body').delay(8000);
				//En el servicio de reprogramar la cita
				//Cuando sale el exito, se debe actualizar el html de la lista con la nueva fecha
				//Para que al cerrar el modal ya este actualizada

			  	Services.citas.reprogramarCitaSuccessCallback(json, form, data );
			  	formElementsModales['reprogramarCita']['sending'] = false;
			  	generalLoadingIcon(form, false);
			  	processCompleted = true;

			  })
			  .fail(function( jqxhr, textStatus, error ) {
			  	Services.citas.reprogramarCitaFailCallback(error, form);
			  	formElementsModales['reprogramarCita']['sending'] = false;
			  	generalLoadingIcon(form, false);
			});
		}
	}

}
/**Fin modal reprogramar cita**/

var mapaCAC = (function () {

	var $mapa = $('#mapa-cac'),
	map = null,
	markers = [],
	userPosition = null,
	clientPositionMarker = null,
	$miUbicacionBtnContainer = $('#mi-ubicacion').parent().parent();

	function resizeMapa(){
		var center = map.getCenter();
		google.maps.event.trigger(map, 'resize');
		map.setCenter(center);
		generalLoadingIcon('.listado-cac-block', false);
	}

	function initMapa(){
		
		$miUbicacionBtnContainer.hide();
		generalLoadingIcon('.listado-cac-block', true);

		// Petición para obtener el script del mapa
		$.ajax({
		  url: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAsnL285ziiyoXYCuzmuo2zXJZoyQkU084&libraries=geometry&v=3.exp&#038;signed_in=true',
		  dataType: "script"
		}).
		// Al ser satisfactoria inicializamos el mapa
		done(function(){
			generateMapa();
			getLocation();
		}).
		fail(function(){
			throw new NuevoError("No se pudo cargar la API de Google Maps, algunas funciones no estarán disponibles en la página.");
		});

	}

	function generateMapa(){

		var myLatlng = new google.maps.LatLng(21.5121499,-109.8253327);

		var mapOptions = {
			scrollwheel: false,
			zoom: 4,
			center: myLatlng
		};

		map = new google.maps.Map(document.getElementById('mapa-cac'), mapOptions);
		map.setOptions({ minZoom: 14 });

		google.maps.event.addListenerOnce( map , 'idle', function(){
		    generalLoadingIcon('.listado-cac-block ', false);
		});
	}

	function getFilteredMarkers(markers){
		drawMarkers(markers);
	}

	function showCloserElements(){
		if(userPosition!=null)
		{
			drawUserMarker();
			closestMarkers();
		}
		else{
			getLocation();
		}
	}


	function cleanMarkers(){

		markers.forEach(function (marker, i) {
		     markers[i].setMap(null);
		});

		markers = [];

		$('.listado-cac-list >ul').html('');
	}

	function drawMarkers(markersT){
		cleanMarkers();

		var count = 0;
		var bounds = new google.maps.LatLngBounds();
		var newcenter; 
		var zoomval = 4;
		var infowindow;
		var mapMarkers = markersT;

		mapMarkers.forEach(function(markerInfo) {

			var lat = markerInfo.latitude;
			var lng = markerInfo.longitude;
			var title = markerInfo.title;
			var info = markerInfo.description;

			if( lng && lat )
			{
				
				var cacHTML = ' <li class="li-cac flex-col-direction-mobile" data-cac="'+markerInfo.id+'" id="cac-'+markerInfo.id+'"> <div class="description flex-col-direction-mobile"> <div class="flex-col-direction-mobile"> <h4 class="title">'+title+'</h4> <p class="address"> '+info+'</p> </div></div> </li>';

				// <button type="button" class="blue-dark btn-elegir"  data-cac="'+markerInfo.id+'"><span class="text">Elegir</span> <span class="span-btn io-SliderRight"></span></button>
				$('.listado-cac-list >ul').append(cacHTML);
				                   
                var pin = 'pin.png';
                
                var myLatlng = new google.maps.LatLng(lat,lng);

  				var image = {
				    url: '../../assets/img/pointer.png',
				    scaledSize : new google.maps.Size(27, 45)
				 };

              	var marker = new google.maps.Marker({
	                position: myLatlng,
	                map: map,
	                title: title,
	                animation: google.maps.Animation.DROP,
	                icon:image
	              });


				marker.addListener('click', function() {
					//SELECCIONAR CAC
					$('#cac-'+markerInfo.id).trigger('click');
					CACcomponent.markerAction(markerInfo.id);

				});

				markers[count] = marker;  

				bounds.extend(myLatlng);

				if(count==0){
                    newcenter =  myLatlng;
                }

                count++;
			}
		});

		setCenter(newcenter, zoomval);
	}

	function setCenter(center, zoom){

		map.setCenter(center);
		zoomChangeBoundsListener = 
		google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) {
			if (this.getZoom()){
				this.setZoom(zoom);
			}
		});

		setTimeout(function(){google.maps.event.removeListener(zoomChangeBoundsListener); }, 2000);
	}

	function getLocation(){
		if (navigator.geolocation)
			navigator.geolocation.getCurrentPosition(setPosition, handleErrorGeoLocation);
		else
			handleErrorGeoLocation();
	}

	function handleErrorGeoLocation(){
		$('.citas-cac-container').addClass('no-geolocation');
		$('#mi-ubicacion').addClass('no-geolocation');
		//HANDLE ERROR
	}

	function setPosition(position){

		$miUbicacionBtnContainer.show();

		userPosition = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		};

		drawUserMarker();
		$('#mi-ubicacion').trigger('click');
		closestMarkers();
	}

	function drawUserMarker(){
		$('.citas-cac-container').removeClass('no-geolocation');
		$('#mi-ubicacion').removeClass('no-geolocation');
		$('#ver-lista').addClass('active');


	    if(clientPositionMarker==null){
	    	var icon = {
	          url: "../../assets/img/location.png", 
	          scaledSize: new google.maps.Size(12, 12), 
	          origin: new google.maps.Point(0,0), 
	          anchor: new google.maps.Point(0, 0)
		    };

		    clientPositionMarker = new google.maps.Marker({
				position: userPosition,
				map: map,
				title: '',
				icon : icon
			});
	    }
			
		map.setCenter(userPosition);
	}

	function closestMarkers(){
		$.getJSON( Services.apiURL.getCACs(), { position: userPosition })
		  .done(function( json ) {
		  	//checkDistance solo se van a mandar para entorno developers
		  	Services.citas.setCACClosestLocationSuccessCallback(json,getFilteredMarkers, checkDistance);
		  })
		  .fail(function( jqxhr, textStatus, error ) {
		  	Services.citas.setCACClosestLocationSuccessCallback({ success: false, data: null } ,getFilteredMarkers);
		});
	}

	function checkDistance(plat, plng){
		var p1 = new google.maps.LatLng(userPosition.lat,userPosition.lng),
		p2 = new google.maps.LatLng(plat, plng),
		distance = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);

		if(distance<1700)
			return true;

		return false;
	}


	return{
		inicializar: function(){

			if($('#mapa-cac').length>0)
				initMapa();
		},

		mresizeMapa : resizeMapa,
		mgetUserLocation : getLocation,
		mgetFilteredMarkers : getFilteredMarkers,
		showCloserElements : showCloserElements
	}
})();

var CACcomponent = (function () {

	var Steps = null,
	isFirstChange = true,
	lineasTramites = [],
	validTramites = false,
	totalLineas = 0,
	totalTramites = 0,
	tramiteOptions = [],
	isVisita = $('#autogestion-form-citas').hasClass('only-visit-cac') ? true : false;

	var _modalConfirmarEliminar = {};
	var modalConfirmarEliminar = null;
	
	var municipiosByEstado = [];

	var cacUserData = null;

	if(isVisita)
		cacUserData = { type : 'visita', lineas : null };
	else
		cacUserData = { type : 'cita', lineas : null, sucursal : null, fecha : null, hora : null };

	function initmodalConfirmarEliminar(){

		var lastLine = false;

		modalConfirmarEliminar = new modalesTelcel($('#modal-confirmar-eliminar'),{
			onInit : function(){
				initActionsModalAuxiliar();
			},
			onReset : function(){
				// if($('#listado-confirmacion-autogestion .linea-batch input[type="checkbox"]:checked').length>0)
				// 	$('.listado-header-autogestion button').prop('disabled', false);
				// else
				// 	$('.listado-header-autogestion button').prop('disabled', true);

				// $('#modal-confirmar-eliminar .added-lines .div-nal').html('');
			},
			onOpen : function(){
				setModalData();
			}
		});

		function setModalData(){
			var meta = _modalConfirmarEliminar.meta;

			if(typeof meta !='undefined')
				$('#modal-confirmar-eliminar .txt-linea').html(meta.numero);
		}


		function initActionsModalAuxiliar(){

			$('#modal-confirmar-eliminar').on('click', '#btn-confirmar-eliminar', function(){

				removeLineasTramites();

				// if(lastLine){
				// 	var url = ( typeof $(this).data('redirect') != 'undefined' ? $(this).data('redirect') : homeURL );
				// 	lastLine = false;
				// 	window.location.href= url;
				// }
			});

		}

	}

	var formElements = {id: 'autogestion-form-citas', validator: null, sending: false };
	var $mainForm = null;

	function validateCACForm(){
		$mainForm = $('#autogestion-form-citas');
		disableSumbitButton($mainForm, true);
		formElements['validator'] = 
			$mainForm.validate({
				ignore:"",
			  rules: {
				checkboxAutogestion : {
					required : true
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
					required : true
				},
				email: {
					required: true,
					email: true
				}
			  },
			  messages: {
			  	numero: {
					required: "Ingresa un número de contacto.",
					digits: "Ingresa un número válido.",
					minlength: "Ingresa un número de 10 dígitos.",
					maxlength: "Ingresa un número de 10 dígitos."
				},
				email: {
					required: "Ingresa un correo electrónico.",
					email: "Ingresa un correo electrónico válido."
				},
				nombre: {
					required : "Ingresa el nombre de la persona autorizada.",
					basicName: "Este campo solo acepta letras, números, punto y espacios.",
					minlength: "El nombre debe contener al menos 3 caracteres.",
				   	maxlength : "El nombre no debe ser mayor a 40 caracteres."
				}
			   },
				errorPlacement: function(error, element) {
					var $parent = element.parent().parent().parent();
					if(element[0].name=='numero' || element[0].name=='email' || element[0].name=='nombre'){				   		
				   		$('<div class="error-aux col-sm-7 col-xs-9 col-xs-offset-3 col-sm-offset-5"></div>').insertAfter( $parent );
				   		$parent.next('.error-aux').append(error);
					}
				}
				,
		        submitHandler: function(form) {
					if(!formElements['sending']){
						sendFormData(form);
			  		}
				}
		});	

		checkThisValidForm();

		function sendFormData(form){

			// var loadingContainer = $('#modal-error-solicitud .form-ge-mod');
			// $('#redirect-txt').show();

			// generalLoadingIcon(loadingContainer, true);
			// modalErrorSolicitud.openModal();

			formElements['sending'] = true;
			$(form).find('button[type="submit"]').prop('disabled', true);

			var self = cacUserData;
			self.nombre = $('#nombre_cac').val();
			self.email = $('#email_cac').val();
			self.numero = $('#numero_cac').val();

			var urlPOST = ( $(form).prop('action') == '' ? postURL : $(form).prop('action') ) ;
			
			/**Quitar una vez en producción**/
			var sendTo = urlPOST;

			urlPOST = checkDevelopmentPostHTML(urlPOST);

			$.post(  urlPOST , self )
			.done(function( data ) {
			  	Services.citas.CACFormCallSuccess(self, form, modalErrorSolicitud, sendTo );
				formElements['sending'] = false;
				// generalLoadingIcon(loadingContainer, false);
			 })
			.fail(function( jqxhr, textStatus, error ) {
			  	//Mensaje de error del sistema
			  	Services.citas.CACFormCallFail(error, form);
			  	formElements['sending'] = false;
			});
		}
	}
	
	function checkThisValidForm(){

		$mainForm.find('input').on('keyup change input keydown', function () { 
	        validateForm();
	    });

	    $mainForm.find('input[type="checkbox"], input[type="radio"]').on('change', function () { 
	        validateForm();
	    });
	}

	function validateForm(){

		if (checkValidData() && $mainForm.validate().checkForm() && validTramites) {                  
	        $mainForm.find('.first-submit, button[type="submit"]').prop('disabled', false);    
	    } else {
	       $mainForm.find('.first-submit, button[type="submit"]').prop('disabled', true); 
	    }
	}

	function checkValidData(){
		for(key in cacUserData){
			if(cacUserData[key]==null || cacUserData[key]=='' || cacUserData[key]==0)
				return false;
		}

		return true;
	}

	function initLineasTramites(){
		var $mainContainer = $('#citas-lineas-tramites'),
		$mainContainerSingle = $('#citas-tramites'),
		currentLineasTramites = [];

		if($mainContainer.length>0){
			updateLineasTramites();
			setActions();
		}

		if($mainContainerSingle.length>0){
			updateLineaSingle();
			setActionsSingle();
		}

		function updateLineaSingle(){
			var linea = $('#lineas-hidden-input').val();
			updateUserData('lineas', linea);
		}

		function setActionsSingle(){

			$mainContainerSingle.on('change', 'input[type=checkbox]' , function (e) {

			    if ($mainContainerSingle.find('input[type=checkbox]:checked').length == 3) 
			        $mainContainerSingle.find('input[type=checkbox]:not(:checked)').prop('disabled', true);
			    else
			    	$mainContainerSingle.find('input[type=checkbox]').prop('disabled', false);


			    var currentlyChecked = $mainContainerSingle.find('input[type=checkbox]:checked').length;

			    if(currentlyChecked>0){
			    	removeTramiteErrorSingle();
			    	validTramites = true;
			    	
			    	if(currentlyChecked>2)
			    		Steps.showStep(1);
			    	else if(currentlyChecked>0)
			    		Steps.showStep(1, false);

			    	if($('#mapa-cac').length>0){
			    		generalLoadingIcon('.listado-cac-block', true);
						getResizeMapa();
						$('.msg-no-geolocation').removeClass('hidden');
					}
			    }
			    else{
			    	validTramites = false;
			    	addTramiteErrorSingle();
			    }

			    updateTramites();
			    
			});

			function updateTramites(){
				var tramites = [];

				$mainContainerSingle.find('input[type=checkbox]:checked').each(function(){
					var $cht = $(this);
					tramites.push($cht.val());
				});

				updateUserData('tramites', tramites);
			}

		}

		function addTramiteErrorSingle(){
			var error = '<label class="error error-tramite">Elige un tramite.</label>';

			if($('.error-tramite').length<1){
				$( error ).insertAfter( $mainContainerSingle );
			}

			validTramites = false;
		}

		function removeTramiteErrorSingle(){
			$('.error-tramite').remove();
		}

		function updateLineasTramites(){
			$mainContainer.find('.linea-batch').each(function(){
				var $linea = $(this),
				data = { id : (typeof $linea.attr('id')!='undefined' ? $linea.attr('id') : null ), meta : (typeof $linea.data('meta') != 'undefined' ? $linea.data('meta') : null )};

				if(data.id){
					lineasTramites[data.id] = data.meta;
					totalLineas++;
					totalTramites++;
				}
			});
		}

		function setActions(){
			$mainContainer.on('click', '.btn-delete', function(){
				var $btn = $(this),
				$container = $btn.closest('.linea-batch');

				if(modalConfirmarEliminar!=null){

					var id = $container.attr('id');

					if(lineasTramites[id] && (totalLineas-1)>0 ){
						_modalConfirmarEliminar = {id : id, 'meta':lineasTramites[id]};
						modalConfirmarEliminar.openModal();
					}
					
				}
				
			});

			$mainContainer.on('click', '.btn-agregar-tramite', function(){
				var $btn = $(this),
				$container = $btn.closest('.linea-batch');

				if(totalTramites<3){
					addTramite($container);
				}

			});

			$mainContainer.on('click', '.btn-delete-tramite', function(){
				var $btn = $(this),
				$container = $btn.closest('.content-item-block.extra'),
				$currentSelect = $container.closest('.tramite'),
				$linea = $container.closest('.linea-batch');
				$container.remove();
				totalTramites--;

				updateLineaSelectOptions($linea);

				var lineasData = [];
				lineasData = updateDataLineas();
				updateUserData('lineas', lineasData);

				if(totalTramites<3)
					$('.linea-batch .agregar-tramite-container').removeClass('hidden');

			});
		}
	}

	function checkTramitesToAdd($container){
		var $selects = $container.find('.tramite'),
		tramiteOptionsNot = [];

		$selects.each(function(){
			var $select = $(this);

			if($select.val()!='')
				tramiteOptionsNot.push($select.val());
		});

		return getSelect(tramiteOptionsNot);
	}

	function getSelect(selected)
	{
		var html = '';

		html = '<div class="col-sm-12 col-xs-12 content-item-block extra padding-0"> <div class="col-sm-pr-100 col-xs-12 flexbox h-align-center v-align-center tramite-container"> <div class="data-write slt"> <select class="tramite"> <option value="">Elige una opción</option>';
		
		$.each(tramiteOptions, function(i, tramite) {
			if($.inArray(tramite.value,selected)<0)
				html+='<option value="'+tramite.value+'">'+tramite.text+'</option>';
		});


		html+='</select> </div> </div><span class="icon io-Less btn-delete-tramite" title="Quitar"></span></div>';

		return html;
	}

	function addTramite($container){
		var $before = $container.find('.delete-container'),
		html = checkTramitesToAdd($container);

		totalTramites++;

		$( html ).insertBefore( $before );

		checkEmptyTramites();

		if(totalTramites==3)
			$('.linea-batch .agregar-tramite-container').addClass('hidden');
	}

	function checkEmptyTramites(){
		var $selects = $('#citas-lineas-tramites .linea-batch .tramite');

		$selects.each(function(){
			var $select = $(this);

			if($select.val()=='')
				addTramiteError($select);
		});
		
		validateForm();
	}

	function removeLineasTramites(){
		var aux = [];

		for (var key in lineasTramites) {
			if(!(key == _modalConfirmarEliminar.id))
				aux[key] = lineasTramites[key];
			else{
				totalLineas--;
				var tramites = $('#'+_modalConfirmarEliminar.id).find('.tramite').length;
				totalTramites -= tramites;
			}
		}

		lineasTramites = aux;

		if(totalLineas==1)
			$('.linea-batch .delete-container').addClass('hidden');

		if(totalTramites<3)
			$('.linea-batch .agregar-tramite-container').removeClass('hidden');

		$('#'+_modalConfirmarEliminar.id).remove();

		var lineasData = [];
		lineasData = updateDataLineas();
		updateUserData('lineas', lineasData);

		var $selected = $('#citas-lineas-tramites .tramite'),
		valid = true;

		$selected.each(function(){
			var $select = $(this);

			if($select.val()=='')
				valid = false;
		});

		validTramites = valid;
		var lineasData = [];

		if(valid){
			lineasData = updateDataLineas();
			Steps.showStep(1);
			if($('#mapa-cac').length>0){
				generalLoadingIcon('.listado-cac-block', true);
				getResizeMapa();
				$('.msg-no-geolocation').removeClass('hidden');
			}
		}

		modalConfirmarEliminar.closeModal();
	}

	function updateUserData(key, value){
		cacUserData[key] = value;
		validateForm();
	}

	function initFiltrado(){
		var currentEstado = 0;
		var currentMunicipio = 0;
		setActions();
		getEstados();


		function setActions(){
			
			$( "#cac-estado" ).change(function() {
				$('.no-close-cacs').addClass('hidden');
				onSelectChange();
				currentEstado = this.value;
			  	getMunicipios(this.value);
			  	filterMarkers();
			});

			$( "#cac-municipio" ).change(function() {
				$('.no-close-cacs').addClass('hidden');
				onSelectChange();
				currentMunicipio = this.value;
			  	filterMarkers();
			});
		}

		function addCACError(){
			var error = '<label class="error error-cac">Selecciona un Centro de Atención a Clientes.</label>';

			if($('.error-cac').length<1){
				$('.listado-cac-list').prepend(error);
			}
		}

		function removeCACError(){
			$('.error-cac').remove();
		}

		function onSelectChange(){
			$('.citas-cac-container').removeClass('no-geolocation');
			resetFechaHoraCAC(true);
			updateUserData('sucursal', null);
			addCACError();

			if(isFirstChange){
				if($('.listado-cac-block').hasClass('map-view-block')){
					$('#ver-mapa').removeClass('active');
					$('#ver-lista').addClass('active');
				}
				else{
					$('#ver-lista').removeClass('active');
					$('#ver-mapa').addClass('active');
				}

				isFirstChange = false;
			}
		}

		function filterMarkers(){

			$.getJSON( Services.apiURL.getCACs(), { estado: currentEstado, municipio: currentMunicipio })
			  .done(function( json ) {
			  	//callDrawMarkers({ success: true, data: json });

			  	Services.citas.setCACLocationSuccessCallback(json,callDrawMarkers);
			  })
			  .fail(function( jqxhr, textStatus, error ) {
			  	//callDrawMarkers({ success: false, data: null });
			  	Services.citas.setCACLocationSuccessCallback({ success: false, data: null } ,callDrawMarkers);
			});
		}

		function callDrawMarkers(data){
			mapaCAC.mgetFilteredMarkers(data);
		}

		function fillEstados(data){
			if(data.success){
				var select = $("#cac-estado");
				$.each(data.data.mexico.estado, function() {
				    select.append($("<option />").val(this.id).text(this.nombre));
				    // Llenar arreglo de municipios
				    municipiosByEstado[this.id] = this.municipios.municipio;
				});
			}
		}

		function fillMunicipios(data){
			if(data.success){
				var select = $("#cac-municipio");
				select.html('<option value="0">Elige el municipio</option>');
				$.each(data.data, function() {
				    select.append($("<option />").val(this.id).text(this.nombre));
				});
			}
		}

		function getEstados(){

			$.getJSON( Services.apiURL.getEstadosMunicipios(), {})
			  .done(function( json ) {
			  	fillEstados({ success: true, data: json });
			  })
			  .fail(function( jqxhr, textStatus, error ) {
			  	fillEstados({ success: false, data: null });
			});
		}

		function getMunicipios(i){

			// AQUÍ VA EL REGRESO DE MUNICIPIOS
			fillMunicipios({ success: true, data: municipiosByEstado[i] });
		}


	}

	function updateDataLineas(){
		var lineasData = [];

		for (var key in lineasTramites) {
			lineasTramites[key].tramites = [];
			$('#'+key).find('.tramite').each(function(){
				var $select = $(this).find(":selected");
				 lineasTramites[key].tramites.push($select.val());

			});

			lineasData.push(lineasTramites[key]);
		}

		return lineasData;

	}

	function addTramiteError($select){
		var $container = $select.closest('.tramite-container'),
		$block = $container.closest('.content-item-block'),
		error = '<label class="error error-tramite">Elige un tramite.</label>';

		if($container.find('.error-tramite').length<1){
			$block.addClass('has-error');
			$select.addClass('error');
			$container.append(error);
		}

		validTramites = false;
	}

	function removeTramiteError($select){
		var $container = $select.closest('.tramite-container'),
		$block = $container.closest('.content-item-block');

		$block.removeClass('has-error');
		$select.removeClass('error');
		$container.find('.error-tramite').remove();

	}


	function setTramitesOptions(){
		var select = $('#citas-lineas-tramites .linea-batch').find('.tramite')[0],
		$options = $(select).find('option');

		$options.each(function(){
			var $option = $(this);
			if($option.val()!='')
				tramiteOptions.push({value : $option.val(), text : $option.text()});
		});
	}

	function updateLineaSelectOptions($linea, selected){
		var checkSelected = (typeof selected != 'undefined' && selected != '' ? true : false);

		if(checkSelected){
			//Remove option from selects
			var $options = $linea.find('.tramite option[value="'+selected+'"]');
			
			$options.each(function(){
				var $option = $(this);

				if(!$option.is(':selected'))
					$option.remove();
			});
		}

		
		//Add previous option
		
		var $selects = $linea.find('.tramite'),
		tramiteOptionsNot = [];

		$selects.each(function(){
			var $select = $(this);
			if($select.val()!='')
				tramiteOptionsNot.push($select.val());
		});


		$selects.each(function(){
			var $select = $(this);

			$.each(tramiteOptions, function(i, tramite) {
				if($.inArray(tramite.value,tramiteOptionsNot)<0 && $select.find('option[value="'+tramite.value+'"]').length==0){
					var html='<option value="'+tramite.value+'">'+tramite.text+'</option>';
					$select.append(html);
				}
			});
			
		});
			
	}

	function setActions(){

		if($('#citas-lineas-tramites').length>0)
			setTramitesOptions();

		$('#citas-lineas-tramites').on('change', '.tramite', function(){
			var $selected = $('#citas-lineas-tramites .tramite'),
			valid = true,
			$currentSelect = $(this),
			$linea = $currentSelect.closest('.linea-batch');

			updateLineaSelectOptions($linea, $currentSelect.val());

			if($currentSelect.val()=='')
				addTramiteError($currentSelect);
			else
				removeTramiteError($currentSelect);

			$selected.each(function(){
				var $select = $(this);

				if($select.val()=='')
					valid = false;
			});

			validTramites = valid;
			var lineasData = [];

			if(valid){
				lineasData = updateDataLineas();
				Steps.showStep(1);
				if($('#mapa-cac').length>0){
					generalLoadingIcon('.listado-cac-block', true);
					getResizeMapa();
					$('.msg-no-geolocation').removeClass('hidden');
				}
			}

			updateUserData('lineas', lineasData);

		});


		$('.listado-cac-list').on( "click", '.li-cac', function(){
			$('.listado-cac-list li').removeClass('active');
			$(this).addClass('active');
			updateUserData('sucursal', $(this).data('cac'));
			updateUserData('fecha', null);
			resetFechaHoraCAC(true);

			addHoraError($('.time-picker .time-select'));
			updateUserData('hora', null);

			$('.error-cac').remove();
			getAvailableDateTimes($(this).data('cac'));
			Steps.showStep(2);
		});

		$('#ver-mapa').click(function(){
			$(this).removeClass('active');
			$('#ver-lista').addClass('active');
		  	$('.listado-cac-block').addClass('map-view-block');
		  	getResizeMapa();
		});

		$('#ver-lista').click(function(){
			$(this).removeClass('active');
			$('#ver-mapa').addClass('active');
		  	$('.listado-cac-block').removeClass('map-view-block');
		  	getResizeMapa();
		});

		$('#mi-ubicacion').click(function(){
			var $btn = $(this);

			$('.no-close-cacs').addClass('hidden');

			if($btn.hasClass('no-geolocation'))
				modalGeolocation.openModal();
			else{
				mapaCAC.showCloserElements();
				$('.listado-cac-block').addClass('map-view-block');
			  	getResizeMapa();
			  	$('#ver-mapa').removeClass('active');
			  	$('#ver-lista').addClass('active');
			}
			
		});

		$('.time-picker').bind('updateDataTiempos', function(e){
			e.stopPropagation();
			var $timepicker = $(this),
			date = $('.fecha-input').val();
			removeFechaError($('#input-fecha-corte'));
			updateSelectTiempos($timepicker);
			updateUserData('fecha', date);

			addHoraError($timepicker.find('.time-select'));
			updateUserData('hora', null);
		});

		$('.time-picker .time-select').change(function(){
			var $timepicker = $(this);

			if($timepicker.val()!=''){
				removeHoraError($timepicker);
				updateUserData('hora', $timepicker.val());
				Steps.showStep(3);
			}
			else{
				addHoraError($timepicker);
				updateUserData('hora', null);
			}
		});

	}

	function getResizeMapa(){
		mapaCAC.mresizeMapa();
	}

	function init(){
		if($('.citas-block').length>0){
			if($('#mapa-cac').length>0){
				mapaCAC.inicializar();
			}
			
			if($('#modal-confirmar-eliminar').length>0)
				initmodalConfirmarEliminar();
			
			initFiltrado();
			validateCACForm();
			initLineasTramites();
			
			setActions();
			var $steps = $('.citas-step');
			Steps = new setSteps($steps);
		}
	}

	return{
		inicializar : init,
		markerAction : function(cacId){
			// updateUserData('sucursal', cacId);
			// Steps.showStep(2);
		}
	}
})();

var misCitas = (function () {

	function init(){
		if($('#listado-citas').length>0)
			initListadoCitas();

		if($('.detalle-citas-block').length>0)
			initDetalleBlock();

		if($('.date-picker').length>0 && !initializedDate)
			generalDatePicker.inicializar();
	}

	function initDetalleBlock(){
		var $element = $('#main-detalle-citas');
		_modalReprogramarCita = _modalCancelarCita = _modalCancelarVisita = (typeof $element.data('meta')!= 'undefined' ? $element.data('meta') : null);
		
		initActions();

		function initActions(){

			$('.detalle-citas-block').on('click', '.btn-reprogramar-cita', function(e){
				e.stopPropagation();
				if(_modalReprogramarCita!=null)
					modalReprogramarCita.openModal();
				
			});

			$('.detalle-citas-block').on('click', '.btn-cancelar-cita', function(e){
				e.stopPropagation();

				if(_modalCancelarCita!=null)
					modalCancelarCita.openModal();
				
			});

			$('.detalle-citas-block').on('click', '.btn-cancelar-visita', function(e){
				e.stopPropagation();

				if(_modalCancelarVisita!=null)
					modalCancelarVisita.openModal();
				
			});

			$('.time-picker').bind('updateDataTiempos', function(e){
				e.stopPropagation();
				var $timepicker = $(this);
				updateSelectTiempos($timepicker);
				addHoraError($timepicker.find('.time-select'));
				$('#btn-reprogramar-cita').prop('disabled',true);
			});

			$('.time-picker .time-select').change(function(){
				var $timepicker = $(this),
				$datepicker = $('#input-fecha-corte');

				if($timepicker.val()!=''){
					removeHoraError($timepicker);

					if($datepicker.val()!='')
						$('#btn-reprogramar-cita').prop('disabled',false);
				}
				else{
					addHoraError($timepicker);
					$('#btn-reprogramar-cita').prop('disabled',true);
				}
			});


		}
	}

	function initListadoCitas(){

		var $listaCitas =  $('#listado-citas');
		generarListadoInicial();
		initActions();


		function initActions(){

			generalCheckBoxAll.inicializar();

			$('#listado-citas').on('click', '.btn-open-general-config', function(e){
				e.stopPropagation();
				var $element = $(this).closest('.linea-batch');
				$('.linea-batch').removeClass('active-settings');
				
				$('body').addClass('settings-open');
				$element.addClass('active-settings');

			});


			$('#listado-citas').on('click', '.btn-close-general-config', function(e){
				e.stopPropagation();
				var $element = $(this).closest('.linea-batch');
				$element.removeClass('active-settings');
				$('body').removeClass('settings-open');
			});

			$('#listado-citas').on('click', '.btn-cancelar-cita', function(e){
				e.stopPropagation();
				var $element = $(this).closest('.linea-batch');
				_modalCancelarCita = (typeof $element.data('meta')!= 'undefined' ? $element.data('meta') : null);

				if(_modalCancelarCita!=null)
					modalCancelarCita.openModal();
				
			});

			$('#listado-citas').on('click', '.btn-cancelar-visita', function(e){
				e.stopPropagation();
				var $element = $(this).closest('.linea-batch');
				_modalCancelarVisita = (typeof $element.data('meta')!= 'undefined' ? $element.data('meta') : null);

				if(_modalCancelarVisita!=null)
					modalCancelarVisita.openModal();
				
			});

			$('#listado-citas').on('click', '.btn-reprogramar-cita', function(e){
				e.stopPropagation();
				var $element = $(this).closest('.linea-batch');
				_modalReprogramarCita = (typeof $element.data('meta')!= 'undefined' ? $element.data('meta') : null);

				if(_modalReprogramarCita!=null)
					modalReprogramarCita.openModal();
				
			});
			
			$('body').on('click', '.settings-ri .cont-set-ri', function(e){
				e.stopPropagation();
			});
			
		}


		function generarListadoInicial(){

			var $elements = $listaCitas.find('.linea-batch');
			var total = $elements.length;

			$elements.each(function (index, value) { 
			  var meta = ( typeof $(this).data('meta') != 'undefined' ? $(this).data('meta') : null );
			  var $element = $(this);

				if(meta != null){
					var elemento = generarHTMLCitas(meta, index);
					$element.html(elemento);
					$element.attr('id', 'cita-'+meta.id);
				}
			});
		}

		function generarHTMLCitas(meta, index){
			var html = '';

			var arrLineas, lineas;

			arrLineas = (typeof meta.lineas != 'undefined' ? meta.lineas.split('|') : [] );

			lineas = '';
			$.each(arrLineas, function(key, d) {
		  		lineas+= '<span title="'+d+'">'+d+'</span>';
			});

			html = '<div class="col-sm-pr-100 col-xs-12 content-item-block '+(meta.estatus == 0 ? 'item-cancelado' : '')+'"><div class="col-sm-pr-15 col-xs-12 flexbox"> <p class="mobile-only hidden-sm hidden-md hidden-lg">Número de folio:</p> <p class="flexbox v-align-center" title="'+meta.folio+'">'+meta.folio+'</p> </div><div class="col-sm-pr-15 col-xs-12 flexbox"> <p class="mobile-only hidden-sm hidden-md hidden-lg">Linea(s):</p> <p class="flexbox v-align-center cita-lineas">'+lineas+'</p> </div><div class="col-sm-pr-15 col-xs-12 flexbox"> <p class="mobile-only hidden-sm hidden-md hidden-lg">Se autorizo a:</p> <p class="flexbox v-align-center" title="'+meta.autorizado+'">'+meta.autorizado+'</p> </div><div class="col-sm-pr-20 col-xs-12 flexbox"> <p class="mobile-only hidden-sm hidden-md hidden-lg">Tipo de trámite:</p> <p class="flexbox v-align-center all-p" title="'+meta.tramite+'">'+meta.tramite+'</p> </div><div class="col-sm-pr-25 col-xs-12 flexbox"> <p class="mobile-only hidden-sm hidden-md hidden-lg">Cita:</p> <p class="flexbox v-align-center all-p cita-detalle">'+(meta.estatus == 1 ? ( meta.tipo == 1 ? 'Cita agendada el '+meta.fecha+' a las '+meta.hora : 'Visita abierta con vigencia hasta el '+meta.fecha) : 'Cancelada')+'</p> </div><div class="col-sm-pr-10 col-xs-12 general-group-options-container flexbox hidden-xs">'+(meta.estatus == 1 ? '<div class="icon-container"> <button class="simple btn-open-general-config" type="button" title="Configuración"> <span class="icon io-Gear"></span> <p>Configuración</p> </button> </div> <div class="col-sm-12 settings-ri"> <div class="col-sm-12 cont-set-ri"> <p class="col-sm-12 title-ri"> <span class="in-text-ri">Configuración</span> <button class="simple icon-text-ri btn-close-general-config" title="Cerrar"> <span class="icon io-Close"></span> </button> </p> <div class="col-sm-12 submenu-ri"> <div class="first-bloq-ri"> <a href="'+meta.detalle+'" class="btn simple btn-ver-detalle"> <span class="icon io-notes"></span> <span class="in-text-fbr">Ver detalle</span> </a> '+(meta.tipo==1 ? '<button class="simple btn-reprogramar-cita" type="button"> <span class="icon io-Month"></span> <span class="in-text-fbr">Reprogramar</span> </button><button class="simple btn-cancelar-cita" type="button"> <span class="icon io-NoEntry"></span> <span class="in-text-fbr">Cancelar</span> </button>' : '')+'</div> </div> </div> </div> ': '')+'</div>'+(meta.estatus == 1 && meta.tipo==1 ? '<div class="btn-container btn-container-2-btns col-xs-12 hidden-sm hidden-md hidden-lg"><div class="col-xs-6 btn-reprogramar-block"><button type="button" class="btn-reprogramar-cita orange">Reprogramar cita</button></div><div class="col-xs-6 btn-cancelar-block"><button type="button" class="btn-cancelar-cita">Cancelar cita</button></div></div>' : '')+'<div class="btn-container col-xs-12 hidden-sm hidden-md hidden-lg"><div class="btn-ver-detalle-block col-xs-12">'+(meta.estatus == 0 ? '<button type="button" class="btn-ver-detalle" disabled><span class="text">Ver detalle</span><span class="icon io-AccordionRightNeg"></span></button>' : '<a href="'+meta.detalle+'" class="btn-ver-detalle"><span class="text">Ver detalle</span><span class="icon io-AccordionRightNeg"></span></a>')+'</div></div></div> ';

			return html;

		}

	}

	return{
		inicializar : init
	}

})();

function addFechaError($input){
	var $container = $input.closest('.date-picker'),
	$block = $container.closest('.date-picker-container'),
	$inputContainer = $input.closest('.input'),
	error = '<label class="error error-fecha">Elige una fecha.</label>';

	if($container.find('.error-fecha').length<1){
		$block.addClass('has-error');
		$inputContainer.addClass('error');
		$container.append(error);
	}

}

function removeFechaError($input){
	var $container = $input.closest('.date-picker'),
	$block = $container.closest('.date-picker-container'),
	$inputContainer = $input.closest('.input');
	
	$block.removeClass('has-error');
	$inputContainer.removeClass('error');
	$container.find('.error-fecha').remove();

}

function addHoraError($select){
	var $container = $select.closest('.time-picker'),
	$block = $container.closest('.time-picker-container'),
	error = '<label class="error error-hora">Elige una hora.</label>';

	if($container.find('.error-hora').length<1){
		$block.addClass('has-error');
		$select.addClass('error');
		$container.append(error);
	}

}

function removeHoraError($select){
	var $container = $select.closest('.time-picker'),
	$block = $container.closest('.time-picker-container');
	
	$block.removeClass('has-error');
	$select.removeClass('error');
	$container.find('.error-hora').remove();

}

function updateSelectTiempos($timepicker){
	var date = $('.fecha-input').val(),
	$timeSelect = $timepicker.find('.time-select');

	$timeSelect.prop('disabled', false);

	$('.time-select').html('<option value="">Elige la hora</option>');

	if(typeof datesJSON[date] != 'undefined' && datesJSON[date].length>0)
		drawOptions();
	else
		modalSinHorarios.openModal();

	function drawOptions(){
	  	$.each(datesJSON[date], function(key, d) {
	  		$('.time-select').append('<option value="'+d+'">'+d+'</option>');
		});
	}
}

function getAvailableDateTimes(cacId){
	$.getJSON( Services.apiURL.getCACAvailableDateTimes(), { id: cacId , range: dateRange })
	  .done(function( json ) {
	  	datesJSON = Services.citas.getCACAvailableDateTimesSuccessCallback(json, dateRange);
	  })
	  .fail(function( jqxhr, textStatus, error ) {
	  	//callDrawMarkers({ success: false, data: null });
	  	Services.citas.getCACAvailableDateTimesFailResponse();
	});
}

function resetFechaHoraCAC(showErrors){

	if(showErrors)
		addFechaError($('#input-fecha-corte'));
	
	$('#time-picker').prop('disabled', true);
	$('#time-picker').html('<option value="">Elige la hora</option>');
  	$('.date-picker .calendar').datepicker( "setDate" , null );
  	$('#input-fecha-corte').val('');
  	$('.date-picker .fecha-corte').html('');
}

if($('#modal-error-solicitud').length>0)
	initModalErrorSolicitud();

if($('#modal-geolocation').length>0)
	initModalGeolocation();

if($('#modal-sin-horarios').length>0)
	initModalSinHorarios();

if($('#modal-cancelar-cita').length>0)
	initModalCancelarCita();

if($('#modal-cancelar-visita').length>0)
	initModalCancelarVisita();
	
if($('#modal-reprogramar-cita').length>0)
	initModalReprogramarCita();