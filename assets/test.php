<?php
	header('Access-Control-Allow-Origin: *');  
	$data = array(array("id" => 1,"text" => "Empresa 1","children"  => true), array("id" => 3,"text" => "Empresa 2","children"  => true));
	$tree = array(
			//EMPRESA (0)
			array("id" => 1,"text" => "Empresa 1","children"  => true),
			//CHILDREN ID (1)
			array(array("id" => 2,"text" => "Grupo 1.1"), array("id" => 10,"text" => "Grupo 1.2"), array("id" => 9,"text" => "Grupo 1.3")),
			//EMPRESA (2)
			array("id" => 3,"text" => "Empresa 2","children"  => true),
			//CHILDREN ID 2 (3)
			array(
				array("id" => 4,"text" => "Grupo 2.1", "children" => true),
				array("id" => 5,"text" => "Grupo 2.2", "children" => true),
				array("id" => 16,"text" => "Grupo 2.3")
			),
			// CHIDREN DE ID (4)
			 array(
				array("id" => 7,"text" => "Grupo 2.1.1", "children"),
				array("id" => 8,"text" => "Grupo 2.1.2", "children")
			),
			//CHILDREN (5)
			array(
				array("id" => 6,"text" => "Grupo 2.2.1", "children" => true),
				array("id" => 15,"text" => "Grupo 2.2.2")
			),
			//CHILDREN (6)
			array(
				array("id" => 12,"text" => "Grupo 2.2.1.1"),array("id" => 13,"text" => "Grupo 2.2.1.2"),array("id" => 14,"text" => "Grupo 2.2.1.3")
			)
		);


		$id = (isset($_GET['id']) ?  $_GET['id'] : '' );

		if(!empty($id)):
			$data = $tree[$id];
		endif;
		
echo json_encode($data);