//JS: Multiplica

/*Variable auxiliar de cuentas asociadas**/
var cuentasAsociadasAuxiliar = [
	{
		id: "1",
		tipo: 1,
		cuenta: '1278348812',
		region : '1',
		rfc : 'ALMD210389HST',
		razonsocial : 'TDMA Celular S.A. de C.V.',
		asociada : true
	},
	{
		id: "2",
		tipo: 1,
		cuenta: '3476120923',
		region : '9',
		rfc : 'CM4D3S0389HST',
		razonsocial : 'LALAD Celular S.A. de C.V.',
		asociada : false
	},
	{
		id: "3",
		tipo: 2,
		cuenta: '0956781673',
		region : '2',
		rfc : 'ALMD29IS45HST',
		razonsocial : 'CFGM Celular S.A. de C.V.',
		asociada : true
	},
	{
		id: "4",
		tipo: 1,
		cuenta: '9876540999',
		region : '9',
		rfc : 'LKS3450389HST',
		razonsocial : 'ARHF Celular S.A. de C.V.',
		asociada : true
	},
	{
		id: "5",
		tipo: 2,
		cuenta: '7783326532',
		region : '3',
		rfc : 'A2EDR50389HST',
		razonsocial : 'AAA Celular S.A. de C.V.',
		asociada : false
	},
	{
		id: "6",
		tipo: 2,
		cuenta: '9865430912',
		region : '6',
		rfc : 'ERWA450389HST',
		razonsocial : 'Erwin Watt S.A. de C.V.',
		asociada : false
	},
	{
		id: "7",
		tipo: 2,
		cuenta: '0988906728',
		region : '7',
		rfc : 'TBON450389HST',
		razonsocial : 'Tim Burton S.A. de C.V.',
		asociada : false
	},
	{
		id: "8",
		tipo: 1,
		cuenta: '3455430923',
		region : '9',
		rfc : 'ERWA450389HST',
		razonsocial : 'Erwin Watt S.A. de C.V.',
		asociada : true
	},
	{
		id: "9",
		tipo: 2,
		cuenta: '7896547834',
		region : '4',
		rfc : 'TROY450389HST',
		razonsocial : 'The Royals S.A. de C.V.',
		asociada : false
	},
	{
		id: "10",
		tipo: 1,
		cuenta: '1278561092',
		region : '1',
		rfc : 'EHAR450389HST',
		razonsocial : 'Ella Harper S.A. de C.V.',
		asociada : false
	},
	{
		id: "11",
		tipo: 1,
		cuenta: '8877662356',
		region : '9',
		rfc : 'PAPER50389HST',
		razonsocial : 'Paper S.A. de C.V.',
		asociada : false
	},
	{
		id: "12",
		tipo: 2,
		cuenta: '9098909837',
		region : '3',
		rfc : 'KIRK450389HST',
		razonsocial : 'Kirkus Reviews S.A. de C.V.',
		asociada : true
	},
	{
		id: "13",
		tipo: 1,
		cuenta: '1278348812',
		region : '1',
		rfc : 'ALMD210389HST',
		razonsocial : 'TDMA Celular S.A. de C.V.',
		asociada : true
	},
	{
		id: "14",
		tipo: 1,
		cuenta: '3476120923',
		region : '9',
		rfc : 'CM4D3S0389HST',
		razonsocial : 'LALAD Celular S.A. de C.V.',
		asociada : false
	},
	{
		id: "15",
		tipo: 2,
		cuenta: '0956781673',
		region : '2',
		rfc : 'ALMD29IS45HST',
		razonsocial : 'CFGM Celular S.A. de C.V.',
		asociada : true
	},
	{
		id: "16",
		tipo: 1,
		cuenta: '9876540999',
		region : '9',
		rfc : 'LKS3450389HST',
		razonsocial : 'ARHF Celular S.A. de C.V.',
		asociada : true
	},
	{
		id: "17",
		tipo: 2,
		cuenta: '7783326532',
		region : '3',
		rfc : 'A2EDR50389HST',
		razonsocial : 'AAA Celular S.A. de C.V.',
		asociada : false
	},
	{
		id: "18",
		tipo: 2,
		cuenta: '9865430912',
		region : '6',
		rfc : 'ERWA450389HST',
		razonsocial : 'Erwin Watt S.A. de C.V.',
		asociada : false
	},
	{
		id: "19",
		tipo: 2,
		cuenta: '0988906728',
		region : '7',
		rfc : 'TBON450389HST',
		razonsocial : 'Tim Burton S.A. de C.V.',
		asociada : false
	},
	{
		id: "20",
		tipo: 1,
		cuenta: '3455430923',
		region : '9',
		rfc : 'ERWA450389HST',
		razonsocial : 'Erwin Watt S.A. de C.V.',
		asociada : true
	},
	{
		id: "21",
		tipo: 1,
		cuenta: '1278348812',
		region : '1',
		rfc : 'ALMD210389HST',
		razonsocial : 'TDMA Celular S.A. de C.V.',
		asociada : true
	},
	{
		id: "22",
		tipo: 1,
		cuenta: '3476120923',
		region : '9',
		rfc : 'CM4D3S0389HST',
		razonsocial : 'LALAD Celular S.A. de C.V.',
		asociada : false
	},
	{
		id: "23",
		tipo: 2,
		cuenta: '0956781673',
		region : '2',
		rfc : 'ALMD29IS45HST',
		razonsocial : 'CFGM Celular S.A. de C.V.',
		asociada : true
	},
	{
		id: "24",
		tipo: 1,
		cuenta: '9876540999',
		region : '9',
		rfc : 'LKS3450389HST',
		razonsocial : 'ARHF Celular S.A. de C.V.',
		asociada : true
	},
	{
		id: "25",
		tipo: 2,
		cuenta: '7783326532',
		region : '3',
		rfc : 'A2EDR50389HST',
		razonsocial : 'AAA Celular S.A. de C.V.',
		asociada : false
	},
	{
		id: "26",
		tipo: 2,
		cuenta: '9865430912',
		region : '6',
		rfc : 'ERWA450389HST',
		razonsocial : 'Erwin Watt S.A. de C.V.',
		asociada : false
	},
	{
		id: "27",
		tipo: 2,
		cuenta: '0988906728',
		region : '7',
		rfc : 'TBON450389HST',
		razonsocial : 'Tim Burton S.A. de C.V.',
		asociada : false
	},
	{
		id: "28",
		tipo: 1,
		cuenta: '3455430923',
		region : '9',
		rfc : 'ERWA450389HST',
		razonsocial : 'Erwin Watt S.A. de C.V.',
		asociada : true
	},
	{
		id: "29",
		tipo: 2,
		cuenta: '7896547834',
		region : '4',
		rfc : 'TROY450389HST',
		razonsocial : 'The Royals S.A. de C.V.',
		asociada : false
	},
	{
		id: "30",
		tipo: 1,
		cuenta: '1278561092',
		region : '1',
		rfc : 'EHAR450389HST',
		razonsocial : 'Ella Harper S.A. de C.V.',
		asociada : false
	},
	{
		id: "31",
		tipo: 1,
		cuenta: '8877662356',
		region : '9',
		rfc : 'PAPER50389HST',
		razonsocial : 'Paper S.A. de C.V.',
		asociada : false
	},
	{
		id: "32",
		tipo: 2,
		cuenta: '9098909837',
		region : '3',
		rfc : 'KIRK450389HST',
		razonsocial : 'Kirkus Reviews S.A. de C.V.',
		asociada : true
	}
];
/** Fin variable auxiliar con cuentas asociadas **/
Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf())
    dat.setDate(dat.getDate() + days);
    return dat;
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push( new Date (currentDate) )
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

