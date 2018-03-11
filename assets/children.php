<?php
	header('Access-Control-Allow-Origin: *');  

	$id = (isset($_GET['id']) ?  $_GET['id'] : '' );
	$data = array();

	if(!empty($id)):
		$nChildren = rand(1,5);
		$last = (bool)rand(0, 1);

		for($i = 0; $i < $nChildren; ++$i) {
		    if(!$last):
		    	$data[$i] = array("id" =>'group_'.$id.'_'.($i+1) ,"text" => "Grupo ".$id.".".($i+1), "icon"=> "io-Maletin", "children" => true, "total" => 4);
		    else:
		    	$data[$i] = array("id" =>'phone_'.$id.'_'.($i+1) ,"text" => "55"+rand(11111111,99999999), "icon"=> "io-Phone", "children" => false, "total" => 1);
		    endif;
		}

	endif;
sleep(4);	
echo json_encode($data);