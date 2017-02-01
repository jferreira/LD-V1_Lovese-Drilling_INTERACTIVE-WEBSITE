"use strict";

var app = {
  currNav: 0,
  interactiveState: false,
  textPageState: false,

  init: function() {
    app.video.init();
    app.navigation.init();
    app.layover.init();

    app.attachObservers();
    app.attachScripts();

    app.helpers.updateContent();
    app.showIntroScreen();
    app.helpers.updateContent(0);

    app.helpers.preload();
  },
  attachObservers: function() {
    // Navigation
    $("#hover-navigation .arrow").on("click", app.navigation.toggle);

    // Video control
    $(".video-controls").on("click", app.video.start);
    $("video").on("click",           app.video.toggle);
  	$('#btn-play-pause').on("click", app.video.toggle);

    // Internal video events
    $("video").on("timeupdate", app.updateTime);

    $('video').on('ended', app.videoEnded);
    $('#seek-bar').on('change', app.videoChange);

    //$('#seek-bar').on('mousedown', app.video.toggle);
    //$('#seek-bar').on('mouseup', app.video.toggle);

    // SCRUBBER:
    // https://html5etc.wordpress.com/2011/11/27/a-basic-html5-video-scrub-bar-using-jquery/

    // Layover
    $("body").on("click", "[rel=closelayover]", app.layover.hide);

    // Shortcuts
    $("body").on('keydown', function(event) {
      if (event.keyCode == 32) // Spacebar
        app.video.toggle();

      if (event.keyCode == 37) // Left
        app.toPrevious();

      if (event.keyCode == 39) // Right
        app.toNext();
    });

    $("#navPrev").on("click", app.toPrevious);
    $("#navNext").on("click", app.toNext);

    $("#mute-video").click( function (){
      if( $("video").prop('muted') ) {
        $("video").prop('muted', false);
      } else {
        $("video").prop('muted', true);
      }
    });

    /*
    document.getElementById('v').addEventListener('ended',myHandler,false);
    function myHandler(e) {
        // What you want to do after the event
        console.log("video ended", e);
    }

      $('video').on('ended',function(){
        console.log('Video has ended!');
      });
    */

  },

  attachScripts: function() {
    // Always have the arrow down when navigation is visible
    // and up when hidden
    app.navigation.callbacks.preShow.push(function() {
      $("#hover-navigation .arrow").removeClass("arrow_up").addClass("arrow_down");
    });
    app.navigation.callbacks.preHide.push(function() {
      $("#hover-navigation .arrow").removeClass("arrow_down").addClass("arrow_up");
    });

    // Hide various elements when the video starts playing
    // and show them again when paused
    app.video.callbacks.preStart.push(function() {
      app.navigation.hide();

      $("#video").css({
          "background-image":"none",
          "background-color": "#000"
      });
      $("#titles").fadeOut(1000);
      $(".nav-holder *").fadeOut(1000);

      $('#btn-play-pause').removeClass('play').addClass('pause');
      $('video').css("z-index","1");
    });
    app.video.callbacks.prePause.push(function() {
      app.navigation.show();

      $(".nav-holder *").fadeIn(1000);
      $("#titles, .video-controls").fadeIn(1000);

      $(".slide-container").css({"background-image": 'none'}); // Remove the title slide when video is paused

      $('#btn-play-pause').removeClass('pause').addClass('play');
      $('video').css("z-index","0");
    });
  },
  toPrevious: function() {
    if (currNav > 0) {
      currNav--;
      app.helpers.updateContent();
    }
  },
  toNext: function() {
    if (app.currNav <= nav.episodes.length-2) {
      app.currNav++;
      app.helpers.updateContent();
    }
  },
  updateTime: function() {
    if(this.readyState > 0) {
      var value = (100 / this.duration) * this.currentTime;

      var minutes = parseInt((this.duration - this.currentTime) / 60, 10);
      var seconds = (this.duration - this.currentTime) % 60;

      seconds = Math.ceil(seconds);
      $(".timeRemaining").text(minutes + ":" + app.helpers.twoDigits(seconds));

      var d = 100 * this.currentTime / this.duration;
      $(".avancee").css({width:d+"%"});

      $("#seek-bar").val(value);
    }
  },
  videoEnded: function() {
    // Hide the video
    // Overlay sharing possibility
    app.helpers.loadTextPage(4);
  },
  videoChange: function() {
      var time = app.video.element.duration * ($("#seek-bar").val() / 100);
      // Update the video time
      app.video.element.currentTime = time;
      console.log("scrub", time);
  },
  helpers: {
    preload: function() {
      for(var i = 1; i < nav.episodes.length; i++) {
        $('<img />').attr('src', nav.episodes[i].poster).appendTo('#preload').css('display','none');
      }
    },
    twoDigits: function(n) {
    	return (n <= 9 ? "0" + n : n);
    },

    updateContent: function(episode) {
      // Quick fix to hide the play functionality.
      if(episode > 0) {
        $("img.video-controls").css({"width": 0, "height" : 0});
        $("button.play").attr("disabled", true);
      } else {
        $("img.video-controls").css({"width": "50px", "height" : "auto"});
        $("button.play").attr("disabled", false);
      }

    	app.interactiveState = false;
      app.textPageState = false;

      app.video.pause();
      $('video').css("z-index","-1");

    	var episodeId;

    	if(episode === undefined || episode === null) {
    		episodeId = app.currNav;
    	} else {
    		episodeId = episode;
    		app.currNav = episodeId;
    	}
    	$(".nav-holder *").fadeIn(500);

    	// Remove interactive content if it's present
    	if ($("#content #interactive *").is(":visible"))
    		$("#content #interactive").empty();

    	if ($('#episodeProgress *').is(":hidden"))
        $('#episodeProgress *').show();

    	$("#video").css({
    		"background": 'url("' + nav.episodes[app.currNav].poster + '") no-repeat',
    		"background-size": 'cover',
        "background-position": 'center center'
    	});

      $("video").attr({
    		"src": nav.episodes[episodeId].mp4
    		//"poster": nav.episodes[episodeId].poster
    		//"preload": "auto"
    		//"autoplay": "autoplay"
    	}).hide(); //hack to fix the load of video before image issue

      $(".slide-container").css({
        "background": 'url("'+nav.episodes[app.currNav].slide+'") no-repeat',
    		"background-size": 'cover',
        "background-position": 'center center'
      });

    	// $("#titles h1").text(nav.episodes[episodeId].title);
    	// $("#titles span.subtitle").text(nav.episodes[episodeId].subtitle);
    	// $("#titles span.description").text(nav.episodes[episodeId].description);
    	$("#content *, #titles").fadeIn(1000);
    	$(".timeRemaining").text("0:00");
    	$('#btn-play-pause').removeClass('pause').addClass('play');
    	$(".avancee").css({width:"0%"});
    },

    loadInteractiveContent: function(id) {
    	app.interactiveState = true;
      app.textPageState = false;
    	// Remove anything related to the video player
    	// Concider removing the whole player layer?
    	app.navigation.hide();

    	$("#video video").attr({"src": ""});
    	$(".timeRemaining").text("");
    	$(".avancee").css({width:"0%"});
    	$('#btn-play-pause').removeClass('pause').addClass('play');

    	//$(".nav-holder *").fadeOut(1000);
    	$('#episodeProgress *').hide();

    	$("#content #video, #titles").hide();
    	$("#content #interactive").empty();

      // Fetch the external resources. Maybe use the whole ajax method to be able to do a loading bar before the map is finished.
      $("#content #interactive").load(nav.interactive[id-1].html, function(response, status, xhr) {
        if(status == "error") {
          //Something went wrong, have your error fallback code here
        }
      });
    },
    loadTextPage: function(id) {
      app.textPageState = true;
      app.navigation.hide();

      // Copied from loadInteractiveContent
      $("#video video").attr({"src": ""});
    	$(".timeRemaining").text("");
    	$(".avancee").css({width:"0%"});
    	$('#btn-play-pause').removeClass('pause').addClass('play');

    	//$(".nav-holder *").fadeOut(1000);
    	$('#episodeProgress *').hide();

    	$("#content #video, #titles").hide();
    	$("#content #interactive").empty();


      // Fetch the external resources. Maybe use the whole ajax method to be able to do a loading bar before the map is finished.
      $("#content #interactive").load(nav.textPages[id-1].html, function(response, status, xhr) {
        if(status == "error") {
          //Something went wrong, have your error fallback code here
        }
      });

    }
  },
  showIntroScreen: function() {
    app.layover.updateContent(
      "<h1 class='brand-heading'>LoVeSe Drilling</h1>"+
      "<p class='intro-text'>Across the world, local communities are fighting to stop new coal, oil and gas projects.</p><br />"+
      "<p class='intro-text'>This interactive documentary explores how one of the most vulnerable and productive ecosystems in the world could be handed over to the oil industry in 2017."+
      "<br /><br />" +
      "<p class='intro-text'>After each episode there is an interactive element which you can use to explore the issue.</p>" +
      "<button class='btn btn-default btn-lg' rel=\"closelayover\">Start the experience</button>"
    );
    app.layover.show();
  }
}
$(app.init);
