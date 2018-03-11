var Indices = (function renderIndice(){

  function init(){
    if($('.indice').length > 0){
      $('.indice .flujo').each(function(){
        renderFlujo($(this));
      });
    }
  }



  function renderFlujo($flujo){
    var flujo_titulo = $flujo.data('titulo');
    var $subflujos = $flujo.find('.subflujo');

    var html = '          <h3 class="h3">Flujo: '+flujo_titulo+'</h3>\n';
    $subflujos.each(function(){
      renderSubflujo($(this));
    });

    $flujo.prepend(html);

  }

  function renderSubflujo($subflujo){
    var subflujo_titulo = $subflujo.data('titulo');
    var $pasos = $subflujo.find('.paso');

    var html_prepend = '            <h4 class="h3 titulo-caso">'+subflujo_titulo+'</h4>\n';
    html_prepend += '          <div class="row pasos pasos-'+ $pasos.length +'">\n';
    var html_append = '          </div>';

    $subflujo.prepend(html_prepend);

    $pasos.each(function(){
      renderPaso($(this));
    });

    $subflujo.append(html_append);

  }

  function renderPaso($paso){
    var paso_titulo = $paso.data('titulo');
    var paso_archivo = $paso.data('archivo');
    var paso_ux = $paso.data('ux');
    var html ='';

    if(paso_titulo && paso_archivo){
      html += '            <div class="paso">\n';
      html += '              <a href="'+paso_archivo+'" class="bton blue-normal" target="_blank">'+paso_titulo+'</a>\n';

      if (paso_ux)
        html += '              <a class="ux" href="'+paso_ux+'" target="_blank">UX</a>\n';   

      html += '            </div>\n';   
    }
    $paso.siblings('.pasos').append(html);
    $paso.remove();
  }

  return{
    inicializar: init
  }

})();

Indices.inicializar();