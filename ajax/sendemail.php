<?php
header('Content-Type: application/json');
session_start();

// Enable error reporting for debugging (disable in production)
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

/* Post Control*/
if($_SERVER['REQUEST_METHOD'] === 'POST'){

	/*Your Website Email*/
	$your_email = "info@guhapromoters.com";
	$admin_email = "rameshvr1234@gmail.com"; // Add backup admin email

	/*Form Post - Sanitize all inputs - Updated field names to match form*/
	$fullName		= isset($_POST['fullName']) ? strip_tags(trim($_POST['fullName'])) : '';
	$email 			= isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
	$phone			= isset($_POST['phone']) ? preg_replace('/[^0-9+\-\s]/', '', trim($_POST['phone'])) : '';
	$interest		= isset($_POST['interest']) ? strip_tags(trim($_POST['interest'])) : 'General Inquiry';
	$message  		= isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';
	$consent		= isset($_POST['consent']) ? true : false;


	/*Validation - Check required fields*/
	if(!$fullName || !$email || !$phone || !$message || !$consent) {
		echo json_encode([
			'success' => false,
			'message' => 'Please fill in all required fields and accept the terms.'
		]);
		exit;
	}

	// Validate email format
	if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
		echo json_encode([
			'success' => false,
			'message' => 'Please enter a valid email address.'
		]);
		exit;
	}

	// Validate phone number (India format)
	if (!preg_match('/^[0-9+\-\s]{10,15}$/', $phone)) {
		echo json_encode([
			'success' => false,
			'message' => 'Please enter a valid phone number.'
		]);
		exit;
	}

	// Prevent header injection by removing newlines
	$fullName = str_replace(array("\r","\n","%0a","%0d"), '', $fullName);
	$email = str_replace(array("\r","\n","%0a","%0d"), '', $email);

	// Map interest to readable text
	$interestText = $interest;
	switch($interest) {
		case 'ongoing': $interestText = 'Ongoing Projects'; break;
		case 'completed': $interestText = 'Completed Projects'; break;
		case 'site-visit': $interestText = 'Schedule Site Visit'; break;
		case 'investment': $interestText = 'Investment Opportunity'; break;
		case 'other': $interestText = 'Other Inquiry'; break;
	}

	// Email to Admin
	$subject = "New Contact Form Inquiry - GUHA Promoters";
	$headers   = array();
	$headers[] = "MIME-Version: 1.0";
	$headers[] = "Content-type: text/html; charset=utf-8";
	$headers[] = "From: GUHA PROMOTERS Website <noreply@guhapromoters.com>";
	$headers[] = "Reply-To: " . $email;
	$headers[] = "X-Mailer: PHP/".phpversion();

	// Build HTML email body for admin
	$email_body = "
	<!DOCTYPE html>
	<html>
	<head>
		<style>
			body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
			.container { max-width: 600px; margin: 0 auto; padding: 20px; }
			.header { background: #1a237e; color: white; padding: 20px; text-align: center; }
			.content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
			.field { margin-bottom: 15px; }
			.field strong { display: inline-block; width: 120px; color: #1a237e; }
			.message-box { background: white; padding: 15px; border-left: 4px solid #FF6B35; margin-top: 10px; }
			.footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
		</style>
	</head>
	<body>
		<div class='container'>
			<div class='header'>
				<h2>New Contact Form Submission</h2>
				<p>GUHA Promoters Website</p>
			</div>
			<div class='content'>
				<div class='field'><strong>Name:</strong> " . htmlspecialchars($fullName) . "</div>
				<div class='field'><strong>Email:</strong> <a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a></div>
				<div class='field'><strong>Phone:</strong> <a href='tel:" . htmlspecialchars($phone) . "'>" . htmlspecialchars($phone) . "</a></div>
				<div class='field'><strong>Interest:</strong> " . htmlspecialchars($interestText) . "</div>
				<div class='field'><strong>Submission Time:</strong> " . date('d M Y, h:i A') . "</div>
				<div class='message-box'>
					<strong>Message:</strong><br><br>
					" . nl2br(htmlspecialchars($message)) . "
				</div>
			</div>
			<div class='footer'>
				<p>This inquiry was submitted through the GUHA Promoters contact form.<br>
				Please respond within 24 hours for best customer experience.</p>
			</div>
		</div>
	</body>
	</html>
	";

	// Send email to admin
	$mailSent = mail($your_email, $subject, $email_body, implode("\r\n", $headers));

	// Optional: Send confirmation email to customer
	$customer_subject = "Thank you for contacting GUHA Promoters";
	$customer_headers   = array();
	$customer_headers[] = "MIME-Version: 1.0";
	$customer_headers[] = "Content-type: text/html; charset=utf-8";
	$customer_headers[] = "From: GUHA PROMOTERS <info@guhapromoters.com>";
	$customer_headers[] = "Reply-To: info@guhapromoters.com";

	$customer_body = "
	<!DOCTYPE html>
	<html>
	<head>
		<style>
			body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
			.container { max-width: 600px; margin: 0 auto; padding: 20px; }
			.header { background: #1a237e; color: white; padding: 30px; text-align: center; }
			.content { padding: 30px; background: #f9f9f9; }
			.cta-button { display: inline-block; padding: 12px 30px; background: #FF6B35; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
			.footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
		</style>
	</head>
	<body>
		<div class='container'>
			<div class='header'>
				<h1>Thank You for Contacting Us!</h1>
			</div>
			<div class='content'>
				<p>Dear " . htmlspecialchars($fullName) . ",</p>
				<p>Thank you for your interest in GUHA Promoters. We have received your inquiry and our team will get back to you within 24 hours.</p>
				<p><strong>Your inquiry details:</strong></p>
				<ul>
					<li>Interest: " . htmlspecialchars($interestText) . "</li>
					<li>Phone: " . htmlspecialchars($phone) . "</li>
					<li>Email: " . htmlspecialchars($email) . "</li>
				</ul>
				<p>In the meantime, feel free to explore our ongoing and completed projects on our website.</p>
				<center>
					<a href='https://rameshvr1234.github.io/guha/projects-ongoing.html' class='cta-button'>View Our Projects</a>
				</center>
				<p>For immediate assistance, you can also reach us at:<br>
				📞 +91-9366624545<br>
				📧 info@guhapromoters.com</p>
				<p>Best regards,<br>
				<strong>GUHA Promoters Team</strong><br>
				Building Dreams Since 2000</p>
			</div>
			<div class='footer'>
				<p>2/57-V, Sri Ram Illam, Athipalayam Post, Coimbatore - 641 103</p>
				<p>This is an automated confirmation email. Please do not reply to this email.</p>
			</div>
		</div>
	</body>
	</html>
	";

	mail($email, $customer_subject, $customer_body, implode("\r\n", $customer_headers));

	// Log inquiry to file (optional but recommended)
	$log_entry = date('Y-m-d H:i:s') . " | " . $fullName . " | " . $email . " | " . $phone . " | " . $interestText . "\n";
	@file_put_contents(dirname(__FILE__) . '/contact_log.txt', $log_entry, FILE_APPEND);

	if($mailSent) {
		echo json_encode([
			'success' => true,
			'message' => 'Thank you for contacting us! We will get back to you within 24 hours. A confirmation email has been sent to your email address.'
		]);
	} else {
		echo json_encode([
			'success' => false,
			'message' => 'Sorry, there was an error sending your message. Please try again or call us directly at +91-9366624545.'
		]);
	}

} else {
	echo json_encode([
		'success' => false,
		'message' => 'Invalid request method.'
	]);
}
?>
