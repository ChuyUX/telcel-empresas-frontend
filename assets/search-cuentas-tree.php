<?php

	header('Access-Control-Allow-Origin: *');  
	header('Content-Type: application/json');

	$search = (isset($_POST['search']) ?  $_POST['search'] : '' );
	$data = [];

	if(!empty($search)):
		$data = array(
			array("id" => "search_root_1","text" => "RFCABCDEE1 Search","icon"=> "io-City", "children"  => array(
					array("id" => "search_child_1","text" => "RFCABCDEEHija 1.1 Search", "icon"=> "io-simple-avatar", "children" => array(
							array("id" =>"search_child_1_1", "text" => "RFCABCDEEHija 1.1.1 Search ".$search, "icon"=> "io-simple-avatar")
							)
					),
					array("id" => "search_child_2","text" => "RFCABCDEEHija 1.2 Search", "icon"=> "io-simple-avatar")
				)
			),
			array("id" => "search_root_2","text" => "RFCABCDEE2 Search" ,"icon"=> "io-City", "children"  => array(
					array("id" => "search_child_3", "text" => "RFCABCDEEHija 2.2 Search Test", "icon"=> "io-simple-avatar")
				)
			)
		);

	endif;
	//$data = array("#root_1", "#group_root_1_1");
sleep(4);		
echo json_encode($data);