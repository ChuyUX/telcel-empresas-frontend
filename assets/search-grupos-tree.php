<?php

	header('Access-Control-Allow-Origin: *');  
	header('Content-Type: application/json');

	$search = (isset($_POST['search']) ?  $_POST['search'] : '' );
	$data = [];

	if(!empty($search)):
		$data = array(
			array("id" => "search_root_1","text" => "Grupo 1 Search","icon"=> "io-Maletin", "children"  => array(
					array("id" => "search_child_1","text" => "Hijo 1.1 Search", "icon"=> "io-Maletin", "children" => array(
							array("id" =>"search_child_1_1", "text" => "Hijo 1.1.1 Search ".$search, "icon"=> "io-Maletin")
							), "total" => 1
					),
					array("id" => "search_child_2","text" => "Hijo 1.2 Search", "icon"=> "io-Maletin", "total" => 0)
				), "total" => 1
			),
			array("id" => "search_root_2","text" => "Grupo 2 Search" ,"icon"=> "io-Maletin", "children"  => array(
					array("id" => "search_child_3", "text" => "Hijo 2.2 Search Test", "icon"=> "io-Maletin", "total" => 0)
				),  "total" => 1
			)
		);

	endif;
	//$data = array("#root_1", "#group_root_1_1");
sleep(4);		
echo json_encode($data);