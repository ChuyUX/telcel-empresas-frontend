<?php

	header('Access-Control-Allow-Origin: *');  

	$data = array(
		array("id" => "cuenta_padre_1","text" => "123456 (RFC18928ABC1)", "icon"=> "io-City" ,"children"  => true, "total" => 4), 
		array("id" => "cuenta_padre_2","text" => "123123 (RFC28928ABC1)", "icon"=> "io-City" ,"children"  => true, "total" => 11),
		array("id" => "cuenta_padre_3","text" => "123456 (RFC38928ABC1)", "icon"=> "io-City","children"  => true, "total" => 12),
		array("id" => "cuenta_padre_4","text" => "234561 (RFC48928ABC1)", "icon"=> "io-City" ,"children"  => true, "total" => 16),
		array("id" => "cuenta_padre_5","text" => "345612 (RFC58928ABC1)", "icon"=> "io-City","children"  => true, "total" => 12),
		array("id" => "cuenta_padre_6","text" => "456123 (RFC68928ABC1)", "icon"=> "io-City" ,"children"  => true, "total" => 10),
		array("id" => "cuenta_padre_7","text" => "561234 (RFC78928ABC1)", "icon"=> "io-City","children"  => true, "total" => 8 ),
		array("id" => "cuenta_padre_8","text" => "612345 (RFC88928ABC1)", "icon"=> "io-City" ,"children"  => true, "total" => 7),
		array("id" => "cuenta_padre_9","text" => "66666 (RFC98928ABC1)", "icon"=> "io-City" ,"children"  => true, "total" => 5),
		array("id" => "cuenta_padre_10","text" => "908762 (RFC18928ABC10)", "icon"=> "io-City","children"  => true, "total" => 10)
	);
sleep(2);		
echo json_encode($data);