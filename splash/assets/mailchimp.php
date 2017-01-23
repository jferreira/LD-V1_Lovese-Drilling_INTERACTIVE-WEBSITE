<?php // for MailChimp API v3.0

include('../../frameworks/MailChimp.php');  // path to API wrapper downloaded from GitHub
use \DrewM\MailChimp\MailChimp;

function storeAddress() {
    $key        = "927cc22bdde6d92c079f1a1428af979a-us13";
    $list_id    = "3495d81ba5"; // Lovese Drilling list

    if(empty($_POST['name']) || empty($_POST['email']) || !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL)) {
      echo "No arguments Provided!";
      return false;
    }

    $name = explode(" ", $_POST['name']);
    $firstname = $name[0];
    array_shift($name);
    $lastname = implode(" ", $name);

    $merge_vars = array(
        'FNAME'     => $name[0],
        'LNAME'     => $lastname
    );

    $mc = new MailChimp($key);

    // add the email to your list
    $result = $mc->post('/lists/'.$list_id.'/members', array(
            'email_address' => $_POST['email'],
            'merge_fields'  => $merge_vars,
            'status'        => 'pending'     // double opt-in
            // 'status'     => 'subscribed'  // single opt-in
        )
    );
    return json_encode($result);
}

// If being called via ajax, run the function, else fail

if ($_POST['ajax']) {
    echo storeAddress(); // send the response back through Ajax
} else {
    echo 'Method not allowed - please ensure JavaScript is enabled in this browser';
}

?>
