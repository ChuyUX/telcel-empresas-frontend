<?php

	header('Access-Control-Allow-Origin: *');  

	$data = array(
		array("id" => "root_1","text" => "Empresa 1", "icon"=> "io-City" ,"children"  => true, "total" => 30), 
		array("id" => "root_2","text" => "Empresa 2", "icon"=> "io-City" ,"children"  => true, "total" => 10),
		array("id" => "root_3","text" => "Empresa 3", "icon"=> "io-City","children"  => true, "total" => 16 ),
		array("id" => "root_4","text" => "Empresa 4", "icon"=> "io-City" ,"children"  => true, "total" => 40),
		array("id" => "root_5","text" => "Empresa 5", "icon"=> "io-City","children"  => true, "total" => 23 ),
		array("id" => "root_6","text" => "Empresa 6", "icon"=> "io-City" ,"children"  => true, "total" => 16),
		array("id" => "root_7","text" => "Empresa 7", "icon"=> "io-City","children"  => true, "total" => 10 ),
		array("id" => "root_8","text" => "Empresa 8", "icon"=> "io-City" ,"children"  => true, "total" => 11),
		array("id" => "root_9","text" => "Empresa 9", "icon"=> "io-City" ,"children"  => true, "total" => 14),
		array("id" => "root_10","text" => "Empresa 10", "icon"=> "io-City","children"  => true, "total" => 9)
	);

sleep(1);	
echo json_encode($data);