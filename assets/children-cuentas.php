<?php
	header('Access-Control-Allow-Origin: *');  

	$id = (isset($_GET['id']) ?  $_GET['id'] : '' );
	$data = array();

	if(!empty($id)):
		$nChildren = rand(1,5);
		// $last = (bool)rand(0, 1);

		for($i = 0; $i < $nChildren; ++$i) {
		    $data[$i] = array("id" =>'cuenta_hija_'.$id.'_'.($i+1) ,"text" => +rand(111111,999999), "icon"=> "io-simple-avatar", "children" => false, "total" => 10 );
		}

	endif;
sleep(2);		
echo json_encode($data);