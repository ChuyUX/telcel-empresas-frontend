
/* Para agregar el footer y header dinamicamente */
var pushHeaderFooter = (function(){
    return{
        inicializar: function(){

            var $body = $('html body'),
            $fullContent = $body.find('.full-content'),
            isloggedin = !$body.hasClass('no-user-logged-in'),
            isEjecutivos = $body.hasClass('header-ejecutivos'),
            isAdmin = $body.hasClass('admin-mode'),
            template_header_url = (isAdmin ? '../../sections/header-footer/header-admin.html' : isEjecutivos ? '../../sections/header-footer/header-ejecutivos.html' : (!isloggedin ? '../../sections/header-footer/header-invitado.html' : '../../sections/header-footer/header.html')),
            template_footer_url = (isloggedin ? ( isEjecutivos ? '../../sections/header-footer/footer-ejecutivos.html' : '../../sections/header-footer/footer.html') : '../../sections/header-footer/footer-log-out.html'),
            template_footer_cta_url = (isloggedin ? '../../sections/header-footer/footer-cta.html' : '../../sections/header-footer/footer-cta-log-out.html'),
            template_header_m_url = (isAdmin ? '../../sections/header-footer/header-m-admin.html' : isEjecutivos ? '../../sections/header-footer/header-m-ejecutivo.html' : (!isloggedin ? '../../sections/header-footer/header-m-invitado.html' : '../../sections/header-footer/header-m.html')),
            template_modal_error = '../../sections/header-footer/modal-masivo-error.html',
            template_modal_landscape = '../../sections/header-footer/modal-landscape.html';

            if ($body.hasClass('MTE')){

                if( !$body.hasClass('no_heading') && !$body.hasClass('no_heading-footer')){
                    

                    $.get( template_header_url , function( template_header ) {
                        $fullContent.prepend(template_header);
                        //Header degradado
                        if($body.hasClass('header-con-degradado'))
                            $('header.container-fluid').addClass('navigation-main-tab');

                        checkMainHeaderFixed();

                        if($body.hasClass('no-header-ticket-fast'))
                            $('header .main-links').remove();
                    });

                    $.get( template_header_m_url , function( template_header_m ) {
                      $( template_header_m ).insertBefore( $fullContent );
                      jqueryAutocompleteRemote();
                    });


                }

                if(!$body.hasClass('no_heading-footer')){
                    $.get( template_footer_url , function( template_footer ) {
                      $fullContent.append(template_footer);
                    });

                    $.get( template_footer_cta_url , function( template_footer_cta ) {
                      $fullContent.find('#info-content').append(template_footer_cta);

                        if($body.hasClass('no_heading')){
                            $('#info-content .last-section-cnt .get-ticket-fast').remove();
                            $('#info-content .get-fast-ticket').parent('section').remove();
                        }
                        
                        if($body.hasClass('no_footer_cta')){
                            $('#info-content .get-fast-ticket').parent('section').remove();
                            $('#info-content .last-section-cnt').remove();
                        }

                        if($body.hasClass('no-header-ticket-fast')){
                            $('#info-content .get-fast-ticket .block-gft').remove();
                        }

                    });

                }

                $.get( template_modal_error , function( template_error ) {
                    $fullContent.prepend(template_error);
                    //Header degradado
                    var hash = window.location.hash;
                    if(hash=='#alerta-general-conexion')
                        $('#modal-error-general').addClass('active');
                });

                $.get( template_modal_landscape , function( template_landscape ) {
                    $fullContent.prepend(template_landscape);
                });


                function checkMainHeaderFixed(){
                    var $header = $('#main-header');

                    addInvisibleElement($header);
                    $(window).scroll(function() {
                        var scroll = $(window).scrollTop();
 
                        if (scroll >= 15) {
                            $header.addClass('fixed-header');
                        } else {
                            $header.removeClass('fixed-header');
                        }
                    });
                }

                function addInvisibleElement($tofix){
                    $( '<div class="main-header-fixed-auxiliar"></div>').insertAfter( $tofix );
                }
            }
        }
    }

})();


