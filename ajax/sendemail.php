<?php
session_start();
ob_start();

/* Database Config*/
//include ("config.php");


/* Post Control*/
if($_POST){
	

	
	/*Your Website Email*/
	$your_email = "youremail@domain.com";
		
	/*Form Post*/
	$name			= $_POST['name'];
	$email 			= $_POST['email']; 
	$phone			= $_POST['phone'];
	$subject 		= $_POST['subject']; 
	$comments  		= $_POST['comments'];
 
	
		
		/*Check the free space*/
		if(!$name || !$email || !$phone || !$comments )
		{

		?>
        <div class="alert alert-danger">Please do not leave space...</div>	

                    

                    
				<?php
                            
                exit;
			   }
		
		
		
			

		$headers   = array();
		$headers[] = "MIME-Version: 1.0";
		$headers[] = "Content-type: text/plain; charset=utf-8";
		$headers[] = "From: $name <$email>"; // Sender name and email address
		$headers[] = "Reply-To: Recipient Name <$your_email>"; // Your site e-mail address
		$headers[] = "Subject: {$subject}";
		$headers[] = "X-Mailer: PHP/".phpversion();
		
		mail($your_email, $subject, $comments, implode("\r\n", $headers));	
			




		/* Optional Insert Database Query*/
		/*
		$update = mysql_query("INSERT INTO contect SET name='$name', email='$email', phone='$phone', subject='$subject', comments='$comments', time='".time()."'")or mysql_errno(); 
		*/ 				  
						 
						  
								  
		?>
        <div class="alert alert-success">Thank you for contacting us.</div>	
		
		<?php
			}

	
	}else{
		?>
        <div class="alert alert-danger">Legal...</div>	
		
		<?php
		}

 ?>