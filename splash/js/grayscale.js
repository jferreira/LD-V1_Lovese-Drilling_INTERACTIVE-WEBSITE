/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
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
    $("#mc-newsletter-message").html("Adding your email address...");

    //grab attributes and values out of the form
    //var data = {email: $('#mc-email').val()};
    var endpoint = "assets/mailchimp.php";

    //make the ajax request
    $.ajax({
      method: 'POST',
      dataType: "json",
      url: endpoint,
      data: $('#mc-newsletter-signup').serialize() + '&ajax=true',
    }).success(function(message){
      var result = '';
      console.log(message);
      
      if (message.status === 'pending') {
        //successful adds will have an id attribute on the object
        result = "Thank you for signing up!";
      } else if (message.status == 400) {
        //MC wil send back an error object with "Member Exists" as the title
        result = "Thank you, but you are already signed up.";
      } else {
        //something went wrong with the API call
        result = "Sorry, but there was a problem. Please try again later.";
      }
      $('#mc-newsletter-message').html(result);
    }).error(function(e){
      console.log(e);
      //the AJAX function returned a non-200, probably a server problem
      result = "Sorry, but there was a problem. Please try again later.";
      $('#mc-newsletter-message').html(result);
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
