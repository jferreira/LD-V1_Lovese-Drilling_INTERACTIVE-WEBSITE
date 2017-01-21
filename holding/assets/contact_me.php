<?php
// Check for empty fields
if(empty($_POST['name'])  		||
   empty($_POST['email']) 		||
   empty($_POST['message'])		||
   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL)) {
		echo "No arguments Provided!";
		return false;
   }

$name = $_POST['name'];
$email_address = $_POST['email'];
$message = $_POST['message'];

// Create the email and send the message
$to = 'havard.lundberg@gmail.com';
$email_subject = "Lovese contact form:  " . $name;
$email_body = "You have received a new message from your website contact form.\n\n Here are the details:\n\n Name: ".$name."\n\nEmail: ".$email_address."\n\nMessage:\n ".$message;
$headers = "From: info@lovese.org\n";
$headers .= "Reply-To: ". $email_address;
mail($to,$email_subject,$email_body,$headers);
return true;
?>
