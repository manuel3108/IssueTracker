<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="css/style.css">
        <title>Issue Tracker - Installer</title>

		<style>
			input{
				width: 50%;
			    padding: 5px 5px;

			    box-sizing: border-box;
			    font-size: 1vmax;
			    color: white;
			    background-color: #303030;

			    border: 2px solid #808080;
			    border-radius: 0.5vmax;

			    margin-bottom: 1vmax;
			}

			.issue.green:hover{
				transition: all 0.5s ease-out;
				background-color: green;
			}

			#content{
				padding-top: 3vmax;
			}
		</style>
    </head>

    <body>
        <div id="menue">
            <span id="title">Issue Tracker - Installer</span>
        </div>

        <div id="content">
        	<?php if(@$_GET['action'] == 1){ ?>
        		<span>Installation started. If you see something like 'ERROR' there was an error in the installation process. In this case, go back and check your input.</span><br><br>
	        	<?php 
	    			$user = $_POST['username'];
	    			$password = $_POST['password'];
	    			$dbname = $_POST['name'];
	    			$dblocation = $_POST['location'];

	    			$db = mysqli_connect($dblocation, $user, $password) or die("<br>ERROR: ".mysqli_error($db));
	    			echo "<br>Connected";

	    			mysqli_select_db($db, $dbname) or die("<br>ERROR: ".mysqli_error($db));
	    			echo "<br>Database available";

	    			$query = "CREATE TABLE `issue` (
							  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
							  `title` varchar(1000) NOT NULL,
							  `description` text NOT NULL,
							  `priority` int(11) NOT NULL,
							  `topic` int(11) NOT NULL,
							  `state` int(11) NOT NULL,
							  `created` varchar(100) NOT NULL,
							  `updated` varchar(100) NOT NULL
							)";
					mysqli_query($db, $query) or die("<br>ERROR: ".mysqli_error($db));
					echo "<br>Table 'issue' created";


					$query = "CREATE TABLE `priority` (
							  `priorityid` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
							  `type` varchar(100) NOT NULL,
							  `importance` int(11) NOT NULL
							)";
					mysqli_query($db, $query) or die("<br>ERROR: ".mysqli_error($db));
					echo "<br>Table 'priority' created";


					$query = "CREATE TABLE `state` (
							  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
							  `type` varchar(100) NOT NULL,
							  `orderid` int(11) NOT NULL
							)";
					mysqli_query($db, $query) or die("<br>ERROR: ".mysqli_error($db));
					echo "<br>Table 'state' created";


					$query = "CREATE TABLE `topic` (
								`topicid` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
								`type` varchar(100) NOT NULL,
								`orderid` int(11) NOT NULL
							)";
					mysqli_query($db, $query) or die("<br>ERROR: ".mysqli_error($db));
					echo "<br>Table 'topic' created";


					$query = "INSERT INTO `issue` (`id`, `title`, `description`, `priority`, `topic`, `state`, `created`, `updated`) VALUES
							(1, 'First issue, click me', 'Here, you can see the description on the left side. On the right side, there are some option to changes things such as the priority, the topic or the state', 1, 3, 6, '1528205087063', '1528211965000'),
							(2, 'How to create an issue?', 'Now, that you know how you can update an issue, you should also know who to create one. Press the orange button to hide this issue (or press ESCAPE), and then hit the big green circle.', 5, 2, 5, '1528205087063', '1528297000547'),
							(3, 'Are you ready?', 'Hit the settings button on the buttom-left to have a look at the settings. There you can add or delete different categories.', 4, 3, 1, '1528205087063', '1528297000547')";
					mysqli_query($db, $query) or die("<br>ERROR: ".mysqli_error($db));
					echo "<br>Inserted data in table 'issue'";


					$query = "INSERT INTO `priority` (`priorityid`, `type`, `importance`) VALUES
							(1, 'critical', 10),
							(2, 'huge', 8),
							(3, 'major', 5),
							(4, 'minor', 2),
							(7, 'priority deleted', -1)";
					mysqli_query($db, $query) or die("<br>ERROR: ".mysqli_error($db));
					echo "<br>Inserted data in table 'priority'";


					$query = "INSERT INTO `state` (`id`, `type`, `orderid`) VALUES
							(1, 'open', 10),
							(2, 'closed', 999),
							(3, 'deployed to master', 0),
							(4, 'deployed to general', 1),
							(5, 'on hold', 7),
							(6, 'is processed', 9),
							(7, 'state deleted', -1)";
					mysqli_query($db, $query) or die("<br>ERROR: ".mysqli_error($db));
					echo "<br>Inserted data in table 'state'";


					$query = "INSERT INTO `topic` (`topicid`, `type`, `orderid`) VALUES
							(2, 'enhancement', 1),
							(3, 'proposal', 2),
							(4, 'sprint', 3),
							(6, 'topic deleted', -1),
							(14, 'bug', 0)";
					mysqli_query($db, $query) or die("<br>ERROR: ".mysqli_error($db));
					echo "<br>Inserted data in table 'topic'";





					$db_data_file = fopen("php/db-data.php", "w");
					$content = '<?php 
	//only change the values below, if you know what you are doing
	//db_location, db_username, db_password, db_database
	$db = mysqli_connect("'.$dblocation.'","'.$user.'","'.$password.'", "'.$dbname.'")or die("ERROR: ".mysqli_connect_error());
?>';
					fwrite($db_data_file, $content);
					fclose($db_data_file);
					echo "<br>File 'db-data.php' written";

        		?>

        		<br><br><br>
        		<span>If you can see this message, the installation process is finished. You can now click the button below and have fun!</span><br>
        		<span>IMPORTANT: Go to your webserver and delete the file 'install.php'. This file was only needed for this installation!</span><br><br>
        		<a href="./"><span class="issue green">I have deleted the file, show me the issue tracker</span></a>
        	<?php } else { ?>
        		<br><br><br>
	    		<span style="top: 3vmax;">Welcome to the installer. The installation process is very short, enter the requierd data, and press the install button.</span><br><br><br>

	    		<form id="install_form" method="POST" action="install.php?action=1">
    				<span>Database username: </span><input type="text" name="username" placeholder="Please enter the database username"><br>
		    		<span>Database password: </span><input type="text" name="password" placeholder="Please enter the database password"><br>
		    		<span>Database name: </span><input type="text" name="name" placeholder="Please enter the database name"><br>
		    		<span>Database location: </span><input type="text" name="location" placeholder="Please enter the database location (maybe localhost)"><br>

		    		<a href="#" onclick="document.getElementById('install_form').submit()"><span class="issue green">Install</span></a>
	    		</form>
        	<?php } ?>
        </div>

        <div id="footer">
            <div id="footer_settings"></div>
            <span id="text">powered by the <a href="https://github.com/manuel3108/IssueTracker">Open-Source IssueTracker</a></span>

            <!-- You may need to comment in, if you need those to legal webpages-->
            <!--<div id="additional_links">
                <a href="html/privacy_policy.html">Privacy Policy</a>
                <a href="html/legal_disclosure.html">Legal Disclosure</a>
            </div>-->
        </div>
    </body>
</html>
