/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

/*
 $(window).load( function(){

 });

var images

function preload() {
  for(var i = 1; i < app.roseAnimation; i++) {
    var img = new Image ();
    img.src = images[index][‘serving_url’];
    //$('<img />').attr('src',"img/rose/Rose_16fr_farve_" + i + ".jpg").appendTo('#preload').css('display','none');
  }
}
*/

// jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

$('document').ready(function(){

  $('#mc-newsletter-signup').submit(function(e){
    e.preventDefault();
    //$("#mc-newsletter-message").html("Adding your email address...");
    $('#mc-newsletter-message p').text("Adding you to our newsletter...");

    //grab attributes and values out of the form
    var name = $('#fullname').val();
    var firstName = name;
    var endpoint = "assets/mailchimp.php";

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

  // Closes the Responsive Menu on Menu Item Click
  $('.navbar-collapse ul li a').click(function() {
      $('.navbar-toggle:visible').click();
  });

  mapboxgl.accessToken = 'pk.eyJ1IjoiaGF2YXJkbCIsImEiOiJtSTFleXg4In0.bCnuP121PLOPrqhdwUwYDA';
  var map = new mapboxgl.Map({
  	container: 'map',
  	style: 'mapbox://styles/mapbox/emerald-v8',
  	center: [15.463257,68.635428],
  	zoom: 6
  });

});