document.addEventListener("DOMContentLoaded", function(event) { 

    // Para poner en el clipboard el valor de un input
    new Clipboard('.c-and-p');
    $(".c-and-p").on('click', function(){
        var $cp = $(this);
        $cp.addClass("ready-on-cb");

        setTimeout(function(){
            $cp.fadeOut(500);
        },2000);
    })

    // Define el dia de hoy para los calendarios
    var defineToday = moment().format('YYYY-MM-DD')

    // Define 5 dias proximos para el calendario
    ,defineinFiveDays = moment().transform('YYYY-MM-+05').format('YYYY-MM-DD');

    // Para inicializar en .calendarBox agregados dinámicamente
    $(document).on('focus',".calendarBox.dynamic", function(){
        $(this).daterangepicker(
            {
                locale: {
                  format: 'YYYY-MM-DD'
                },
                "startDate": defineToday,
                "endDate": defineinFiveDays,
                "minDate": defineToday,
                "buttonClasses": "bton",
                "applyClass": "orange",
                "cancelClass": "",
                "opens": "center"

            }
        );
    });
});

$(document).ready(function(){
    $(this).scrollTop(0);

    function init(){


        // Set orientation on initiliasation
        currentOrientation();
        // Reset orientation each time window is resized. Keyboard opening, or change in orientation triggers this.
        $(window).on("resize", currentOrientation);

        initmodalLimitarMasivo();

        var $tofixAfter = $('.to-fixed-block.after-general');
        if($tofixAfter.length>0)
            initCheckFixedHeader($tofixAfter);

        if($('.ver-por-pagina-block').length>0)
            verPorPagina();

        if($('.general-block.has-filters .order-by-query').length>0)
            orderItemsQueryURL();


        initRefreshSite();
        initSendTo();
        //preventPaste();
        validateOneField();
        initSendToGestion();
        goToTop();
        chatWindow();


        generalContainerFS.inicializar();

        /**fin Acciones masivas en modal bloqueo masivo**/
        if($('.bloquear-acciones-masivas').length>0)
            initAccionesMasivasModal();

        if($('#modal-error-mantenimiento').length>0)
            initModalErrorMantenimiento();

        if(typeof searchFaq!= 'undefined')
            searchFaq.inicializar();

        if(typeof pushHeaderFooter!= 'undefined')
            pushHeaderFooter.inicializar();

        if(typeof questionFaq!= 'undefined')
            questionFaq.inicializar();

        if(typeof menuComponent !='undefined')
            menuComponent.fInitMenu();

        if(typeof tokenFieldComponent !='undefined')
            tokenFieldComponent.inicializar();

        /*Inicio componente Login*/
        if(typeof loginTemplate !='undefined')
            loginTemplate.inicializar();
        
        if(typeof miCuenta !='undefined')
            miCuenta.inicializar();

        if(typeof activacionCuenta !='undefined')
            activacionCuenta.inicializar();

        if(typeof estableceContrasena !='undefined')
            estableceContrasena.inicializar();
        /*Fin componente Login*/

        /*Inicio componente gestión de grupos*/
        if(typeof gestionGrupos !='undefined')
            gestionGrupos.inicializar();
        /*Fin componente gestión de grupos*/

        if(typeof homeAdminComponent!='undefined' && $('#gestionar-favoritos').length>0)
            homeAdminComponent.fInitComponent();

        if(typeof chartsTelcel !='undefined')
            chartsTelcel.inicializar();

        if(typeof swipersMTelcel !='undefined')
            swipersMTelcel.inicializar();

        if(typeof sliderCreate != 'undefined')
            sliderCreate.inicializar();

        /** componente enviar correo confirmación**/
        if(typeof confirmacionEnvioCorreo !='undefined')
            confirmacionEnvioCorreo.inicializar();
        /** fin componente enviar correo confirmación**/

        /**Inicio componente autogestion general**/
        if(typeof autogestionTelcel !='undefined')
            autogestionTelcel.inicializar();
        /** Fin componente autogestion general**/

        /**Inicio componente notificaciones**/
        if(typeof notificaciones !='undefined')
            notificaciones.inicializar();
        /**Fin componente notificaciones**/

        /**Componente gestión de ejecutivos**/
        if(typeof gestionEjecutivos !='undefined' && $('.gestion-ejecutivos-block').length>0)
            gestionEjecutivos.inicializar();
        /**Fin Componente gestión de ejecutivos**/

        /**Componente gestión de ejecutivos**/
        if(typeof historialMovimientos !='undefined' && $('.historial-movimientos-block').length>0)
            historialMovimientos.inicializar();
        /**Fin Componente gestión de ejecutivos**/

        /**Componente sertec**/
        if(typeof sertec !='undefined' && $('.sertec-block').length>0)
            sertec.inicializar();
        /**Fin Componente sertec**/

        /**Componente home**/
        if(typeof home !='undefined')
            home.inicializar();
        /**Fin Componente home**/

        /**Componente citas**/
        if(typeof misCitas !='undefined')
            misCitas.inicializar();
        if(typeof CACcomponent !='undefined')
            CACcomponent.inicializar();
        /**Fin Componente citas**/

        /**Componente adendum**/
        if(typeof adendum !='undefined' && $('.adendum-block').length>0)
            adendum.inicializar();
        /**Fin Componente adendum**/

        /**Componente Carga masiva**/
        if(typeof cargaMasivaGrupos !='undefined' && $('.carga-masiva-block').length>0)
            cargaMasivaGrupos.inicializar();
        /**Fin Componente Carga masiva**/

        /**Header Radio opciones**/
        if($('.options-header-block .element-option').length>0)
            initHeaderOptions();
        /**Fin Header Radio opciones**/


        checkOnlyNumberElements();
        checkOnlyEmailElements();


        if (is_desktop()) {
            checkOnlyAlphanumericElements();
        } 


        terminosActions();
        initActionsTerminosGenerales();
        
        cerrarConfiguracionAfuera();

        if(typeof ingresarLineasComponent !='undefined')
            ingresarLineasComponent.inicializar();


        if(typeof FAQComponente !='undefined' && $('.faq-main').length>0)
            FAQComponente.inicializar();

        if(typeof facturacionTelcel !='undefined' && $('.facturacion-block').length>0 || $('.autogestion-facturacion-block').length>0)
            facturacionTelcel.inicializar();


        initCheckInputRegex();

    }


    var hash = window.location.hash;
    // EJEMPLO PANTALLA MOSTRAR CHIP
    if($('.notificacion-chip-container').length>0){
        
        if(hash=='#notificacionChip')
            $('.notificacion-chip-container').show();
    }

    //EJEMPLO MOSTRAR EXITO
    if($('.success-tooltip').length>0){
        
        if(hash=='#exito')
            $('.success-tooltip').removeClass('hidden');

        if(hash=='#cambioPass'){
            $('.success-tooltip p').html('Tu contraseña ha sido cambiada con éxito.');
            $('.success-tooltip').removeClass('hidden');
        }


    }

    /** En éxito login **/
    if(hash=='#exitoLogin'){
        var $infoContent = $('body #info-content');
        var htmlExitoLogin = '<div id="login-exito-msg" class="fixed"> <div class="container"> <div class="row"> <div class="col-sm-12 col-xs-12 center-block flexbox v-align-center main-block system-general-msg-fs"> <div class="success-tooltip back-green vertical-align col-sm-7 col-xs-12 system-msg"> <div class="center-element"> <span class="icon io-TickNeg"></span> <p>​Bienvenido a Mi Telcel Empresas. Tu cuenta ha sido activada con éxito.</p> </div> <span class="close-msg"> <span class="icon io-Close"></span> </span> </div> </div> </div> </div> </div>';

        $infoContent.prepend(htmlExitoLogin);

        $infoContent.find('.close-msg').on('click', function(e){
            e.stopPropagation();
            $('#login-exito-msg').remove();
        });

        $infoContent.find('.system-general-msg-fs').on('click', function(e){
            e.stopPropagation();
            $('#login-exito-msg').remove();
        });

        $infoContent.find('.system-msg').on('click', function(e){
            e.stopPropagation();
        });
    }
    /** Fin éxito login **/

    /** En aviso **/
    if(hash=='#avisoErrorGeneral'){
        generalErrorButtonAction(true);
    }
    /** Fin aviso **/

    //EJEMPLO MOSTRAR ERROR
    if($('.error-tooltip').length>0){
        
        if(hash=='#error')
            $('.error-tooltip').removeClass('hidden');
    }

    //MOSTRAR ERROR DE PASSWORD
    if($('#pass-incorrecto').length>0){
        
        if(hash=='#passIncorrecto'){
            $('#pass-incorrecto').removeClass('hidden');
            $('#pass-usuario').addClass('error');
        }
    }

        //MOSTRAR ERROR DE PASSWORD
    if($('#pass-igual').length>0){
        if(hash=='#passIgual'){
            $('#pass-igual').removeClass('hidden');
            $('#nuevo-pass-usuario').addClass('error');
            $('#nuevo-pass-usuario-r').addClass('error');
        }
    }


    init();

});