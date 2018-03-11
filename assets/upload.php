<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');  

	$data = array('success' => false, 'data' => $_FILES);

    if ( 0 < $_FILES['file']['error'] ) {
        $data['error'] = $_FILES['file']['error'];
    }
    else {
    	$data['success'] = true;
    	// $data['data'] = $_FILES['file']['tmp_name'];
        //move_uploaded_file($_FILES['file']['tmp_name'], 'uploads/' . $_FILES['file']['name']);
    }

		
echo json_encode($data);