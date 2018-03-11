<?php

	header('Access-Control-Allow-Origin: *');  

	$data = array(
		array("id" => "root_0","text" => "Líneas sin agrupar", "icon"=> "io-Maletin", "children"  => false, "total" => 0),
		array("id" => "root_1","text" => "Grupo 1", "icon"=> "io-Maletin" ,"children"  => true, "total" => 30), 
		array("id" => "root_2","text" => "Grupo 2", "icon"=> "io-Maletin" ,"children"  => true, "total" => 10),
		array("id" => "root_3","text" => "Grupo 3", "icon"=> "io-Maletin","children"  => true, "total" => 16 ),
		array("id" => "root_4","text" => "Grupo 4", "icon"=> "io-Maletin" ,"children"  => true, "total" => 40),
		array("id" => "root_5","text" => "Grupo 5", "icon"=> "io-Maletin","children"  => true, "total" => 23 ),
		array("id" => "root_6","text" => "Grupo 6", "icon"=> "io-Maletin" ,"children"  => true, "total" => 16),
		array("id" => "root_7","text" => "Grupo 7", "icon"=> "io-Maletin","children"  => true, "total" => 10 ),
		array("id" => "root_8","text" => "Grupo 8", "icon"=> "io-Maletin" ,"children"  => true, "total" => 11),
		array("id" => "root_9","text" => "Grupo 9", "icon"=> "io-Maletin" ,"children"  => true, "total" => 14),
		array("id" => "root_10","text" => "Grupo 10", "icon"=> "io-Maletin","children"  => true, "total" => 9),
	);

sleep(1);	
echo json_encode($data);