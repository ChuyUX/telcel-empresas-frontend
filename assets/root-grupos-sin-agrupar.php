<?php

	header('Access-Control-Allow-Origin: *');  

	$data = array(
		array("id" => "root_0","text" => "Líneas sin agrupar", "icon"=> "io-Maletin", "children"  => false, "total" => 0),
	);

sleep(1);	
echo json_encode($data);