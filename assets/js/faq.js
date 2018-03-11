// Buscador del faq
var searchFaq = (function(){
    return{
        inicializar: function(){

            /*Resetar el modal cuando se hace resize*/
            var menulateralfaq = document.getElementsByClassName("search-bar-section-mobile")[0];
            if (menulateralfaq) {

                function hideMenuLateralMobile() {
                    var windowSizeFaq = window.innerWidth,
                    buscadorlateralfaq = document.getElementsByClassName("faq-left-menu")[0],
                    fondobuscadorfaq = document.getElementsByClassName("back-ftm")[0];

                    if (windowSizeFaq > 767) {
                       buscadorlateralfaq.classList.remove("flm-fixed");
                       fondobuscadorfaq.classList.remove("back-ftm-active");

                    }
                    else {}
                }
                
                window.onresize = function(event) {
                    hideMenuLateralMobile();
                };
            }
            else {}


            /*Menu para busqueda en mobile*/

            $(".float-icon-search-faq").on("click", function(){
                $(".faq-left-menu").addClass("flm-fixed");
                $(".back-ftm").addClass("back-ftm-active");
            });

            $(".back-ftm").on("click", function(){
                $(".faq-left-menu").removeClass("flm-fixed");
                $(this).removeClass("back-ftm-active");
            });



            // Overrides the default autocomplete filter function to search for matched on atleast 1 word in each of the input term's words --- PARA que acepte palabras separadas
            // $.ui.autocomplete.filter = function (array, terms) {
            //     arrayOfTerms = terms.split(" ");
            //     var term = $.map(arrayOfTerms, function (tm) {
            //          return $.ui.autocomplete.escapeRegex(tm);
            //     }).join('|');
            //    var matcher = new RegExp("\\b" + term, "i");
            //     return $.grep(array, function (value) {
            //        return matcher.test(value.label || value.value || value);
            //     });
            // };


            var NoResultsLabel = "<div class='no-results'> <p>No tenemos coincidencias con {{searchedvalue}}</p> <span>Intenta con otras palabras</span> </div>";
            var dataQuestions = [ 
                "¿Qué hago si no tengo servicio de Internet (datos)?"
                ,"¿Qué hacer en caso de Robo o extravío en el extranjero?"
                ,"¿Cómo puedo realizar el pago de mi factura?"
                ,"Quiero descargar mi factura"
                ,"Crear un grupo"
                ,"Administrar una línea"
                ,"¿Cómo agrego nuevos servicios a mi plan?"
                ,"Tengo un Plan de Renta, ¿qué tengo que contratar para viajar a Estados Unidos y que no me salga tan caro?"
                ,"Quiero contratar un plan de datos"
                ,"Quiero descativar mi línea"
                ,"Quiero pagar un grupo de líneas"
                ,"Quiero facturar periódicamente las líneas de mi cuenta"

            ];

            var accentMap = {
                'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', // a
                'ç': 'c',                                                   // c
                'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',                     // e
                'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',                     // i
                'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o', // o
                'ß': 's',                                                   // s
                'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',                     // u
                'ÿ': 'y'                                                    // y
            };

            var normalize = function( term ) {
              var ret = "";
              for ( var i = 0; i < term.length; i++ ) {
                ret += accentMap[ term.charAt(i) ] || term.charAt(i);
              }
              return ret;
            };
         
            
        
            function customFilter(array, terms) {
                arrayOfTerms = terms.split(" ");
                var term = $.map(arrayOfTerms, function (tm) {
                     return $.ui.autocomplete.escapeRegex(tm);
                }).join('|');
               var matcher = new RegExp("\\b" + term, "i");
                return $.grep(array, function (value) {
                   return matcher.test(value.label || value.value || value);
                });
            };

            $( "#input-search-faq" ).autocomplete({
                multiple: true,
                mustMatch: false,
                appendTo: "#form-search-faq .search",
        
                open: function (e, ui) {
                    var acData = $(this).data('ui-autocomplete');
                    acData
                    .menu
                    .element
                    .find('li')
                    .each(function () {
                        var me = $(this);
                        var keywords = acData.term.split(' ').join('|');
                        me.html(me.text().replace(new RegExp("(" + keywords + ")", "gi"), '<b>$1</b>'));
                     });

                    var ancho_del_input_actual = $('#input-search-faq').innerWidth(),
                        fitstyles_input = ({
                            // width: ancho_del_input_actual
                            position: "absolute",
                            top: "40px",
                            left: "0",
                        });


                    console.log( fitstyles_input );

                    $(this).autocomplete("widget").css( fitstyles_input );
                },

                source: function( request, response ) {

                    // Si no hay resultados
                    var results = $.ui.autocomplete.filter(dataQuestions, request.term);

                    var matcher = new RegExp( $.ui.autocomplete.escapeRegex( request.term ), "i" );
                    var results = $.grep( dataQuestions, function( value ) {
                      value = value.label || value.value || value;
                      return matcher.test( value ) || matcher.test( normalize( value ) );
                    });

                    if (!results.length) {
                        results = [replaceValue("searchedvalue", request.term, NoResultsLabel)];
                    }
                    function replaceValue(search, replace, string){
                        // console.log(search,replace,string);
                        // console.log (string.replace("{{" + search + "}}", replace));
                        return string.replace("{{" + search + "}}", replace);
                    }
                    // console.log(results);
                    response(results);

                },

                select: function (event, ui) {
                    var sin_resultados = "<div class='no-results'> <p>No tenemos coincidencias con";
                    if (ui.item.label.search(sin_resultados) > -1) {
                        event.preventDefault();
                    }
                },
                focus: function (event, ui) {
                    var sin_resultados = "<div class='no-results'> <p>No tenemos coincidencias con";
                    if (ui.item.label.search(sin_resultados) > -1) {
                        event.preventDefault();
                    }
                }

          } );




        }
    }
})();


