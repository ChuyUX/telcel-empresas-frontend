var chartsMTE = (function(){

	var $chartsContainer = $('.pie-chart-container');

	function initializeCharts(){
		setLoaders();

		// Petición para obtener el script del mapa
		$.ajax({
		  url: 'https://www.gstatic.com/charts/loader.js',
		  dataType: "script"
		}).
		// Al ser satisfactoria inicializamos el mapa
		done(function(){
			var hash = window.location.hash;
			setTimeout(function(){
				mainInitCharts();
	      	}, 1500);

      		
		}).
		fail(function(){
			throw new NuevoError("No se pudo cargar la API de las gráficas, algunas funciones no estarán disponibles en la página.");

			//Volver a hacer un segundo intento si fue fail.
			// Petición para obtener el script del mapa
			$.ajax({
			  url: 'https://www.gstatic.com/charts/loader.js',
			  dataType: "script"
			}).
			// Al ser satisfactoria inicializamos el mapa
			done(function(){
				var hash = window.location.hash;
				setTimeout(function(){
					mainInitCharts();
		      	}, 1500);

	      		
			});
		});
	}

	function mainInitCharts(){
		google.charts.load('current', {'packages':['corechart']});
		loadCharts();
		setActions();
		setActionsError();
	}

	function reinitDuplicates(){
		google.charts.load('current', {'packages':['corechart']});
		loadChartsDuplicate();
		setActions();
		setActionsError();
	}

	function loadCharts(){
		google.charts.setOnLoadCallback(initCharts);
	}

	function loadChartsDuplicate(){
		google.charts.setOnLoadCallback(initChartsSwiperDuplicate);
	}

	function loadChart($container){
		$chart = $container.find('.pie-chart-block');
		var i = $chart.data('index');
		initChart($chart, i);
		loadingChart($container, false);
	}

	function loadIndividualChart(){}

	function setError(){

		var html = '<div class="col-sm-12 api-msg api-msg-error"> <div class="notif-bloq"> <div class="row"> <div class="col-xs-12 col-sm-12 inner-nb"> <span class="icon io-Alert2"></span> <h2 class="h4">Información no disponible por el momento.</h2> <p class="p-only"><button class="btn-like-a btn-reintentar">Reintentar</button></p></div> </div> </div> </div>';

		$chartsContainer.each(function(){
			var $chartContainer = $(this);
			$chartContainer.append(html);

			loadingChart($chartContainer, false);
		});


	}


	function setChartError($chart){
		var $chartContainer = $chart.closest('.pie-chart-container');
		var html = '<div class="col-sm-12 api-msg api-msg-error"> <div class="notif-bloq"> <div class="row"> <div class="col-xs-12 col-sm-12 inner-nb"> <span class="icon io-Alert2"></span> <h2 class="h4">Información no disponible por el momento.</h2> <p class="p-only"><button class="btn-like-a btn-reintentar">Reintentar</button></p></div> </div> </div> </div>';

		$chartContainer.append(html);

		loadingChart($chartContainer, false);

		$chartContainer.find('.first-chart').show();

	}

	function initCharts(){

      	var $charts = $chartsContainer.find('.pie-chart-block');

      	$chartsContainer.find('.first-chart').hide();
		$charts.each(function(index){
			var $chart = $(this);
			var i = $chart.data('index');

			/*Get data*/
			var loaded = typeof $chart.data('loaded') != 'undefined' ? Number($chart.data('loaded')) : 0;

			if(loaded)
				initChart($chart, i);
			else
				setChartError($chart);
  		});
	}

	function initChartsSwiperDuplicate(){

		var $chartsContainerDuplicate = $('.pie-chart-container.swiper-slide-duplicate');

      	var $charts = $chartsContainerDuplicate.find('.pie-chart-block');

      	$chartsContainerDuplicate.find('.first-chart').hide();

		$charts.each(function(index){
			var $chart = $(this);
			var i = $chart.data('index');

			/*Get data*/
			var loaded = typeof $chart.data('loaded') != 'undefined' ? Number($chart.data('loaded')) : 0;

			if(loaded)
				initChart($chart, i);
			else
				setChartError($chart);
  		});
	}

	function initChart($chart, i){
		var id = 'pie-chart-'+i,
		percentage = $chart.data('percentage'),
		colors = $chart.data('colors'),
		text = $chart.data('description');

		if($('#'+id).length>0)
			id = 'pie-chart-'+i+'-'+i;

		$chart.attr('id', id );


		var $chartContainer = $chart.closest('.pie-chart-container');

        if(typeof percentage != 'undefined') {

            drawChart(id, percentage, colors, text);
            
            if($chartContainer.hasClass('swiper-slide') && !firstChartLoaded){
				firstChartLoaded = true;
				$chartContainer.addClass('firstLoaded');
				var $swiper = $chartContainer.closest('.swiper-mobile');
				var toSlide = (Number(i)-1 >-1 ? Number(i)-1 : Number(i)+1);
				swipersM[$swiper.data('index')].slideTo(toSlide);
				swipersM[$swiper.data('index')].slideTo(i);
				
			}
        }

        $chartContainer.find('.first-chart').show();
	}

	function setActions(){
		$('body').bind('resizeChart', '.pie-chart-container', function(){ 
			initCharts();
		});
	}

	function setActionsError(){
		$('.pie-chart-container').on('click', '.btn-reintentar', function(){
			var $button = $(this),
			$container = $button.closest('.pie-chart-container');
			loadingChart($container, true);
			setTimeout(function(){
				loadChart($container);
			}, 3000);
			
			$container.find('.api-msg-error').remove();
			
		});
	}

	function calculatePercentage(){

	}



	function drawChart(chartId, percentage, colors, text){
		percentage = JSON.parse('[' + percentage + ']'); 
		colors = JSON.parse('[' + colors + ']');

		var pairs = [['Task', 'Hours per Day']];

		$.each(percentage, function( i, value ) {
			var aux = ['', percentage[i]/10];
		  	pairs.push(aux);
		});

		var pairsColors = {};

		$.each(colors, function( i, value ) {
			pairsColors[i] = {color : colors[i]} ;
		});

		var data = google.visualization.arrayToDataTable(pairs);
		var container = $('#'+chartId);
		var size = ($(container).width() <240 ? 240 : $(container).width()-20);

        var options = {
			backgroundColor : 'transparent',
			legend: 'none',
			pieSliceText: 'none',
			pieStartAngle: 155,
			tooltip: { trigger: 'none' },
			slices: pairsColors,
			width :size,
            height :size,
            is3D : false,
            pieStartAngle: 290,
            enableInteractivity: false
		};

		var $chart = $('#'+chartId);
        drawingChart($chart, chartId, data, options);

        if(typeof text != 'undefined')
        	$chart.find('>div').append('<div class="chart-center"><span class="robusta">'+text+'</span></div>');
        
        $chart.closest('.pie-chart-container').find('.loading-block').hide();

        //loadingChart($chart, false);
	}

	function drawingChart($chart, chartId, data, options){

		var chart = new google.visualization.PieChart(document.getElementById(chartId));
        chart.draw(data, options);

	}

	function setLoaders(){
		$chartsContainer.each(function(){
			var $chartContainer = $(this);
			loadingChart($chartContainer, true);
		});
	}

	return{
		inicializar : initializeCharts,
		drawChart : drawingChart,
		reinitDuplicates : reinitDuplicates
	}
})();

if($('.pie-chart-block').length>0)
	chartsMTE.inicializar();