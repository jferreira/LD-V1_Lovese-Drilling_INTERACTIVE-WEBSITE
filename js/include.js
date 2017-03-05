$('document').ready(function(){

  $('#mc-newsletter-signup').submit(function(e){
    e.preventDefault();
    //$("#mc-newsletter-message").html("Adding your email address...");
    $('#mc-newsletter-message p').text("Adding you to our newsletter...");

    //grab attributes and values out of the form
    var name = $('#fullname').val();
    var firstName = name;
    var endpoint = "frameworks/MailChimp.php";

    // Check for white space in name for Success/Fail message
    if (firstName.indexOf(' ') >= 0) {
        firstName = name.split(' ').slice(0, -1).join(' ');
    }

    //make the ajax request
    $.ajax({
      method: 'POST',
      dataType: "json",
      url: endpoint,
      data: $('#mc-newsletter-signup').serialize() + '&ajax=true',
    }).success(function(message){
      var result = '';
      console.log("sucess: ",message);

      if (message.status === 'pending') {
        //successful adds will have an id attribute on the object
        result = "Thank you "+firstName+" for signing up!";
      } else if (message.title == "Member Exists") {
        result = "Thank you "+firstName+", but you are already signed up.";
        //MC wil send back an error object with "Member Exists" as the title
      } else if(message.title == "Invalid Resource") {
        result = firstName + ", you need to provide a valid email address.";
      } else {
        //something went wrong with the API call
        result = "Sorry, but there was a problem. Please try again later.";
      }
      $('#mc-newsletter-message p').text(result);
    }).error(function(e){
      console.log("error: ", e);
      if(e.status == 200) {
        result = "You need to provide a name and a valid email address.";
      } else {
        result = "Sorry "+firstName+", but there was a problem. Please try again later.";
      }

      $('#mc-newsletter-message p').text(result);
    });
    return false;
  });

  });
