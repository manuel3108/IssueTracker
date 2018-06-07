<?php 

	$query = $_POST['query'];

	
	//$db = mysqli_connect('localhost','root','', 'manuel-serret_it')or die("Fehler: ".mysqli_connect_error());
	$db = mysqli_connect('localhost','manuel-serret_admin','Bplaced&yvnr8084', 'manuel-serret_IssueTracker')or die("Fehler: ".mysqli_connect_error());
	mysqli_set_charset($db, 'utf8');

    if(!$db){
		die('<p class="mitte">Verbindung zur Datenbank konnte nicht hergestellt werden.</p>');	
	}

	if(strpos($query, 'SELECT') !== false){
		$counter = 0;

		$res = mysqli_query($db, $query);
		$rows = array();
		while($r = mysqli_fetch_assoc($res)) {
		    $rows[] = $r;
		}
		print json_encode($rows);
	} else if(strpos($query, 'INSERT') !== false){
		mysqli_query($db, $query)or die(mysqli_error($db));
		echo mysqli_insert_id($db);
	} else if(strpos($query, 'UPDATE') !== false || strpos($query, 'DELETE') !== false) {
		mysqli_query($db, $query)or die(mysqli_error($db));
	}else {
		echo "not valid";
	}


	mysqli_close($db)

?>