/* Tabs para preguntas de FAQ */
var questionFaq = (function(){

    // SEnd number to contact

    function validatenumFaqFeed ($form){
        // var idQuestNum = $form.attr('id');

        disableSumbitButton($form, true);

        $form.validate({

            onkeyup: function(element) {
                   $(element).valid(); 
            },
            errorElement: "div",
            errorPlacement: function(error, element) {
                error.prependTo("div.cnf-errors-faq");
            }, 
            rules: {
                answer_contact_me_to_cel: {
                    required: true,
                    number: true,
                    minlength: 10
                }
            },
            messages: {
                answer_contact_me_to_cel: {
                    minlength: "El número debe de ser a 10 dígitos"
                }
            },
            submitHandler: function(form) {
                var self = $(form).serialize(),
                upperblockformnumber = $(form).parents(".active-feedback-f");

                $(".btons-number-feedback").removeClass("active-btons-number-feedback");

                // var messagenumNotreq = "<div class='understoodquestion'><p><span class='icon io-TickNeg'></span>Gracias por tu ayuda, en breve revisaremos tu solicitud.</p></div>";
                // $(this).parents(".feedback-f").append( messagenumNotreq );



                loadingIcon(form, true);
                $.when( sendFormData(self) )
                    .done(function() {
                        var child_of_question_feed = $(form).attr('id'),
                            
                            $messagenumSuctext1 = "<div class='understoodquestion icon-left'><p><span class='icon io-TickNeg'></span>¡Gracias!<br>Un ejecutivo se comunicará contigo al ",
                            $messagenumSuctext2 = " para ayudarte con tu duda.</p></div>";

                        loadingIcon(form, false);

                        $(".faq-f-feed-number").removeClass("active-fffn");

                        console.log( "En la pregunta "+ child_of_question_feed + " " + self );
                        $(form).parents(".active-q").append($messagenumSuctext1 + $form.find(".number_to_contact").val() + $messagenumSuctext2);

                    }
                );
            }
        });

        checkGeneralValidForm($form);

        function sendFormData(self){
            return $('body').delay( 2000 );
        }
        function loadingIcon(form, show){
            var loading = '<div class="loading-block"><span class="icon io-Update loading-stat"></span></div>';

            if(show){
                $(form).find('button[type="submit"]').parents(".contactnumber-feedback").append(loading);
            }
            else{
                $('.loading-block').remove();
            }
        }

        return {
            clearForm: function(){
                $form.validate().resetForm();
                $form[0].reset();
                // document.getElementByClass('fq-qt-01-04').reset();
                // console.log($form + "si jala la funcion de reset");
            }
        }

    }


    function validateformFAQfeed($form){

        var idQuest = $form.attr('id');

        disableSumbitButton($form, true);

        $form.validate({

            focusInvalid: false,
            onkeyup: function(element) {
                   $(element).valid(); 
            },
            errorElement: "div",
            errorPlacement: function(error, element) {
                error.prependTo("div.errors-faq");
            }, 
            rules: {
                answer_in_s_lvl_in: {
                    required: true
                },

                answer_in_s_lvl_in_other: {
                    required: function(){
                        var value = $form.find('input[name="answer_in_s_lvl_in"]:checked').val();
                        // console.info($form);
                        return value==='other';
                    },
                    minlength: 3,
                    maxlength: 200
                },
                answer_contact_me_to_cel: {
                    required: true,
                    number: true,
                    minlength: 10
                }
            },
            messages: {
                answer_in_s_lvl_in: "Debes elegir una opción",
                // answer_in_s_lvl_in_other: "Escribe tu comentario"
                answer_in_s_lvl_in_other: {
                    required :"Escribe tu comentario",
                    minlength: "Escribe al menos 3 letras",
                    maxlength: "Escribe un comentario mas de máximo 200 letras"
                },
                answer_contact_me_to_cel: {
                    minlength: "El número debe de ser a 10 dígitos"
                }
            },
            submitHandler: function(form) {

                var self = $(form).serialize(),
                    $pointthisForm = $(form);

                
                loadingIcon(form, true);
                $pointthisForm.find(".button-f-a").removeClass("active-button-f-a");

                $.when( sendFormData(self) )
                    .done(function() {
                        
                        loadingIcon(form, false);

                        console.log( idQuest + " " + self );
                        $pointthisForm.find(".first-lvl").addClass("active-first-lvl");
                        $pointthisForm.find(".second-lvl").removeClass("active-lvl");
                        $pointthisForm.find(".first-lvl").removeClass("active-first-lvl");
                        $pointthisForm.siblings(".faq-f-feed-number").addClass("active-fffn");
                        $pointthisForm.siblings(".faq-f-feed-number").find(".btons-number-feedback").addClass("active-btons-number-feedback");

                        $pointthisForm.siblings(".faq-f-feed-number").each(function( index ) {
                            var $form = $(this);
                            validatenumFaqFeed($form);
                        });

                    });
            }
        });

        checkGeneralValidForm($form);

        function sendFormData(self){
            return $('body').delay( 2000 );
        }
        function loadingIcon(form, show){
            var loading = '<div class="loading-block"><span class="icon io-Update loading-stat"></span></div>';

            if(show){
                $(form).find('button[type="submit"]').parents(".active-feedback-f").append(loading);
            }
            else{
                $('.loading-block').remove();
            }
        }



        return {
            clearForm: function(){
                $form.validate().resetForm();
                $form[0].reset();
                // document.getElementByClass('fq-qt-01-04').reset();
                // console.log($form + "si jala la funcion de reset");
            }
        }


    }


    return{
        inicializar: function(){
            $(".full-question .question-f").on("click", function(){
                var $questblockClicked = $(this),
                    $formRelative = $questblockClicked.siblings(".feedback-f").find(".faq-form-feed"),
                    $secondformRelative = $questblockClicked.siblings(".feedback-f").find(".faq-f-feed-number"),
                    succesblockmessagefaq = $questblockClicked.siblings(".understoodquestion"),
                    secondblockmessagefaq = $questblockClicked.siblings(".active-feedback-f").find(".active-fffn");

                    $questblockClicked.siblings(".feedback-f").removeClass("active-feedback-f");
                    $questblockClicked.siblings(".feedback-f").find(".first-lvl");


                if ( $questblockClicked.parent(".full-question").hasClass("active-q") )
                {
                    $questblockClicked.parent().removeClass("active-q");
                    $(".full-question .second-lvl").removeClass("active-lvl");
                    $(".full-question .first-lvl").removeClass("active-first-lvl");
                    $questblockClicked.siblings(".feedback-f").removeClass("active-feedback-f");
                }

                else
                {

                    $questblockClicked.siblings(".feedback-f").addClass("active-feedback-f");
                    $(".full-question .first-lvl").addClass("active-first-lvl");
                    $(".number_to_contact").val("");
                    $(".full-question .second-lvl").removeClass("active-lvl");
                    $(".faq-question-block .full-question").removeClass("active-q");
                    $questblockClicked.parent(".full-question").toggleClass("active-q");

                    validateformFAQfeed( $formRelative ).clearForm();
                    validatenumFaqFeed( $secondformRelative );
                }

                $('html, body').animate({
                    scrollTop: $( $questblockClicked ).offset().top
                }, 500);



                if ( succesblockmessagefaq[0] ) {
                    $questblockClicked.siblings(".feedback-f").removeClass("active-feedback-f");
                }
                else {}

                if ( secondblockmessagefaq[0] ) {
                    secondblockmessagefaq.siblings(".faq-form-feed").find(".first-lvl").removeClass("active-first-lvl");
                }
                else {}

                // Limpiar formularios y errores
                $("form").validate().resetForm();
                // $(".faq-f-feed-number").removeClass("active-fffn");
                $(".input-other-faq").removeClass("active-iof");
                $(".errors-faq, .cnf-errors-faq").html("");
                $(".number_to_contact").removeClass("error");

                return $questblockClicked;
            });

            $(".to-hi-check").on("click", function(){
                var $fakeLabelclicked = $(this),
                    $locateforminclick = $fakeLabelclicked.parents('form'),
                    $idlocateforminclick = $locateforminclick.attr("id"),
                    $valuefeedInput = $(this).siblings(".hide-input").val(),
                    $messagethanks = "<div class='understoodquestion'><p><span class='icon io-TickNeg'></span>Agradecemos tu ayuda</p></div>";

                if ( $valuefeedInput == "feedback-yes" ) {
                    $fakeLabelclicked.parents(".first-lvl").siblings(".second-lvl").addClass("active-lvl");
                    $fakeLabelclicked.parents(".first-lvl").siblings(".second-lvl").find(".button-f-a").addClass("active-button-f-a");
                }
                else if ( $valuefeedInput == "feedback-no" ) {
                    $fakeLabelclicked.parents(".first-lvl").siblings(".second-lvl").removeClass("active-lvl");
                    $fakeLabelclicked.parents(".full-question").append($messagethanks);
                    $fakeLabelclicked.parents(".feedback-f").removeClass("active-feedback-f");
                    console.log("id de Pregunta:  "+ $idlocateforminclick + "  La pregunta quedó clara");
                }

                $(".input-other-faq input").val( "" );
                    

            });
            $(".clear-action-f-a").on("click", function(){
                $(".second-lvl.active-lvl").removeClass("active-lvl");
                $(".data-write .hide-input").prop( "checked", false );
                $(".input-other-faq").removeClass("active-iof");
            });

            $(".normal-faq-asnwer input").on("click", function(){
                // $( ".data-write.input-other-faq" ).remove();
                $( ".errors-faq .error" ).hide();
                var nextfielnorm = $(".normal-faq-asnwer input").parent().siblings(".input-other-faq");
                $(nextfielnorm).find("input").removeClass('error');
                $(nextfielnorm).removeClass("active-iof");
            });

            $(".data-write.other-faq-asnwer input").on("click", function(){
                
                var nextfieldother = $(".data-write.other-faq-asnwer input").parent().siblings(".input-other-faq");
                $(nextfieldother).addClass("active-iof");

            });

            $(".do-not-contact-me").on("click", function(){
                var messagenumNotreq = "<div class='understoodquestion'><p><span class='icon io-TickNeg'></span>Gracias por tu ayuda, en breve revisaremos tu solicitud.</p></div>";
                $(this).parents(".active-q").append( messagenumNotreq );

                $(".faq-f-feed-number").removeClass("active-fffn");
                

            });



            // // SEnd number to contact
            // $(".contactnumber-feedback .bton_not_contact_me_to_cel").on("click", function (){
            //     $(".full-question.active-q").append($messagenumNotreq);
            //     $(".contactnumber-feedback").hide();
            // });
            


            $('.faq-form-feed').each(function( index ) {
                var $form = $(this);
                validateformFAQfeed($form);
            });



            // SEnd number to contact
            // $('.contactnumber-feedback').each(function( index ) {
            // });

        }
    }

})();