var EnvironmentServicesDevelopment = function(){

	var buscador = {
		solicitudDescargas : {
			searchForm : function(form_data, urlPOST){
				console.log(form_data);
				window.location.href = urlPOST;
			},
			/**Método para ejecutar la limpieza de la búsqueda 
			para fines de simulación del proceso se va a comentar el método.**/
			// cleanForm : function(form_data, urlPOST){
			// 	console.log('cleaning');
			// }
		},
		facturasFiscales : {
			searchForm : function(form_data, urlPOST){
				console.log(form_data);
				window.location.href = urlPOST;
			},
			/**Método para ejecutar la limpieza de la búsqueda 
			para fines de simulación del proceso se va a comentar el método.**/
			// cleanForm : function(form_data, urlPOST){
			// 	console.log('cleaning');
			// }
		},
		estadosCuenta : {
			searchForm : function(form_data, urlPOST){
				console.log(form_data);
				window.location.href = urlPOST;
			},
			/**Método para ejecutar la limpieza de la búsqueda 
			para fines de simulación del proceso se va a comentar el método.**/
			// cleanForm : function(form_data, urlPOST){
			// 	console.log('cleaning');
			// }
		},
		facturasEquipos : {
			searchForm : function(form_data, urlPOST){
				console.log(form_data);
				window.location.href = urlPOST;
			},
			/**Método para ejecutar la limpieza de la búsqueda 
			para fines de simulación del proceso se va a comentar el método.**/
			// cleanForm : function(form_data, urlPOST){
			// 	console.log('cleaning');
			// }
		},
		referenciaUnica : {
			searchForm : function(form_data, urlPOST){
				console.log(form_data);
				window.location.href = urlPOST;
			},
			/**Método para ejecutar la limpieza de la búsqueda 
			para fines de simulación del proceso se va a comentar el método.**/
			// cleanForm : function(form_data, urlPOST){
			// 	console.log('cleaning');
			// }
		},
		notificacionesMTE : {
			searchForm : function(form_data, urlPOST){
				console.log(form_data);
				window.location.href = urlPOST;
			},
			/**Método para ejecutar la limpieza de la búsqueda 
			para fines de simulación del proceso se va a comentar el método.**/
			// cleanForm : function(form_data, urlPOST){
			// 	console.log('cleaning');
			// }
		},
		historialMovimientos : {
			searchForm : function(form_data, urlPOST){
				console.log(form_data);
				window.location.href = urlPOST;
			},
			/**Método para ejecutar la limpieza de la búsqueda 
			para fines de simulación del proceso se va a comentar el método.**/
			cleanForm : function(form_data, urlPOST){
				console.log('cleaning');
			}
		},
		historialMovimientosDetalles : {
			searchForm : function(form_data, urlPOST){
				console.log(form_data);
				window.location.href = urlPOST;
			},
			/**Método para ejecutar la limpieza de la búsqueda 
			para fines de simulación del proceso se va a comentar el método.**/
			// cleanForm : function(form_data, urlPOST){
			// 	console.log('cleaning');
			// }
		},
		consultaCuentas : {
			searchForm : function(form_data, urlPOST){
				console.log(form_data);
				window.location.href = urlPOST;
			},
			/**Método para ejecutar la limpieza de la búsqueda 
			para fines de simulación del proceso se va a comentar el método.**/
			// cleanForm : function(form_data, urlPOST){
			// 	console.log('cleaning');
			// }
		},
		gestionGrupos : {
			searchForm : function(form_data, urlPOST){
				console.log(form_data);
				window.location.href = urlPOST;
			},
			/**Método para ejecutar la limpieza de la búsqueda 
			para fines de simulación del proceso se va a comentar el método.**/
			// cleanForm : function(form_data, urlPOST){
			// 	console.log('cleaning');
			// }
		},
		misCitas : {
			searchForm : function(form_data, urlPOST){
				console.log(form_data);
				window.location.href = urlPOST;
			},
			/**Método para ejecutar la limpieza de la búsqueda 
			para fines de simulación del proceso se va a comentar el método.**/
			// cleanForm : function(form_data, urlPOST){
			// 	console.log('cleaning');
			// }
		},
		adendum : {
			searchForm : function(form_data, urlPOST){
				console.log(form_data);
				window.location.href = urlPOST;
			},
			/**Método para ejecutar la limpieza de la búsqueda 
			para fines de simulación del proceso se va a comentar el método.**/
			// cleanForm : function(form_data, urlPOST){
			// 	console.log('cleaning');
			// }
		},
		sertec : {
			searchForm : function(form_data, urlPOST){
				console.log(form_data);
				window.location.href = urlPOST;
			},
			/**Método para ejecutar la limpieza de la búsqueda 
			para fines de simulación del proceso se va a comentar el método.**/
			// cleanForm : function(form_data, urlPOST){
			// 	console.log('cleaning');
			// }
		},
		configuracionRolUsuarios : {
			searchForm : function(form_data, urlPOST){
				console.log(form_data);
				window.location.href = urlPOST;
			},
			/**Método para ejecutar la limpieza de la búsqueda 
			para fines de simulación del proceso se va a comentar el método.**/
			// cleanForm : function(form_data, urlPOST){
			// 	console.log('cleaning');
			// }
		},
		directorioContactos : {
			searchForm : function(form_data, urlPOST){
				console.log(form_data);
				window.location.href = urlPOST;
			},
			/**Método para ejecutar la limpieza de la búsqueda 
			para fines de simulación del proceso se va a comentar el método.**/
			// cleanForm : function(form_data, urlPOST){
			// 	console.log('cleaning');
			// }
		},
		marcacionCorta : {
			searchForm : function(form_data, urlPOST){
				console.log(form_data);
				window.location.href = urlPOST;
			},
			/**Método para ejecutar la limpieza de la búsqueda 
			para fines de simulación del proceso se va a comentar el método.**/
			// cleanForm : function(form_data, urlPOST){
			// 	console.log('cleaning');
			// }
		},
		desvioLlamadas : {
			searchForm : function(form_data, urlPOST){
				console.log(form_data);
				window.location.href = urlPOST;
			},
			/**Método para ejecutar la limpieza de la búsqueda 
			para fines de simulación del proceso se va a comentar el método.**/
			// cleanForm : function(form_data, urlPOST){
			// 	console.log('cleaning');
			// }
		},
		abonoDeSaldo : {
			searchForm : function(form_data, urlPOST){
				console.log(form_data);
				window.location.href = urlPOST;
			},
			/**Método para ejecutar la limpieza de la búsqueda 
			para fines de simulación del proceso se va a comentar el método.**/
			// cleanForm : function(form_data, urlPOST){
			// 	console.log('cleaning');
			// }
		},
	};

	/*Métodos para el ordenamiento*/

	var ordenamiento = {
		ordenamientoHistorialMovimientos : function(data){
			console.log('ordenando...');
		},
		ordenamientoHistorialMovimientosDetalle : function(data){
			console.log('ordenando...');
		},
		ordenamientoSertec : function(data){
			console.log('ordenando...');
		},
		ordenamientoSertecMovimientosDetalle :  function(data){
			console.log('ordenando...');
		},
		ordenamientoUsuarios : function(data){
			console.log('ordenando...');
		},
		ordenamientoDirectorio : function(data){
			console.log('ordenando...');
		},
		ordenamientoMarcacionCorta : function(data){
			console.log('ordenando...');
		},
		ordenamientoControlCostos : function(data){
			console.log('ordenando...');
		},
		ordenamientoDesvioLlamadas : function(data){
			console.log('ordenando...');
		},
		ordenamientoAbonoDeSaldo : function(data){
			console.log('ordenando...');
		},
	};

	var autocompleteTokenfield = function (term, groups, cuentas, isCitas, isIMEI){

		term = term.toLowerCase();

		var dataBaseLineas = [
			{ telefono: '3172376804',	nombre :	'Carmon Hodgkinson'  },
			{ telefono: '7864046711',	nombre :	'Anjelica Friedel'  },
			{ telefono: '1090068090',	nombre :	'Eda Levesque'  },
			{ telefono: '4549232325',	nombre :	'Orville Galland'  },
			{ telefono: '9311794118',	nombre :	'Penny Dellinger'  },
			{ telefono: '7131659895',	nombre :	'Lizzie Kimble'  },
			{ telefono: '342712684',	nombre :	'Regine Chesser'  },
			{ telefono: '1948030120',	nombre :	'Katheleen Fitzgerald'  },
			{ telefono: '311613692',	nombre :	'Elke Binford'  },
			{ telefono: '6622847607',	nombre :	'Gwenda Herlihy'  },
			{ telefono: '6722864901',	nombre :	'Brande Junk'  },
			{ telefono: '9159460848',	nombre :	'Jeana Sisneros'  },
			{ telefono: '193737155',	nombre :	'Jayne Stoker'  },
			{ telefono: '4909664544',	nombre :	'Ethyl Solberg'  },
			{ telefono: '2175648814',	nombre :	'Gisela Keeton'  },
			{ telefono: '6428808714',	nombre :	'Cheryle Carman'  },
			{ telefono: '3386014510',	nombre :	'Epifania Lezama'  },
			{ telefono: '5987266306',	nombre :	'Sharan Vegas'  },
			{ telefono: '4757536444',	nombre :	'Doug Simoneaux'  },
			{ telefono: '9579050608',	nombre :	'Lesha Mays'  },
			{ telefono: '2010932216',	nombre :	'Essie Revell'  },
			{ telefono: '4087297513',	nombre :	'Eli Harmer'  },
			{ telefono: '9453530993',	nombre :	'Delma Abe'  },
			{ telefono: '2079092600',	nombre :	'Nevada Kieser'  },
			{ telefono: '9460638908',	nombre :	'Amos Jaso'  },
			{ telefono: '4113172858',	nombre :	'Cori Raso'  },
			{ telefono: '1646087386',	nombre :	'Shonna Holbert'  },
			{ telefono: '2821144490',	nombre :	'Gayle Tarleton'  },
			{ telefono: '3571474313',	nombre :	'Coleen Blackmore'  },
			{ telefono: '7272322155',	nombre :	'Brig Rieger'  },
			{ telefono: '6285052885',	nombre :	'August Heatwole'  },
			{ telefono: '1479918835',	nombre :	'Dagny Lawlor'  },
			{ telefono: '60922028',	nombre :	'Melvina Mannino'  },
			{ telefono: '76286508',	nombre :	'Annalisa Ertle'  },
			{ telefono: '7890667453',	nombre :	'Janeth Hepworth'  },
			{ telefono: '9463400897',	nombre :	'Lacey Jone'  },
			{ telefono: '9703216172',	nombre :	'Nicholle Tallarico'  },
			{ telefono: '8341885379',	nombre :	'Lanny Norby'  },
			{ telefono: '277220641',	nombre :	'Bernard Steelman'  },
			{ telefono: '6070584291',	nombre :	'Mitsue Dieterich'  },
			{ telefono: '4568091403',	nombre :	'Asa Donnell'  },
			{ telefono: '1751507313',	nombre :	'Eva Troxell'  },
			{ telefono: '5710220419',	nombre :	'Delphia Currence'  },
			{ telefono: '9712043211',	nombre :	'Arlinda Jonas'  },
			{ telefono: '4135010217',	nombre :	'Salvador Speers'  },
			{ telefono: '2707843333',	nombre :	'Britteny Weatherford'  },
			{ telefono: '1592750103',	nombre :	'Kristine Champion'  },
			{ telefono: '6600100480',	nombre :	'Shavonda Boutte'  },
			{ telefono: '3343789590',	nombre :	'Antwan Thorington'  },
			{ telefono: '9592512966',	nombre :	'Alexandria Fairchild'  },
			{ telefono: '5967136829',	nombre :	'Kenya Harrell'  },
			{ telefono: '8530333857',	nombre :	'Nina Sutherland'  },
			{ telefono: '965000954',	nombre :	'Carmel Botta'  },
			{ telefono: '8146458415',	nombre :	'Jonell Weingart'  },
			{ telefono: '8625696398',	nombre :	'Otis Hogsett'  },
			{ telefono: '690251269',	nombre :	'Shena Wadsworth'  },
			{ telefono: '1582741989',	nombre :	'Deedee Quirion'  },
			{ telefono: '9263628697',	nombre :	'Ardath Swager'  },
			{ telefono: '3747716917',	nombre :	'Margery Dauphin'  },
			{ telefono: '3342930954',	nombre :	'Ena Terrones'  },
			{ telefono: '294227633',	nombre :	'Octavia Yanez'  },
			{ telefono: '9307524445',	nombre :	'Patrice Meszaros'  },
			{ telefono: '9122619309',	nombre :	'Camille Ekdahl'  },
			{ telefono: '323470901',	nombre :	'Peggy Schweizer'  },
			{ telefono: '8892520651',	nombre :	'Minda Aguinaldo'  },
			{ telefono: '6521099219',	nombre :	'Regina Bivins'  },
			{ telefono: '7995809591',	nombre :	'Maranda Backstrom'  },
			{ telefono: '2228458736',	nombre :	'Ozella Hora'  },
			{ telefono: '6876354539',	nombre :	'Miranda Cockrill'  },
			{ telefono: '2984927955',	nombre :	'Evita Overholt'  },
			{ telefono: '1620423275',	nombre :	'Tena Ryland'  },
			{ telefono: '6957176297',	nombre :	'Leonore Town'  },
			{ telefono: '258380228',	nombre :	'Bart Miguez'  },
			{ telefono: '8828045554',	nombre :	'Ana Mayberry'  },
			{ telefono: '933779756',	nombre :	'Georgene Sizemore'  },
			{ telefono: '813191144',	nombre :	'Mindy Trollinger'  },
			{ telefono: '4278070549',	nombre :	'Darnell Gullatt'  },
			{ telefono: '224213746',	nombre :	'Michell Cargile'  },
			{ telefono: '4736260722',	nombre :	'Eli Winger'  },
			{ telefono: '1861016838',	nombre :	'Florence Langenfeld'  },
			{ telefono: '8010298111',	nombre :	'Kami Mcgarity'  },
			{ telefono: '5853296925',	nombre :	'Bernard Linsley'  },
			{ telefono: '4578327274',	nombre :	'Therese Brugger'  },
			{ telefono: '8197357753',	nombre :	'Janine Minier'  },
			{ telefono: '127946504',	nombre :	'Racquel Kroner'  },
			{ telefono: '333260956',	nombre :	'Jerrell Atwater'  },
			{ telefono: '1095719261',	nombre :	'Leeanna Kenison'  },
			{ telefono: '9283745428',	nombre :	'Nenita Balentine'  },
			{ telefono: '661138357',	nombre :	'Herminia Gravely'  },
			{ telefono: '2021604938',	nombre :	'Caryl Fitzsimons'  },
			{ telefono: '5435067565',	nombre :	'Charlette Pickel'  },
			{ telefono: '1271765133',	nombre :	'Shaunda Finkbeiner'  },
			{ telefono: '3295816228',	nombre :	'Bethany Shake'  },
			{ telefono: '1765550927',	nombre :	'Jeri Hudkins'  },
			{ telefono: '2101007539',	nombre :	'Normand Llanas'  },
			{ telefono: '5084634192',	nombre :	'Nathalie Lehner'  },
			{ telefono: '570460122',	nombre :	'Wilbert Mire'  },
			{ telefono: '9909846314',	nombre :	'Jae Brookman'  },
			{ telefono: '1811622222',	nombre :	'Larhonda Korus'  },
			{ telefono: '6840769161',	nombre :	'Ollie Yohe'  }
		];

		var dataBaseGroup = [
			{ id: '99', nombre :	'Multiplex', total: 83 },
			{ id: '100', nombre :	'Multinacional', total: 51 },
			{ id: '101', nombre :	'Multiplica', total: 10 },
			{ id: '102', nombre :	'Gluo', total: 30 },
			{ id: '103', nombre :	'CFE', total: 20 },
			{ id: '104', nombre :	'Dev MX', total: 12 },
			{ id: '105', nombre :	'UX MX', total: 13 },
			{ id: '106', nombre :	'Lab MX', total: 3 },
			{ id: '107', nombre :	'Metriplica', total: 1 },
			{ id: '108', nombre :	'SEO MX', total: 0 }
		]; 

		var dataBaseCuentas= [
			{ id: '1234567812', nombre :	'Incrementa consulting S.A.' },
			{ id: '8747843211', nombre :	'Empresa no. 2 S.A. de C.V.' },
			{ id: '4532003411', nombre : 'Kliev S.A. de C.V.' },
			{ id: '3566229912', nombre :	'Tabacalera S.A. de C.V.' }
		]; 

		var dataBaseIMEI= [
			{ id: '2', imei : '123456789012345', nombre :	'Sony X10', telefono: '3172376804' },
			{ id: '28', imei : '123456789054321', nombre : 'Motorola - Moto G', telefono: '3172376804' },
			{ id: '30', imei : '123456789056745', nombre : 'Samsung S5', telefono: '3172376804' },
			{ id: '45', imei : '123456789012333', nombre : 'Iphone 5S', telefono: '3172376804' }
		]; 

		var queryresults  = [];

		if(cuentas){

			$.each( dataBaseCuentas, function( i, v ) {
			 	if (v.nombre.toLowerCase().indexOf(term) >= 0  || v.id.indexOf(term) >= 0 ) {

		            v.label = v.nombre;
		            v.cuenta = v.id;
		            v.tipo = 'cuenta';
		            v.id = v.id;
		            queryresults.push(v);
		        }

			});
		}
		else if(isIMEI){

			$.each( dataBaseIMEI, function( i, v ) {
			 	if (v.telefono.indexOf(term) >= 0  || v.imei.indexOf(term) >= 0 ) {

		            v.label = v.telefono+'-'+v.imei;
		            v.imei = v.imei;
		            v.tipo = 'imei';
		            v.id = v.id;
		            v.telefono = v.telefono;
		            queryresults.push(v);
		        }

			});

		}
		else{

			$.each( dataBaseLineas, function( i, v ) {

			 	if (v.nombre.toLowerCase().indexOf(term) >= 0 || v.telefono.indexOf(term) >= 0 ) {
		            if(isCitas)
		            	v.label = v.telefono;
		            else
		            	v.label =  v.nombre + '-' + v.telefono;
			 		v.tipo = 'single';
		            v.id = i;
		            queryresults.push(v);
		        }

			});

			if(groups){
				$.each( dataBaseGroup, function( i, v ) {

				 	if (v.nombre.toLowerCase().indexOf(term) >= 0 ) {
			            v.label = v.nombre+' ('+v.total+')';
			            v.tipo = 'group';
			            v.id = v.id;
			            queryresults.push(v);
			        }

				});
			}
		}

		console.log(queryresults);
		return queryresults;

	}

	var general = {
		getArbolBusquedaGeneralResponse : function(data, container){
			var data = { success: true, data: data };

			var hash = window.location.hash;

			if(hash=='#sinResultados'){
				var data = { success: true, data: [] };
			}

			$('#tree-lineas-search').find('.tree-arbol-sin-resultados').remove();

			if(data.success){
		  		$('#tree-lineas').hide();

		  		if(data.data.length>0){
		  			$('#tree-lineas-search').find('.jstree-children').removeClass('hidden');
			  		$('#tree-lineas-search').jstree(true).settings.core.data = data.data;
					$('#tree-lineas-search').jstree(true).refresh();
					
					var newNodes = data.data;

					newNodes.forEach(function(node, i){

						if($('#'+node.id).length==0){
							var created = $('#tree-lineas').jstree(true).create_node("#", node);
						}
					});
				}
				else{
					$('#tree-lineas-search').find('.jstree-children').addClass('hidden');
					$('#tree-lineas-search').append('<div class="notif-bloq tree-arbol-sin-resultados"> <div class="row"> <div class="col-xs-12 inner-nb"> <span class="icon io-Alert2"></span> <p class="only-p">No existen resultados. Modifica tu(s) criterio(s) de búsqueda.</p> </div> </div> </div>');
				}
				
				$('#tree-lineas-search').show();
				$('#componente-ingresar-lineas .lineas-arbol .btn-remover-seleccion').removeClass('active');

				$('#componente-ingresar-lineas .lineas-arbol .block-content-arbol-btn').removeClass('hidden');
				$('#componente-ingresar-lineas .lineas-arbol .btn-remover-busqueda').addClass('active');
				

		  	}
		  	else{
		  		
		  	}
		},
		getArbolBusquedaGeneralFailResponse : function (error, container){		
			console.log(error);
		},
		getArbolBusquedaGruposResponse : function(data, container, arbolId){
			var data = { success: true, data: data };

			var hash = window.location.hash;

			if(hash=='#sinResultados'){
				var data = { success: true, data: [] };
			}

			$('#' + arbolId + ' .tree-grupos-search').find('.tree-arbol-sin-resultados').remove();

			if(data.success){
		  		$('#' + arbolId + ' .tree-grupos').hide();

		  		if(data.data.length>0){
		  			$('#' + arbolId + ' .tree-grupos-search').find('.jstree-children').removeClass('hidden');
			  		$('#' + arbolId + ' .tree-grupos-search').jstree(true).settings.core.data = data.data;
					$('#' + arbolId + ' .tree-grupos-search').jstree(true).refresh();
					
					var newNodes = data.data;

					newNodes.forEach(function(node, i){

						if($('#'+node.id).length==0){
							var created = $('#' + arbolId + ' .tree-grupos').jstree(true).create_node("#", node);
						}
					});
				}
				else{
					$('#' + arbolId + ' .tree-grupos-search').find('.jstree-children').addClass('hidden');
					$('#' + arbolId + ' .tree-grupos-search').append('<div class="notif-bloq tree-arbol-sin-resultados"> <div class="row"> <div class="col-xs-12 inner-nb"> <span class="icon io-Alert2"></span> <p class="only-p">No existen resultados. Modifica tu(s) criterio(s) de búsqueda.</p> </div> </div> </div>');
				}
				
				$('#' + arbolId + ' .tree-grupos-search').show();
				$('#' + arbolId + ' .btn-remover-seleccion').removeClass('active');

				$('#' + arbolId + ' .block-content-arbol-btn').removeClass('hidden');
				$('#' + arbolId + ' .btn-remover-busqueda').addClass('active');
				

		  	}
		  	else{
		  		
		  	}
		},
		getArbolBusquedaGruposFailResponse : function (error, container, arbolId){		
			console.log(error);
		},
	};

	var login = {
		getPassForgotResponse : function(data, form){
			/**Posibles mensajes
				  		
				SIN REGISTRARSE UF
					El número que ingresaste no puede ser registrado en Mi Telcel Empresas, debido a que no es una cuenta Corporativa Telcel.

				SIN REGISTRARSE
					El correo electrónico que ingresaste no está asociado a una cuenta Corporativa Telcel. 
					¿Necesitas ayuda? Contacta a tu Ejecutivo.

				SIN REGISTRARSE CON CORREO ELECTRONICO COPORATIVO
					El correo electrónico que ingresaste no está registrado en Mi Telcel Empresas. 
					¿Necesitas ayuda? Contacta a tu Ejecutivo.

				ERROR
					Esta consulta por el momento no está disponible. 
					Estamos trabajando para servirte mejor, por favor intenta más tarde.

				ÉXITO
					Tu contraseña ha sido enviada con éxito al correo electrónico que proporcionaste en tu registro.

				ERROR (intento 6)
					Tu contraseña recuperada fue enviada al correo electrónico que proporcionaste en tu registro. ¿Necesitas ayuda? Contacta a tu Ejecutivo.
			**/

			/**HASH PARA SIMULAR ERROR**/
			var hash = window.location.hash;
			if(hash=='#errorPass'){
				var msgHTML = 'Esta consulta por el momento no está disponible.';
				$('.login-form-block .general-error .text').html(msgHTML);
				handleErrorTooltip(true);
			}

			else{
				//$(form).find('.form-block').addClass('hidden');
				$('.login-form-block .general-error').addClass('hidden');
				$('.login-form-block .general-success').removeClass('hidden');
			}

			scrollToElement($('.login-form'));
			$('#pass-forgot-admin').slideToggle( 800 );

			function handleErrorTooltip(show){
				var $error = $('.login-form-block .general-error');
				if(show)
					$error.removeClass('hidden');
				else
					$error.addClass('hidden');
			}
		},

		getPassForgotFailResponse : function (error, form){		
			console.log(error);
		},
		getUserLoginResponse : function(data, form){
			/**Posibles mensajes
		  		
		  		Error (Intentos 1-5, 7, 9)
			  		La contraseña es incorrecta. Por favor, verifícala. ¿Olvidaste tu contraseña?
				
				Bloqueo 15 mins (Intento 6) 
				Bloqueo 30 mins (Intento 8)
					Has excedido el número de intentos. Por seguridad no podrás iniciar sesión en este momento. Por favor, intenta más tarde.

				Bloqueo total (Intento 10)
					Has excedido el número de intentos permitidos. Para cualquier aclaración, comunícate con tu ejecutivo.

			**/

			/**HASH PARA SIMULAR ERROR**/
			var hash = window.location.hash;

			if(hash=='#errorLogin'){
				var msgHTML = 'La contraseña es incorrecta. Por favor, verifícala. <a class="cta-shows-block nuevo" data-show="#pass-forgot-admin">¿Olvidaste tu contraseña?</a>';
				$('.login-form-block .general-error .text').html(msgHTML);
				$('.login-form-block .general-success').addClass('hidden');
				$('.login-form-block .general-error').removeClass('hidden');
			}
			else
				location.reload();
		},
		getUserLoginFailResponse : function(error, form){
			console.log(error);
		},
		getActivarCuentaResponse : function(data, form){
			var hash = window.location.hash;
			var currentURL = window.location.href.substr(0, window.location.href.indexOf('#'));

			if(hash=="#mandarError"){
				window.location.href = currentURL+'#error';
				window.location.reload();
			}
			else
				/**Este HTML es para simular si se selecciono una opción en ¿Qué quieres hacer?**/
				window.location.href = 'activa-tu-cuenta-2.html'+'#exitoLogin';

			console.log('Formulario enviado.');
		},
		getActivarCuentaFailResponse : function(error, form){
			console.log(error);
		},
		getEstablecerContrasenaResponse : function(data, form){
			console.log('Formulario enviado.');
		},
		getEstablecerContrasenaFailResponse : function(error, form){
			console.log(error);
		},
		getActualizarDatosResponse : function(data, form){

			var hash = window.location.hash;
			var currentURL = window.location.href.substr(0, window.location.href.indexOf('#'));

			if(hash=="#mandarError")
				window.location.href = currentURL+'#error';
			else
				window.location.href = currentURL+'#exito';

			window.location.reload();
			console.log('Formulario enviado.');
		},
		getActualizarDatosFailResponse : function(error, form){
			console.log(error);
		},
	};

	var gestionGrupos = {
		getAgregarGrupoResponse : function(data, form, elementData, callback){
			var data = { success: true, data: [] };

			/* simular error de nombre existente */
		  	var hash = window.location.hash;
		  	
			if(hash=='#errorNombreExistente'){
				data.success = false;
				data.error = {
					message : 'El nombre de grupo fue utilizado anteriormente, favor de ingresar uno nuevo.'
				};

			}
			/* fin simular error de nombre existente */

			if(data.success){
		  		/* simular ID agregado en la DB */
				var idAdded = $('.mosaico-view .item-mv').length;

				var parentData = $('#group-data-info').data('item');

				if(typeof parentData !='undefined' && parentData.id == elementData.currentId){
					//Envío el Id y el nombre del nuevo elemento
					callback(idAdded, elementData.name);
				}

				$('#btn-agregar-lineas-grupo-modal').attr('data-item', '{"id": "'+idAdded+'" ,"texto": "'+elementData.name+'"}');

				$(form).hide();
				$(form).addClass('success');

				$('.form-agregar-grupo .api-msg .grupo-txt').html(elementData.name);

		  	}
		  	else{

		  		/* mostrar error enviado por el sistema */

		  		if(data.error){
		  			appendErrorGeneral($('.form-agregar-grupo .element-input-block'), elementData.input , data.error.message);
		  		}

		  	}
		},
		getAgregarGrupoFailResponse : function(error, form){
			console.log(error);
		},
		getConsultarLineasResponse : function(data, currentModalData, callback){
			
			var data = { success: true, data: { lineasAsociadas : true } };

			/** Simular caso de uso **/
		  	var hash = window.location.hash;

			if(hash=='#casoSinLineasAsociadas'){
				data.data = {
					lineasAsociadas : false
				};
			}
			/** Simular caso de uso **/

			if(data.success){
		  		/* simular ID elimindado de la DB */
				var idDeleted = currentModalData.id;

		  		$('#modal-eliminar-grupo .alias-text').html(currentModalData.texto);

		  		/* simular cuando el grupo ya fue eliminado previamente en otra pestaña */
		  		if(hash=='#grupoPreviamenteEliminado'){
		  			$('#eliminar-grupo-ya-eliminado').show();
		  		}
		  		else{
		  			/* simular cuando hay líneas asociadas al grupo */
			  		if(data.data.lineasAsociadas){
			  			$('#confirmar-eliminar-grupo').show();
			  		}
			  		/* cuando no hay líneas asociadas */
			  		else{
			  			callback(idDeleted);
			  			$('#eliminar-grupo-confirmacion').show();

			  		}
			  	}
		  	}
		  	else{
		  		/* mostrar error enviado por el sistema */
		  		if(data.error){
		  			
		  		}

		  	}
		},
		getConsultarLineasFailResponse : function(error){
			console.log(error);
		},
		getEliminarGrupoResponse : function(data, form, currentModalData){

			/**Respuesta hardcodeada**/
			var data = { success: true };
		  	
		  	if(data.success){
		  		/**éxito**/
		  		$('#confirmar-eliminar-grupo').hide();
		  		$('#eliminar-grupo-confirmacion').show();
		  		$('#modal-eliminar-grupo .alias-text').html(currentModalData.texto);
		  	}
		  	else{
		  		/** Mostrar mensaje enviado por sistema **/
		  	}
		},
		getEliminarGrupoFailResponse : function(error, form){
			console.log(error);
		},
		getDescargarFacturasResponse : function(data, form, title){

			var hash= window.location.hash;

			/**Respuesta hardcodeada**/
			var data = { success: true };

		  	/**Caso de uso admin previamente eliminado**/
		  	if(hash=="#error-solicitud-descarga"){
				data.success = false;
				data.error = {
					message : 'Por el momento no se puede realizar tu solicitud, por favor intentalo más tarde.'
				};
			}
		  	
		  	if(data.success){
				$(form).hide();

				if(title!=null)
					title.element.html(title.text);

				$('#descargar-facturas-confirmacion').show();
		  	}
		  	else{
		  		/**mostrar mensaje enviado por sistema**/
		  		if(data.error){
					var errorHTML = '<div class="notif-bloq"> <div class="row"> <div class="col-xs-12 col-sm-12 inner-nb" id="error-autogestion-block"> <span class="icon io-Alert2"></span> <h2 class="h4">No se pudo procesar la operación</h2> <div id="listado-sin-autogestion-container"> <p>Lo sentimos, este servicio por el momento no está disponible. Estamos trabajando para servirte mejor. Por favor, intenta más tarde.</p> <div class="col-sm-12 btn-container"> <button type="button" class="bton blue-dark" id="btn-r-descargar-facturas">Reintentar</button> </div> </div> </div> </div> </div>';
					appendErrorGeneralHTML($('#modal-descargar .in-cont-mod'), null , errorHTML);
					
				}

				$(form).find('button[type="submit"]').prop('disabled', false);
		  	}
		},
		getDescargarFacturasFailResponse : function(error, form){
			console.log(error);
			/**mostrar mensaje enviado por sistema**/
	  		if(data.error){
	  			var errorHTML = '<div class="notif-bloq"> <div class="row"> <div class="col-xs-12 col-sm-12 inner-nb" id="error-autogestion-block"> <span class="icon io-Alert2"></span> <h2 class="h4">No se pudo procesar la operación</h2> <div id="listado-sin-autogestion-container"> <p>Lo sentimos, este servicio por el momento no está disponible. Estamos trabajando para servirte mejor. Por favor, intenta más tarde.</p> <div class="col-sm-12 btn-container"> <button type="button" class="bton blue-dark" id="btn-r-descargar-facturas">Reintentar</button> </div> </div> </div> </div> </div>';
				appendErrorGeneralHTML($('#modal-descargar .in-cont-mod'), null , errorHTML);
				
			}
			
			$(form).find('button[type="submit"]').prop('disabled', false);
		},
		getEditarNombreGrupoResponse : function(data, value, callback, $elementos){
			var $element = $elementos.element;
		  	var $input = $elementos.input;

			/**Respuesta hardcodeada**/
		  	var data = { success : true, data : [] };

			/**simular casp de uso**/
			var hash = window.location.hash;

			if(hash=='#errorNombreExistente'){

				data.success = false;

				data.error = {
					message : 'El nombre de grupo fue utilizado anteriormente, favor de ingresar uno nuevo.'
				};
			}

			if(data.success){
		  		$element.find('.name-container .ribbon-content').html(value);
		  		$element.data('name', value);
		  		$element.find('.name-container').removeClass('active-edit');

		  		var item = ( typeof $element.data('item') != 'undefined' ? $element.data('item') : null);

		  		if(item!=null){
		  			item.texto = value;
		  			$element.data('item', item);
		  		}

		  	}
		  	else{
		  		//JSON SUCCESS FALSE
		  		if(data.error){
		  			callback($element, $input, data.error.message);
		  		}

		  	}


		},
		getEditarNombreGrupoFailResponse : function(error){
			console.log(error);
		},
		getEditarNombreLineaResponse : function(data, value, callback, $elementos){

			/**Respuesta hardcodeada**/
		  	var data = { success : true, data : [] };

			/**simular casp de uso**/
			var hash = window.location.hash;

			if(hash=='#errorNombreExistente'){
				data.success = false;

				data.error = {
					message : 'Este nombre ya ha sido asignado a otro elemento.'
				};

			}

			if(data.success){
		  		$('.name-toedit-eli').html(value);
	  			$('.editar-nombre-form').removeClass('active-edit');
		  	}
		  	else{
		  		//JSON SUCCESS FALSE
		  		if(data.error){
		  			callback($elementos.element, $elementos.input, data.error.message);
		  		}

		  	}

		},
		getEditarNombreLineaFailResponse : function(error, form){
			console.log(error);
		},
		cuentasAsociadasSuccessCallback : function(modal, json, cuentasAsociadas){
			/**Hardcodeo el resultado del GETJSON **/
			json = { success: true, data: cuentasAsociadasAuxiliar };

			cuentasAsociadas.value = json.data;

			if(json.success){
				var hash = window.location.hash;

				if(hash=='#errorCuentasBusqueda' || json.data.length == 0){
		  			$('#modal-asociar-cuentas #listado-result-asoc, .button-field-mod, .pagination-block').addClass('hidden');
		  			$('#sin-resultados').removeClass('hidden');
		  		}
		  		else{
		  			$('#sin-resultados').addClass('hidden');
		  			$('#modal-asociar-cuentas #listado-result-asoc, .button-field-mod, .pagination-block').removeClass('hidden');
		  		}

				modal['data'] = json.data;
		  		modal['paginacion'].updateItems(json.data);
		  		modal['paginacion'].reset();
		  	}
		  	else{
		  		/* agregar error enviado por el sistema */
		  	}
		},
		cuentasAsociadasFailCallback : function(error){
			console.log(error);
		},
		enviarDatosAutogestionMasivos : function(data, apiPost){
			//Aquí hacer el post o lo necesario para mandar la información para la data masiva
			console.log(data);
			window.location.href = apiPost;
		},
		getBusquedaArbolGruposResponse : function(json){

			/**Respuesta hardcodeada**/
			var data = { success: true, data : json };
			var hash = window.location.hash;
		  	if(hash=='#sinResultados'){
				var data = { success: true, data: [] };
			}

		  	if(data.success){
		  		$('#tree-grupo').hide();

		  		if(data.data.length>0){
			  		$('#tree-grupo-search').jstree(true).settings.core.data = json;
					$('#tree-grupo-search').jstree(true).refresh();
					
					var newNodes = json;

					newNodes.forEach(function(node, i){

						if($('#'+node.id).length==0){
							var created = $('#tree-grupo').jstree(true).create_node("#", node);
						}
					});
				}
				else{
					$('#tree-grupo-search').find('.jstree-children').addClass('hidden');
					$('#tree-grupo-search').append('<div class="notif-bloq tree-arbol-sin-resultados"> <div class="row"> <div class="col-xs-12 inner-nb"> <span class="icon io-Alert2"></span> <p class="only-p">No existen resultados. Modifica tu(s) criterio(s) de búsqueda.</p> </div> </div> </div>');
				}

				$('#tree-grupo-search').show();
				$('#btn-mover-grupo').prop('disabled', true);
				$('#modal-mover-grupo .btn-remover-busqueda').addClass('active');

		  	}
		  	else{
		  		/**Mostrar mensajes de error**/
		  	}
		},
		getBusquedaArbolGruposFailResponse : function(error, form){
			console.log(error);
		},
		getMoverGrupoResponse : function(data, form, callbackError, callbackMostrarTablas, aux){

			/**Respuesta hardcodeada**/
			var data = { success: true, data : [] };
		  	
		  	data.success = true;

		  	data.data = {
		  			success : ['5567778991', '576876541', '5523657999', '5544448991', '5511145678', '5567778991', '576876541', '5523657999', '5544448991', '5511145678'],
		  			error : []
		  	};

			/**simular error caso de uso**/
			var hash = window.location.hash;

			if(hash=='#errorMoverGrupo'){

				data.success = false;

				data.error = {
					message : 'No se puede realizar el cambio. Necesitas permisos para modificar este grupo.'
				};

			}
			else if(hash=='#errorMoverMismoGrupo'){
				data.success = false;

				data.error = {
					message : 'Es necesario mover a un destino distinto al que pertenece.'
				};
			}

		  	if(data.success){
				$(form).hide();
				$(form).addClass('success');

				if(aux.moverLineas){

					/**Simular error agregar lineas**/
				  	var hash = window.location.hash;

					if(hash=='#errorAgregarLineas'){
						data.data.error = [ 
							{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
							{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
							{'numero' : '5523657890', 'motivo' : 'Número no existe' },
							{'numero' : '5512348991', 'motivo' : 'Número no existe' },
							{'numero' : '5512345678', 'motivo' : 'Falta de permisos' }
						];
					}
					else if(hash == '#errorAgregarTodasLineas'){
						data.data.success = [];
						data.data.error = [ 
							{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
							{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
							{'numero' : '5523657890', 'motivo' : 'Número no existe' },
							{'numero' : '5512348991', 'motivo' : 'Número no existe' },
							{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
							{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
							{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
							{'numero' : '5523657890', 'motivo' : 'Número no existe' },
							{'numero' : '5512348991', 'motivo' : 'Número no existe' },
							{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
							{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
							{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
							{'numero' : '5523657890', 'motivo' : 'Número no existe' },
							{'numero' : '5512348991', 'motivo' : 'Número no existe' },
							{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
							{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
							{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
							{'numero' : '5523657890', 'motivo' : 'Número no existe' },
							{'numero' : '5512348991', 'motivo' : 'Número no existe' },
							{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
							{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
							{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
							{'numero' : '5523657890', 'motivo' : 'Número no existe' },
							{'numero' : '5512348991', 'motivo' : 'Número no existe' },
							{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
							{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
							{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
							{'numero' : '5523657890', 'motivo' : 'Número no existe' },
							{'numero' : '5512348991', 'motivo' : 'Número no existe' },
							{'numero' : '5512345678', 'motivo' : 'Falta de permisos' }
						];
					}

					callbackMostrarTablas(data.data);

					$('#modal-mover-grupo .multiple-lines').show();

				}
				else{
					$('#modal-mover-grupo .grupo-txt-old').html(aux.oldMove);
					$('#modal-mover-grupo .single-msg').show();
				}

				$('#modal-mover-grupo .grupo-txt-new').html(aux.grupo);
				$('#btn-mover-grupo').prop('disabled', true);

		  	}
		  	else{
		  		/**Mostrar error que regresa el sistema**/
		  		if(data.error){
		  			callbackError($('#modal-mover-grupo .tree-groups-asoc'), null, data.error.message);
		  		}
		  	}
		},
		getMoverGrupoFailResponse : function(error, form){
			console.log(error);
		},
		postAgregarLineasArchivo : function(dataArchivo, callbackpostAgregarLineas, callbackArchivoInvalido ){
			/*Simular error de archivo ilegible */
			var hash = window.location.hash;
			if(hash=='#archivoInvalido')
				callbackArchivoInvalido();
			else{
				if(typeof dataArchivo != 'undefined')
					callbackpostAgregarLineas(dataArchivo, 'archivo');
			}
		},
		getAgregarLineasResponse : function(data, callbackMostrarTablas, callbackNextStep, aux){

			/**Respuesta hardcodeada**/
			var data = { success: true, data : [] };

			// ESTE SETTIMEOUT SOLO ESTA PARA SIMULAR QUE SE TARDA EN REGRESAR LA RESPUESTA
			setTimeout(function(){
				callbackNextStep('#modal-agregar-lineas .step-3','#modal-agregar-lineas .step-2');
				$('#modal-agregar-lineas .loading-block-screen').hide();
			}, 3000);

			/**Respuesta simulada**/

		  	data.data = {
		  			success : ['5567778991', '576876541', '5523657999', '5544448991', '5511145678', '5567778991', '576876541', '5523657999', '5544448991', '5511145678'],
		  			error : []
		  	}; 

			/**fin Respuesta simulada**/

			/** Simular error caso de uso **/
		  	var hash = window.location.hash;

			if(hash=='#errorAgregarLineas'){
				data.data.error = [ 
					{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
					{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
					{'numero' : '5523657890', 'motivo' : 'Número no existe' },
					{'numero' : '5512348991', 'motivo' : 'Número no existe' },
					{'numero' : '5512345678', 'motivo' : 'Falta de permisos' }
				];
			}
			else if(hash == '#errorAgregarTodasLineas'){
				data.data.success = [];
				data.data.error = [ 
					{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
					{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
					{'numero' : '5523657890', 'motivo' : 'Número no existe' },
					{'numero' : '5512348991', 'motivo' : 'Número no existe' },
					{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
					{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
					{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
					{'numero' : '5523657890', 'motivo' : 'Número no existe' },
					{'numero' : '5512348991', 'motivo' : 'Número no existe' },
					{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
					{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
					{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
					{'numero' : '5523657890', 'motivo' : 'Número no existe' },
					{'numero' : '5512348991', 'motivo' : 'Número no existe' },
					{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
					{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
					{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
					{'numero' : '5523657890', 'motivo' : 'Número no existe' },
					{'numero' : '5512348991', 'motivo' : 'Número no existe' },
					{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
					{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
					{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
					{'numero' : '5523657890', 'motivo' : 'Número no existe' },
					{'numero' : '5512348991', 'motivo' : 'Número no existe' },
					{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
					{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
					{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
					{'numero' : '5523657890', 'motivo' : 'Número no existe' },
					{'numero' : '5512348991', 'motivo' : 'Número no existe' },
					{'numero' : '5512345678', 'motivo' : 'Falta de permisos' }
				];
			}

		  	if(data.success){

				$('#btn-add-lineas-arbol').prop('disabled', true);
				$('#modal-agregar-lineas .txt-grupo').html(aux.text);
				callbackMostrarTablas(data.data);

		  	}
		  	else{					  		
		  		//**Mostrar mensaje no success**//
		  	}

		},
		getAgregarLineasFailResponse : function(error, form){
			console.log(error);
		},
		getCargaMasivaPostArbolResponse : function(data, form, sentTo){
			console.log('Formulario enviado.');
			window.location.href = sentTo;
		},
		getCargaMasivaPostArbolFailResponse : function(error, form){
			console.log(error);
		},
		getCargaMasivaResponse : function(data, form, sentTo, showInvalidErrorArchivo){
			/*simular error de archivo*/ 
			var hash = window.location.hash;
			if(hash=='#archivoInvalido'){
				showInvalidErrorArchivo();
				submit = false;
			}
			/*fin simular error de archivo*/ 
			else{
				console.log('Formulario enviado.');
				window.location.href = sentTo;
			}
		},
		getCargaMasivaFailResponse : function(error, form){
			console.log(error);
		},
	};

	var autogestion = {
		getSingleSuspensionResponse : function(data, form, sentTo){
			console.log('Formulario enviado.');
			window.location.href = sentTo;
		},
		getSingleSuspensionFailResponse : function(error, form){
			console.log(error);
		},
		getSingleAutogestionGeneralResponse : function(data, form, sentTo){
			console.log('Formulario enviado.');
			window.location.href = sentTo;
		},
		getSingleAutogestionGeneralFailResponse : function(error, form){
			console.log(error);
		},
		getMasivoSuspensionResponse : function(data, form, sentTo, showInvalidErrorArchivo){
			/*simular error de archivo*/ 
			var hash = window.location.hash;
			if(hash=='#archivoInvalido'){
				showInvalidErrorArchivo();
				submit = false;
			}
			/*fin simular error de archivo*/ 
			else{
				console.log('Formulario enviado.');
				window.location.href = sentTo;
			}
			
			
		},
		getMasivoSuspensionFailResponse : function(error, form){
			console.log(error);
		},
		getMasivoAutogestionGeneralResponse : function(data, form, sentTo, showInvalidErrorArchivo){
			/*simular error de archivo*/ 
			var hash = window.location.hash;
			if(hash=='#archivoInvalido'){
				showInvalidErrorArchivo();
				submit = false;
			}
			/*fin simular error de archivo*/ 
			else{
				console.log('Formulario enviado.');
				window.location.href = sentTo;
			}
		},
		getMasivoAutogestionGeneralFailResponse : function(error, form){
			console.log(error);
		},
		getMasivoAutogestionServiciosResponse : function(data, form, sentTo, showInvalidErrorArchivo){
			/*simular error de archivo*/ 
			var hash = window.location.hash;
			if(hash=='#archivoInvalido'){
				showInvalidErrorArchivo();
				submit = false;
			}
			/*fin simular error de archivo*/ 
			else{
				console.log('Formulario enviado.');
				window.location.href = sentTo;
			}
		},
		getMasivoAutogestionServiciosFailResponse : function(error, form){
			console.log(error);
		},
		getMasivoAutogestionConfirmacionGeneralResponse : function(data, form, sentTo, showInvalidErrorArchivo){
			console.log('Formulario enviado.');
			window.location.href = sentTo;
		},
		getMasivoAutogestionConfirmacionGeneralFailResponse : function(error, form){
			console.log(error);
		},
		getEnviarCorreoConfirmacionResponse : function(data, form){
			console.log('Formulario enviado.');
			$('.email-sent').html($(form).find('input[name="email"]').val());
			$('.op-resend-id').addClass('email-sent');
		},
		getEnviarCorreoConfirmacionFailResponse : function(error, form){
			console.log(error);
		},
		getRedPrivadaCallResponse : function(data, form, sentTo){
			console.log('Formulario enviado.');
			window.location.href = sentTo;
		},
		getRedPrivadaCallFailResponse : function(error, form){
			console.log(error);
		},
		getAbonoDeSaldoCallResponse : function(data, form, sentTo){
			console.log('Formulario enviado.');
			window.location.href = sentTo;
		},
		getAbonoDeSaldoCallFailResponse : function(error, form){
			console.log(error);
		},
		getMasivoAutogestionRoamingResponse : function(data, form, sentTo, showInvalidErrorArchivo){
			/*simular error de archivo*/ 
			var hash = window.location.hash;
			if(hash=='#archivoInvalido'){
				showInvalidErrorArchivo();
				submit = false;
			}
			/*fin simular error de archivo*/ 
			else{
				console.log('Formulario enviado.');
				window.location.href = sentTo;
			}
		},
		getMasivoAutogestionRoamingFailResponse : function(error, form){
			console.log(error);
		},
		getSingleAutogestionRoamingResponse : function(data, form, sentTo){
			console.log('Formulario enviado.');
			window.location.href = sentTo;
		},
		getSingleAutogestionRoamingFailResponse : function(error, form){
			console.log(error);
		},
	};

	var servicios = {
		contratarServiciosSuccessCallback : function(data, form, sentTo){
			console.log('Formulario enviado.');
			window.location.href = sentTo;
		},
		contratarServiciosFailCallback : function(error, form){
			console.log(error);
		},
	};

	var gestionEjecutivos = {
		getAgregarAliasResponse : function(data, form, elementData, callback){
			var data = { success: true, data: [] };

			/* simular error de nombre existente */
		  	var hash = window.location.hash;
		  	
			if(hash=='#errorNombreExistente'){
				data.success = false;
				data.error = {
					message : 'El nombre de alias fue utilizado anteriormente, favor de ingresar uno nuevo.'
				};

			}
			/* fin simular error de nombre existente */

			/**Caso de uso error en solicitud**/
		  	if(hash=="#error-servicio-general"){
				data.success = false;
				data.error = {
					message : 'Lo sentimos, este servicio por el momento no está disponible. Estamos trabajando para servirte mejor. Por favor, intenta más tarde.'
				};
			}

			if(data.success){
		  		/* simular ID agregados en la DB */
				var idAddedAlias = $('#gestion-ejecutivos-view .mosaico-view .item-mv').length+1;
				var idAddedAdmin = $('#gestion-ejecutivos-view .mosaico-view .item-mv').length+1;
				/** fin simular **/

				var meta = {
					'id' : idAddedAlias,
					'texto' : elementData.texto,
					'lineas' : 0,
					'administrador' :{
						'id' : idAddedAdmin,
						'nombre' : elementData.admin.nombre,
						'correo' : elementData.admin.correo,
						'lada' : elementData.admin.lada,
						'numero' : elementData.admin.numero,
						'extension' : elementData.admin.extension
					}
				};

				//Envío el Id y el nombre del nuevo elemento
				callback(idAddedAlias, meta);

				$(form).hide();
				$(form).addClass('success');

				$('.form-agregar-alias .api-msg .new-alias-text').html(meta.texto);
				$('.form-agregar-alias .api-msg .user-text').html(meta.administrador.nombre);
				$('.form-agregar-alias .api-msg .user-email').html(meta.administrador.correo);

		  	}
		  	else{

		  		/* mostrar error enviado por el sistema */

		  		if(data.error){
		  			//appendErrorGeneral($('.form-agregar-grupo .element-input-block'), elementData.input , data.error.message);

		  			if(hash=='#errorNombreExistente'){
			  			var error=$('<label class="error error-nombre-alias">'+data.error.message+'</label>');
						var element = elementData.input;
						element.addClass('error');
						error.insertAfter( element );
					}
					else{
						$(form).hide();

						var errorHTML = '<div class="notif-bloq"> <div class="row"> <div class="col-xs-12 col-sm-12 inner-nb" id="error-autogestion-block"> <span class="icon io-Alert2"></span> <h2 class="h4">No se pudo procesar la operación</h2> <div id="listado-sin-autogestion-container"> <p>'+data.error.message+'</p> <div class="col-sm-12 btn-container"> <button type="button" class="bton blue-dark" id="btn-resend-form">Reintentar</button> </div> </div> </div> </div> </div>';
						appendErrorGeneralHTML($('#modal-agregar-alias .in-cont-mod'), null , errorHTML);
					}

		  		}

		  	}
		},
		getAgregarAliasFailResponse : function(error, form){
			console.log(error);
		},
		getEditarNombreAliasResponse : function(data, value, callback, $elementos){
			var $element = $elementos.element;
		  	var $input = $elementos.input;

			/**Respuesta hardcodeada**/
		  	var data = { success : true, data : [] };

			/**simular casp de uso**/
			var hash = window.location.hash;

			if(hash=='#errorNombreExistente'){

				data.success = false;

				data.error = {
					message : 'El nombre del alias fue utilizado anteriormente, favor de ingresar uno nuevo.'
				};
			}

			if(data.success){
		  		$element.find('.name-container .ribbon-content').html(value);
		  		$element.data('name', value);
		  		$element.find('.name-container').removeClass('active-edit');

		  		var item = ( typeof $element.data('item') != 'undefined' ? $element.data('item') : null);

		  		if(item!=null){
		  			item.texto = value;
		  			$element.data('item', item);
		  		}

		  	}
		  	else{
		  		//JSON SUCCESS FALSE
		  		if(data.error){
		  			callback($element, $input, data.error.message);
		  		}

		  	}


		},
		getEditarNombreAliasFailResponse : function(error){
			console.log(error);
		},
		getEliminarAliasResponse : function(data, form, currentModalData){
			var hash= window.location.hash;

			/**Respuesta hardcodeada**/
			var data = { success: true };

			/**Caso de uso servicio no disponible**/
		  	if(hash=="#error-servicio-general"){
				data.success = false;
				data.error = {
					message : 'Lo sentimos, este servicio por el momento no está disponible. Estamos trabajando para servirte mejor. Por favor, intenta más tarde.'
				};
			}

		  	/**Caso de uso alias previamente eliminado**/
		  	if(hash=="#aliasPreviamenteEliminado"){
				$('#confirmar-eliminar-alias').hide();
				$('#eliminar-alias-ya-eliminado').show();
			}
			else{
			  	if(data.success){
			  		/**éxito**/
			  		$('#confirmar-eliminar-alias').hide();
			  		$('#eliminar-alias-pre-confirmacion').hide();
			  		$('#eliminar-alias-confirmacion').show();
			  		$('#modal-eliminar-alias .alias-text').html(currentModalData.texto);

			  		var $alias = $('#alias-'+currentModalData.id);
			  		var $parent = $alias.parent('.item-mv');
			  		$parent.remove();
			  	}
			  	else{
			  		/** Mensaje de error enviado por el sistema**/
			  		$(form).hide();
						
					var errorHTML = '<div class="notif-bloq"> <div class="row"> <div class="col-xs-12 col-sm-12 inner-nb" id="error-autogestion-block"> <span class="icon io-Alert2"></span> <h2 class="h4">No se pudo procesar la operación</h2> <div id="listado-sin-autogestion-container"> <p>'+data.error.message+'</p> <div class="col-sm-12 btn-container"> <button type="button" class="bton blue-dark" id="btn-resend-form">Reintentar</button> </div> </div> </div> </div> </div>';
					appendErrorGeneralHTML($('#modal-eliminar-alias .in-cont-mod'), null , errorHTML);
			  	}
			 }
		},
		getEliminarAliasFailResponse : function(error, form){
			console.log(error);
		},
		getAgregarAdminResponse : function(data, form, elementData, callback){
			var data = { success: true, data: [] };

			/* simular error de email existente */
		  	var hash = window.location.hash;
		  	
			if(hash=='#errorAdminEmail'){
				data.success = false;
				data.error = {
					message : 'Ya existe un administrador con ese correo electrónico.'
				};
			}
			/* fin simular error de email existente */

			/**Caso de uso servicio no disponible**/
		  	if(hash=="#error-servicio-general"){
				data.success = false;
				data.error = {
					message : 'Lo sentimos, este servicio por el momento no está disponible. Estamos trabajando para servirte mejor. Por favor, intenta más tarde.'
				};
			}

			if(data.success){
				

		  		/* simular ID agregados en la DB */
				var idAddedAdmin = $('#gestion-ejecutivos-view .mosaico-view .item-mv').length+1;
				/** fin simular **/

				var meta = {
					'aliasId' : elementData.aliasId,
					'id' : idAddedAdmin,
					'nombre' : elementData.nombre,
					'correo' : elementData.correo,
					'lada' : elementData.lada,
					'numero' : elementData.numero,
					'extension' : elementData.extension
				};

				var $alias = $('#alias-'+elementData.aliasId);
				//Envío el Id y el nombre del nuevo elemento
				callback(meta, $alias);

				$(form).hide();
				$(form).addClass('success');

				$('#modal-agregar-administrador .main-modal-header').hide();
				$('#modal-agregar-administrador .secondary-modal-header').show();
				$('.form-agregar-administrador .user-email').html(meta.correo);

		  	}
		  	else{

		  		/* mostrar error enviado por el sistema */

		  		if(data.error){
		  			if(hash=='#errorAdminEmail'){
			  			/*Este es el caso de correo electrónico existente*/
			  			var $container = $('#form-agregar-administrador .element-input-block .email-container');
			  			appendErrorGeneral($container, $container.find('input') , data.error.message);
			  		}
			  		else{
		  			/** Mensaje de error enviado por el sistema**/
				  		$(form).hide();
							
						var errorHTML = '<div class="notif-bloq"> <div class="row"> <div class="col-xs-12 col-sm-12 inner-nb" id="error-autogestion-block"> <span class="icon io-Alert2"></span> <h2 class="h4">No se pudo procesar la operación</h2> <div id="listado-sin-autogestion-container"> <p>'+data.error.message+'</p> <div class="col-sm-12 btn-container"> <button type="button" class="bton blue-dark" id="btn-resend-form">Reintentar</button> </div> </div> </div> </div> </div>';
						appendErrorGeneralHTML($('#modal-agregar-administrador .in-cont-mod'), null , errorHTML);
					}
		  			
		  		}

		  	}
		},
		getEditarAdminFailResponse : function(error, form){
			console.log(error);
		},
		getEditarAdminResponse : function(data, form, elementData, callback){
			var data = { success: true, data: [] };

			/* simular error de email existente */
		  	var hash = window.location.hash;
		  	
			if(hash=='#errorAdminEmail'){
				data.success = false;
				data.error = {
					message : 'Ya existe un administrador con ese correo electrónico.'
				};
			}
			/* fin simular error de email existente */

			/**Caso de uso servicio no disponible**/
		  	if(hash=="#error-servicio-general"){
				data.success = false;
				data.error = {
					message : 'Lo sentimos, este servicio por el momento no está disponible. Estamos trabajando para servirte mejor. Por favor, intenta más tarde.'
				};
			}

			if(data.success){
				
				var meta = {
					'aliasId' : elementData.aliasId,
					'id' : elementData.adminId,
					'nombre' : elementData.nombre,
					'correo' : elementData.correo,
					'lada' : elementData.lada,
					'numero' : elementData.numero,
					'extension' : elementData.extension
				};

				var $alias = $('#alias-'+elementData.aliasId);
				//Envío el Id y el nombre del nuevo elemento
				callback(meta, $alias);

				$(form).hide();
				$(form).addClass('success');

		  	}
		  	else{

		  		/* mostrar error enviado por el sistema */

		  		if(data.error){
		  			if(hash=='#errorAdminEmail'){
		  			/*Este es el caso de correo electrónico existente*/
		  			var $container = $('#form-editar-administrador .element-input-block .email-container');
		  			appendErrorGeneral($container, $container.find('input') , data.error.message);
					}
					else{
			  			/** Mensaje de error enviado por el sistema**/
				  		$(form).hide();
							
						var errorHTML = '<div class="notif-bloq"> <div class="row"> <div class="col-xs-12 col-sm-12 inner-nb" id="error-autogestion-block"> <span class="icon io-Alert2"></span> <h2 class="h4">No se pudo procesar la operación</h2> <div id="listado-sin-autogestion-container"> <p>'+data.error.message+'</p> <div class="col-sm-12 btn-container"> <button type="button" class="bton blue-dark" id="btn-resend-form">Reintentar</button> </div> </div> </div> </div> </div>';
						appendErrorGeneralHTML($('#modal-editar-administrador .in-cont-mod'), null , errorHTML);
					}
		  		}

		  	}
		},
		getAgregarAdminFailResponse : function(error, form){
			console.log(error);
		},
		getEliminarAdminResponse : function(data, form, currentModalData, updateDataDomCallback){
			var hash= window.location.hash;

			/**Respuesta hardcodeada**/
			var data = { success: true };
		  	/**Caso de uso servicio no disponible**/
		  	if(hash=="#error-servicio-general"){
				data.success = false;
				data.error = {
					message : 'Lo sentimos, este servicio por el momento no está disponible. Estamos trabajando para servirte mejor. Por favor, intenta más tarde.'
				};
			}

		  	/**Caso de uso admin previamente eliminado**/
		  	if(hash=="#adminPreviamenteEliminado"){
				$('#confirmar-eliminar-admin').hide();
				$('#eliminar-admin-ya-eliminado').show();
			}
			else{
			  	if(data.success){
			  		/**éxito**/
			  		$('#confirmar-eliminar-admin').hide();
					$('#eliminar-admin-confirmacion').show();
					$('#modal-eliminar-admin .alias-text').html(currentModalData.texto);

					var $alias = $('#alias-'+currentModalData.id);
					updateDataDomCallback($alias);
			  	}
			  	else{
			  		/** Mensaje de error enviado por el sistema**/
			  		$(form).hide();
						
					var errorHTML = '<div class="notif-bloq"> <div class="row"> <div class="col-xs-12 col-sm-12 inner-nb" id="error-autogestion-block"> <span class="icon io-Alert2"></span> <h2 class="h4">No se pudo procesar la operación</h2> <div id="listado-sin-autogestion-container"> <p>'+data.error.message+'</p> <div class="col-sm-12 btn-container"> <button type="button" class="bton blue-dark" id="btn-resend-form">Reintentar</button> </div> </div> </div> </div> </div>';
						appendErrorGeneralHTML($('#modal-eliminar-admin .in-cont-mod'), null , errorHTML);
			  	}
			 }
		},
		getEliminarAdminFailResponse : function(error, form){
			console.log(error);
		},
		getAsociarCuentasResponse : function(data, form){
			/**Respuesta hardcodeada**/
			var data = { success: true };

			$('#paso-1').hide();
			$('#paso-2').hide();

			if(data.success){
		  		/**éxito**/
		  		$(form).find('.form-ge-mod').hide();
				$(form).find('.form-ge-mod').addClass('success');
				$(form).parent().find('.head-action-mod .m-btn-close-modal').addClass('m-btn-close-modal-parent');
		  		
				window.location.href='consulta-cuentas-2.html';
		  		// $('#edit-cuentas-table').removeClass('no-cuentas');
		  		// $('.hide-no-cuentas').removeClass('hidden');

		  	}
		  	else{
		  		/** Mensaje de error enviado por el sistema**/
		  	}

		  	$('#paso-3').show();
		},
		getAsociarCuentasFailResponse : function(error, form){
			console.log(error);
		},
		getQuitarCuentasResponse : function(data, form, allChecked, resetBlockCallback){
			/**Respuesta hardcodeada**/
			var data = { success: true };

			if(data.success){
		  		/**éxito**/
		  		/**Si no ocurre el error eliminamos del html los elementos.**/

		  		$('#listado-cuentas .linea-batch.checked-element').remove();
		  		
		  		var enPagina = $('#listado-cuentas .linea-batch input[type="checkbox"]').length == $('#listado-cuentas .linea-batch input[type="checkbox"]:checked').length;
		  		if(allChecked || enPagina){
		  			// $('#edit-cuentas-table').addClass('no-cuentas');
		  			// $('.hide-no-cuentas').addClass('hidden');
		  			window.location.href='consulta-cuentas-2-sin-cuentas.html';
		  		}
		  		resetBlockCallback();

		  		$('#confirmar-desasociar-cuentas').hide();
		  		$('#desasociar-cuentas-confirmacion').show();

		  	}
		  	else{
		  		/** Mensaje de error enviado por el sistema**/
		  	}
		},
		getQuitarCuentasFailResponse : function(error, form){
			console.log(error);
		},
		cuentasAsociadasSuccessCallback : function(modal, json, cuentasAsociadas){
			/**Hardcodeo el resultado del GETJSON **/
			json = { success: true, data: cuentasAsociadasAuxiliar };

			cuentasAsociadas.value = json.data;

			if(json.success){
		  		modal['paginacion'].updateItems(json.data);
		  		modal['paginacion'].reset();
		  	}
		  	else{
		  		/* agregar error enviado por el sistema */
		  	}
		},
		cuentasAsociadasFailCallback : function(error){
			console.log(error);
		},
	};

	var facturacion = {
		getFacturacionFormResponse : function(data, form, sentTo){
			console.log('Formulario enviado.');
			window.location.href = sentTo;
		},
		getFacturacionFormFailResponse : function(error, form){
			console.log(error);
		},
		getDescargarFacturasResponse : function(data, form, title, callback){

			var hash= window.location.hash;

			/**Respuesta hardcodeada**/
			var data = { success: true };

		  	/**Caso de uso error en solicitud**/
		  	if(hash=="#error-solicitud-descarga"){
				data.success = false;
				data.error = {
					message : 'Por el momento no se puede realizar tu solicitud, por favor intentalo más tarde.'
				};
			}

		  	/*Exito*/
		  	if(data.success){
				$(form).hide();
				if(title!=null)
					title.element.html(title.text);

				if(typeof callback!='undefined')
					callback();

				if($('#descargar-facturas-confirmacion').hasClass('add-modal-no-close'))
					$('#modal-descargar').addClass('no-close-out');

				$('#descargar-facturas-confirmacion').show();
				$(form).find('button[type="submit"]').prop('disabled', false);
			}
			else{
				if(data.error){
					var errorHTML = '<div class="notif-bloq"> <div class="row"> <div class="col-xs-12 col-sm-12 inner-nb" id="error-autogestion-block"> <span class="icon io-Alert2"></span> <h2 class="h4">No se pudo procesar la operación</h2> <div id="listado-sin-autogestion-container"> <p>Lo sentimos, este servicio por el momento no está disponible. Estamos trabajando para servirte mejor. Por favor, intenta más tarde.</p> <div class="col-sm-12 btn-container"> <button type="button" class="bton blue-dark" id="btn-r-descargar-facturas">Reintentar</button> </div> </div> </div> </div> </div>';
					appendErrorGeneralHTML($('#modal-descargar .in-cont-mod'), null , errorHTML);

				}
				$(form).find('button[type="submit"]').prop('disabled', false);
			}
		},
		getDescargarFacturasFailResponse : function(error, form){
			console.log(error);
		},
		generarReferenciaUnicaResponse : function(data, form, _modalData, updateDomCallback){
			/**Respuesta hardcodeada**/
			var data = { success: true };
		  	
			var hash = window.location.hash;

			if(hash=='#error-solicitud' || hash=='#error-sistema')
				data.success = false;
			else
				data.success = true;

		  	/*Exito*/
		  	//aqui iría el data que regrese el json
		  	data.referencia = '5C9D2E7W4D4E051';//SIMULACIÓN DE UN DATA GENERADO

		  	if(data.success){
		  		_modalData.referencia = data.referencia;
		  		$(form).find('.referencia-generada').html(_modalData.referencia);
		  		updateDomCallback();

		  		console.log('here');
		  	}
		  	else{

		  		if(hash=='#error-sistema'){
				$('#modal-generar-referencia .form-ge-mod.error-ge .only-p').html('Por el momento no se puede procesar tu solicitud, te sugerimos intentar en 15 min, por favor.');
				}
				else{
					$('#modal-generar-referencia .form-ge-mod.error-ge .only-p').html('Tu solicitud no puede ser procesada en este momento. <br>Estamos trabajando para servirte mejor, por favor intenta más tarde.');
				}
			
		  		$('#modal-generar-referencia #form-generar-referencia').addClass('hidden');
		  		$('#modal-generar-referencia .form-ge-mod.error-ge').removeClass('hidden');
		  		$('#modal-generar-referencia .heading-mod .title-mod p').html('Referencia única no generada');

		  	}
		},
		generarReferenciaUnicaFailResponse : function(error, form){
			
			if(hash=='#error-sistema'){
				$('#modal-generar-referencia .form-ge-mod.error-ge .only-p').html('Por el momento no se puede procesar tu solicitud, te sugerimos intentar en 15 min, por favor.');
			}
			else{
				$('#modal-generar-referencia .form-ge-mod.error-ge .only-p').html('Tu solicitud no puede ser procesada en este momento. <br>Estamos trabajando para servirte mejor, por favor intenta más tarde.');
			}

			$('#modal-generar-referencia #form-generar-referencia').addClass('hidden');
		  	$('#modal-generar-referencia .form-ge-mod.error-ge').removeClass('hidden');
		  	$('#modal-generar-referencia .heading-mod .title-mod p').html('Referencia única no generada');
		}
	};

	var home = {
		getFacturasPendientes : function(data,form){
			var data = { success: true };
		  	
			var hash = window.location.hash;

			var success  = '<div class="col-sm-12 api-msg api-msg-success"> <div class="notif-bloq"> <div class="row"> <div class="col-xs-12 col-sm-12 inner-nb"> <div class="en-proceso"><div class="sk-circle"> <div class="sk-circle1 sk-child"></div> <div class="sk-circle2 sk-child"></div> <div class="sk-circle3 sk-child"></div> <div class="sk-circle4 sk-child"></div> <div class="sk-circle5 sk-child"></div> <div class="sk-circle6 sk-child"></div> <div class="sk-circle7 sk-child"></div> <div class="sk-circle8 sk-child"></div> <div class="sk-circle9 sk-child"></div> <div class="sk-circle10 sk-child"></div> <div class="sk-circle11 sk-child"></div> <div class="sk-circle12 sk-child"></div> </div></div> <h2 class="h4">Solicitud de consulta</h2><p class="only-p">Esta consulta puede tardar varíos minutos, te notificaremos en cuanto este lista</p></div> </div> </div></div>';


   			//$(form).parent().parent().parent().find('.heading-opc-tab').addClass('hidden');
			// $(form).addClass('hidden');

			if(data.success)
				$(form).append(success);
			else
				$(form).append(error);
		},
		getFacturasPendientesFail : function(form){

		},
		getCambioFormResponse : function(data, form){
			/**Respuesta hardcodeada**/
			var data = { success: true };
		  	
			var hash = window.location.hash;

			if(hash=='#error-solicitud')
				data.success = false;
			else
				data.success = true;

			$(form).parent().parent().parent().find('.heading-opc-tab').addClass('hidden');
			$(form).addClass('hidden');

			if(data.success)
				$(form).next('.api-msg-success').removeClass('hidden');
			else
				$(form).parent().find('.api-msg-error').removeClass('hidden');
			
		},
		getCambioFormFailResponse : function(error, form){
			console.log('Error.');
		},
		getSuspensionFormResponse : function(data, form){
			/**Respuesta hardcodeada**/
			var data = { success: true };
		  	
			var hash = window.location.hash;

			if(hash=='#error-solicitud')
				data.success = false;
			else
				data.success = true;

			$(form).parent().parent().parent().find('.heading-opc-tab').addClass('hidden');
			$(form).addClass('hidden');

			if(data.success)
				$(form).next('.api-msg-success').removeClass('hidden');
			else
				$(form).parent().find('.api-msg-error').removeClass('hidden');
		},
		getSuspensionFormFailResponse : function(error, form){
			console.log('Error.');
		},
		getCACFormResponse : function(data, form){
			/**Respuesta hardcodeada**/
			var data = { success: true };
		  	
			var hash = window.location.hash;

			if(hash=='#error-solicitud')
				data.success = false;
			else
				data.success = true;

			$(form).parent().parent().parent().find('.heading-opc-tab').addClass('hidden');
			$(form).addClass('hidden');

			if(data.success)
				$(form).next('.api-msg-success').removeClass('hidden');
			else
				$(form).parent().find('.api-msg-error').removeClass('hidden');
		},
		getCACFormFailResponse : function(error, form){
			console.log('Error.');
		},
		getReactivacionFormResponse : function(data, form){
			/**Respuesta hardcodeada**/
			var data = { success: true };
		  	
			var hash = window.location.hash;

			if(hash=='#error-solicitud')
				data.success = false;
			else
				data.success = true;

			$(form).parent().parent().parent().find('.heading-opc-tab').addClass('hidden');
			$(form).addClass('hidden');

			if(data.success)
				$(form).next('.api-msg-success').removeClass('hidden');
			else
				$(form).parent().find('.api-msg-error').removeClass('hidden');
		},
		getReactivacionFormFailResponse : function(error, form){
			console.log('Error.');
		},

	};

	var citas = {
		setCACLocation : function(data, drawMarkersCallback){
			/**Respuesta hardcodeada**/
			var data = { success: true, data : shuffle([
					{"id":48,"title":"Amores","description": "Amores No. 26, Col. del Valle, C.P. 03100, México D.F., Lunes a Viernes 9:00 a 18:00 hrs.", "longitude":"-99.168029","latitude":"19.3818785"},
					{"id":46,"title":"Del Valle","description": "Eje 7 Sur Felix Cuevas No. 825 Esq. Aniceto Ortega, Col. Del Valle, C.P. 03100, México D.F., Lúnes a Viernes 9:00 a 18:00 hrs.", "longitude":"-99.167084","latitude":"19.370912"},
					{"id":44,"title":"Pabellón Del Valle","description": "Av. Universidad No. 740, Col. Santa Cruz Atoyac. Deleg. Benito Juárez, Plaza Pabellón del Valle Local A2 México.D.F. C.P. 03100, Lúnes a Viernes 9:00 a 18:00 hrs.", "longitude":"-99.162443","latitude":"19.373748"},
					{"id":43,"title":"Lago Alberto","description": "Lago Alberto No. 366 Col. Anáhuac C.P. 11320, México D.F., Lúnes a Viernes 9:00 a 18 hrs.", "longitude":"-99.179889","latitude":"19.439093"},
					{"id":39,"title":"Masaryk","description": "Tennyson No. 120 Esq. Presidente Masaryk, Col. Polanco Reforma, C.P. 11560, México D.F., Lúnes a Viernes 9:00 a 18 hrs.", "longitude":"-99.195201","latitude":"19.431978"},
					{"id":6,"title":"Pabellón Polanco","description": "Lago Alberto No. 366 Col. Anáhuac C.P. 11320, México D.F., Lúnes a Viernes de 9:00 a 18 hrs.", "longitude":"-99.207044","latitude":"19.437508"}
				])
			};

			if(data.success){
				drawMarkersCallback(data.data);
			}
			
		},
		setCACClosestLocation : function(data, drawMarkersCallback, checkDistance){
			/**Respuesta hardcodeada simulada**/
			var data = { success: true, data : [
					{"id":48,"title":"Amores","description": "Amores No. 26, Col. del Valle, C.P. 03100, México D.F., Lunes a Viernes 9:00 a 18:00 hrs.", "longitude":"-99.168029","latitude":"19.3818785"},
					{"id":46,"title":"Del Valle","description": "Eje 7 Sur Felix Cuevas No. 825 Esq. Aniceto Ortega, Col. Del Valle, C.P. 03100, México D.F., Lúnes a Viernes 9:00 a 18:00 hrs.", "longitude":"-99.167084","latitude":"19.370912"},
					{"id":44,"title":"Pabellón Del Valle","description": "Av. Universidad No. 740, Col. Santa Cruz Atoyac. Deleg. Benito Juárez, Plaza Pabellón del Valle Local A2 México.D.F. C.P. 03100, Lúnes a Viernes 9:00 a 18:00 hrs.", "longitude":"-99.162443","latitude":"19.373748"},
					{"id":43,"title":"Lago Alberto","description": "Lago Alberto No. 366 Col. Anáhuac C.P. 11320, México D.F., Lúnes a Viernes 9:00 a 18 hrs.", "longitude":"-99.179889","latitude":"19.439093"},
					{"id":39,"title":"Masaryk","description": "Tennyson No. 120 Esq. Presidente Masaryk, Col. Polanco Reforma, C.P. 11560, México D.F., Lúnes a Viernes 9:00 a 18 hrs.", "longitude":"-99.195201","latitude":"19.431978"},
					{"id":6,"title":"Pabellón Polanco","description": "Lago Alberto No. 366 Col. Anáhuac C.P. 11320, México D.F., Lúnes a Viernes de 9:00 a 18 hrs.", "longitude":"-99.207044","latitude":"19.437508"}
				]
			};

			var hash = window.location.hash;
			var aux = [];
			//Simular cuando no hay "cercanos"
			if(hash=='#sin-cercanos')
				$('.no-close-cacs').removeClass('hidden');
			else{

				//Simular los "cercanos"
				$.each(data.data, function(key, value) {
				   var close = checkDistance(data.data[key].latitude, data.data[key].longitude);

				   if(close)
				   		aux.push(data.data[key]);
				});
			}
				

			if(data.success){
				//Simular los populares cuando no hay "cercanos"
				if(aux.length==0){
					$('.no-close-cacs').removeClass('hidden');
					var t = 0;
					$.each(data.data, function(key, value) {
						t++;
						if(t<4)
							aux.push(data.data[key]);
						else
							return;
					});
				}

				drawMarkersCallback(aux);
			}
			
		},
		getCACAvailableDateTimes : function(data, range){
			/**Respuesta hardcodeada**/
			var data = { success: true, data : null };
			var minDateData = (range.min != null ? range.min.split('/') : null),maxDateData = (range.max != null ? range.max.split('/') : null),
			rangeArray = getDates(new Date(minDateData[2], minDateData[1]-1, minDateData[0]), (new Date(maxDateData[2], maxDateData[1]-1, maxDateData[0]))),
			dateTimesArr = [];

			var hash = window.location.hash,
			testSinHorario = false;

			if(hash=='#sin-horarios'){
				testSinHorario = true;
			}

			$.each(rangeArray, function(key, d) {
				var day = (d.getDate()<10 ? '0'+d.getDate() : d.getDate() ),
				month = (d.getMonth()+1<10 ? '0'+(d.getMonth()+1) : d.getMonth()+1 ),
				year = d.getFullYear(),
				date = day + '/' + month + '/' + year,
				aux = [],
				total =  Math.floor(Math.random() * (9 - 1) + 1),
				currentTotal = 0;
			    
			    if(testSinHorario && currentTotal<5)
			    	dateTimesArr[date] = aux;
			    else{
			    	for (i = 0; i < total; i++) {
				    	var hour = Math.floor(Math.random() * (19 - 9) + 9);
					   	hour = hour+':'+( Math.floor(Math.random() * (3 - 1) + 1) ==1 ? '00' : '30');
					   	hour = (hour.length>1 ? hour : '' )
					   	if($.inArray( hour, aux )==-1)
							aux.push(hour);
					}

				    dateTimesArr[date] = aux.sort();
			    }

			    currentTotal++;

			});
			
			return dateTimesArr;

		},
		getCACAvailableDateTimesFailResponse : function(){
			
		},
		getCACFormResponse : function(data, form, modalErrorSolicitud, sentTo){
			/**Respuesta hardcodeada**/
			var data = { success: true };
		  	
			var hash = window.location.hash;

			if(hash=='#error-solicitud'){
				modalErrorSolicitud.openModal();
			}
			else{
				console.log('Formulario enviado.');
				window.location.href = sentTo;
			}
		},
		getCACFormFailResponse : function(error, form){
			console.log('Error.');
		},
		getCancelarCitaResponse : function(data, form, currentModalData){

			/**Respuesta hardcodeada**/
			var data = { success: true };
		  	
		  	if(data.success){
		  		/**éxito**/
		  		$('#confirmar-cancelar-cita').hide();
		  		$('#cancelar-cita-confirmacion').show();
		  		$('#modal-cancelar-cita .cita-fecha').html(currentModalData.fecha);

		  		/**actualizar tabla**/
		  		var $cita = $('#cita-'+currentModalData.id);

		  		$cita.find('.content-item-block').addClass('item-cancelado');
		  		$cita.find('.cita-detalle').html('Cancelada');
		  		$cita.find('.general-group-options-container').html('');
		  		$cita.find('.btn-container-2-btns').remove();

		  	}	
		  	else{
		  		/** Mostrar mensaje enviado por sistema **/
		  	}
		},
		getCancelarCitaFailResponse : function(error, form){
			console.log(error);
		},
		getCancelarVisitaResponse : function(data, form, currentModalData){

			/**Respuesta hardcodeada**/
			var data = { success: true };
		  	
		  	if(data.success){
		  		/**éxito**/
		  		$('#confirmar-cancelar-visita').hide();
		  		$('#cancelar-visita-confirmacion').show();
		  		$('#modal-cancelar-visita .visita-folio').html(currentModalData.folio);

		  		/**actualizar tabla**/
		  		var $cita = $('#cita-'+currentModalData.id);
		  		
		  		$cita.find('.content-item-block').addClass('item-cancelado');
		  		$cita.find('.cita-detalle').html('Cancelada');
		  		$cita.find('.general-group-options-container').html('');
		  		$cita.find('.btn-container-2-btns').remove();
		  	}	
		  	else{
		  		/** Mostrar mensaje enviado por sistema **/
		  	}
		},
		getCancelarVisitaFailResponse : function(error, form){
			console.log(error);
		},
		getReprogramarCitaResponse : function(data, form, newData){
			/**Respuesta hardcodeada**/
			var data = { success: true };
		  	
		  	if(data.success){
		  		/**éxito**/
		  		$('#confirmar-reprogramar-cita').hide();
		  		$('#reprogramar-cita-confirmacion').show();
		  		$('#modal-reprogramar-cita .cita-fecha').html(newData.fecha);
		  		$('#modal-reprogramar-cita .cita-hora').html(newData.hora);
		  	}	
		  	else{
		  		/** Mostrar mensaje enviado por sistema **/
		  	}
		},
		getReprogramarCitaFailResponse : function(error, form){
			console.log(error);
		},
		consultarDateTimeResponse : function(data, currentModalData, callBack){

			/**Respuesta hardcodeada**/
			var data = { success: true };
		  	
		  	var hash = window.location.hash;

		  	console.log(hash=='#menos-24hrs');
			if(hash=='#menos-24hrs'){
				$('#cancelar-cita-24-hrs, #reprogramar-cita-24-hrs').show();
				console.log('cancelar');
			}
			else{
				if(typeof callBack!= 'undefined'){
					$('#confirmar-reprogramar-cita').show();
					getAvailableDateTimes(currentModalData.fecha);
				}
				else{
					$('#confirmar-cancelar-cita').show();
					$('#modal-cancelar-cita .cita-fecha').html(currentModalData.fecha);
					$('#modal-cancelar-cita .cita-hora').html(currentModalData.hora);
					$('#modal-cancelar-cita .cita-cac').html(currentModalData.cac);
				}
				
			}

		},
		consultarDateTimeFailResponse : function(error, form){
			console.log(error);
		},



	};

	var adendum = {
		getSingleAdendumResponse : function(data, form, sentTo){
			console.log('Formulario enviado.');
			window.location.href = sentTo;
		},
		getSingleAdendumFailResponse : function(error, form){
			console.log(error);
		},
		getMasivoAdendumResponse : function(data, form, sentTo, showInvalidErrorArchivo){
			/*simular error de archivo*/ 
			var hash = window.location.hash;
			if(hash=='#archivoInvalido'){
				showInvalidErrorArchivo();
				submit = false;
			}
			/*fin simular error de archivo*/ 
			else{
				console.log('Formulario enviado.');
				window.location.href = sentTo;
			}
		},
		getMasivoAdendumFailResponse : function(error, form){
			console.log(error);
		},
		getAllResponse : function(data, form, sentTo){
			console.log('Formulario enviado.');
			window.location.href = sentTo;
		},
		getAllFailResponse : function(error, form){
			console.log(error);
		},
		getDescargarFacturasResponse : function(data, form, title){

			var hash= window.location.hash;

			/**Respuesta hardcodeada**/
			var data = { success: true };

		  	/**Caso de uso admin previamente eliminado**/
		  	if(hash=="#error-solicitud-descarga"){
				data.success = false;
				data.error = {
					message : 'Por el momento no se puede realizar tu solicitud, por favor intentalo más tarde.'
				};
			}
		  	
		  	if(data.success){
				$(form).hide();

				if(title!=null)
					title.element.html(title.text);

				$('#descargar-facturas-confirmacion').show();
		  	}
		  	else{
		  		/**mostrar mensaje enviado por sistema**/
		  		if(data.error){
					var errorHTML = '<div class="notif-bloq"> <div class="row"> <div class="col-xs-12 col-sm-12 inner-nb" id="error-autogestion-block"> <span class="icon io-Alert2"></span> <h2 class="h4">No se pudo procesar la operación</h2> <div id="listado-sin-autogestion-container"> <p>Lo sentimos, este servicio por el momento no está disponible. Estamos trabajando para servirte mejor. Por favor, intenta más tarde.</p> <div class="col-sm-12 btn-container"> <button type="button" class="bton blue-dark" id="btn-r-descargar-facturas">Reintentar</button> </div> </div> </div> </div> </div>';
					appendErrorGeneralHTML($('#modal-descargar .in-cont-mod'), null , errorHTML);
					
				}
		  	}

		  	$(form).find('button[type="submit"]').prop('disabled', false);
		},
		getDescargarFacturasFailResponse : function(error, form){
			console.log(error);
			/**mostrar mensaje enviado por sistema**/
		},
	};
	
	var sertec = {
		getSpecificIMEIResponse : function(data, form, sentTo, showInvalidErrorArchivo){
			/*simular error de archivo*/ 
			var hash = window.location.hash;
			if(hash=='#archivoInvalido'){
				showInvalidErrorArchivo();
				submit = false;
			}
			/*fin simular error de archivo*/ 
			else{
				console.log('Formulario enviado.');
				window.location.href = sentTo;
			}
		},
		getSpecificIMEIFailResponse : function(error, form){
			console.log(error);
		},
		getAllIMEIResponse : function(data, form, sentTo){
			console.log('Formulario enviado.');
			window.location.href = sentTo;
		},
		getAllIMEIFailResponse : function(error, form){
			console.log(error);
		},
		getSingleResponse : function(data, form, sentTo){
			console.log('Formulario enviado.');
			window.location.href = sentTo;
		},
		getSingleFailResponse : function(error, form){
			console.log(error);
		},
		getDescargarFacturasResponse : function(data, form, title){

			var hash= window.location.hash;

			/**Respuesta hardcodeada**/
			var data = { success: true };

		  	/**Caso de uso admin previamente eliminado**/
		  	if(hash=="#error-solicitud-descarga"){
				data.success = false;
				data.error = {
					message : 'Por el momento no se puede realizar tu solicitud, por favor intentalo más tarde.'
				};
			}
		  	
		  	if(data.success){
				$(form).hide();

				if(title!=null)
					title.element.html(title.text);

				$('#descargar-facturas-confirmacion').show();
		  	}
		  	else{
		  		/**mostrar mensaje enviado por sistema**/
		  		if(data.error){
					var errorHTML = '<div class="notif-bloq"> <div class="row"> <div class="col-xs-12 col-sm-12 inner-nb" id="error-autogestion-block"> <span class="icon io-Alert2"></span> <h2 class="h4">No se pudo procesar la operación</h2> <div id="listado-sin-autogestion-container"> <p>Lo sentimos, este servicio por el momento no está disponible. Estamos trabajando para servirte mejor. Por favor, intenta más tarde.</p> <div class="col-sm-12 btn-container"> <button type="button" class="bton blue-dark" id="btn-r-descargar-facturas">Reintentar</button> </div> </div> </div> </div> </div>';
					appendErrorGeneralHTML($('#modal-descargar .in-cont-mod'), null , errorHTML);
					
				}
		  	}

		  	$(form).find('button[type="submit"]').prop('disabled', false);
		},
		getDescargarFacturasFailResponse : function(error, form){
			console.log(error);
			/**mostrar mensaje enviado por sistema**/
		},
	};

	var historial = {
		getDescargarFacturasResponse : function(data, form, title){

			var hash= window.location.hash;

			/**Respuesta hardcodeada**/
			var data = { success: true };

		  	/**Caso de uso admin previamente eliminado**/
		  	if(hash=="#error-solicitud-descarga"){
				data.success = false;
				data.error = {
					message : 'Por el momento no se puede realizar tu solicitud, por favor intentalo más tarde.'
				};
			}
		  	
		  	if(data.success){
				$(form).hide();

				if(title!=null)
					title.element.html(title.text);

				$('#descargar-facturas-confirmacion').show();
		  	}
		  	else{
		  		/**mostrar mensaje enviado por sistema**/
		  		if(data.error){
					var errorHTML = '<div class="notif-bloq"> <div class="row"> <div class="col-xs-12 col-sm-12 inner-nb" id="error-autogestion-block"> <span class="icon io-Alert2"></span> <h2 class="h4">No se pudo procesar la operación</h2> <div id="listado-sin-autogestion-container"> <p>Lo sentimos, este servicio por el momento no está disponible. Estamos trabajando para servirte mejor. Por favor, intenta más tarde.</p> <div class="col-sm-12 btn-container"> <button type="button" class="bton blue-dark" id="btn-r-descargar-facturas">Reintentar</button> </div> </div> </div> </div> </div>';
					appendErrorGeneralHTML($('#modal-descargar .in-cont-mod'), null , errorHTML);
					
				}
		  	}

		  	$(form).find('button[type="submit"]').prop('disabled', false);
		},
		getDescargarFacturasFailResponse : function(error, form){
			console.log(error);
			/**mostrar mensaje enviado por sistema**/
		},
	};


	var configuracion = {
		getAgregarRolResponse : function(data, form, elementData, callback){
			var data = { success: true, data: [] };

			/* simular error de nombre existente */
		  	var hash = window.location.hash;
		  	
			if(hash=='#errorNombreExistente'){
				data.success = false;
				data.error = {
					message : 'El nombre del perfil fue utilizado anteriormente, favor de ingresar uno nuevo.'
				};

			}
			/* fin simular error de nombre existente */

			if(data.success){
		  		/* simular ID agregado en la DB */
				// var idAdded = $('.mosaico-view .item-mv').length;

				// callback(idAdded, elementData.name);

				// $('#btn-agregar-lineas-grupo-modal').attr('data-item', '{"id": "'+idAdded+'" ,"nombre": "'+elementData.name+'", "showgrupo" : true}');

				// $(form).hide();
				// $(form).addClass('success');

				// $('.form-agregar-rol .api-msg .rol-txt').html(elementData.name);

				window.location.href="configuracion-1-d.html";
		  	}
		  	else{

		  		/* mostrar error enviado por el sistema */

		  		if(data.error){
		  			appendErrorGeneral($('.form-agregar-rol .element-input-block'), elementData.input , data.error.message);
		  		}

		  	}
		},
		getAgregarRolFailResponse : function(error, form){
			console.log(error);
		},
		getAgregarRolAdminResponse : function(data, form, perfil, callback){
			var data = { success: true, data: [] };

			/* simular error de nombre existente */

			if(data.success){
		  		/* simular ID agregado en la DB */

		  		callback(perfil);

				//$(form).hide();
				//$(form).addClass('success');

				// $('.form-agregar-rol .api-msg .rol-txt').html(elementData.name);

		  	}
		  	else{

		  		/* mostrar error enviado por el sistema */

		  		if(data.error){
		  			appendErrorGeneral($('.form-agregar-rol .element-input-block'), elementData.input , data.error.message);
		  		}

		  	}
		},
		getAgregarRolAdminFailResponse : function(error, form){
			console.log(error);
		},
		postAgregarLineasArchivo : function(dataArchivo, callbackpostAgregarLineas, callbackArchivoInvalido ){
			/*Simular error de archivo ilegible */
			var hash = window.location.hash;
			if(hash=='#archivoInvalido')
				callbackArchivoInvalido();
			else{
				if(typeof dataArchivo != 'undefined')
					callbackpostAgregarLineas(dataArchivo, 'archivo');
			}
		},
		getAgregarLineasResponse : function(data, callbackMostrarTablas, callbackNextStep, aux){

			/**Respuesta hardcodeada**/
			var data = { success: true, data : [] };

			// ESTE SETTIMEOUT SOLO ESTA PARA SIMULAR QUE SE TARDA EN REGRESAR LA RESPUESTA
			setTimeout(function(){
				callbackNextStep('#modal-agregar-usuarios .step-3','#modal-agregar-usuarios .step-2');
				$('#modal-agregar-usuarios .loading-block-screen').hide();
			}, 3000);

			/**Respuesta simulada**/

		  	data.data = {
		  			success : ['5567778991', '576876541', '5523657999', '5544448991', '5511145678', '5567778991', '576876541', '5523657999', '5544448991', '5511145678'],
		  			error : []
		  	}; 

			/**fin Respuesta simulada**/

			/** Simular error caso de uso **/
		  	var hash = window.location.hash;

			if(hash=='#errorAgregarLineas'){
				data.data.error = [ 
					{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
					{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
					{'numero' : '5523657890', 'motivo' : 'Número no existe' },
					{'numero' : '5512348991', 'motivo' : 'Número no existe' },
					{'numero' : '5512345678', 'motivo' : 'Falta de permisos' }
				];
			}
			else if(hash == '#errorAgregarTodasLineas'){
				data.data.success = [];
				data.data.error = [ 
					{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
					{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
					{'numero' : '5523657890', 'motivo' : 'Número no existe' },
					{'numero' : '5512348991', 'motivo' : 'Número no existe' },
					{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
					{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
					{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
					{'numero' : '5523657890', 'motivo' : 'Número no existe' },
					{'numero' : '5512348991', 'motivo' : 'Número no existe' },
					{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
					{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
					{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
					{'numero' : '5523657890', 'motivo' : 'Número no existe' },
					{'numero' : '5512348991', 'motivo' : 'Número no existe' },
					{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
					{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
					{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
					{'numero' : '5523657890', 'motivo' : 'Número no existe' },
					{'numero' : '5512348991', 'motivo' : 'Número no existe' },
					{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
					{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
					{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
					{'numero' : '5523657890', 'motivo' : 'Número no existe' },
					{'numero' : '5512348991', 'motivo' : 'Número no existe' },
					{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
					{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
					{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
					{'numero' : '5523657890', 'motivo' : 'Número no existe' },
					{'numero' : '5512348991', 'motivo' : 'Número no existe' },
					{'numero' : '5512345678', 'motivo' : 'Falta de permisos' }
				];
			}

		  	if(data.success){

				$('#btn-add-lineas-arbol').prop('disabled', true);
				$('#modal-agregar-usuarios .txt-current').html(aux.text);
				callbackMostrarTablas(data.data);

				if($('#listado-usuarios').length>0)
				{
					var url = window.location.href;
					
					if (url.indexOf('configuracion-4-a') >= 0)
						window.location.href="configuracion-4-a-un-usuario.html";
					else if(url.indexOf('configuracion-4-b') >= 0)
						window.location.href="configuracion-4-b-un-usuario.html";
					else if (url.indexOf('configuracion-4-c') >= 0)
						window.location.href="configuracion-4-c-un-usuario.html";
					else if(url.indexOf('configuracion-4-d') >= 0)
						window.location.href="configuracion-4-d-un-usuario.html";
				}

		  	}
		  	else{					  		
		  		//**Mostrar mensaje no success**//
		  	}



		},
		getAgregarLineasFailResponse : function(error, form){
			console.log(error);
		},
		getEditarNombreRolResponse : function(data, value, callback, $elementos){
			var $element = $elementos.element;
		  	var $input = $elementos.input;

			/**Respuesta hardcodeada**/
		  	var data = { success : true, data : [] };

			/**simular casp de uso**/
			var hash = window.location.hash;

			if(hash=='#errorNombreExistente'){

				data.success = false;

				data.error = {
					message : 'El nombre del perfil fue utilizado anteriormente, favor de ingresar uno nuevo.'
				};
			}

			if(data.success){
		  		$element.find('.name-container .ribbon-content').html(value);
		  		$element.data('name', value);
		  		$element.find('.name-container').removeClass('active-edit');

		  		var item = ( typeof $element.data('item') != 'undefined' ? $element.data('item') : null);

		  		if(item!=null){
		  			item.nombre = value;
		  			$element.data('item', item);
		  		}

		  	}
		  	else{
		  		//JSON SUCCESS FALSE
		  		if(data.error){
		  			callback($element, $input, data.error.message);
		  		}

		  	}


		},
		getEditarNombreRolFailResponse : function(error){
			console.log(error);
		},
		getEliminarRolResponse : function(data, form, currentModalData){

			/**Respuesta hardcodeada**/
			var data = { success: true };
		  	
		  	if(data.success){
		  		/**éxito**/
		  		$('#confirmar-eliminar-rol').hide();
		  		$('#eliminar-rol-confirmacion').show();
		  		$('#modal-eliminar-rol .alias-text').html(currentModalData.texto);

		  		var $rol = $('#rol-'+currentModalData.id);
		  		if($rol.length>0)
		  			$rol.remove();
		  	}
		  	else{
		  		/** Mostrar mensaje enviado por sistema **/
		  	}
		},
		getEliminarRolFailResponse : function(error, form){
			console.log(error);
		},
		getEliminarRolAdminResponse : function(data, form, currentModalData, callback){

			/**Respuesta hardcodeada**/
			var data = { success: true };
		  	
		  	if(data.success){
		  		/**éxito**/
		  		$('#confirmar-eliminar-rol-admin').hide();
		  		$('#eliminar-rol-admin-confirmacion').show();
		  		$('#modal-eliminar-rol-admin .alias-text').html(currentModalData.texto);
		  		$('#rol-'+currentModalData.id).parent().remove();
		  		callback();
		  	}
		  	else{
		  		/** Mostrar mensaje enviado por sistema **/
		  	}
		},
		getEliminarRolAdminFailResponse : function(error, form){
			console.log(error);
		},
		getAgregarUsuarioResponse : function(data, form, elementData, successCallback){
			var data = { success: true, data: [] };

			/* simular error de email existente */
		  	var hash = window.location.hash;
		  	
			if(hash=='#errorUsuarioEmail'){
				data.success = false;
				data.error = {
					message : 'Ya existe un usuario con ese correo electrónico.'
				};
			}
			/* fin simular error de email existente */

			if(data.success){

				var grupotxt = '',
				gtotal = elementData.grupos.length;

				if(gtotal>0){
					grupotxt = ' para que pueda gestionar el(los) grupo(s) seleccionado(s)'
				}
				// if(gtotal > 0)
				// {
				// 	var grupos = '',
				// 	cgtotal = 0;

					
				// 	grupotxt = ' para que ['+elementData.nombre+'] pueda gestionar ';

				// 	if(gtotal>1){
				// 		var grupo = '';
				// 		elementData.grupos.each(function() {

				// 			var $grupo = $( this );

				// 			grupo+=$grupo.data('grupo');
							
				// 			cgtotal++;

				// 			if(cgtotal == gtotal-1)
				// 				grupo+=' y ';
				// 			else if(cgtotal > 0 && cgtotal < gtotal)
				// 				grupo+=', ';

				// 		});

				// 		grupotxt+='los grupos ['+grupo+']';

				// 	}
				// 	else
				// 		grupotxt+='el grupo ['+elementData.grupos.id('grupo')+']';

				// }


				var msg = 'El usuario ['+elementData.nombre+'] se agrego de forma exitosa al perfil ['+elementData.rol+']. Se enviará un correo de bienvenida con los accesos a Mi Telcel Empresas a ['+elementData.correo+']'+grupotxt+'.';

				successCallback(msg);

				if($('#listado-usuarios').length>0)
				{
					var url = window.location.href;
					
					if (url.indexOf('configuracion-4-a') >= 0)
						window.location.href="configuracion-4-a-un-usuario.html";
					else if(url.indexOf('configuracion-4-b') >= 0)
						window.location.href="configuracion-4-b-un-usuario.html";
					else if (url.indexOf('configuracion-4-c') >= 0)
						window.location.href="configuracion-4-c-un-usuario.html";
					else if(url.indexOf('configuracion-4-d') >= 0)
						window.location.href="configuracion-4-d-un-usuario.html";
				}

				$(form).hide();
				$(form).addClass('success');

		  	}
		  	else{

		  		/* mostrar error enviado por el sistema */

		  		if(data.error){
		  			/*Este es el caso de correo electrónico existente*/
		  			var $container = $('#form-agregar-usuario .element-input-block .email-container');
		  			appendErrorGeneral($container, $container.find('input') , data.error.message);
		  		}

		  	}
		},
		getAgregarUsuarioFailResponse : function(error, form){
			console.log(error);
		},
		getCambiarRolResponse : function(data, form, callbackMostrarTablas, meta){

			// ESTE SETTIMEOUT SOLO ESTA PARA SIMULAR QUE SE TARDA EN REGRESAR LA RESPUESTA
			setTimeout(function(){
				$('#modal-cambiar-rol .step-2').hide();
				$('#modal-cambiar-rol .step-3').show();
				$('#modal-cambiar-rol .loading-block-screen').hide();
			}, 3000);

			/**Respuesta simulada**/

			/**Respuesta hardcodeada**/
			var data = { success: true, data : [] };
		  	
		  	data.success = true;

		  	data.data = {
		  			success : ['5567778991', '576876541', '5523657999', '5544448991', '5511145678', '5567778991', '576876541', '5523657999', '5544448991', '5511145678'],
		  			error : []
		  	};

			/**simular error caso de uso**/
			var hash = window.location.hash;

			if(hash=='#errorCambiarRol'){

				data.success = false;

				data.error = {
					message : 'No se puede realizar el cambio. Necesitas permisos para modificar este rol.'
				};

			}
			else if(hash=='#errorMoverMismoRol'){
				data.success = false;

				data.error = {
					message : 'Es necesario mover a un destino distinto al que pertenece.'
				};
			}

		  	if(data.success){
				$(form).hide();
				$(form).addClass('success');

				if(meta.isMultiple){

					/**Simular error agregar lineas**/
				  	var hash = window.location.hash;

					if(hash=='#errorCambiarUsuarios'){
						data.data.error = [ 
							{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
							{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
							{'numero' : '5523657890', 'motivo' : 'Número no existe' },
							{'numero' : '5512348991', 'motivo' : 'Número no existe' },
							{'numero' : '5512345678', 'motivo' : 'Falta de permisos' }
						];
					}
					else if(hash == '#errorCambiarTodosUsuarios'){
						data.data.success = [];
						data.data.error = [ 
							{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
							{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
							{'numero' : '5523657890', 'motivo' : 'Número no existe' },
							{'numero' : '5512348991', 'motivo' : 'Número no existe' },
							{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
							{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
							{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
							{'numero' : '5523657890', 'motivo' : 'Número no existe' },
							{'numero' : '5512348991', 'motivo' : 'Número no existe' },
							{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
							{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
							{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
							{'numero' : '5523657890', 'motivo' : 'Número no existe' },
							{'numero' : '5512348991', 'motivo' : 'Número no existe' },
							{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
							{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
							{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
							{'numero' : '5523657890', 'motivo' : 'Número no existe' },
							{'numero' : '5512348991', 'motivo' : 'Número no existe' },
							{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
							{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
							{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
							{'numero' : '5523657890', 'motivo' : 'Número no existe' },
							{'numero' : '5512348991', 'motivo' : 'Número no existe' },
							{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
							{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
							{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
							{'numero' : '5523657890', 'motivo' : 'Número no existe' },
							{'numero' : '5512348991', 'motivo' : 'Número no existe' },
							{'numero' : '5512345678', 'motivo' : 'Falta de permisos' }
						];
					}

					callbackMostrarTablas(data.data);

					$('#modal-cambiar-rol .multiple-lines').show();

				}
				else{
					$('#modal-cambiar-rol .single-msg').show();
				}

				$('#modal-cambiar-rol .rol-txt-new').html(meta.rol);
				$('#btn-cambiar-rol').prop('disabled', true);

		  	}
		  	else{
		  		/**Mostrar error que regresa el sistema**/
		  		// if(data.error){
		  		// 	callbackError($('#modal-cambiar-rol .form-cambiar-rol'), null, data.error.message);
		  		// }
		  	}
		},
		getCambiarRolFailResponse : function(error, form){
			console.log(error);
		},
		getEliminarUsuarioRolResponse : function(data, form, callbackMostrarTablas, meta){

			// ESTE SETTIMEOUT SOLO ESTA PARA SIMULAR QUE SE TARDA EN REGRESAR LA RESPUESTA
			setTimeout(function(){
				$('#modal-quitar-usuario .step-2').hide();
				$('#modal-quitar-usuario .step-3').show();
				$('#modal-quitar-usuario .loading-block-screen').hide();
			}, 3000);

			/**Respuesta simulada**/

			/**Respuesta hardcodeada**/
			var data = { success: true, data : [] };
		  	
		  	data.success = true;

		  	data.data = {
		  			success : ['5567778991', '576876541', '5523657999', '5544448991', '5511145678', '5567778991', '576876541', '5523657999', '5544448991', '5511145678'],
		  			error : []
		  	};

			/**simular error caso de uso**/
			var hash = window.location.hash;

			if(hash=='#errorEliminarUsuarioRol'){

				data.success = false;

				data.error = {
					message : 'No se puede realizar el cambio. Necesitas permisos para modificar este rol.'
				};

			}
			else if(hash=='#errorMoverMismoRol'){
				data.success = false;

				data.error = {
					message : 'Es necesario mover a un destino distinto al que pertenece.'
				};
			}

		  	if(data.success){
				$(form).hide();
				$(form).addClass('success');

				if(meta.isMultiple){

					/**Simular error agregar lineas**/
				  	var hash = window.location.hash;

					if(hash=='#errorCambiarUsuarios'){
						data.data.error = [ 
							{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
							{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
							{'numero' : '5523657890', 'motivo' : 'Número no existe' },
							{'numero' : '5512348991', 'motivo' : 'Número no existe' },
							{'numero' : '5512345678', 'motivo' : 'Falta de permisos' }
						];
					}
					else if(hash == '#errorCambiarTodosUsuarios'){
						data.data.success = [];
						data.data.error = [ 
							{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
							{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
							{'numero' : '5523657890', 'motivo' : 'Número no existe' },
							{'numero' : '5512348991', 'motivo' : 'Número no existe' },
							{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
							{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
							{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
							{'numero' : '5523657890', 'motivo' : 'Número no existe' },
							{'numero' : '5512348991', 'motivo' : 'Número no existe' },
							{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
							{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
							{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
							{'numero' : '5523657890', 'motivo' : 'Número no existe' },
							{'numero' : '5512348991', 'motivo' : 'Número no existe' },
							{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
							{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
							{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
							{'numero' : '5523657890', 'motivo' : 'Número no existe' },
							{'numero' : '5512348991', 'motivo' : 'Número no existe' },
							{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
							{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
							{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
							{'numero' : '5523657890', 'motivo' : 'Número no existe' },
							{'numero' : '5512348991', 'motivo' : 'Número no existe' },
							{'numero' : '5512345678', 'motivo' : 'Falta de permisos' },
							{'numero' : '5567888991', 'motivo' : 'Falta de permisos' },
							{'numero' : '5599876541', 'motivo' : 'Falta de permisos' },
							{'numero' : '5523657890', 'motivo' : 'Número no existe' },
							{'numero' : '5512348991', 'motivo' : 'Número no existe' },
							{'numero' : '5512345678', 'motivo' : 'Falta de permisos' }
						];
					}

					callbackMostrarTablas(data.data);

					$('#modal-quitar-usuario .multiple-lines').show();

				}
				else{
					$('#modal-quitar-usuario .single-msg').show();
				}

				$('#modal-quitar-usuario .rol-txt-new').html(meta.rol);
				$('#btn-confirmar-quitar').prop('disabled', true);

		  	}
		  	else{
		  		/**Mostrar error que regresa el sistema**/
		  		// if(data.error){
		  		// 	callbackError($('#modal-quitar-usuario .form-quitar-usuario'), null, data.error.message);
		  		// }
		  	}
		},
		getEliminarUsuarioRolFailResponse : function(error, form){
			console.log(error);
		},
		getEditarUsuarioResponse : function(data, form, elementData, successCallback){
			var data = { success: true, data: [] };

			/* simular error de email existente */
		  	var hash = window.location.hash;
		  	
			if(hash=='#errorUsuarioEmail'){
				data.success = false;
				data.error = {
					message : 'Ya existe un usuario con ese correo electrónico.'
				};
			}
			/* fin simular error de email existente */

			if(data.success){
				var msg= 'Los cambios en los datos del usuario ['+elementData.nombre+'] se han guardado correctamente. Se le notificará al usuario vía correo electrónico sobre los ajustes en su perfil.';

				successCallback(msg);

				$(form).hide();
				$(form).addClass('success');

		  	}
		  	else{

		  		/* mostrar error enviado por el sistema */

		  		if(data.error){
		  			/*Este es el caso de correo electrónico existente*/
		  			var $container = $('#form-editar-administrador .element-input-block .email-container');
		  			appendErrorGeneral($container, $container.find('input') , data.error.message);
		  		}

		  	}
		},
		getEditarUsuarioFailResponse : function(error, form){
			console.log(error);
		},
		getEditarPermisosResponse : function(data, form, redirect){
			var data = { success: true, data: [] };

			var hash = window.location.hash;
			var currentURL = window.location.href.substr(0, window.location.href.indexOf('#'));

			if(redirect == null)
			{
				if(hash=="#mandarError")
					window.location.href = currentURL+'#error';
				else
					window.location.href = currentURL+'#exito';
				
				window.location.reload();

			}
			else{
				window.location.href = redirect+'#rolCreado';
			}
			
			console.log('Formulario enviado.');
			
		},
		getEditarPermisosFailResponse : function(error, form){
			console.log(error);
		},
		getEditarNotificacionesResponse : function(data, form){
			var data = { success: true, data: [] };

			var hash = window.location.hash;
			var currentURL = window.location.href.substr(0, window.location.href.indexOf('#'));

			if(hash=="#mandarError")
				window.location.href = currentURL+'#error';
			else
				window.location.href = currentURL+'#exito';

			window.location.reload();
			console.log('Formulario enviado.');
			
		},
		getEditarNotificacionesFailResponse : function(error, form){
			console.log(error);
		},
		getCancelarAgregarRolResponse : function(data, form, redirect){
			var data = { success: true, data: [] };

			var hash = window.location.hash;
			var currentURL = window.location.href.substr(0, window.location.href.indexOf('#'));

			if(hash=="#mandarError"){
				window.location.href = currentURL+'#error';
				window.location.reload();
			}
			else
				window.location.href = redirect;

			console.log('Formulario enviado.');
			
		},
		getCancelarAgregarRolFailResponse : function(error, form){
			console.log(error);
		},
	};

	var redPrivada = {
		getAgregarContactoResponse : function(data, form, elementData, successCallback){
			//Regresar el id agregado
			var data = { success: true, data: {
				id : $('.red-contactos-table-block .table-main-block .linea-batch').length+1
			} };

			elementData.id = data.data.id;
			/* simular error de número existente */
		  	var hash = window.location.hash;
		  	
			if(hash=='#errorContactoNumero'){
				data.success = false;
				data.error = {
					message : 'Ya existe un contacto con ese número.'
				};
			}
			/* fin simular error de número existente */

			if(data.success){
				var msg = 'Se ha agregado correctamente el contacto con el número ['+elementData.numero+'], el número de operación de este movimiento es [65342122].';

				successCallback(elementData, msg);

				$(form).hide();
				$(form).addClass('success');

		  	}
		  	else{

		  		/* mostrar error enviado por el sistema */

		  		if(data.error){
		  			appendErrorGeneral($('.form-agregar-contacto'), null , data.error.message);
		  		}

		  	}
		},
		getAgregarContactoFailResponse : function(error, form){
			console.log(error);
		},
		getEditarContactoResponse : function(data, form, elementData, successCallback){
			var data = { success: true, data: [] };

			/* simular error de número existente */
		  	var hash = window.location.hash;
		  	
			if(hash=='#errorContactoNumero'){
				data.success = false;
				data.error = {
					message : 'Ya existe un contacto con ese número.'
				};
			}
			/* fin simular error de número existente */

			if(data.success){
				var msg = 'Se ha modificado correctamente el contacto con el número ['+elementData.numero+'], el número de operación de este movimiento es [87645326].';

				successCallback(elementData, msg);

				$(form).hide();
				$(form).addClass('success');

		  	}
		  	else{

		  		/* mostrar error enviado por el sistema */

		  		if(data.error){
		  			appendErrorGeneral($('.form-agregar-contacto'), null , data.error.message);
		  		}

		  	}
		},
		getEditarContactoFailResponse : function(error, form){
			console.log(error);
		},
		getEliminarContactoResponse : function(data, form, elementData, successCallback){
			var data = { success: true, data: [] };

			/* simular error de número existente */
		  	var hash = window.location.hash;
		  	
			// if(hash=='#errorContactoNumero'){
			// 	data.success = false;
			// 	data.error = {
			// 		message : 'Ya existe un contacto con ese número.'
			// 	};
			// }
			// /* fin simular error de número existente */

			if(data.success){
				var msg = 'Se ha eliminado correctamente el contacto con el número ['+elementData.numero+'], el número de operación de este movimiento es [76234565].';

				successCallback(elementData.id, msg);

				$(form).hide();
				$(form).addClass('success');

		  	}
		  	else{

		  		/* mostrar error enviado por el sistema */

		  		if(data.error){
		  			appendErrorGeneral($('.form-agregar-contacto'), null , data.error.message);
		  		}

		  	}
		},
		getEliminarContactoFailResponse : function(error, form){
			console.log(error);
		},
		getCargaMasivaResponse : function(data, form, sentTo, showInvalidErrorArchivo){
			/*simular error de archivo*/ 
			var hash = window.location.hash;
			if(hash=='#archivoInvalido'){
				showInvalidErrorArchivo();
				submit = false;
			}
			/*fin simular error de archivo*/ 
			else{
				console.log('Formulario enviado.');
				window.location.href = sentTo;
			}
		},
		getCargaMasivaFailResponse : function(error, form){
			console.log(error);
		},
		getModificarContactoResponse : function(data, form, successCallback){
			var data = { success: true, data: [] };

			/* simular error de número existente */
		  	var hash = window.location.hash;
		  	
			if(hash=='#errorModificar'){
				data.success = false;
				data.error = {
					message : 'Se ha presentado un error al intentar modificar el contacto. Por favor intentalo más tarde y si el problema persiste contacta a un ejecutivo.'
				};
			}
			/* fin simular error de número existente */

			if(data.success){

				$(form).hide();
				$(form).addClass('success');

				successCallback('Los cambios se han guardado con éxito, el número de operación de este movimiento es [87234567].');

		  	}
		  	else{

		  		$(form).hide();
				$(form).addClass('success');

				//successCallback(data.error.message);

				/**mostrar mensaje enviado por sistema**/
		  		if(data.error.message){
					var errorHTML = '<div class="notif-bloq"> <div class="row"> <div class="col-xs-12 col-sm-12 inner-nb" id="error-autogestion-block"> <span class="icon io-Alert2"></span> <h2 class="h4">No se pudo procesar la operación</h2> <div id="listado-sin-autogestion-container"> <p>'+data.error.message+'</p> <div class="col-sm-12 btn-container"> <button type="button" class="bton blue-dark btn-rsend-general">Reintentar</button> </div> </div> </div> </div> </div>';
					appendErrorGeneralHTML($('#modal-modificar-contacto #form-modificar-contacto'), null , errorHTML);
					
				}

		  	}
		},
		getModificarContactoFailResponse : function(error, form){
			console.log(error);
		},
		getMarcacionCortaResponse : function(data, form, successCallback){
			var data = { success: true, data: [] };

			/* simular error de número existente */
		  	var hash = window.location.hash;
		  	
			if(hash=='#errorModificar'){
				data.success = false;
				data.error = {
					message : 'Se ha presentado un error al intentar modificar el contacto. Por favor intentalo más tarde y si el problema persiste contacta a un ejecutivo.'
				};
			}
			/* fin simular error de número existente */

			if(data.success){

				$(form).hide();
				$(form).addClass('success');

				successCallback('Los cambios se han guardado con éxito, el número de operación de este movimiento es [78345678].');

		  	}
		  	else{

		  		$(form).hide();
				$(form).addClass('success');

				//successCallback(data.error.message);
				/**mostrar mensaje enviado por sistema**/
		  		if(data.error.message){
					var errorHTML = '<div class="notif-bloq"> <div class="row"> <div class="col-xs-12 col-sm-12 inner-nb" id="error-autogestion-block"> <span class="icon io-Alert2"></span> <h2 class="h4">No se pudo procesar la operación</h2> <div id="listado-sin-autogestion-container"> <p>'+data.error.message+'</p> <div class="col-sm-12 btn-container"> <button type="button" class="bton blue-dark btn-rsend-general">Reintentar</button> </div> </div> </div> </div> </div>';
					appendErrorGeneralHTML($('#modal-marcacion-corta #form-marcacion-corta'), null , errorHTML);
					
				}
		  	}
		},
		getMarcacionCortaFailResponse : function(error, form){
			console.log(error);
		},
		getControlCostosServiciosResponse : function(data, form, sentTo){
			console.log('Formulario enviado.');
			window.location.href = sentTo;
		},
		getControlCostosServiciosFailResponse : function(error, form){
			console.log(error);
		},
		getModificarDesvioResponse : function(data, form, successCallback){
			var data = { success: true, data: [] };

			/* simular error de número existente */
		  	var hash = window.location.hash;
		  	
			if(hash=='#errorModificar'){
				data.success = false;
				data.error = {
					message : 'Se ha presentado un error al intentar modificar el contacto. Por favor intentalo más tarde y si el problema persiste contacta a un ejecutivo.'
				};
			}
			/* fin simular error de número existente */

			if(data.success){

				$(form).hide();
				$(form).addClass('success');

				successCallback('Los cambios se han guardado con éxito, el número de operación de este movimiento es [89234567].');

		  	}
		  	else{

		  		$(form).hide();
				$(form).addClass('success');

				//successCallback(data.error.message);
				/**mostrar mensaje enviado por sistema**/
		  		if(data.error.message){
					var errorHTML = '<div class="notif-bloq"> <div class="row"> <div class="col-xs-12 col-sm-12 inner-nb" id="error-autogestion-block"> <span class="icon io-Alert2"></span> <h2 class="h4">No se pudo procesar la operación</h2> <div id="listado-sin-autogestion-container"> <p>'+data.error.message+'</p> <div class="col-sm-12 btn-container"> <button type="button" class="bton blue-dark btn-rsend-general">Reintentar</button> </div> </div> </div> </div> </div>';
					appendErrorGeneralHTML($('#modal-modificar-desvio #form-modificar-desvio'), null , errorHTML);
					
				}
		  	}
		},
		getModificarDesvioFailResponse : function(error, form){
			console.log(error);
		},
		getCargaDirectorioGeneralResponse : function(data, form, sentTo, showInvalidErrorArchivo){
			/*simular error de archivo*/ 
			var hash = window.location.hash;
			if(hash=='#archivoInvalido'){
				showInvalidErrorArchivo();
				submit = false;
			}
			/*fin simular error de archivo*/ 
			else{
				console.log('Formulario enviado.');
				window.location.href = sentTo;
			}
		},
		getCargaDirectorioGeneralFailResponse : function(error, form){
			console.log(error);
		},
	};

	var roaming = {
		getCoberturaResponse : function(data, form ){
			console.log(data);
		},
		getCoberturaFailResponse : function(error, form){
			console.log(error);
		},
		getPaquetesRoamingUsuarioResponse : function(data, callBack ){
			/**Aquí regresa los paquetes y tarifas disponibles que coincidan con la búsqueda y se pintan en el html**/
			var data = {
				"paquete-4" : {"id" : "4", "nombre": "Paquete Viajero Internacional de Internet 1000 MB", "costo": "932.00", "tyc" : "Pie jelly beans fruitcake powder cake biscuit. Toffee oat cake biscuit jujubes gummi bears tart I love. Tiramisu fruitcake tiramisu gummies lollipop cake sweet oat cake. Sweet roll sesame snaps donut pastry. Jujubes lemon drops jujubes macaroon carrot cake dragée cake. Liquorice icing gummies jujubes bear claw chocolate candy canes cake. Gingerbread pudding carrot cake icing pudding. Pastry pie tootsie roll marshmallow pastry. Soufflé jelly gingerbread pudding I love. Caramels sugar plum topping topping sweet cake.",
					"fecha" : { "init" : "10/08/2017", "fin" : "01/09/2017" }
				},
					
				"paquete-6" : {
					"id" : "6", "nombre": "Nombre de tarifa tipo 1", "costo": "199.00", "tyc" : "Pie jelly beans fruitcake powder cake biscuit. Toffee oat cake biscuit jujubes gummi bears tart I love. Tiramisu fruitcake tiramisu gummies lollipop cake sweet oat cake. Sweet roll sesame snaps donut pastry. Jujubes lemon drops jujubes macaroon carrot cake dragée cake. Liquorice icing gummies jujubes bear claw chocolate candy canes cake. Gingerbread pudding carrot cake icing pudding. Pastry pie tootsie roll marshmallow pastry. Soufflé jelly gingerbread pudding I love. Caramels sugar plum topping topping sweet cake."

				},
				"paquete-8" : {"id" : "8", "nombre": "Paquete Completo con Claro Video 50", "costo": "199.00", "tyc" : "Pie jelly beans fruitcake powder cake biscuit. Toffee oat cake biscuit jujubes gummi bears tart I love. Tiramisu fruitcake tiramisu gummies lollipop cake sweet oat cake. Sweet roll sesame snaps donut pastry. Jujubes lemon drops jujubes macaroon carrot cake dragée cake. Liquorice icing gummies jujubes bear claw chocolate candy canes cake. Gingerbread pudding carrot cake icing pudding. Pastry pie tootsie roll marshmallow pastry. Soufflé jelly gingerbread pudding I love. Caramels sugar plum topping topping sweet cake."},
				"paquete-10" : {
					"id" : "10", "nombre": "Cruceros y Ferries que pertenecen a las siguientes líneas navieras: Royal Caribbean International, Pullmantur Cruices, Celebrity Cruices", "costo": "199.00", "tyc" : "Pie jelly beans fruitcake powder cake biscuit. Toffee oat cake biscuit jujubes gummi bears tart I love. Tiramisu fruitcake tiramisu gummies lollipop cake sweet oat cake. Sweet roll sesame snaps donut pastry. Jujubes lemon drops jujubes macaroon carrot cake dragée cake. Liquorice icing gummies jujubes bear claw chocolate candy canes cake. Gingerbread pudding carrot cake icing pudding. Pastry pie tootsie roll marshmallow pastry. Soufflé jelly gingerbread pudding I love. Caramels sugar plum topping topping sweet cake."
				},
				"paquete-12" : {
					"id" : "12", "nombre": "Nombre de tarifa tipo 3", "costo": "199.00", "tyc" : "Pie jelly beans fruitcake powder cake biscuit. Toffee oat cake biscuit jujubes gummi bears tart I love. Tiramisu fruitcake tiramisu gummies lollipop cake sweet oat cake. Sweet roll sesame snaps donut pastry. Jujubes lemon drops jujubes macaroon carrot cake dragée cake. Liquorice icing gummies jujubes bear claw chocolate candy canes cake. Gingerbread pudding carrot cake icing pudding. Pastry pie tootsie roll marshmallow pastry. Soufflé jelly gingerbread pudding I love. Caramels sugar plum topping topping sweet cake."
				},
				"paquete-14" : {
					"id" : "14", "nombre": "Tarifa Marítima Tipo 1", "costo": "189.00", "tyc" : "Pie jelly beans fruitcake powder cake biscuit. Toffee oat cake biscuit jujubes gummi bears tart I love. Tiramisu fruitcake tiramisu gummies lollipop cake sweet oat cake. Sweet roll sesame snaps donut pastry. Jujubes lemon drops jujubes macaroon carrot cake dragée cake. Liquorice icing gummies jujubes bear claw chocolate candy canes cake. Gingerbread pudding carrot cake icing pudding. Pastry pie tootsie roll marshmallow pastry. Soufflé jelly gingerbread pudding I love. Caramels sugar plum topping topping sweet cake."
				}
			};

			callBack(data);

		},
		getPaquetesRoamingUsuarioUsuarioFailResponse : function(error){
			console.log(error);
		},
		getSearchRoamingResponse : function(data, form, callBack, destinos ){
			
			/**Aquí regresa los paquetes y tarifas disponibles que coincidan con la búsqueda y se pintan en el html**/
			var data = {
				"paquete-4" : {"id" : "4", "nombre": "Paquete Viajero Internacional de Internet 1000 MB", "costo": "932.00", "tyc" : "Pie jelly beans fruitcake powder cake biscuit. Toffee oat cake biscuit jujubes gummi bears tart I love. Tiramisu fruitcake tiramisu gummies lollipop cake sweet oat cake. Sweet roll sesame snaps donut pastry. Jujubes lemon drops jujubes macaroon carrot cake dragée cake. Liquorice icing gummies jujubes bear claw chocolate candy canes cake. Gingerbread pudding carrot cake icing pudding. Pastry pie tootsie roll marshmallow pastry. Soufflé jelly gingerbread pudding I love. Caramels sugar plum topping topping sweet cake."},
					
				"paquete-6" : {
					"id" : "6", "nombre": "Nombre de tarifa tipo 1", "costo": "199.00", "tyc" : "Pie jelly beans fruitcake powder cake biscuit. Toffee oat cake biscuit jujubes gummi bears tart I love. Tiramisu fruitcake tiramisu gummies lollipop cake sweet oat cake. Sweet roll sesame snaps donut pastry. Jujubes lemon drops jujubes macaroon carrot cake dragée cake. Liquorice icing gummies jujubes bear claw chocolate candy canes cake. Gingerbread pudding carrot cake icing pudding. Pastry pie tootsie roll marshmallow pastry. Soufflé jelly gingerbread pudding I love. Caramels sugar plum topping topping sweet cake."

				},
				"paquete-8" : {"id" : "8", "nombre": "Paquete Completo con Claro Video 50", "costo": "199.00", "tyc" : "Pie jelly beans fruitcake powder cake biscuit. Toffee oat cake biscuit jujubes gummi bears tart I love. Tiramisu fruitcake tiramisu gummies lollipop cake sweet oat cake. Sweet roll sesame snaps donut pastry. Jujubes lemon drops jujubes macaroon carrot cake dragée cake. Liquorice icing gummies jujubes bear claw chocolate candy canes cake. Gingerbread pudding carrot cake icing pudding. Pastry pie tootsie roll marshmallow pastry. Soufflé jelly gingerbread pudding I love. Caramels sugar plum topping topping sweet cake."},
				"paquete-10" : {
					"id" : "10", "nombre": "Cruceros y Ferries que pertenecen a las siguientes líneas navieras: Royal Caribbean International, Pullmantur Cruices, Celebrity Cruices", "costo": "199.00", "tyc" : "Pie jelly beans fruitcake powder cake biscuit. Toffee oat cake biscuit jujubes gummi bears tart I love. Tiramisu fruitcake tiramisu gummies lollipop cake sweet oat cake. Sweet roll sesame snaps donut pastry. Jujubes lemon drops jujubes macaroon carrot cake dragée cake. Liquorice icing gummies jujubes bear claw chocolate candy canes cake. Gingerbread pudding carrot cake icing pudding. Pastry pie tootsie roll marshmallow pastry. Soufflé jelly gingerbread pudding I love. Caramels sugar plum topping topping sweet cake."
				},
				"paquete-12" : {
					"id" : "12", "nombre": "Nombre de tarifa tipo 3", "costo": "199.00", "tyc" : "Pie jelly beans fruitcake powder cake biscuit. Toffee oat cake biscuit jujubes gummi bears tart I love. Tiramisu fruitcake tiramisu gummies lollipop cake sweet oat cake. Sweet roll sesame snaps donut pastry. Jujubes lemon drops jujubes macaroon carrot cake dragée cake. Liquorice icing gummies jujubes bear claw chocolate candy canes cake. Gingerbread pudding carrot cake icing pudding. Pastry pie tootsie roll marshmallow pastry. Soufflé jelly gingerbread pudding I love. Caramels sugar plum topping topping sweet cake."
				},
				"paquete-14" : {
					"id" : "14", "nombre": "Tarifa Marítima Tipo 1", "costo": "189.00", "tyc" : "Pie jelly beans fruitcake powder cake biscuit. Toffee oat cake biscuit jujubes gummi bears tart I love. Tiramisu fruitcake tiramisu gummies lollipop cake sweet oat cake. Sweet roll sesame snaps donut pastry. Jujubes lemon drops jujubes macaroon carrot cake dragée cake. Liquorice icing gummies jujubes bear claw chocolate candy canes cake. Gingerbread pudding carrot cake icing pudding. Pastry pie tootsie roll marshmallow pastry. Soufflé jelly gingerbread pudding I love. Caramels sugar plum topping topping sweet cake."
				}
			};

			callBack(data);
		},
		getSearchRoamingFailResponse : function(error, form){
			console.log(error);
		},
		contratarServiciosSuccessCallback : function(data, form, sentTo){
			console.log('Formulario enviado.');
			window.location.href = sentTo;
		},
		contratarServiciosFailCallback : function(error, form){
			console.log(error);
		},
	};


	return{

		apiURL :{
			generalTest : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			consultarLineas : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; }, 
			eliminarGrupo : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			editarNombreGrupo : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			arbolGruposRoot : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/root.php"; },
			arbolGruposChildren : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/children-group.php"; },
			arbolGruposBusqueda : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/search-tree.php"; },
			arbolBusqueda : function(tree){ return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/search"+tree+"-tree.php"; },
			arbolOnlyGruposRoot : function(){
				var hash = window.location.hash;
				if(hash=='#soloSinAgrupar')
					return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/root-grupos-sin-agrupar.php";
				else
					return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/root-grupos.php";
				 },
			arbolOnlyGruposBusqueda : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/search-grupos-tree.php"; },
			moverGrupo : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			agregarLineasArchivo : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			agregarLineas : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			editarNombreAlias : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			eliminarAlias : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			eliminarAdmin : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			quitarCuentas : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			asociarCuentas : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			generarReferenciaUnica : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			getFacturasPendientesHome : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			getCACs : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			getEstadosMunicipios : function(){ return "https://bitbucket.org/foxnetorka/estados-de-mexico/raw/6fc110abab0167e8d0aa42f537135dce8dfa834e/Mexico-Estados.json"; },
			getCACAvailableDateTimes : function(){ return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			cancelarCita : function(){ return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			cancelarVisita : function(){ return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			reprogramarCita : function(){ return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			getCurrentDateTime : function(){ return "http://time.jsontest.com/"; },
			editarNombreRol : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			eliminarRol : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			eliminarRolAdmin : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			agregarUsuariosArchivo : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			agregarUsuarios : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			eliminarUsuarioRol : function(){return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			cancelarRol : function(){ return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			eliminarContacto: function(){ return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			getRoamingDestinos: function(){ return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
			getRoamingDestinosJSON : function(){ return "../../assets/roaming.json"; },
			getPaquetesUsuario : function(){ return "http://multiplicamx.com/cliente/2016/mi-telcel-empresas/assets/test.php"; },
		},

		buscador : buscador,

		ordenamiento : ordenamiento,

		general : {
			getAutocompleteData : autocompleteTokenfield,
			getArbolBusquedaGeneralCallSuccess : general.getArbolBusquedaGeneralResponse,
			getArbolBusquedaGeneralCallFail : general.getArbolBusquedaGeneralFailResponse,
			getArbolBusquedaGruposCallSuccess : general.getArbolBusquedaGruposResponse,
			getArbolBusquedaGruposCallFail : general.getArbolBusquedaGruposFailResponse
		},
		login : {
			passForgotCallSuccess : login.getPassForgotResponse,
			passForgotCallFail : login.getPassForgotFailResponse,
			userLoginCallSuccess : login.getUserLoginResponse,
			userLoginCallFail : login.getUserLoginFailResponse,
			activarCuentaCallSuccess : login.getActivarCuentaResponse,
			activarCuentaCallFail : login.getActivarCuentaFailResponse,
			reestablecerContrasenaCallSuccess : login.getEstablecerContrasenaResponse,
			reestablecerContrasenaCallFail : login.getEstablecerContrasenaFailResponse,
			actualizarDatosCallSuccess : login.getActualizarDatosResponse,
			actualizarDatosCallFail : login.getActualizarDatosFailResponse
		},
		gestionGrupos : {
			cuentasAsociadasSuccessCallback : gestionGrupos.cuentasAsociadasSuccessCallback,
			cuentasAsociadasFailCallback : gestionGrupos.cuentasAsociadasFailCallback,
			enviarDatosAutogestionMasivosPost : gestionGrupos.enviarDatosAutogestionMasivos,
			agregarGrupoSuccessCallback : gestionGrupos.getAgregarGrupoResponse,
			agregarGrupoFailCallback : gestionGrupos.getAgregarGrupoFailResponse,
			consultarLineasSuccessCallback : gestionGrupos.getConsultarLineasResponse,
			consultarLineasFailCallback : gestionGrupos.getConsultarLineasFailResponse,
			eliminarGrupoSuccessCallback : gestionGrupos.getEliminarGrupoResponse,
			eliminarGrupoFailCallback : gestionGrupos.getEliminarGrupoFailResponse,
			descargarFacturasSuccessCallback : gestionGrupos.getDescargarFacturasResponse,
			descargarFacturasFailCallback : gestionGrupos.getDescargarFacturasFailResponse,
			editarNombreGrupoSuccessCallback : gestionGrupos.getEditarNombreGrupoResponse,
			editarNombreGrupoFailCallback : gestionGrupos.getEditarNombreGrupoFailResponse,
			editarNombreLineaSuccessCallback : gestionGrupos.getEditarNombreLineaResponse,
			editarNombreLineaFailCallback : gestionGrupos.getEditarNombreLineaFailResponse,
			busquedaArbolGruposSuccessCallback : gestionGrupos.getBusquedaArbolGruposResponse,
			busquedaArbolGruposFailCallback : gestionGrupos.getBusquedaArbolGruposFailResponse,
			moverGrupoSuccessCallback : gestionGrupos.getMoverGrupoResponse,
			moverGrupoFailCallback : gestionGrupos.getMoverGrupoFailResponse,
			postAgregarLineasArchivo : gestionGrupos.postAgregarLineasArchivo,
			agregarLineasSuccessCallback : gestionGrupos.getAgregarLineasResponse,
			agregarLineasFailCallback : gestionGrupos.getAgregarLineasFailResponse,
			cargaMasivaPostArbolCallSuccess : gestionGrupos.getCargaMasivaPostArbolResponse,
			cargaMasivaPostArbolCallFail : gestionGrupos.getCargaMasivaPostArbolFailResponse,
			cargaMasivaCallSuccess : gestionGrupos.getCargaMasivaResponse,
			cargaMasivaCallFail : gestionGrupos.getCargaMasivaFailResponse,
		},
		autogestion : {
			enviarCorreoConfirmacionCallSuccess : autogestion.getEnviarCorreoConfirmacionResponse,
			enviarCorreoConfirmacionCallFail : autogestion.getEnviarCorreoConfirmacionFailResponse,
			singleSuspensionCallSuccess : autogestion.getSingleSuspensionResponse,
			singleSuspensionCallFail : autogestion.getSingleSuspensionFailResponse,
			singleAutogestionGeneralCallSuccess : autogestion.getSingleAutogestionGeneralResponse,
			singleAutogestionGeneralCallFail : autogestion.getSingleAutogestionGeneralFailResponse,
			masivoSuspensionCallSuccess : autogestion.getMasivoSuspensionResponse,
			masivoSuspensionCallFail : autogestion.getMasivoSuspensionFailResponse,
			masivoAutogestionGeneralCallSuccess : autogestion.getMasivoAutogestionGeneralResponse,
			masivoAutogestionGeneralCallFail : autogestion.getMasivoAutogestionGeneralFailResponse,
			masivoAutogestionServiciosCallSuccess : autogestion.getMasivoAutogestionServiciosResponse,
			masivoAutogestionServiciosCallFail : autogestion.getMasivoAutogestionServiciosFailResponse,
			masivoAutogestionConfirmacionGeneralCallSuccess : autogestion.getMasivoAutogestionConfirmacionGeneralResponse,
			masivoAutogestionConfirmacionGeneralCallFail : autogestion.getSingleAutogestionConfirmacionGeneralFailResponse,
			redPrivadaCallSuccess : autogestion.getRedPrivadaCallResponse,
			redPrivadaCallFail : autogestion.getRedPrivadaCallFailResponse,
			abonoDeSaldoCallSuccess : autogestion.getAbonoDeSaldoCallResponse,
			abonoDeSaldoCallFail : autogestion.getAbonoDeSaldoCallFailResponse,
			masivoAutogestionRoamingCallSuccess : autogestion.getMasivoAutogestionRoamingResponse,
			masivoAutogestionRoamingCallFail : autogestion.getMasivoAutogestionServiciosFailResponse,
			singleAutogestionRoamingCallSuccess : autogestion.getSingleAutogestionRoamingResponse,
			singleAutogestionRoamingCallFail : autogestion.getSingleAutogestionRoamingFailResponse,

		},
		servicios : {
			contratarServiciosSuccessCallback : servicios.contratarServiciosSuccessCallback,
			contratarServiciosFailCallback : servicios.contratarServiciosFailCallback,
		},
		gestionEjecutivos : {
			/** Gestión de alias **/
			agregarAliasSuccessCallback : gestionEjecutivos.getAgregarAliasResponse,
			agregarAliasFailCallback : gestionEjecutivos.getAgregarAliasFailResponse,
			editarNombreAliasSuccessCallback : gestionEjecutivos.getEditarNombreAliasResponse,
			editarNombreAliasFailCallback : gestionEjecutivos.getEditarNombreAliasFailResponse,
			eliminarAliasSuccessCallback : gestionEjecutivos.getEliminarAliasResponse,
			eliminarAliasFailCallback : gestionEjecutivos.getEliminarAliasFailResponse,
			agregarAdminSuccessCallback : gestionEjecutivos.getAgregarAdminResponse,
			agregarAdminFailCallback : gestionEjecutivos.getAgregarAdminFailResponse,
			editarAdminSuccessCallback : gestionEjecutivos.getEditarAdminResponse,
			editarAdminFailCallback : gestionEjecutivos.getEditarAdminFailResponse,
			eliminarAdminSuccessCallback : gestionEjecutivos.getEliminarAdminResponse,
			eliminarAdminFailCallback : gestionEjecutivos.getEliminarAdminFailResponse,
			/** Fin Gestión de alias **/

			/** Asociar/Quitar cuentas **/
			asociarCuentasSuccessCallback : gestionEjecutivos.getAsociarCuentasResponse,
			asociarCuentasFailCallback : gestionEjecutivos.getAsociarCuentasFailResponse,
			quitarCuentasSuccessCallback : gestionEjecutivos.getQuitarCuentasResponse,
			quitarCuentasFailCallback : gestionEjecutivos.getQuitarCuentasFailResponse,
			cuentasAsociadasSuccessCallback : gestionEjecutivos.cuentasAsociadasSuccessCallback,
			cuentasAsociadasFailCallback : gestionEjecutivos.cuentasAsociadasFailCallback,
			/** Fin Asociar/Quitar cuentas **/
		},

		facturacion : {
			facturacionFormCallSuccess : facturacion.getFacturacionFormResponse,
			facturacionFormCallFail : facturacion.getFacturacionFormFailResponse,
			descargarFacturasSuccessCallback : facturacion.getDescargarFacturasResponse,
			descargarFacturasFailCallback : facturacion.getDescargarFacturasFailResponse,
			generarReferenciaUnicaSuccessCallback : facturacion.generarReferenciaUnicaResponse,
			generarReferenciaUnicaFailCallback : facturacion.generarReferenciaUnicaFailResponse,
		},
		home : {
			getFacturasPendientes : home.getFacturasPendientes,
			getFacturasPendientesFail : home.getFacturasPendientesFail,
			cambioFormCallSuccess: home.getCambioFormResponse,
			cambioFormCallFail: home.getCambioFormFailResponse,
			suspensionFormCallSuccess: home.getSuspensionFormResponse,
			suspensionFormCallFail: home.getSuspensionFormFailResponse,
			CACFormCallSuccess: home.getCACFormResponse,
			CACFormCallFail: home.getCACFormFailResponse,
			reactivacionFormCallSuccess: home.getReactivacionFormResponse,
			reactivacionFormCallFail: home.getReactivacionFormFailResponse,
		},
		citas : {
			setCACLocationSuccessCallback : citas.setCACLocation,
			setCACClosestLocationSuccessCallback : citas.setCACClosestLocation,
			getCACAvailableDateTimesSuccessCallback : citas.getCACAvailableDateTimes,
			getCACAvailableDateTimesCallFail: citas.getCACAvailableDateTimesFailResponse,
			CACFormCallSuccess: citas.getCACFormResponse,
			CACFormCallFail: citas.getCACFormFailResponse,
			consultarDateTimeSuccessCallback : citas.consultarDateTimeResponse,
			consultarDateTimeFailCallback : citas.consultarDateTimeFailResponse,
			cancelarCitaSuccessCallback : citas.getCancelarCitaResponse,
			cancelarCitaFailCallback : citas.getCancelarCitaFailResponse,
			cancelarVisitaSuccessCallback : citas.getCancelarVisitaResponse,
			cancelarVisitaFailCallback : citas.getCancelarVisitaFailResponse,
			reprogramarCitaSuccessCallback : citas.getReprogramarCitaResponse,
			reprogramarCitaFailCallback : citas.getReprogramarCitaFailResponse,
		},
		adendum : {
			singleAdendumCallSuccess : adendum.getSingleAdendumResponse,
			singleAdendumCallFail : adendum.getSingleAdendumFailResponse,
			masivoAdendumCallSuccess : adendum.getMasivoAdendumResponse,
			masivoAdendumCallFail : adendum.getMasivoAdendumFailResponse,
			allCallSuccess : adendum.getAllResponse,
			allCallFail : adendum.getAllFailResponse,
			descargarFacturasSuccessCallback : adendum.getDescargarFacturasResponse,
			descargarFacturasFailCallback : adendum.getDescargarFacturasFailResponse,
		},
		sertec : {
			specificIMEICallSuccess : sertec.getSpecificIMEIResponse,
			specificIMEICallFail : sertec.getSpecificIMEIFailResponse,
			allIMEICallSuccess : sertec.getAllIMEIResponse,
			allIMEICallFail : sertec.getAllIMEIFailResponse,
			singleCallSuccess : sertec.getSingleResponse,
			singleCallFail : sertec.getSingleFailResponse,
			descargarFacturasSuccessCallback : sertec.getDescargarFacturasResponse,
			descargarFacturasFailCallback : sertec.getDescargarFacturasFailResponse,
		},
		historial : {
			descargarFacturasSuccessCallback : historial.getDescargarFacturasResponse,
			descargarFacturasFailCallback : historial.getDescargarFacturasFailResponse,
		},
		configuracion : {
			agregarRolSuccessCallback : configuracion.getAgregarRolResponse,
			agregarRolFailCallback : configuracion.getAgregarRolFailResponse,
			agregarRolAdminSuccessCallback : configuracion.getAgregarRolAdminResponse,
			agregarRolAdminFailCallback : configuracion.getAgregarRolAdminFailResponse,
			postAgregarLineasArchivo : configuracion.postAgregarLineasArchivo,
			agregarLineasSuccessCallback : configuracion.getAgregarLineasResponse,
			agregarLineasFailCallback : configuracion.getAgregarLineasFailResponse,
			editarNombreRolSuccessCallback : configuracion.getEditarNombreRolResponse,
			editarNombreRolFailCallback : configuracion.getEditarNombreRolFailResponse,
			eliminarRolSuccessCallback : configuracion.getEliminarRolResponse,
			eliminarRolFailCallback : configuracion.getEliminarRolFailResponse,
			eliminarRolAdminSuccessCallback : configuracion.getEliminarRolAdminResponse,
			eliminarRolAdminFailCallback : configuracion.getEliminarRolAdminFailResponse,
			agregarUsuarioSuccessCallback : configuracion.getAgregarUsuarioResponse,
			agregarUsuarioFailCallback : configuracion.getAgregarUsuarioFailResponse,
			cambiarRolSuccessCallback : configuracion.getCambiarRolResponse,
			cambiarRolFailCallback : configuracion.getCambiarRolFailResponse,
			eliminarUsuarioRolSuccessCallback : configuracion.getEliminarUsuarioRolResponse,
			eliminarUsuarioRolFailCallback : configuracion.getEliminarUsuarioRolFailResponse,
			editarUsuarioSuccessCallback : configuracion.getEditarUsuarioResponse,
			editarUsuarioFailCallback : configuracion.getEditarUsuarioFailResponse,
			editarPermisosSuccessCallback : configuracion.getEditarPermisosResponse,
			editarPermisosFailCallback : configuracion.getEditarPermisosFailResponse,
			editarNotificacionesSuccessCallback : configuracion.getEditarNotificacionesResponse,
			editarNotificacionesFailCallback : configuracion.getEditarNotificacionesFailResponse,
			cancelarAgregarRolSuccessCallback : configuracion.getCancelarAgregarRolResponse,
			cancelarAgregarRolFailCallback : configuracion.getCancelarAgregarRolFailResponse,
		},
		redPrivada : {
			agregarContactoSuccessCallback : redPrivada.getAgregarContactoResponse,
			agregarContactoFailCallback : redPrivada.getAgregarContactoFailResponse,
			editarContactoSuccessCallback : redPrivada.getEditarContactoResponse,
			editarContactoFailCallback : redPrivada.getEditarContactoFailResponse,
			eliminarContactoSuccessCallback : redPrivada.getEliminarContactoResponse,
			eliminarContactoFailCallback : redPrivada.getEliminarContactoFailResponse,
			cargaMasivaCallSuccess : redPrivada.getCargaMasivaResponse,
			cargaMasivaCallFail : redPrivada.getCargaMasivaFailResponse,
			modificarContactoSuccessCallback : redPrivada.getModificarContactoResponse,
			modificarContactoFailCallback : redPrivada.getModificarContactoFailResponse,
			marcacionCortaSuccessCallback : redPrivada.getMarcacionCortaResponse,
			marcacionCortaFailCallback : redPrivada.getMarcacionCortaFailResponse,
			controlCostosServiciosSuccessCallback : redPrivada.getControlCostosServiciosResponse,
			controlCostosServiciosFailCallback : redPrivada.getControlCostosServiciosFailResponse,
			modificarDesvioSuccessCallback : redPrivada.getModificarDesvioResponse,
			modificarDesvioFailCallback : redPrivada.getModificarDesvioFailResponse,
			cargaDirectorioGeneralCallSuccess : redPrivada.getCargaDirectorioGeneralResponse,
			cargaDirectorioGeneralCallFail : redPrivada.getCargaDirectorioGeneralFailResponse,
		},
		roaming : {
			getCoberturaSuccessCallback : roaming.getCoberturaResponse,
			getCoberturaFailCallback : roaming.getCoberturaFailResponse,
			getPaquetesRoamingUsuarioSuccessCallback : roaming.getPaquetesRoamingUsuarioResponse,
			getPaquetesRoamingUsuarioFailCallback : roaming.getPaquetesRoamingUsuarioFailResponse,
			getSearchRoamingSuccessCallback : roaming.getSearchRoamingResponse,
			getSearchRoamingFailCallback : roaming.getSearchRoamingFailResponse,
			contratarServiciosSuccessCallback : roaming.contratarServiciosSuccessCallback,
			contratarServiciosFailCallback : roaming.contratarServiciosFailCallback,
		}


	}

}();

// var utils = (window.location.hostname == "localhost:3000" || window.location.hostname == "multiplicamx") ? utils.multiplica : utils.gluo;
