<?php
session_start();
ob_start();

/* Database Config*/
//include ("config.php");


/* Post Control*/
if($_POST){



	/*Your Website Email*/
	$your_email = "info@guhapromoters.com";

	/*Form Post - Sanitize all inputs*/
	$name			= isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
	$email 			= isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
	$phone			= isset($_POST['phone']) ? preg_replace('/[^0-9+\-\s]/', '', trim($_POST['phone'])) : '';
	$subject 		= isset($_POST['subject']) ? strip_tags(trim($_POST['subject'])) : 'Contact Form Submission';
	$comments  		= isset($_POST['comments']) ? strip_tags(trim($_POST['comments'])) : '';



		/*Check the free space*/
		if(!$name || !$email || !$phone || !$comments )
		{

		?>
        <div class="alert alert-danger">Please fill in all required fields.</div>




				<?php

                exit;
			   }

		// Validate email format
		if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
			?>
			<div class="alert alert-danger">Please enter a valid email address.</div>
			<?php
			exit;
		}

		// Prevent header injection by removing newlines
		$name = str_replace(array("\r","\n","%0a","%0d"), '', $name);
		$email = str_replace(array("\r","\n","%0a","%0d"), '', $email);
		$subject = str_replace(array("\r","\n","%0a","%0d"), '', $subject);


		$headers   = array();
		$headers[] = "MIME-Version: 1.0";
		$headers[] = "Content-type: text/plain; charset=utf-8";
		$headers[] = "From: GUHA PROMOTERS Contact Form <noreply@guhapromoters.com>";
		$headers[] = "Reply-To: " . $email;
		$headers[] = "X-Mailer: PHP/".phpversion();

		// Build email body
		$email_body = "Contact Form Submission\n\n";
		$email_body .= "Name: " . $name . "\n";
		$email_body .= "Email: " . $email . "\n";
		$email_body .= "Phone: " . $phone . "\n\n";
		$email_body .= "Message:\n" . $comments . "\n";

		mail($your_email, $subject, $email_body, implode("\r\n", $headers));





		/* Optional Insert Database Query*/
		/*
		$update = mysql_query("INSERT INTO contect SET name='$name', email='$email', phone='$phone', subject='$subject', comments='$comments', time='".time()."'")or mysql_errno();
		*/



		?>
        <div class="alert alert-success">Thank you for contacting us. We will get back to you soon.</div>

		<?php
			}


	}else{
		?>
        <div class="alert alert-danger">Invalid request method.</div>

		<?php
		}

 ?>
