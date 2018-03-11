<?php
	header('Access-Control-Allow-Origin: *');  

	$id = (isset($_GET['id']) ?  $_GET['id'] : '' );
	$data = array();

	if(!empty($id)):
		$nChildren = rand(1,5);

		for($i = 0; $i < $nChildren; ++$i) {
		    $data[$i] = array("id" =>'group_'.$id.'_'.($i+1) ,"text" => "Grupo ".$id.".".($i+1), "icon"=> "io-Maletin", "children" => (bool)rand(0, 1), "total" => 5);
		}

	endif;
sleep(4);		
echo json_encode($data);